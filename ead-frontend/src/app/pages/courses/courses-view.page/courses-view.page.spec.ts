import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesViewPage } from './courses-view.page';

describe('CoursesViewPage', () => {
  let component: CoursesViewPage;
  let fixture: ComponentFixture<CoursesViewPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesViewPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursesViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
