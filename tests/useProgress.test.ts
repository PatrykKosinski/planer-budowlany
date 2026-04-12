import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useProgress } from '../src/hooks/useProgress'
import type { Stage } from '../src/types'

const mockStage: Stage = {
  id: 'test-stage',
  title: 'Test Stage',
  tasks: [
    { id: 'task-1', title: 'Task 1', type: 'formal' },
    { id: 'task-2', title: 'Task 2', type: 'technical' },
  ],
}

describe('useProgress', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('starts with all tasks unchecked', () => {
    const { result } = renderHook(() => useProgress())
    expect(result.current.isTaskDone('task-1')).toBe(false)
  })

  it('toggleTask marks task as done', () => {
    const { result } = renderHook(() => useProgress())
    act(() => {
      result.current.toggleTask('task-1')
    })
    expect(result.current.isTaskDone('task-1')).toBe(true)
  })

  it('toggleTask unmarks a done task', () => {
    const { result } = renderHook(() => useProgress())
    act(() => { result.current.toggleTask('task-1') })
    act(() => { result.current.toggleTask('task-1') })
    expect(result.current.isTaskDone('task-1')).toBe(false)
  })

  it('getStageProgress returns correct counts', () => {
    const { result } = renderHook(() => useProgress())
    act(() => { result.current.toggleTask('task-1') })
    const progress = result.current.getStageProgress(mockStage.tasks)
    expect(progress.done).toBe(1)
    expect(progress.total).toBe(2)
  })

  it('persists progress to localStorage', () => {
    const { result } = renderHook(() => useProgress())
    act(() => { result.current.toggleTask('task-1') })
    const stored = JSON.parse(localStorage.getItem('planer-budowlany-progress') ?? '{}')
    expect(stored['task-1']).toBe(true)
  })

  it('restores progress from localStorage on mount', () => {
    localStorage.setItem(
      'planer-budowlany-progress',
      JSON.stringify({ 'task-1': true })
    )
    const { result } = renderHook(() => useProgress())
    expect(result.current.isTaskDone('task-1')).toBe(true)
    expect(result.current.isTaskDone('task-2')).toBe(false)
  })
})
