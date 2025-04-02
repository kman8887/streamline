import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RatingsOnboardingComponent } from '../ratings-onboarding/ratings-onboarding.component';
import { Movie } from '../../models/movie';

@Component({
  selector: 'app-ratings-onboarding-dynamic-dialog',
  templateUrl: './ratings-onboarding-dynamic-dialog.component.html',
  styleUrl: './ratings-onboarding-dynamic-dialog.component.scss',
  providers: [DialogService, MessageService],
})
export class RatingsOnboardingDynamicDialogComponent {
  ref: DynamicDialogRef | undefined;

  constructor(
    public dialogService: DialogService,
    public messageService: MessageService
  ) {}

  show() {
    this.ref = this.dialogService.open(RatingsOnboardingComponent, {
      header: 'Rate Movies',
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
    });

    // this.ref.onClose.subscribe((product: Movie) => {
    //     if (product) {
    //         this.messageService.add({ severity: 'info', summary: 'Product Selected', detail: product.name });
    //     }
    // });
  }
}
