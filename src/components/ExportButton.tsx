import { useState } from 'react'
import type { Stage, ProgressMap } from '../types'
import { generatePdf } from '../utils/pdfExport'

interface Props {
  stages: Stage[]
  progress: ProgressMap
}

export function ExportButton({ stages, progress }: Props) {
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      const bytes = await generatePdf(stages, progress)
      const blob = new Blob([bytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'planer-budowlany.pdf'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('PDF export failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      aria-label={loading ? 'Generowanie PDF…' : 'Eksport PDF'}
      className="flex items-center gap-2 px-4 py-2 text-sm font-sans border border-sand-300 rounded text-stone-700 hover:border-sand-400 hover:bg-sand-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {loading ? (
        <>
          <span className="inline-block w-3 h-3 border-2 border-sand-400 border-t-transparent rounded-full animate-spin" />
          Generowanie…
        </>
      ) : (
        <>
          ↓ Eksport PDF
        </>
      )}
    </button>
  )
}
