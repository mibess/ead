import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesPopularCardComponent } from './courses-popular-card.component';

describe('CoursesPopularCardComponent', () => {
  let component: CoursesPopularCardComponent;
  let fixture: ComponentFixture<CoursesPopularCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesPopularCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursesPopularCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
