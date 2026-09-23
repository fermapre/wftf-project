import process from 'node:process'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// Política de seguridad de contenido (CSP): el navegador solo cargará scripts,
// estilos, imágenes y fuentes del propio sitio y solo enviará datos al backend.
// Se agrega únicamente al compilar para producción (en desarrollo rompería la
// recarga en caliente de Vite).
function contentSecurityPolicy(apiUrl) {
  let apiOrigin
  try {
    apiOrigin = new URL(apiUrl).origin
  } catch {
    apiOrigin = ''
  }

  const policy = [
    "default-src 'self'",
    "script-src 'self'",
    "worker-src 'self' blob:",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self' data:",
    `connect-src 'self' ${apiOrigin}`.trim(),
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    'upgrade-insecure-requests',
  ].join('; ')

  return {
    name: 'inject-csp',
    apply: 'build',
    transformIndexHtml(html) {
      return html.replace(
        '<meta charset="UTF-8" />',
        `<meta charset="UTF-8" />\n    <meta http-equiv="Content-Security-Policy" content="${policy}" />\n    <meta name="referrer" content="strict-origin-when-cross-origin" />`,
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    plugins: [react(), contentSecurityPolicy(env.VITE_API_URL || 'http://localhost:8000')],
    build: {
      // No publicar el código fuente original junto con el sitio.
      sourcemap: false,
    },
  }
})
