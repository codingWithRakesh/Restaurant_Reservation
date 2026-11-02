import { Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Food } from '../core/models';

@Component({
  selector: 'app-food-card',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <article class="card overflow-hidden group">
      <div class="aspect-[4/3] overflow-hidden bg-ink-800">
        <img [src]="food().image" [alt]="food().name" loading="lazy"
             class="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div class="p-5">
        <div class="flex items-start justify-between gap-3">
          <h3 class="font-display text-xl text-white">{{ food().name }}</h3>
          <span class="shrink-0 rounded-full bg-saffron/15 px-3 py-1 text-sm font-semibold text-saffron">
            {{ food().price | currency:'INR':'symbol':'1.0-0' }}
          </span>
        </div>
        <p class="mt-2 text-sm text-neutral-400 line-clamp-2">{{ food().description }}</p>
      </div>
    </article>`,
})
export class FoodCardComponent {
  food = input.required<Food>();
}
