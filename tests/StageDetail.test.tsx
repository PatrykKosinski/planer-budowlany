import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { StageDetail } from '../src/components/StageDetail'
import type { Stage } from '../src/types'

const stage: Stage = {
  id: 'stage-1',
  title: 'I. Działka',
  tasks: [
    { id: 't1', title: 'Formalność 1', type: 'formal', tip: 'tip1' },
    { id: 't2', title: 'Formalność 2', type: 'formal' },
    { id: 't3', title: 'Techniczna 1', type: 'technical' },
  ],
}

describe('StageDetail', () => {
  it('renders stage title', () => {
    render(<StageDetail stage={stage} progress={{}} onToggle={vi.fn()} />)
    expect(screen.getByText('I. Działka')).toBeInTheDocument()
  })

  it('renders "Formalności" section when formal tasks exist', () => {
    render(<StageDetail stage={stage} progress={{}} onToggle={vi.fn()} />)
    expect(screen.getByText('Formalności')).toBeInTheDocument()
  })

  it('renders "Wymagania techniczne" section when technical tasks exist', () => {
    render(<StageDetail stage={stage} progress={{}} onToggle={vi.fn()} />)
    expect(screen.getByText('Wymagania techniczne')).toBeInTheDocument()
  })

  it('renders all task titles', () => {
    render(<StageDetail stage={stage} progress={{}} onToggle={vi.fn()} />)
    expect(screen.getByText('Formalność 1')).toBeInTheDocument()
    expect(screen.getByText('Formalność 2')).toBeInTheDocument()
    expect(screen.getByText('Techniczna 1')).toBeInTheDocument()
  })

  it('renders 3 checkboxes for 3 tasks', () => {
    render(<StageDetail stage={stage} progress={{}} onToggle={vi.fn()} />)
    expect(screen.getAllByRole('checkbox')).toHaveLength(3)
  })

  it('shows progress count', () => {
    render(
      <StageDetail stage={stage} progress={{ 't1': true }} onToggle={vi.fn()} />
    )
    expect(screen.getByText(/1.*3|1 z 3/)).toBeInTheDocument()
  })

  it('does not render "Formalności" header when no formal tasks', () => {
    const techOnlyStage: Stage = {
      id: 's2',
      title: 'Tech only',
      tasks: [{ id: 'x1', title: 'Tech task', type: 'technical' }],
    }
    render(<StageDetail stage={techOnlyStage} progress={{}} onToggle={vi.fn()} />)
    expect(screen.queryByText('Formalności')).not.toBeInTheDocument()
  })
})
