import { DOCUMENT } from '@angular/common';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'SteamLine';
  #document = inject(DOCUMENT);
  isDarkMode = false;

  constructor() {
    if (this.isSystemDark()) {
      this.toggleLightDark();
    }
  }

  toggleLightDark() {
    const linkElement = this.#document.getElementById(
      'app-theme'
    ) as HTMLLinkElement;
    if (linkElement.href.includes('light')) {
      linkElement.href = 'theme-dark.css';
      this.isDarkMode = true;
    } else {
      linkElement.href = 'theme-light.css';
      this.isDarkMode = false;
    }
  }

  isSystemDark(): boolean {
    return window?.matchMedia?.('(prefers-color-scheme:dark)')?.matches;
  }
}
