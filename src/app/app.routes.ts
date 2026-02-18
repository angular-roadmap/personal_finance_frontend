import { Routes } from '@angular/router';
import { DashboardComponent } from './components/expenses/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';
import { CategoryManagerComponent } from './components/category-manager/category-manager.component';
import { ExpenseFormComponent } from './components/expenses/expense-form/expense-form.component';
import { ExpenseListComponent } from './components/expenses/list/expense-list.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'expenses',
    component: ExpenseFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'expenses-list',
    component: ExpenseListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'categories',
    component: CategoryManagerComponent,
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];