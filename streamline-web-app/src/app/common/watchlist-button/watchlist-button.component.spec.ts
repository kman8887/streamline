import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchlistButtonComponent } from './watchlist-button.component';

describe('WatchlistButtonComponent', () => {
  let component: WatchlistButtonComponent;
  let fixture: ComponentFixture<WatchlistButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WatchlistButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WatchlistButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
