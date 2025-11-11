import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from './index'

describe('API Tests', () => {
  it('should return health check', async () => {
    const response = await request(app.callback()).get('/api/health')
    expect(response.status).toBe(200)
    expect(response.body.status).toBe('ok')
  })

  it('should return hello message', async () => {
    const response = await request(app.callback()).get('/api/hello')
    expect(response.status).toBe(200)
    expect(response.body.message).toContain('Hello')
  })
})

