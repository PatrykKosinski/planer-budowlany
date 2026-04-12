export type TaskType = 'formal' | 'technical';

export interface Task {
  id: string;
  title: string;
  type: TaskType;
  tip?: string;
}

export interface Stage {
  id: string;
  title: string;
  tasks: Task[];
}

export interface StagesData {
  stages: Stage[];
}

/** taskId → checked */
export type ProgressMap = Record<string, boolean>;
