import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingsOnboardingDynamicDialogComponent } from './ratings-onboarding-dynamic-dialog.component';

describe('RatingsOnboardingDynamicDialogComponent', () => {
  let component: RatingsOnboardingDynamicDialogComponent;
  let fixture: ComponentFixture<RatingsOnboardingDynamicDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RatingsOnboardingDynamicDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RatingsOnboardingDynamicDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
