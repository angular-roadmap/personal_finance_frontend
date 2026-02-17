import { Component, OnInit, inject, signal, effect } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

import { ExpenseService } from '../../../services/expense.service';
import { ExpenseListComponent } from '../list/expense-list.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ExpenseListComponent, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private expenseService = inject(ExpenseService);

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
    this.expenseService.getStats().subscribe({
      next: (stats) => {
        // Ensure we are creating a NEW object reference so the signal triggers
        this.chartData.set({
          labels: stats.map(s => s.categoryName),
          datasets: [{
            data: stats.map(s => s.total),
            backgroundColor: ['#38bdf8', '#818cf8', '#fb7185', '#34d399', '#fbbf24'],
            hoverBackgroundColor: ['#0ea5e9', '#6366f1', '#f43f5e', '#10b981', '#f59e0b']
          }]
        });
      }
    });
  }
}