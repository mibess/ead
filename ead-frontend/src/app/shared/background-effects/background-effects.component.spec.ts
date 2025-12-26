import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundEffectsComponent } from './background-effects.component';

describe('BackgroundEffectsComponent', () => {
  let component: BackgroundEffectsComponent;
  let fixture: ComponentFixture<BackgroundEffectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackgroundEffectsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackgroundEffectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
