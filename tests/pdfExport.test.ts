import { describe, it, expect } from 'vitest'
import { generatePdf } from '../src/utils/pdfExport'
import type { Stage } from '../src/types'

const stages: Stage[] = [
  {
    id: 'stage-1',
    title: 'I. Działka',
    tasks: [
      { id: 't1', title: 'Sprawdź MPZP', type: 'formal', tip: 'wskazówka' },
      { id: 't2', title: 'Badanie gruntu', type: 'technical' },
    ],
  },
]

describe('generatePdf', () => {
  it('returns a Uint8Array (valid PDF bytes)', async () => {
    const result = await generatePdf(stages, { 't1': true })
    expect(result).toBeInstanceOf(Uint8Array)
  })

  it('returns non-empty bytes', async () => {
    const result = await generatePdf(stages, {})
    expect(result.length).toBeGreaterThan(100)
  })

  it('accepts empty progress map without throwing', async () => {
    await expect(generatePdf(stages, {})).resolves.toBeInstanceOf(Uint8Array)
  })

  it('accepts all-done progress map without throwing', async () => {
    await expect(generatePdf(stages, { 't1': true, 't2': true })).resolves.toBeInstanceOf(Uint8Array)
  })
})
