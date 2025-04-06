import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchlistcardComponent } from './watchlistcard.component';

describe('WatchlistcardComponent', () => {
  let component: WatchlistcardComponent;
  let fixture: ComponentFixture<WatchlistcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WatchlistcardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WatchlistcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
