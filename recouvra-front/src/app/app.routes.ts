import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { SignupComponent } from './features/auth/signup/signup.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { DashboardOverviewComponent } from './features/dashboard/dashboard-overview.component';
import { DashboardSettingsComponent } from './features/dashboard/dashboard-settings.component';
import { OauthCallbackComponent } from './features/auth/oauth-callback/oauth-callback.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'oauth/callback',
    component: OauthCallbackComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
      },
      {
        path: 'overview',
        component: DashboardOverviewComponent
      },
      {
        path: 'settings',
        component: DashboardSettingsComponent
      }
    ]
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
