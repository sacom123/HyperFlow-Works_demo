import { Context } from 'koa'

export const errorHandler = async (ctx: Context, next: () => Promise<any>) => {
  try {
    await next()
  } catch (err: any) {
    ctx.status = err.status || 500
    ctx.body = {
      error: {
        message: err.message || 'Internal Server Error',
        status: ctx.status,
      },
    }
    ctx.app.emit('error', err, ctx)
  }
}

