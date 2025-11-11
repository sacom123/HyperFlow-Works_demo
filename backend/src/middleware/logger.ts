import { Context } from 'koa'

export const logger = async (ctx: Context, next: () => Promise<any>) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
}

