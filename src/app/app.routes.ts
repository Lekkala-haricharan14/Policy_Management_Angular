import { Routes } from '@angular/router';
import { ViewPoliciesComponent } from './components/view-policies/view-policies';
import { AddPolicyComponent } from './components/add-policy/add-policy';
import { UpdatePolicyComponent } from './components/update-policy/update-policy';

export const routes: Routes = [
  { path: '', redirectTo: '/view-policies', pathMatch: 'full' },
  { path: 'view-policies', component: ViewPoliciesComponent },
  { path: 'add-policy', component: AddPolicyComponent },
  { path: 'update-policy/:id', component: UpdatePolicyComponent }
];