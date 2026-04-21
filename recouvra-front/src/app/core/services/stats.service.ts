import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { OverviewStats, OverviewStatsResponse } from '../models/stats.model';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private readonly apiUrl = 'http://localhost:3000/api/stats';

  constructor(private readonly http: HttpClient) {}

  getOverviewStats(): Observable<OverviewStats> {
    return this.http
      .get<OverviewStatsResponse>(`${this.apiUrl}/overview`)
      .pipe(map((response) => response.data));
  }
}
