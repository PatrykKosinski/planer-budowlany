import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Task } from '../types'
import { useTaskContent } from '../hooks/useTaskContent'

interface Props {
  task: Task
  isDone: boolean
  onToggle: (taskId: string) => void
}

export function TaskItem({ task, isDone, onToggle }: Props) {
  const [open, setOpen] = useState(false)
  const { content, loading } = useTaskContent(task.id)

  const hasArticle = content !== null
  const hasTip = !!task.tip

  return (
    <li className={`flex flex-col gap-1 py-3 border-b border-sand-200 last:border-0 ${isDone ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={isDone}
          onChange={() => onToggle(task.id)}
          className="mt-0.5 h-4 w-4 flex-shrink-0 accent-sand-400 cursor-pointer"
        />
        <span className={`font-serif text-sm leading-snug ${isDone ? 'line-through text-stone-700' : 'text-stone-900'}`}>
          {task.title}
        </span>
        {(hasArticle || hasTip) && (
          <button
            onClick={() => setOpen(v => !v)}
            className="ml-auto flex-shrink-0 text-xs text-sand-400 border border-sand-300 rounded px-2 py-0.5 hover:bg-sand-100 transition-colors"
            aria-label={open ? 'zwiń' : 'czytaj więcej'}
          >
            {open ? 'zwiń' : hasArticle ? 'artykuł' : 'wskazówka'}
          </button>
        )}
      </div>

      {open && (
        <div className="ml-7 mt-2">
          {loading && (
            <p className="text-xs text-stone-700 italic">Ładowanie…</p>
          )}

          {!loading && hasArticle && (
            <div className="prose prose-sm prose-stone max-w-none
              prose-headings:font-serif prose-headings:text-stone-900
              prose-h1:text-base prose-h1:mt-0 prose-h1:mb-3
              prose-h2:text-sm prose-h2:mt-4 prose-h2:mb-2
              prose-p:text-stone-700 prose-p:leading-relaxed
              prose-li:text-stone-700
              prose-strong:text-stone-900
              prose-blockquote:border-sand-300 prose-blockquote:text-stone-700 prose-blockquote:bg-sand-50 prose-blockquote:rounded prose-blockquote:px-3 prose-blockquote:py-1
              prose-table:text-xs prose-th:text-stone-900 prose-td:text-stone-700
              prose-a:text-sand-500 prose-a:no-underline hover:prose-a:underline
              prose-img:rounded prose-img:max-w-full prose-img:my-3">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
          )}

          {!loading && !hasArticle && hasTip && (
            <p className="text-xs text-stone-700 bg-sand-100 rounded p-2 leading-relaxed">
              {task.tip}
            </p>
          )}
        </div>
      )}
    </li>
  )
}
