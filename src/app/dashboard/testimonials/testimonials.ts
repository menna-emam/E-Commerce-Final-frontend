import { Component, inject } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { BehaviorSubject, switchMap } from 'rxjs';
import { AdminTestimonialService,TestimonialFilters,} 
from '../../core/services/admin-testimonial.service';
import { IAdminTestimonial } from '../../core/models/admin-testimonial.model';

@Component({
  selector: 'app-testimonials',
  imports: [AsyncPipe, DatePipe],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.css',
})
export class Testimonials {
  private _testimonialService = inject(AdminTestimonialService);
  statuses = ['pending', 'approved', 'declined', ''];
  currentStatus = 'pending';
  private _filters$ = new BehaviorSubject<TestimonialFilters>({
    status: 'pending',
    page: 1,
    limit: 10,
  });
  testimonials$ = this._filters$.pipe(
    switchMap((filters) => this._testimonialService.getAll(filters)),
  );
  setStatus(status: string) {
    this.currentStatus = status;
    this._filters$.next({ ...this._filters$.value, status, page: 1 });
  }
  onPageChange(page: number) {
    this._filters$.next({ ...this._filters$.value, page });
  }
  changeStatus(testimonial: IAdminTestimonial, status: string) {
    this._testimonialService.updateStatus(testimonial._id, status).subscribe({
      next: () => this._filters$.next({ ...this._filters$.value }), 
      error: (err) => alert(err.error?.error || 'could not change the status'),
    });
  }
  pages(total: number) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  statusClass(status: string) {
    const colors: Record<string, string> = {
      pending: 'bg-warning text-dark',
      approved: 'bg-success',
      declined: 'bg-secondary',
    };
    return colors[status] ?? 'bg-secondary';
  }
}