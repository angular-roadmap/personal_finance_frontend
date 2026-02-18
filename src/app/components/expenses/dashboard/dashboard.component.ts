import { Component, OnInit, inject, signal, effect } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

import { ExpenseService } from '../../../services/expense.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private expenseService = inject(ExpenseService);
  public authService = inject(AuthService); // Inject for admin check

  // Filter Signals
  // Defaulting start date to the 1st of the current month
  startDate = signal(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
  endDate = signal(new Date().toISOString().split('T')[0]);
  targetUser = signal<string>('');

  constructor() {
    // This 'effect' runs automatically whenever chartData changes!
    effect(() => {
      console.log('Chart Data updated:', this.chartData());
    });
  }

  // Signal for Chart Data
  chartData = signal<ChartData<'pie'>>({
    labels: [],
    datasets: [{ data: [] }]
  });

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { position: 'top' } }
  };
  chartType: ChartType = 'pie';

  ngOnInit() {
    this.refreshGraphics();
  }

  refreshGraphics() {
    this.expenseService.getStats(
      this.startDate(), 
      this.endDate(), 
      this.targetUser()
    ).subscribe({
      next: (stats) => {
        // stats is now properly typed as ApiResponse<CategorySum[]>
        this.chartData.set({
          labels: stats.data.map((s) => s.categoryName),
          datasets: [{
            data: stats.data.map((s) => s.total),
            backgroundColor: ['#38bdf8', '#818cf8', '#fb7185', '#34d399', '#fbbf24'],
            hoverBackgroundColor: ['#0ea5e9', '#6366f1', '#f43f5e', '#10b981', '#f59e0b']
          }]
        });
      }
    });
  }
}