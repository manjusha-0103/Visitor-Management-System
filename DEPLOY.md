Using environment variables and GitHub Secrets for VisitMi

1) Local / server env file
- Copy `.env.production.example` to `.env.production` on the server and fill in secret values (DB password, SMTP credentials, JWT_SECRET, etc.).
- Keep `.env.production` out of git (add to `.gitignore`).

2) GitHub Actions / Secrets (recommended for CI-based deploy)
- In your GitHub repo Settings → Secrets → Actions, add secrets such as:
  - `PROD_DATABASE_URL`
  - `PROD_APP_URL`
  - `PROD_JWT_SECRET`
  - `PROD_SMTP_HOST`, `PROD_SMTP_PORT`, `PROD_SMTP_USER`, `PROD_SMTP_PASS`
  - `SSH_HOST`, `SSH_USER`, `SSH_KEY` (for deploy via SSH)

- Example job step that writes an env file on the runner/remote server using secrets (careful with logs):

```yaml
- name: Build .env.production
  run: |
    cat > .env.production <<EOF
    NODE_ENV=production
    PORT=5000
    DATABASE_URL=${{ secrets.PROD_DATABASE_URL }}
    APP_URL=${{ secrets.PROD_APP_URL }}
    JWT_SECRET=${{ secrets.PROD_JWT_SECRET }}
    EMAIL_USER=${{ secrets.PROD_SMTP_USER }}
    EMAIL_PASS=${{ secrets.PROD_SMTP_PASS }}
    EOF
  env:
    # Do not print secrets in logs; they are masked automatically
```

3) SSH deploy snippet (copy site file and env to server)

```yaml
- name: Upload site & env
  uses: appleboy/scp-action@v0.1.6
  with:
    host: ${{ secrets.SSH_HOST }}
    username: ${{ secrets.SSH_USER }}
    key: ${{ secrets.SSH_KEY }}
    source: "Visitor-Management-System/infra/nginx/sites-available/visitmi.conf"
    target: "/tmp/visitmi.conf"

- name: Enable site and reload nginx
  uses: appleboy/ssh-action@v0.1.6
  with:
    host: ${{ secrets.SSH_HOST }}
    username: ${{ secrets.SSH_USER }}
    key: ${{ secrets.SSH_KEY }}
    script: |
      sudo mv /tmp/visitmi.conf /etc/nginx/sites-available/visitmi.conf
      sudo ln -sfn /etc/nginx/sites-available/visitmi.conf /etc/nginx/sites-enabled/visitmi.conf
      sudo nginx -t
      sudo systemctl reload nginx
```

4) Notes & security
- Never echo secrets into public logs. Use GitHub Secrets and masked outputs.
- Prefer storing sensitive connection strings, like `DATABASE_URL`, as a single secret rather than separate local Postgres fields.
- On the server, protect `.env.production` with proper filesystem permissions and limit who can read it.

If you want, I can:
- Add a GitHub Actions deploy job that writes `.env.production` on the runner and SCPs files to the server using secrets.
- Or just add a short sample `deploy.yml` under `.github/workflows/` using your existing CI.
