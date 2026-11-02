import { Component, input } from '@angular/core';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-auth-shell',
  standalone: true,
  imports: [IconComponent],
  template: `
    <main class="min-h-screen grid lg:grid-cols-2">
      <section class="hidden lg:flex flex-col justify-end p-12 bg-ink-900 border-r border-ink-700 relative overflow-hidden">
        <div class="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-saffron/10 blur-3xl"></div>
        <app-icon name="utensils" [size]="40" class="text-saffron mb-6" />
        <h1 class="font-display text-5xl leading-tight text-white max-w-md">Your table is waiting.</h1>
        <p class="mt-4 text-neutral-400 max-w-sm">Pick a table, choose a time, and walk in knowing it's yours.</p>
      </section>
      <section class="flex items-center justify-center p-6">
        <div class="w-full max-w-sm">
          <h2 class="font-display text-3xl text-white">{{ title() }}</h2>
          <p class="mt-1 mb-8 text-sm text-neutral-400">{{ subtitle() }}</p>
          <ng-content />
        </div>
      </section>
    </main>`,
})
export class AuthShellComponent {
  title = input.required<string>();
  subtitle = input('');
}
