import { Component, inject } from '@angular/core';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { BehaviorSubject, switchMap } from 'rxjs';
import { ReportFilters, ReportService } from '../../core/services/report.service';
import { enveronment } from '../../../environments/env';

@Component({
  selector: 'app-sales-report',
  imports: [AsyncPipe, DecimalPipe],
  templateUrl: './sales-report.html',
  styleUrl: './sales-report.css',
})
export class SalesReport {
  private _reportService = inject(ReportService);
  imgBase = enveronment.staticURL;
  errorMessage = '';
  private _filters$ = new BehaviorSubject<ReportFilters>({});
  report$ = this._filters$.pipe(switchMap((filters) => this._reportService.getSalesReport(filters)));
  applyFilter(fromDate: string, toDate: string) {
    if (fromDate && toDate && fromDate > toDate) {
      this.errorMessage = '"From" date must be before "To" date';
      return;
    }
    this.errorMessage = '';
    this._filters$.next({ fromDate, toDate });
  }
  resetFilter(from: HTMLInputElement, to: HTMLInputElement) {
    from.value = '';
    to.value = '';
    this.errorMessage = '';
    this._filters$.next({});
  }
  monthName(year: number, month: number) {
    return new Date(year, month - 1, 1).toLocaleString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  }
}