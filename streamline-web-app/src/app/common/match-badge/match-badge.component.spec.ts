import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchBadgeComponent } from './match-badge.component';

describe('MatchBadgeComponent', () => {
  let component: MatchBadgeComponent;
  let fixture: ComponentFixture<MatchBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MatchBadgeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
