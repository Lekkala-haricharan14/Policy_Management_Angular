import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PolicyService } from '../../services/policy';
import { Policy } from '../../models/policy.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-view-policies',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './view-policies.html',
  styleUrls: ['./view-policies.css']
})
export class ViewPoliciesComponent implements OnInit {
  // Signals
  policies = signal<Policy[]>([]);
  searchTerm = signal<string>('');
  filterStatus = signal<string>('All');
  isLoading = signal<boolean>(false);

  // Computed signal for filtered policies
  filteredPolicies = computed(() => {
    let result = this.policies();
    
    // Filter by status
    if (this.filterStatus() !== 'All') {
      result = result.filter(p => p.status === this.filterStatus());
    }
    
    // Filter by search term
    if (this.searchTerm()) {
      const term = this.searchTerm().toLowerCase();
      result = result.filter(p => 
        p.policyNumber.toLowerCase().includes(term) ||
        p.policyHolderName.toLowerCase().includes(term) ||
        p.policyType.toLowerCase().includes(term)
      );
    }
    
    return result;
  });

  // Computed signal for statistics
  totalPolicies = computed(() => this.policies().length);
  activePolicies = computed(() => 
    this.policies().filter(p => p.status === 'Active').length
  );
  totalPremium = computed(() => 
    this.policies().reduce((sum, p) => sum + p.premium, 0)
  );

  statusOptions = signal<string[]>(['All', 'Active', 'Inactive', 'Expired']);

  constructor(private policyService: PolicyService) {}

  ngOnInit() {
    this.loadPolicies();
  }

  loadPolicies() {
    this.isLoading.set(true);
    this.policyService.getPolicies().pipe(
      map(policies => policies.map(p => ({
        ...p,
        premium: Number(p.premium)
      })))
    ).subscribe({
      next: (data) => {
        this.policies.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading policies:', err);
        this.isLoading.set(false);
      }
    });
  }

  deletePolicy(id: number | undefined) {
    if (id && confirm('Are you sure you want to delete this policy?')) {
      this.policyService.deletePolicy(id).subscribe({
        next: () => {
          // Update signal by filtering out deleted policy
          this.policies.update(policies => 
            policies.filter(p => p.id !== id)
          );
          alert('Policy deleted successfully!');
        },
        error: (err) => console.error('Error deleting policy:', err)
      });
    }
  }

  onSearchChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }

  onFilterChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.filterStatus.set(value);
  }

  clearFilters() {
    this.searchTerm.set('');
    this.filterStatus.set('All');
  }
}