import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ExportButton } from '../src/components/ExportButton'
import type { Stage } from '../src/types'

// Mock pdfExport so tests don't run pdf-lib
vi.mock('../src/utils/pdfExport', () => ({
  generatePdf: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
}))

const stages: Stage[] = [
  {
    id: 's1',
    title: 'I. Test',
    tasks: [{ id: 't1', title: 'Task', type: 'formal' }],
  },
]

describe('ExportButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    globalThis.URL.createObjectURL = vi.fn().mockReturnValue('blob:mock')
    globalThis.URL.revokeObjectURL = vi.fn()
  })

  it('renders export button', () => {
    render(<ExportButton stages={stages} progress={{}} />)
    expect(screen.getByRole('button', { name: /eksport pdf/i })).toBeInTheDocument()
  })

  it('shows loading state while generating', async () => {
    const { generatePdf } = await import('../src/utils/pdfExport')
    let resolvePdf!: (v: Uint8Array) => void
    vi.mocked(generatePdf).mockReturnValueOnce(
      new Promise(resolve => { resolvePdf = resolve })
    )

    render(<ExportButton stages={stages} progress={{}} />)

    // Fire a raw click event (synchronous) so we can catch the loading state
    // before the async userEvent machinery wraps up
    await act(async () => {
      screen.getByRole('button', { name: /eksport pdf/i }).click()
    })

    // Check loading state — generatePdf is still pending at this point
    expect(screen.getByRole('button', { name: /generowanie/i })).toBeInTheDocument()

    // Resolve and finish
    resolvePdf(new Uint8Array([1]))
  })

  it('calls generatePdf with all stages and progress on click', async () => {
    const { generatePdf } = await import('../src/utils/pdfExport')
    render(<ExportButton stages={stages} progress={{ 't1': true }} />)
    await userEvent.click(screen.getByRole('button', { name: /eksport pdf/i }))
    expect(generatePdf).toHaveBeenCalledWith(stages, { 't1': true })
  })
})
