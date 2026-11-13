import { Column } from '../models/board.model';
import { filterColumns } from './task-filters';

const columns: Column[] = [
  {
    id: 'todo',
    name: 'Todo',
    tasks: [
      { id: '1', title: 'Write docs', description: '', subtasks: [] },
      { id: '2', title: 'Build API', description: '', subtasks: [] },
      { id: '3', title: 'Build UI', description: '', subtasks: [] },
    ],
  },
  { id: 'done', name: 'Done', tasks: [] },
];

describe('filterColumns', () => {
  it('keeps tasks whose title matches, ignoring case and spaces', () => {
    const [todo] = filterColumns(columns, '  BUILD ');
    expect(todo.tasks.map((t) => t.id)).toEqual(['2', '3']);
  });

  it('keeps every column, even when none of its tasks match', () => {
    expect(filterColumns(columns, 'docs').map((c) => c.id)).toEqual(['todo', 'done']);
  });

  it('returns the columns unchanged for an empty search', () => {
    expect(filterColumns(columns, '   ')).toBe(columns);
  });

  it('does not change the original columns', () => {
    filterColumns(columns, 'docs');
    expect(columns[0].tasks.length).toBe(3);
  });
});
