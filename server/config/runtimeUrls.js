const trimTrailingSlash = (value) =>
  typeof value === "string" ? value.trim().replace(/\/+$/, "") : "";

const normalizeOrigin = (value) => {
  const trimmed = trimTrailingSlash(value);
  if (!trimmed) return "";

  try {
    return new URL(trimmed).origin;
  } catch {
    return trimmed;
  }
};

export const getPublicAppUrl = () =>
  trimTrailingSlash(process.env.APP_URL || "https://visitmi.irayva.ai");

export const getBackendUrl = () =>
  trimTrailingSlash(
    process.env.BACKEND_URL ||
      process.env.BACKEND_DEV_URL ||
      `${getPublicAppUrl()}`,
  );

export const getAllowedOrigins = () => {
  const configured = [
    process.env.ALLOWED_ORIGINS,
    process.env.CORS_ORIGIN,
    process.env.APP_URL,
  ]
    .filter(Boolean)
    .flatMap((value) => String(value).split(","))
    .map(normalizeOrigin)
    .filter(Boolean);

  const defaults = [
    "https://visitmi.irayva.ai",
    "https://visitmi.irayva.ai:443",
    "http://visitmi.irayva.ai",
    "http://localhost:3000",
    "http://localhost:5173",
  ].map(normalizeOrigin);

  return [...new Set([...configured, ...defaults])];
};
