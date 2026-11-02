import { Component, OnInit, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { IconComponent } from '../components/icon.component';
import { Table, RestaurantReservation } from '../core/models';
import { select } from '../core/store-signal';
import { authStore } from '../store/auth.store';
import { catalogStore } from '../store/catalog.store';
import { reservationStore } from '../store/reservation.store';

interface Row { table: Table; booking?: RestaurantReservation }

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [DatePipe, IconComponent],
  template: `
    <main class="mx-auto max-w-5xl px-6 py-8">
      <header class="flex items-center justify-between">
        <div>
          <h1 class="font-display text-3xl text-white">{{ account()?.name || 'Restaurant' }} dashboard</h1>
          <p class="text-sm text-neutral-400">Live view of your tables.</p>
        </div>
        <button class="btn-ghost" (click)="logout()"><app-icon name="logout" [size]="16" />Log out</button>
      </header>

      <section class="mt-8 grid gap-4 sm:grid-cols-3">
        <div class="card flex items-center gap-4 p-5">
          <div class="rounded-xl bg-ink-800 p-3 text-neutral-300"><app-icon name="table" [size]="24" /></div>
          <div><p class="text-3xl font-semibold text-white">{{ total() }}</p><p class="text-sm text-neutral-400">Total tables</p></div>
        </div>
        <div class="card flex items-center gap-4 p-5">
          <div class="rounded-xl bg-rose-500/15 p-3 text-rose-400"><app-icon name="lock" [size]="24" /></div>
          <div><p class="text-3xl font-semibold text-white">{{ booked() }}</p><p class="text-sm text-neutral-400">Booked</p></div>
        </div>
        <div class="card flex items-center gap-4 p-5">
          <div class="rounded-xl bg-emerald-500/15 p-3 text-emerald-400"><app-icon name="check" [size]="24" /></div>
          <div><p class="text-3xl font-semibold text-white">{{ free() }}</p><p class="text-sm text-neutral-400">Not booked</p></div>
        </div>
      </section>

      <div class="card mt-4 p-5">
        <div class="mb-2 flex justify-between text-sm text-neutral-400">
          <span>Occupancy</span><span class="text-white">{{ occupancy() }}%</span>
        </div>
        <div class="h-2.5 overflow-hidden rounded-full bg-ink-800">
          <div class="h-full rounded-full bg-saffron transition-all duration-700" [style.width.%]="occupancy()"></div>
        </div>
      </div>

      <h2 class="mt-10 mb-4 text-lg text-white">Table details</h2>
      <div class="space-y-3">
        @for (row of rows(); track row.table._id) {
          <div class="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
               [class.border-rose-500/40]="row.table.status === 'reserved'">
            <div class="flex items-center gap-4">
              <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-ink-800 font-display text-xl text-white">{{ row.table.tableNumber }}</div>
              <div class="text-sm text-neutral-400">
                <p class="flex items-center gap-1.5"><app-icon name="users" [size]="14" />{{ row.table.capacity }} seats</p>
                <p class="flex items-center gap-1.5"><app-icon name="layers" [size]="14" />Floor {{ row.table.floor }}</p>
              </div>
            </div>

            @if (row.booking; as b) {
              <div class="text-sm sm:text-right">
                <p class="text-white">{{ b.user.name }}</p>
                <p class="text-neutral-400">{{ b.user.email }}</p>
                <p class="mt-1 text-neutral-300">{{ b.date | date:'d MMM y' }} · {{ b.time }}</p>
              </div>
            }

            <span class="self-start rounded-full px-3 py-1 text-xs font-medium sm:self-center"
                  [class]="row.table.status === 'reserved' ? 'bg-rose-500/15 text-rose-400' : 'bg-emerald-500/15 text-emerald-400'">
              {{ row.table.status === 'reserved' ? 'Booked' : 'Not booked' }}
            </span>
          </div>
        } @empty {
          <p class="text-neutral-400">No tables yet. Add tables through your API to see them here.</p>
        }
      </div>
    </main>`,
})
export class DashboardPage implements OnInit {
  account = select(authStore, s => s.account);
  tables = select(catalogStore, s => s.tables);
  bookings = select(reservationStore, s => s.forRestaurant);

  total = computed(() => this.tables().length);
  booked = computed(() => this.tables().filter(t => t.status === 'reserved').length);
  free = computed(() => this.total() - this.booked());
  occupancy = computed(() => (this.total() ? Math.round((this.booked() / this.total()) * 100) : 0));

  // Booked tables first
  rows = computed<Row[]>(() => {
    const byTable = new Map<string, RestaurantReservation>();
    this.bookings().filter(b => b.status !== 'cancelled').forEach(b => byTable.set(b.table._id, b));
    return this.tables()
      .map(table => ({ table, booking: byTable.get(table._id) }))
      .sort((a, b) => Number(b.table.status === 'reserved') - Number(a.table.status === 'reserved') || a.table.tableNumber - b.table.tableNumber);
  });

  constructor(private router: Router) {}
  ngOnInit() {
    catalogStore.getState().fetchTables();
    reservationStore.getState().fetchForRestaurant();
  }
  async logout() {
    await authStore.getState().logout();
    this.router.navigate(['/restaurant/login']);
  }
}
