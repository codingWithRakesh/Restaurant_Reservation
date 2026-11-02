import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { select } from '../core/store-signal';
import { adminStore } from '../store/admin.store';
import { FilePickerComponent } from './file-picker.component';
import { ModalShellComponent } from './modal-shell.component';

@Component({
  selector: 'app-food-modal',
  standalone: true,
  imports: [FormsModule, ModalShellComponent, FilePickerComponent],
  template: `
    <app-modal-shell title="Add a dish" (close)="close.emit()">
      <div class="space-y-3">
        <input class="field" placeholder="Dish name" [(ngModel)]="name" />
        <textarea class="field min-h-20" placeholder="Short description" [(ngModel)]="description"></textarea>
        <input class="field" type="number" min="0" placeholder="Price (₹)" [(ngModel)]="price" />
        <app-file-picker label="Dish photo" (picked)="file = $event" />
      </div>
      @if (error()) { <p class="mt-3 text-sm text-rose-400">{{ error() }}</p> }
      <button class="btn mt-5 w-full" [disabled]="busy() || !name || !description || !price || !file" (click)="submit()">
        {{ busy() ? 'Adding…' : 'Add dish' }}
      </button>
    </app-modal-shell>`,
})
export class FoodModalComponent {
  close = output<void>();
  busy = select(adminStore, s => s.busy);
  error = select(adminStore, s => s.error);
  name = ''; description = ''; price: number | null = null;
  file: File | null = null;

  constructor() { adminStore.getState().clearError(); }

  async submit() {
    const fd = new FormData();
    fd.append('name', this.name);
    fd.append('description', this.description);
    fd.append('price', String(this.price));
    fd.append('image', this.file!);
    if (await adminStore.getState().addFood(fd)) this.close.emit();
  }
}
