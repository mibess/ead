import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesEditPage } from './courses-edit.page';

describe('CoursesEditPage', () => {
  let component: CoursesEditPage;
  let fixture: ComponentFixture<CoursesEditPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesEditPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursesEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
