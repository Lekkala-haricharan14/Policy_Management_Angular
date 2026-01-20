export interface Policy {
  id?: number;
  policyNumber: string;
  policyHolderName: string;
  policyType: string;
  premium: number;
  startDate: string;
  endDate: string;
  status: string;
}