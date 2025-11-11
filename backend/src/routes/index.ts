import Router from 'koa-router'

const router = new Router()

// Health check
router.get('/health', async (ctx) => {
  ctx.body = {
    status: 'ok',
    message: 'Hyperflow Works API is running',
    timestamp: new Date().toISOString(),
  }
})

// Hello endpoint
router.get('/hello', async (ctx) => {
  ctx.body = {
    message: 'Hello from Hyperflow Works Backend!',
  }
})

export default router

