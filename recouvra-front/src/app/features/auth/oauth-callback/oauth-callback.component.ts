import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { AuthUser } from '../../../core/models/auth.model';

@Component({
  selector: 'app-oauth-callback',
  standalone: true,
  template: ''
})
export class OauthCallbackComponent {
  constructor(
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.finalizeGoogleSession();
  }

  private finalizeGoogleSession(): void {
    this.route.fragment.pipe(take(1)).subscribe((fragment) => {
      if (!fragment) {
        this.router.navigate(['/login'], { queryParams: { oauth: 'missing' } });
        return;
      }

      const params = new URLSearchParams(fragment);
      const token = params.get('token');
      const encodedUser = params.get('user');

      if (!token || !encodedUser) {
        this.router.navigate(['/login'], { queryParams: { oauth: 'invalid' } });
        return;
      }

      try {
        const user = JSON.parse(encodedUser) as AuthUser;
        this.authService.completeOAuthSession(token, user);
        this.router.navigate(['/dashboard']);
      } catch {
        this.router.navigate(['/login'], { queryParams: { oauth: 'invalid-user' } });
      }
    });
  }
}
