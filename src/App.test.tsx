import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('塔罗牌阵游戏', () => {
  it('抽取单张牌，并可重新开始', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /开始抽牌/ }))
    act(() => vi.advanceTimersByTime(540))
    expect(screen.getAllByRole('article')).toHaveLength(1)
    expect(screen.getByText('此刻的一张牌')).not.toBeNull()
    fireEvent.click(screen.getByRole('button', { name: '重新开始' }))
    expect(screen.queryByRole('article')).toBeNull()
    expect(screen.getByText('点击开始抽牌')).not.toBeNull()
  })

  it('切换到三张牌阵后抽取三张不同的牌', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('radio', { name: /三张牌/ }))
    fireEvent.click(screen.getByRole('button', { name: /开始抽牌/ }))
    act(() => vi.advanceTimersByTime(540))
    const cards = screen.getAllByRole('article')
    expect(cards).toHaveLength(3)
    expect(new Set(cards.map((card) => card.getAttribute('aria-label'))).size).toBe(3)
    expect(screen.getByText('过去')).not.toBeNull()
    expect(screen.getByText('当下')).not.toBeNull()
    expect(screen.getByText('指引')).not.toBeNull()
  })

  it.each([
    { name: /二选一决策阵/, count: 5, labels: ['现状', '选择 A', 'A 的走向', '选择 B', 'B 的走向'] },
    { name: /十字圣杯阵/, count: 10, labels: ['现状', '阻碍', '根基', '过去', '近未来', '自我', '环境', '希望', '提醒', '结果'] },
  ])('支持$name并展示对应牌位', ({ name, count, labels }) => {
    render(<App />)
    fireEvent.click(screen.getByRole('radio', { name }))
    fireEvent.click(screen.getByRole('button', { name: /开始抽牌/ }))
    act(() => vi.advanceTimersByTime(540))
    const cards = screen.getAllByRole('article')
    expect(cards).toHaveLength(count)
    expect(new Set(cards.map((card) => card.getAttribute('aria-label'))).size).toBe(count)
    labels.forEach((label) => expect(screen.getAllByText(label).length).toBeGreaterThan(0))
  })
})
