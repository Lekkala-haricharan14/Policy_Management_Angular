import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PolicyService } from '../../services/policy';
import { Policy } from '../../models/policy.model';

@Component({
  selector: 'app-add-policy',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-policy.html',
  styleUrls: ['./add-policy.css']
})
export class AddPolicyComponent implements OnInit {
  policyForm!: FormGroup;
  
  // Signals
  isSubmitting = signal<boolean>(false);
  submitError = signal<string>('');
  submitSuccess = signal<boolean>(false);

  policyTypes = signal<string[]>(['Health', 'Life', 'Auto', 'Home']);
  statuses = signal<string[]>(['Active', 'Inactive', 'Expired']);

  constructor(
    private fb: FormBuilder,
    private policyService: PolicyService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.policyForm = this.fb.group({
      policyNumber: ['', [Validators.required, Validators.pattern(/^[A-Z]{3}\d{3}$/)]],
      policyHolderName: ['', [Validators.required, Validators.minLength(3)]],
      policyType: ['', Validators.required],
      premium: [0, [Validators.required, Validators.min(1)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: ['Active', Validators.required]
    });
  }

  onSubmit() {
    if (this.policyForm.invalid) {
      this.policyForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.submitError.set('');

    const policyData: Policy = this.policyForm.value;

    this.policyService.addPolicy(policyData).subscribe({
      next: () => {
        this.submitSuccess.set(true);
        this.isSubmitting.set(false);
        setTimeout(() => {
          this.router.navigate(['/view-policies']);
        }, 1000);
      },
      error: (err) => {
        console.error('Error adding policy:', err);
        this.submitError.set('Failed to add policy. Please try again.');
        this.isSubmitting.set(false);
      }
    });
  }

  // Getter methods for form controls
  get policyNumber() { return this.policyForm.get('policyNumber'); }
  get policyHolderName() { return this.policyForm.get('policyHolderName'); }
  get policyType() { return this.policyForm.get('policyType'); }
  get premium() { return this.policyForm.get('premium'); }
  get startDate() { return this.policyForm.get('startDate'); }
  get endDate() { return this.policyForm.get('endDate'); }
  get status() { return this.policyForm.get('status'); }
}