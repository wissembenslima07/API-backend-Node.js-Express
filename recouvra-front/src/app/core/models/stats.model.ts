import { ApiResponse } from './auth.model';

export interface OverviewStats {
  totalClients: number;
  totalInvoices: number;
  totalFacture: number;
  totalImpaye: number;
  montantRecouvre: number;
  tauxRecouvrement: number;
}

export type OverviewStatsResponse = ApiResponse<OverviewStats>;
