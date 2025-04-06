import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-watchlist-button',
  templateUrl: './watchlist-button.component.html',
  styleUrl: './watchlist-button.component.scss',
})
export class WatchlistButtonComponent {
  @Input() isInWatchList: boolean = false; // Initial like status
  @Output() toggleWatchList = new EventEmitter<boolean>(); // Emit event on toggle

  onToggleWatchList(): void {
    this.isInWatchList = !this.isInWatchList;
    this.toggleWatchList.emit(this.isInWatchList); // Notify parent component
  }
}
