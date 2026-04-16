import { useState, useEffect } from 'react'

// Vite resolves all matching files at build time — zero runtime overhead
const contentModules = import.meta.glob('../content/tasks/*.md', {
  query: '?raw',
  import: 'default',
})

interface TaskContentResult {
  content: string | null  // null = no article file for this task
  loading: boolean
}

export function useTaskContent(taskId: string): TaskContentResult {
  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const key = `../content/tasks/${taskId}.md`
    const loader = contentModules[key]

    if (!loader) {
      setContent(null)
      return
    }

    setLoading(true)
    loader().then((mod) => {
      setContent(mod as string)
      setLoading(false)
    })
  }, [taskId])

  return { content, loading }
}
