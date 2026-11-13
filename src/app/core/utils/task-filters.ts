import { Column } from '../models/board.model';

/** Columns with only the tasks whose title contains `search` (case-insensitive). */
export function filterColumns(columns: Column[], search: string): Column[] {
  const term = search.trim().toLowerCase();
  if (!term) return columns;

  return columns.map((column) => ({
    ...column,
    tasks: column.tasks.filter((task) => task.title.toLowerCase().includes(term)),
  }));
}
