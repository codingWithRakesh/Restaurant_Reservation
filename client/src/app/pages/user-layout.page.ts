import { Component, OnInit, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IconComponent } from '../components/icon.component';
import { ReservationsDrawerComponent } from '../components/reservations-drawer.component';
import { select } from '../core/store-signal';
import { reservationStore } from '../store/reservation.store';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [RouterOutlet, IconComponent, ReservationsDrawerComponent],
  template: `
    <router-outlet />

    <!-- top-right: my bookings -->
    <button class="fixed right-4 top-4 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-ink-700 bg-ink-900/90 text-white shadow-lg backdrop-blur transition hover:border-saffron"
            (click)="openDrawer()" aria-label="My bookings">
      <app-icon name="user" />
      @if (count() > 0) {
        <span class="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-saffron text-xs font-bold text-ink-950">{{ count() }}</span>
      }
    </button>

    <app-reservations-drawer />
  `,
})
export class UserLayoutPage implements OnInit {
  private mine = select(reservationStore, s => s.mine);
  count = computed(() => this.mine().length);
  ngOnInit() { reservationStore.getState().fetchMine(); }
  openDrawer() { reservationStore.getState().setDrawer(true); }
}
