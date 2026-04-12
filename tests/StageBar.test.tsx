import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { StageBar } from '../src/components/StageBar'
import type { Stage } from '../src/types'

const stages: Stage[] = [
  {
    id: 'stage-a',
    title: 'I. Działka',
    tasks: [
      { id: 't1', title: 'T1', type: 'formal' },
      { id: 't2', title: 'T2', type: 'formal' },
    ],
  },
  {
    id: 'stage-b',
    title: 'II. Projekt',
    tasks: [
      { id: 't3', title: 'T3', type: 'technical' },
    ],
  },
  {
    id: 'stage-c',
    title: 'III. Pozwolenie',
    tasks: [
      { id: 't4', title: 'T4', type: 'formal' },
    ],
  },
]

describe('StageBar', () => {
  it('renders all stage short labels', () => {
    render(
      <StageBar stages={stages} currentIndex={0} progress={{}} onSelect={vi.fn()} />
    )
    expect(screen.getByText('I')).toBeInTheDocument()
    expect(screen.getByText('II')).toBeInTheDocument()
    expect(screen.getByText('III')).toBeInTheDocument()
  })

  it('marks current stage as active', () => {
    render(
      <StageBar stages={stages} currentIndex={1} progress={{}} onSelect={vi.fn()} />
    )
    const activeButton = screen.getByRole('button', { name: 'II. Projekt' })
    expect(activeButton).toHaveClass('bg-sand-400')
  })

  it('calls onSelect with index when stage button clicked', async () => {
    const onSelect = vi.fn()
    render(
      <StageBar stages={stages} currentIndex={0} progress={{}} onSelect={onSelect} />
    )
    await userEvent.click(screen.getByRole('button', { name: 'II. Projekt' }))
    expect(onSelect).toHaveBeenCalledWith(1)
  })

  it('shows completion indicator when all tasks in a stage are done', () => {
    render(
      <StageBar
        stages={stages}
        currentIndex={0}
        progress={{ 't1': true, 't2': true }}
        onSelect={vi.fn()}
      />
    )
    // Stage I is complete — its button should have data-complete="true"
    const stageAButton = screen.getByRole('button', { name: 'I. Działka' })
    expect(stageAButton).toHaveAttribute('data-complete', 'true')
  })

  it('renders previous and next navigation buttons', () => {
    render(
      <StageBar stages={stages} currentIndex={1} progress={{}} onSelect={vi.fn()} />
    )
    expect(screen.getByRole('button', { name: /poprzedni/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /następny/i })).toBeInTheDocument()
  })

  it('previous button calls onSelect with currentIndex - 1', async () => {
    const onSelect = vi.fn()
    render(
      <StageBar stages={stages} currentIndex={1} progress={{}} onSelect={onSelect} />
    )
    await userEvent.click(screen.getByRole('button', { name: /poprzedni/i }))
    expect(onSelect).toHaveBeenCalledWith(0)
  })

  it('next button calls onSelect with currentIndex + 1', async () => {
    const onSelect = vi.fn()
    render(
      <StageBar stages={stages} currentIndex={1} progress={{}} onSelect={onSelect} />
    )
    await userEvent.click(screen.getByRole('button', { name: /następny/i }))
    expect(onSelect).toHaveBeenCalledWith(2)
  })

  it('previous button is disabled at first stage', () => {
    render(
      <StageBar stages={stages} currentIndex={0} progress={{}} onSelect={vi.fn()} />
    )
    expect(screen.getByRole('button', { name: /poprzedni/i })).toBeDisabled()
  })

  it('next button is disabled at last stage', () => {
    render(
      <StageBar stages={stages} currentIndex={2} progress={{}} onSelect={vi.fn()} />
    )
    expect(screen.getByRole('button', { name: /następny/i })).toBeDisabled()
  })
})
