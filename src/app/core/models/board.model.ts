export interface Subtask {
  title: string;
  isCompleted: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  subtasks: Subtask[];
}

/** A task's status is the column it lives in. */
export interface Column {
  id: string;
  name: string;
  tasks: Task[];
}

export interface Board {
  id: string;
  name: string;
  columns: Column[];
}

/** Form value for creating or editing a board. Columns without an id are new. */
export interface BoardDraft {
  name: string;
  columns: { id?: string; name: string }[];
}

/** Form value for creating or editing a task. `columnId` is the chosen status. */
export interface TaskDraft {
  title: string;
  description: string;
  subtasks: Subtask[];
  columnId: string;
}

/** A task together with the column (status) it belongs to. */
export interface TaskLocation {
  task: Task;
  column: Column;
}
