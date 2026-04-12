import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { TaskItem } from '../src/components/TaskItem'
import type { Task } from '../src/types'

const formalTask: Task = {
  id: 'task-formal',
  title: 'Sprawdź MPZP',
  type: 'formal',
  tip: 'To jest wskazówka',
}

const technicalTask: Task = {
  id: 'task-tech',
  title: 'Badanie geotechniczne',
  type: 'technical',
}

describe('TaskItem', () => {
  it('renders task title', () => {
    render(<TaskItem task={formalTask} isDone={false} onToggle={vi.fn()} />)
    expect(screen.getByText('Sprawdź MPZP')).toBeInTheDocument()
  })

  it('checkbox is unchecked when isDone=false', () => {
    render(<TaskItem task={formalTask} isDone={false} onToggle={vi.fn()} />)
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('checkbox is checked when isDone=true', () => {
    render(<TaskItem task={formalTask} isDone={true} onToggle={vi.fn()} />)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('calls onToggle with taskId when checkbox clicked', async () => {
    const onToggle = vi.fn()
    render(<TaskItem task={formalTask} isDone={false} onToggle={onToggle} />)
    await userEvent.click(screen.getByRole('checkbox'))
    expect(onToggle).toHaveBeenCalledWith('task-formal')
  })

  it('does not show tip button when task has no tip', () => {
    render(<TaskItem task={technicalTask} isDone={false} onToggle={vi.fn()} />)
    expect(screen.queryByRole('button', { name: /wskazówka/i })).not.toBeInTheDocument()
  })

  it('shows tip text when tip button is clicked', async () => {
    render(<TaskItem task={formalTask} isDone={false} onToggle={vi.fn()} />)
    const tipButton = screen.getByRole('button', { name: /wskazówka/i })
    await userEvent.click(tipButton)
    expect(screen.getByText('To jest wskazówka')).toBeInTheDocument()
  })

  it('hides tip text when tip button is clicked again', async () => {
    render(<TaskItem task={formalTask} isDone={false} onToggle={vi.fn()} />)
    const tipButton = screen.getByRole('button', { name: /wskazówka/i })
    await userEvent.click(tipButton)
    await userEvent.click(tipButton)
    expect(screen.queryByText('To jest wskazówka')).not.toBeInTheDocument()
  })
})
