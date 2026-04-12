import type { Stage, ProgressMap } from '../types'
import { TaskItem } from './TaskItem'

interface Props {
  stage: Stage
  progress: ProgressMap
  onToggle: (taskId: string) => void
}

export function StageDetail({ stage, progress, onToggle }: Props) {
  const formalTasks = stage.tasks.filter(t => t.type === 'formal')
  const technicalTasks = stage.tasks.filter(t => t.type === 'technical')
  const doneCount = stage.tasks.filter(t => progress[t.id]).length

  return (
    <section className="bg-white rounded-lg border border-sand-200 shadow-sm p-6">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="font-serif text-xl text-stone-900">{stage.title}</h2>
        <span className="text-sm text-stone-700 font-sans">
          {doneCount} / {stage.tasks.length}
        </span>
      </div>

      {formalTasks.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs font-sans font-semibold uppercase tracking-widest text-sand-400 mb-2">
            Formalności
          </h3>
          <ul>
            {formalTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                isDone={!!progress[task.id]}
                onToggle={onToggle}
              />
            ))}
          </ul>
        </div>
      )}

      {technicalTasks.length > 0 && (
        <div>
          <h3 className="text-xs font-sans font-semibold uppercase tracking-widest text-sand-400 mb-2">
            Wymagania techniczne
          </h3>
          <ul>
            {technicalTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                isDone={!!progress[task.id]}
                onToggle={onToggle}
              />
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
