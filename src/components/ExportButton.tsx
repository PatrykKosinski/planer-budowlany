import { useState } from 'react'
import type { Stage, ProgressMap } from '../types'
import { generatePdf } from '../utils/pdfExport'
import { generateGuidebook } from '../utils/guidebookExport'

interface Props {
  stages: Stage[]
  progress: ProgressMap
}

export function ExportButton({ stages, progress }: Props) {
  const [loadingGuide, setLoadingGuide] = useState(false)
  const [loadingCheck, setLoadingCheck] = useState(false)

  const handleGuidebook = async () => {
    setLoadingGuide(true)
    try {
      await generateGuidebook(stages)
    } catch (err) {
      console.error('Guidebook export failed:', err)
    } finally {
      setLoadingGuide(false)
    }
  }

  const handleChecklist = async () => {
    setLoadingCheck(true)
    try {
      const bytes = await generatePdf(stages, progress)
      const blob = new Blob([bytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'checklista-budowlana.pdf'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Checklist export failed:', err)
    } finally {
      setLoadingCheck(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* Primary — guidebook */}
      <button
        onClick={handleGuidebook}
        disabled={loadingGuide || loadingCheck}
        className="flex items-center gap-2 px-4 py-2 text-sm font-sans bg-sand-400 text-white rounded hover:bg-sand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loadingGuide ? (
          <>
            <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Generowanie…
          </>
        ) : (
          '↓ Poradnik PDF'
        )}
      </button>

      {/* Secondary — checklist */}
      <button
        onClick={handleChecklist}
        disabled={loadingGuide || loadingCheck}
        className="flex items-center gap-2 px-3 py-2 text-xs font-sans border border-sand-300 rounded text-stone-700 hover:border-sand-400 hover:bg-sand-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loadingCheck ? (
          <>
            <span className="inline-block w-2.5 h-2.5 border-2 border-sand-400 border-t-transparent rounded-full animate-spin" />
            Generowanie…
          </>
        ) : (
          'Checklista PDF'
        )}
      </button>
    </div>
  )
}
