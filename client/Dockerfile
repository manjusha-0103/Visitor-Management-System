# syntax=docker/dockerfile:1

FROM node:24-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_SERVER_URL=/api/v1
ARG VITE_SOCKET_URL=
ENV VITE_SERVER_URL=${VITE_SERVER_URL}
ENV VITE_SOCKET_URL=${VITE_SOCKET_URL}

RUN npm run build

FROM nginx:1.27-alpine AS runtime

RUN apk add --no-cache curl

RUN cat <<'EOF' > /etc/nginx/conf.d/default.conf
server {
	listen 80;
	listen [::]:80;
	server_name _;

	root /usr/share/nginx/html;
	index index.html;

	location = /health {
		access_log off;
		add_header Content-Type text/plain always;
		return 200 "healthy\n";
	}

	location /assets/ {
		expires 1y;
		add_header Cache-Control "public, immutable" always;
		try_files $uri =404;
	}

	location / {
		try_files $uri $uri/ /index.html;
	}
}
EOF

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]