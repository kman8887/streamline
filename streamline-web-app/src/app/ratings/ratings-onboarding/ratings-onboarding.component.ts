import { Component, OnDestroy, signal } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MoviesService } from '../../services/movies.service';
import { OnboardingMovie, ShowAllMovies } from '../../models/movie';
import { finalize, Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';
import { AuthService } from '@auth0/auth0-angular';

export interface MovieRating
  extends Omit<ShowAllMovies, 'vote_average' | 'genres'> {
  rating?: number;
}

@Component({
  selector: 'app-ratings-onboarding',
  templateUrl: './ratings-onboarding.component.html',
  styleUrl: './ratings-onboarding.component.scss',
  providers: [DialogService, MoviesService],
})
export class RatingsOnboardingComponent implements OnDestroy {
  private moviesSubscription: Subscription | null = null;
  private currentUserId: number | null = null;

  loading = signal(false);
  movies: MovieRating[] = [];
  movie: MovieRating = {
    id: 'loading',
    title: 'Test',
    release_date: new Date(),
    poster_path: 'some_temp_url',
  };
  rating: number = 0;
  pageNumber = 0;

  constructor(
    private moviesService: MoviesService,
    private userService: UserService,
    private authService: AuthService,
    private dialogService: DialogService,
    private ref: DynamicDialogRef
  ) {}

  ngOnInit() {
    this.getMovies();
    this.getCurrentUser();
  }

  getMovies(): void {
    this.loading.set(true);

    if (this.moviesSubscription) {
      this.moviesSubscription.unsubscribe();
    }

    this.moviesSubscription = this.moviesService
      .findOnboardingMovies(this.pageNumber)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((response) => {
        const newMovies = response.map((movie) => {
          return {
            ...movie,
          } as MovieRating;
        });

        this.movie = newMovies[0];
        this.movies = [...this.movies, ...newMovies];
      });
  }

  getMoviePosterUrl(poster_url: string) {
    const baseUrl: string = 'https://image.tmdb.org/t/p/w500';
    return baseUrl + poster_url;
  }

  ngOnDestroy() {
    this.moviesSubscription ? this.moviesSubscription.unsubscribe() : null;
    console.log(this.currentUserId);
    console.log(this.getFilteredMovieRatings());
    if (this.currentUserId !== null) {
      const filteredMovies = this.getFilteredMovieRatings();
      if (filteredMovies.length > 0) {
        this.userService
          .bulkRateMovies(filteredMovies, this.currentUserId)
          .subscribe({
            next: (response) => {
              console.log('Bulk rate movies successful:', response);
              // Handle success, e.g., show a success message or update the UI
            },
            error: (error) => {
              console.error('Error bulk rating movies:', error);
              // Handle error, e.g., show an error message
            },
            complete: () => {
              console.log('Bulk rate movies request completed.');
              // Optional: Handle any cleanup or final steps
            },
          });
      }
    }
  }

  isRateMovieDisabled(): boolean {
    return this.rating === undefined || this.rating === null;
  }

  rateMovie() {
    console.log(this.rating);
    const currentIndex = this.movies.findIndex(
      (movie) => movie.id === this.movie.id
    );

    if (this.rating !== undefined && this.rating !== null) {
      this.movies[currentIndex].rating = this.rating;
    }
    this.nextMovie();
  }

  skipMovie() {
    this.nextMovie();
  }

  goBack() {
    return;
  }

  private nextMovie() {
    const currentIndex = this.movies.findIndex(
      (movie) => movie.id === this.movie.id
    );
    if (currentIndex !== -1 && currentIndex < this.movies.length - 1) {
      this.movie = this.movies[currentIndex + 1];
      if (this.movie.rating !== undefined && this.movie.rating !== null) {
        this.rating = this.movie.rating;
        return;
      }
    } else {
      this.pageNumber++;
      this.getMovies();
    }
    this.rating = 0;
  }

  private getFilteredMovieRatings(): MovieRating[] {
    return this.movies.filter(
      (movie) => movie.rating !== undefined && movie.rating !== null
    );
  }

  private getCurrentUser(): void {
    this.authService.user$.subscribe((response: any) => {
      this.currentUserId = response._id;
    });
  }

  // closeDialog(data: any) {
  //   this.ref.close(data);
  // }

  // getSeverity(status: string) {
  //   switch (status) {
  //     case 'INSTOCK':
  //       return 'success';
  //     case 'LOWSTOCK':
  //       return 'warning';
  //     case 'OUTOFSTOCK':
  //       return 'danger';
  //   }
  // }
}

// import { Component, OnInit } from '@angular/core';
// import { Product } from '@/domain/product';
// import { ProductService } from '@/service/productservice';
// import { MessageService } from 'primeng/api';
// import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
// import { InfoDemo } from './infodemo';
// import { TableModule } from 'primeng/table'
// import { ButtonModule } from 'primeng/button';

// @Component({
//     providers: [DialogService, MessageService, ProductService],
//     standalone:true,
//     imports:[TableModule, ButtonModule],
//     template: `<div class="flex justify-end mt-1 mb-4">
//             <p-button icon="pi pi-external-link" label="Nested Dialog" [outlined]="true" severity="success" (click)="showInfo()" />
//         </div>
//         <p-table [value]="products" responsiveLayout="scroll" [rows]="5" [responsive]="true">
//             <ng-template pTemplate="header">
//                 <tr>
//                     <th pSortableColumn="code">Code</th>
//                     <th pSortableColumn="name">Name</th>
//                     <th pSortableColumn="year">Image</th>
//                     <th pSortableColumn="price">Category</th>
//                     <th pSortableColumn="inventoryStatus">Quantity</th>
//                     <th style="width:4em"></th>
//                 </tr>
//             </ng-template>
//             <ng-template pTemplate="body" let-product>
//                 <tr>
//                     <td>{{ product.code }}</td>
//                     <td>{{ product.name }}</td>
//                     <td><img src="https://primefaces.org/cdn/primeng/images/demo/product/{{ product.image }}" [alt]="product.image" class="w-16 h-16 shadow" /></td>
//                     <td>{{ product.category }}</td>
//                     <td>
//                         {{ product.quantity }}
//                     </td>
//                     <td>
//                         <p-button type="button" [text]="true" [rounded]="true" icon="pi pi-plus" (click)="selectProduct(product)" />
//                     </td>
//                 </tr>
//             </ng-template>
//         </p-table>`
// })
// export class ProductListDemo implements OnInit {
//     products: Product[];

//     constructor(private productService: ProductService, private dialogService: DialogService, private ref: DynamicDialogRef) {}

//     ngOnInit() {
//         this.productService.getProductsSmall().then((products) => (this.products = products.slice(0, 5)));
//     }

//     selectProduct(product: Product) {
//         this.ref.close(product);
//     }

//     showInfo() {
//         this.dialogService.open(InfoDemo, {
//             header: 'Information',
//             modal: true,
//             dismissableMask: true,
//             data: {
//                 totalProducts: this.products ? this.products.length : 0
//             }
//         });
//     }

//     closeDialog(data) {
//         this.ref.close(data);
//     }

//     getSeverity(status: string) {
//         switch (status) {
//             case 'INSTOCK':
//                 return 'success';
//             case 'LOWSTOCK':
//                 return 'warning';
//             case 'OUTOFSTOCK':
//                 return 'danger';
//         }
//     }
// }
