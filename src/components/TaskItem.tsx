import { useState } from 'react'
import type { Task } from '../types'

interface Props {
  task: Task
  isDone: boolean
  onToggle: (taskId: string) => void
}

export function TaskItem({ task, isDone, onToggle }: Props) {
  const [showTip, setShowTip] = useState(false)

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
        {task.tip && (
          <button
            onClick={() => setShowTip(v => !v)}
            className="ml-auto flex-shrink-0 text-xs text-sand-400 border border-sand-300 rounded px-2 py-0.5 hover:bg-sand-100 transition-colors"
            aria-label="wskazówka"
          >
            {showTip ? 'zwiń' : 'wskazówka'}
          </button>
        )}
      </div>
      {showTip && task.tip && (
        <p className="ml-7 text-xs text-stone-700 bg-sand-100 rounded p-2 leading-relaxed">
          {task.tip}
        </p>
      )}
    </li>
  )
}
