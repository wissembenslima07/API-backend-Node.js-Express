import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { ApiResponse, AuthResult, AuthUser, LoginRequest, RegisterRequest } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:3000/api/auth';
  private readonly tokenKey = 'recouvra_token';
  private readonly userKey = 'recouvra_user';

  private readonly currentUserSubject = new BehaviorSubject<AuthUser | null>(this.readUserFromStorage());
  readonly currentUser$ = this.currentUserSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  login(payload: LoginRequest): Observable<AuthUser> {
    return this.http
      .post<ApiResponse<AuthResult>>(`${this.apiUrl}/login`, payload)
      .pipe(tap((response) => this.persistSession(response.data)), map((response) => response.data.user));
  }

  register(payload: RegisterRequest): Observable<AuthUser> {
    return this.http
      .post<ApiResponse<AuthResult>>(`${this.apiUrl}/register`, payload)
      .pipe(tap((response) => this.persistSession(response.data)), map((response) => response.data.user));
  }

  me(): Observable<AuthUser> {
    return this.http
      .get<ApiResponse<AuthUser>>(`${this.apiUrl}/me`)
      .pipe(tap((response) => this.currentUserSubject.next(response.data)), map((response) => response.data));
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return Boolean(this.getToken());
  }

  getCurrentUserSnapshot(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  private persistSession(data: AuthResult): void {
    localStorage.setItem(this.tokenKey, data.token);
    localStorage.setItem(this.userKey, JSON.stringify(data.user));
    this.currentUserSubject.next(data.user);
  }

  private readUserFromStorage(): AuthUser | null {
    const raw = localStorage.getItem(this.userKey);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      localStorage.removeItem(this.userKey);
      return null;
    }
  }
}
