import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Policy } from '../models/policy.model';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {
  private apiUrl = 'http://localhost:3000/policies';
  
  // Signal to track loading state
  isLoading = signal<boolean>(false);
  
  // Signal to track error messages
  errorMessage = signal<string>('');

  constructor(private http: HttpClient) {}

  getPolicies(): Observable<Policy[]> {
    this.isLoading.set(true);
    return this.http.get<Policy[]>(this.apiUrl).pipe(
      map(policies => policies.sort((a, b) => (b.id || 0) - (a.id || 0))),
      tap(() => this.isLoading.set(false))
    );
  }

  getPolicyById(id: number): Observable<Policy> {
    return this.http.get<Policy>(`${this.apiUrl}/${id}`).pipe(
      map(policy => ({
        ...policy,
        premium: Number(policy.premium)
      }))
    );
  }

  addPolicy(policy: Policy): Observable<Policy> {
    return this.http.post<Policy>(this.apiUrl, policy).pipe(
      map(response => ({
        ...response,
        createdAt: new Date().toISOString()
      }))
    );
  }

  updatePolicy(id: number, policy: Policy): Observable<Policy> {
    return this.http.put<Policy>(`${this.apiUrl}/${id}`, policy).pipe(
      map(response => ({
        ...response,
        updatedAt: new Date().toISOString()
      }))
    );
  }

  deletePolicy(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Method to get policies by status using map
  getPoliciesByStatus(status: string): Observable<Policy[]> {
    return this.getPolicies().pipe(
      map(policies => policies.filter(p => p.status === status))
    );
  }

  // Method to calculate total premium using map and reduce
  getTotalPremium(): Observable<number> {
    return this.getPolicies().pipe(
      map(policies => policies.reduce((sum, policy) => sum + policy.premium, 0))
    );
  }
}