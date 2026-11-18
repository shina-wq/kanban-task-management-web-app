import { Injectable, computed, signal } from '@angular/core';
import { readJson, removeItem, writeJson } from '../utils/storage';

export interface User {
  name: string;
}

const STORAGE_KEY = 'kanban.user';

// Fake authentication: any display name "logs in".
// There is no password or server
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUser = signal<User | null>(readJson<User | null>(STORAGE_KEY, null));

  readonly user = this.currentUser.asReadonly();
  readonly isLoggedIn = computed(() => this.currentUser() !== null);

  login(name: string): void {
    this.save({ name: name.trim() });
  }

  updateName(name: string): void {
    if (this.currentUser()) this.save({ name: name.trim() });
  }

  logout(): void {
    this.currentUser.set(null);
    removeItem(STORAGE_KEY);
  }

  private save(user: User): void {
    this.currentUser.set(user);
    writeJson(STORAGE_KEY, user);
  }
}
