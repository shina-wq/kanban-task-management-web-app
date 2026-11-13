import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    service = TestBed.inject(AuthService);
  });

  it('starts logged out', () => {
    expect(service.isLoggedIn()).toBe(false);
    expect(service.user()).toBeNull();
  });

  it('logs in and out', () => {
    service.login('  Ada ');
    expect(service.isLoggedIn()).toBe(true);
    expect(service.user()?.name).toBe('Ada');

    service.logout();
    expect(service.isLoggedIn()).toBe(false);
    expect(localStorage.getItem('kanban.user')).toBeNull();
  });

  it('updates the display name only when logged in', () => {
    service.updateName('Ghost');
    expect(service.user()).toBeNull();

    service.login('Ada');
    service.updateName('Grace');
    expect(service.user()?.name).toBe('Grace');
  });
});
