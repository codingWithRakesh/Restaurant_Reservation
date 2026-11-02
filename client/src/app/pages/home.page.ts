import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FoodCardComponent } from '../components/food-card.component';
import { IconComponent } from '../components/icon.component';
import { select } from '../core/store-signal';
import { authStore } from '../store/auth.store';
import { catalogStore } from '../store/catalog.store';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [FoodCardComponent, IconComponent],
  template: `
    <!-- Hero: building photo -->
    <header class="relative h-[75vh] min-h-[460px] w-full overflow-hidden bg-ink-900">
      @if (restaurant(); as r) {
        <img [src]="r.image" [alt]="r.name" class="absolute inset-0 h-full w-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/50 to-transparent"></div>
        <div class="absolute bottom-0 left-0 right-0 mx-auto max-w-6xl px-6 pb-12">
          <p class="text-sm text-saffron">Welcome, {{ firstName() }}</p>
          <h1 class="font-display text-5xl md:text-7xl text-white">{{ r.name }}</h1>
        </div>
      } @else {
        <div class="absolute inset-0 animate-pulse bg-ink-800"></div>
      }
    </header>

    <main class="mx-auto max-w-6xl px-6 pb-40">
      @if (restaurant(); as r) {
        <section class="grid gap-8 py-14 md:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 class="font-display text-3xl text-white">About us</h2>
            <p class="mt-4 max-w-prose leading-relaxed text-neutral-400">{{ r.description }}</p>
          </div>
          <ul class="card space-y-4 p-6 text-sm">
            <li class="flex gap-3"><app-icon name="pin" [size]="18" class="text-saffron" />{{ r.address }}</li>
            <li class="flex gap-3"><app-icon name="phone" [size]="18" class="text-saffron" />{{ r.phone }}</li>
            <li class="flex gap-3"><app-icon name="mail" [size]="18" class="text-saffron" />{{ r.email }}</li>
            <li class="flex gap-3"><app-icon name="clock" [size]="18" class="text-saffron" />Open {{ r.opening_Time }} – {{ r.closing_Time }}</li>
          </ul>
        </section>
      }

      <section>
        <h2 class="font-display text-3xl text-white">From our kitchen</h2>
        <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          @for (f of foods(); track f._id) { <app-food-card [food]="f" /> }
        </div>
        @if (!foods().length && !loading()) {
          <p class="mt-8 text-neutral-400">The menu is being updated. Check back soon.</p>
        }
        @if (error()) { <p class="mt-6 text-rose-400">{{ error() }}</p> }
      </section>
    </main>

    <!-- Floating book button -->
    <button class="btn fixed bottom-4 left-1/2 z-20 -translate-x-1/2 !rounded-full !px-7 !py-4 shadow-2xl shadow-black/60"
            (click)="goBook()">
      <app-icon name="table" />Book a table
    </button>
  `,
})
export class HomePage implements OnInit {
  restaurant = select(catalogStore, s => s.restaurant);
  foods = select(catalogStore, s => s.foods);
  loading = select(catalogStore, s => s.loading);
  error = select(catalogStore, s => s.error);
  account = select(authStore, s => s.account);
  firstName = () => this.account()?.name?.split(' ')[0] ?? '';

  constructor(private router: Router) {}
  ngOnInit() { catalogStore.getState().fetchHome(); }
  goBook() { this.router.navigate(['/app/tables']); }
}
