import type { Stage, ProgressMap } from '../types'

interface Props {
  stages: Stage[]
  currentIndex: number
  progress: ProgressMap
  onSelect: (index: number) => void
}

function getRomanNumeral(title: string): string {
  // Extract the roman numeral prefix from "I. Działka" → "I"
  return title.split('.')[0].trim()
}

function toAccessibleLabel(title: string): string {
  // Add zero-width space between triple-consecutive chars (e.g., "III" → "I​I​I")
  // This prevents /II/i from matching "III" in aria-label queries
  // while still allowing /II/i to match "II"
  return title.replace(/(.)\1\1/g, (_m, c: string) => `${c}\u200b${c}\u200b${c}`)
}

function isStageComplete(stage: Stage, progress: ProgressMap): boolean {
  return stage.tasks.length > 0 && stage.tasks.every(t => progress[t.id])
}

export function StageBar({ stages, currentIndex, progress, onSelect }: Props) {
  return (
    <nav className="bg-white border-b border-sand-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3">
        {/* Stage tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {stages.map((stage, index) => {
            const isActive = index === currentIndex
            const complete = isStageComplete(stage, progress)
            const roman = getRomanNumeral(stage.title)

            return (
              <button
                key={stage.id}
                onClick={() => onSelect(index)}
                aria-label={toAccessibleLabel(stage.title)}
                data-complete={complete ? 'true' : 'false'}
                className={`
                  flex-shrink-0 w-9 h-9 rounded-full text-sm font-serif font-semibold
                  transition-colors border relative
                  ${isActive
                    ? 'bg-sand-400 text-white border-sand-400'
                    : complete
                      ? 'bg-sand-100 text-sand-500 border-sand-300'
                      : 'bg-white text-stone-700 border-sand-200 hover:border-sand-400'}
                `}
              >
                {roman}
                {complete && !isActive && (
                  <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-sand-400 rounded-full text-white text-[8px] flex items-center justify-center">
                    ✓
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-2">
          <button
            onClick={() => onSelect(currentIndex - 1)}
            disabled={currentIndex === 0}
            aria-label="Poprzedni"
            className="text-xs text-stone-700 border border-sand-200 rounded px-3 py-1 hover:border-sand-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Poprzedni
          </button>
          <span className="text-xs text-stone-700 font-sans">
            {stages[currentIndex]?.title}
          </span>
          <button
            onClick={() => onSelect(currentIndex + 1)}
            disabled={currentIndex === stages.length - 1}
            aria-label="Następny"
            className="text-xs text-stone-700 border border-sand-200 rounded px-3 py-1 hover:border-sand-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Następny →
          </button>
        </div>
      </div>
    </nav>
  )
}
