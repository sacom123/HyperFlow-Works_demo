import Koa from 'koa'
import Router from 'koa-router'
import cors from '@koa/cors'
import bodyParser from 'koa-bodyparser'
import json from 'koa-json'
import serve from 'koa-static'
import path from 'path'
import { fileURLToPath } from 'url'
import { readFileSync, existsSync, statSync } from 'fs'
import dotenv from 'dotenv'
import apiRoutes from './routes/index.js'
import { errorHandler } from './middleware/errorHandler.js'
import { logger } from './middleware/logger.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = new Koa()
const router = new Router()

// Middleware
app.use(errorHandler)
app.use(logger)
app.use(cors())
app.use(bodyParser())
app.use(json())

// API routes
router.use('/api', apiRoutes.routes(), apiRoutes.allowedMethods())

app.use(router.routes()).use(router.allowedMethods())

// Serve static files (frontend) in production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../../frontend/dist')

  // Check if frontend dist exists
  if (existsSync(frontendPath) && statSync(frontendPath).isDirectory()) {
    // Serve static assets (JS, CSS, images, etc.)
    app.use(
      serve(frontendPath, {
        index: false, // Don't serve index.html for static files
        gzip: true,
        maxage: 86400000, // 1 day cache
      })
    )

    // Serve index.html for all non-API routes (SPA routing)
    app.use(async (ctx) => {
      if (!ctx.path.startsWith('/api')) {
        // Check if it's a file request (has extension)
        const hasExtension = path.extname(ctx.path) !== ''

        if (!hasExtension) {
          // SPA fallback - serve index.html
          try {
            const indexHtmlPath = path.join(frontendPath, 'index.html')
            if (existsSync(indexHtmlPath)) {
              const indexHtml = readFileSync(indexHtmlPath, 'utf-8')
              ctx.type = 'html'
              ctx.body = indexHtml
            } else {
              ctx.status = 404
              ctx.body = 'Frontend not found'
            }
          } catch (error) {
            console.error('Error serving index.html:', error)
            ctx.status = 500
            ctx.body = 'Internal Server Error'
          }
        }
      }
    })
  } else {
    console.warn('Frontend dist directory not found. Skipping static file serving.')
  }
}

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
  if (process.env.NODE_ENV === 'production') {
    console.log(`📦 Serving frontend from ${path.join(__dirname, '../../frontend/dist')}`)
  }
})

export default app
