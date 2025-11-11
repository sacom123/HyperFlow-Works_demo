import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    // 랜딩 페이지가 렌더링되는지 확인
    expect(screen.getByText(/복잡한 코딩없이/i)).toBeInTheDocument()
  })
})

