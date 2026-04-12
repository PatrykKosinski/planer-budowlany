import { useState, useEffect } from 'react'
import type { Task, ProgressMap } from '../types'

const STORAGE_KEY = 'planer-budowlany-progress'

function loadFromStorage(): ProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as ProgressMap) : {}
  } catch {
    return {}
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressMap>(loadFromStorage)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  const toggleTask = (taskId: string) => {
    setProgress(prev => ({ ...prev, [taskId]: !prev[taskId] }))
  }

  const isTaskDone = (taskId: string): boolean => !!progress[taskId]

  const getStageProgress = (tasks: Task[]): { done: number; total: number } => {
    const done = tasks.filter(t => progress[t.id]).length
    return { done, total: tasks.length }
  }

  return { toggleTask, isTaskDone, getStageProgress }
}
