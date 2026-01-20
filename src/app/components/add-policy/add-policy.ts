import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PolicyService } from '../../services/policy';
import { Policy } from '../../models/policy.model';

@Component({
  selector: 'app-add-policy',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './add-policy.html',
  styleUrls: ['./add-policy.css']
})
export class AddPolicyComponent {

  // ---------------- FORM STATE ----------------
  policyNumber = signal('');
  policyHolderName = signal('');
  policyType = signal('');
  premium = signal<number>(0);
  startDate = signal('');
  endDate = signal('');
  status = signal('Active');

  // ---------------- UI STATE ----------------
  isSubmitting = signal(false);
  submitError = signal('');
  submitSuccess = signal(false);

  policyTypes = signal(['Health', 'Life', 'Auto', 'Home']);
  statuses = signal(['Active', 'Inactive', 'Expired']);

  // ---------------- VALIDATIONS ----------------
  policyNumberError = computed(() => {
    if (!this.policyNumber()) return 'Policy number is required';
    if (!/^[A-Z]{3}\d{3}$/.test(this.policyNumber()))
      return 'Format: POL001';
    return '';
  });

  nameError = computed(() => {
    if (!this.policyHolderName()) return 'Name is required';
    if (this.policyHolderName().length < 3)
      return 'Minimum 3 characters';
    return '';
  });

  premiumError = computed(() => {
    if (this.premium() <= 0) return 'Premium must be greater than 0';
    return '';
  });

  isFormValid = computed(() =>
    !this.policyNumberError() &&
    !this.nameError() &&
    !this.premiumError() &&
    !!this.policyType() &&
    !!this.startDate() &&
    !!this.endDate()
  );

  constructor(
    private policyService: PolicyService,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.isFormValid()) return;

    this.isSubmitting.set(true);

    const policy: Policy = {
      policyNumber: this.policyNumber(),
      policyHolderName: this.policyHolderName(),
      policyType: this.policyType(),
      premium: this.premium(),
      startDate: this.startDate(),
      endDate: this.endDate(),
      status: this.status()
    };

    this.policyService.addPolicy(policy).subscribe({
      next: () => {
        this.submitSuccess.set(true);
        this.isSubmitting.set(false);
        setTimeout(() => this.router.navigate(['/view-policies']), 1000);
      },
      error: () => {
        this.submitError.set('Failed to add policy');
        this.isSubmitting.set(false);
      }
    });
  }
}
