import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-like-button',
  templateUrl: './likeButton.component.html',
})
export class LikeButtonComponent {
  @Input() isLiked: boolean = false; // Initial like status
  @Output() toggleLike = new EventEmitter<boolean>(); // Emit event on toggle

  onToggleLike(): void {
    this.isLiked = !this.isLiked;
    this.toggleLike.emit(this.isLiked); // Notify parent component
  }
}
