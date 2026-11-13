import { TestBed } from '@angular/core/testing';
import { BoardService } from './board.service';

describe('BoardService', () => {
  let service: BoardService;

  beforeEach(() => {
    localStorage.clear();
    service = TestBed.inject(BoardService);
  });

  it('starts with the seed boards', () => {
    expect(service.boards().map((b) => b.name)).toEqual([
      'Platform Launch',
      'Marketing Plan',
      'Roadmap',
    ]);
  });

  it('creates a board with a unique slug id and empty columns', () => {
    const board = service.createBoard({ name: 'Roadmap', columns: [{ name: 'Ideas' }] });

    expect(board.id).toBe('roadmap-2');
    expect(service.getBoard('roadmap-2')?.columns[0]).toMatchObject({ name: 'Ideas', tasks: [] });
  });

  it('keeps tasks of remaining columns when editing a board', () => {
    const before = service.getBoard('platform-launch')!;
    const [todo] = before.columns;

    service.updateBoard('platform-launch', {
      name: 'Launch',
      columns: [{ id: todo.id, name: 'Backlog' }, { name: 'Review' }],
    });

    const after = service.getBoard('platform-launch')!;
    expect(after.name).toBe('Launch');
    expect(after.columns.map((c) => c.name)).toEqual(['Backlog', 'Review']);
    expect(after.columns[0].tasks.length).toBe(todo.tasks.length);
  });

  it('deletes a board', () => {
    service.deleteBoard('roadmap');
    expect(service.getBoard('roadmap')).toBeUndefined();
  });

  it('creates, finds and deletes a task', () => {
    const task = service.createTask('roadmap', {
      title: '  Ship it  ',
      description: '',
      subtasks: [{ title: 'Deploy', isCompleted: false }],
      columnId: 'rm-next',
    });

    const found = service.findTask('roadmap', task.id);
    expect(found?.task.title).toBe('Ship it');
    expect(found?.column.id).toBe('rm-next');

    service.deleteTask('roadmap', task.id);
    expect(service.findTask('roadmap', task.id)).toBeUndefined();
  });

  it('moves a task to another column when its status changes', () => {
    service.updateTask('roadmap', 'rm-t1', {
      title: 'Launch version one',
      description: '',
      subtasks: [],
      columnId: 'rm-later',
    });

    expect(service.findTask('roadmap', 'rm-t1')?.column.id).toBe('rm-later');
  });

  it('moves a task to a position in a column (drag and drop)', () => {
    service.moveTask('platform-launch', 'pl-t4', 'pl-todo', 0);
    expect(service.getBoard('platform-launch')!.columns[0].tasks[0].id).toBe('pl-t4');
  });

  it('toggles a subtask', () => {
    service.toggleSubtask('platform-launch', 'pl-t1', 1);
    expect(service.findTask('platform-launch', 'pl-t1')?.task.subtasks[1].isCompleted).toBe(true);
  });

  it('never mutates the previous state (new references for OnPush)', () => {
    const before = service.boards();
    service.toggleSubtask('platform-launch', 'pl-t1', 1);
    expect(service.boards()).not.toBe(before);
    expect(before[0].columns[0].tasks[0].subtasks[1].isCompleted).toBe(false);
  });

  it('saves changes to localStorage and reset restores the seed', () => {
    service.deleteBoard('roadmap');
    expect(localStorage.getItem('kanban.boards')).not.toContain('"roadmap"');

    service.reset();
    expect(service.getBoard('roadmap')).toBeDefined();
  });
});
