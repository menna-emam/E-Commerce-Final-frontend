import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { userMatchGuard } from './user-match-guard';

describe('userMatchGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => userMatchGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
