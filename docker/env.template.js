// Optional runtime configuration.
// If your app loads /env.js in index.html, you can read window.__ENV__ at runtime.
// This does NOT affect Vite's import.meta.env values which are baked at build time.
window.__ENV__ = {
  VITE_AUTH0_DOMAIN: "${VITE_AUTH0_DOMAIN}",
  VITE_AUTH0_CLIENT_ID: "${VITE_AUTH0_CLIENT_ID}",
  VITE_AUTH0_AUDIENCE: "${VITE_AUTH0_AUDIENCE}",
  VITE_API_URL: "${VITE_API_URL}"
};