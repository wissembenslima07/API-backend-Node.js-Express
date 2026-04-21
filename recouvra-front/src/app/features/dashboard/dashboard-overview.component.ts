import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { OverviewStats } from '../../core/models/stats.model';
import { StatsService } from '../../core/services/stats.service';

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-overview.component.html',
  styleUrl: './dashboard-overview.component.scss'
})
export class DashboardOverviewComponent implements OnInit {
  isLoadingStats = true;
  statsErrorMessage = '';
  overviewStats: OverviewStats = {
    totalClients: 0,
    totalInvoices: 0,
    totalFacture: 0,
    totalImpaye: 0,
    montantRecouvre: 0,
    tauxRecouvrement: 0
  };

  constructor(private readonly statsService: StatsService) {}

  ngOnInit(): void {
    this.loadOverviewStats();
  }

  private loadOverviewStats(): void {
    this.isLoadingStats = true;
    this.statsErrorMessage = '';

    this.statsService.getOverviewStats().subscribe({
      next: (overview) => {
        this.overviewStats = overview;
        this.isLoadingStats = false;
      },
      error: (error: HttpErrorResponse) => {
        this.isLoadingStats = false;

        if (error.status === 403) {
          this.statsErrorMessage = 'Acces refuse: les statistiques sont reservees aux roles manager/admin.';
          return;
        }

        this.statsErrorMessage =
          error.error?.message ||
          (Array.isArray(error.error?.errors) ? error.error.errors.join(' ') : '') ||
          'Impossible de charger les statistiques pour le moment.';
      }
    });
  }
}
