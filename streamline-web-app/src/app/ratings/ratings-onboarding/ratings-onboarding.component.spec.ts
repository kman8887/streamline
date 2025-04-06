import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingsOnboardingComponent } from './ratings-onboarding.component';

describe('RatingsOnboardingComponent', () => {
  let component: RatingsOnboardingComponent;
  let fixture: ComponentFixture<RatingsOnboardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RatingsOnboardingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RatingsOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
