import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { UserListPage } from './user-list.page';
import { UserService } from '../user.service';
import { UsersSelectors } from '../user.selectors';
import { of } from 'rxjs';

describe('UserListPage', () => {
  let component: UserListPage;
  let fixture: ComponentFixture<UserListPage>;
  let userServiceMock: any;
  let usersSelectorsMock: any;

  beforeEach(async () => {
    userServiceMock = {
      getAll: jasmine.createSpy('getAll').and.returnValue({ subscribe: () => { } })
    };

    usersSelectorsMock = {
      users: jasmine.createSpy('users').and.returnValue(null), // Signal
      userResponseState: Object.assign(
        jasmine.createSpy('userResponseState'),
        {
          set: jasmine.createSpy('set'),
          update: jasmine.createSpy('update') // Add update if needed
        }
      ),
      // Computed must be mocked if accessed directly, but here we mock the service/selectors that feed them.
      // However, the component reads `this.usersSelectors.userResponseState().loading`.
      // So userResponseState must be a signal-like object.
    };
    // Fix userResponseState to be callable (getter) and have set/update methods
    usersSelectorsMock.userResponseState.and.returnValue({ loading: false, users: null });


    await TestBed.configureTestingModule({
      imports: [UserListPage],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: UserService, useValue: userServiceMock },
        { provide: UsersSelectors, useValue: usersSelectorsMock }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UserListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(userServiceMock.getAll).toHaveBeenCalled();
  });
});
