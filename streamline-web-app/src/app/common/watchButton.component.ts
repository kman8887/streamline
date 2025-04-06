import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-watch-button',
  templateUrl: './watchButton.component.html',
})
export class WatchButtonComponent {
  @Input() isWatched: boolean = false; // Initial like status
  @Output() toggleWatch = new EventEmitter<boolean>(); // Emit event on toggle

  onToggleWatch(): void {
    this.isWatched = !this.isWatched;
    this.toggleWatch.emit(this.isWatched); // Notify parent component
  }
}
