import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesNewPage } from './courses-new.page';

describe('CoursesNewPage', () => {
  let component: CoursesNewPage;
  let fixture: ComponentFixture<CoursesNewPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesNewPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursesNewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
