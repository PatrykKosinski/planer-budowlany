import { useState } from 'react'
import stagesData from './data/stages.json'
import type { StagesData } from './types'
import { useProgress } from './hooks/useProgress'
import { StageBar } from './components/StageBar'
import { StageDetail } from './components/StageDetail'
import { ExportButton } from './components/ExportButton'

const { stages } = stagesData as StagesData

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { toggleTask, isTaskDone, getStageProgress } = useProgress()

  const currentStage = stages[currentIndex]
  const { done, total } = getStageProgress(currentStage.tasks)
  const allDone = stages.every(s => s.tasks.every(t => isTaskDone(t.id)))

  const progressMap = Object.fromEntries(
    stages.flatMap(s => s.tasks.map(t => [t.id, isTaskDone(t.id)]))
  )

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header */}
      <header className="bg-white border-b border-sand-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl text-stone-900 tracking-tight">
              Planer Budowlany
            </h1>
            <p className="text-xs text-stone-700 mt-0.5 font-sans">
              Budowa domu jednorodzinnego — formalności i wymagania techniczne
            </p>
          </div>
          <ExportButton stages={stages} progress={progressMap} />
        </div>
      </header>

      {/* Stage navigation */}
      <StageBar
        stages={stages}
        currentIndex={currentIndex}
        progress={progressMap}
        onSelect={setCurrentIndex}
      />

      {/* Stage progress bar */}
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-sand-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-sand-400 rounded-full transition-all duration-300"
              style={{ width: total > 0 ? `${(done / total) * 100}%` : '0%' }}
            />
          </div>
          <span className="text-xs font-sans text-stone-700 whitespace-nowrap">
            {done} z {total} zadań
          </span>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 pb-12">
        <StageDetail
          stage={currentStage}
          progress={progressMap}
          onToggle={toggleTask}
        />

        {allDone && (
          <div className="mt-6 text-center py-8 bg-white border border-sand-200 rounded-lg">
            <p className="font-serif text-lg text-stone-900">
              Gratulacje — wszystkie etapy ukończone!
            </p>
            <p className="text-sm text-stone-700 mt-1 font-sans">
              Eksportuj pełny plan jako PDF na pamiątkę.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
