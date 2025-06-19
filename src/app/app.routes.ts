import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'inventory',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/inventory/product-list/product-list.component').then(m => m.ProductListComponent)
          },
          {
            path: 'new',
            loadComponent: () => import('./features/inventory/product-form/product-form.component').then(m => m.ProductFormComponent)
          },
          {
            path: ':id/edit',
            loadComponent: () => import('./features/inventory/product-form/product-form.component').then(m => m.ProductFormComponent)
          },
          {
            path: ':id/batches',
            loadComponent: () => import('./features/inventory/batch-management/batch-management.component').then(m => m.BatchManagementComponent)
          }
        ]
      },
      {
        path: 'suppliers',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/suppliers/supplier-list/supplier-list.component').then(m => m.SupplierListComponent)
          },
          {
            path: ':id/orders',
            loadComponent: () => import('./features/suppliers/purchase-orders/purchase-orders.component').then(m => m.PurchaseOrdersComponent)
          }
        ]
      },
      {
        path: 'customers',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/customers/customer-list/customer-list.component').then(m => m.CustomerListComponent)
          },
          {
            path: ':id/invoices',
            loadComponent: () => import('./features/customers/customer-invoices/customer-invoices.component').then(m => m.CustomerInvoicesComponent)
          }
        ]
      },
      {
        path: 'invoices',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/invoices/invoice-list/invoice-list.component').then(m => m.InvoiceListComponent)
          },
          {
            path: 'new',
            loadComponent: () => import('./features/invoices/invoice-form/invoice-form.component').then(m => m.InvoiceFormComponent)
          },
          {
            path: ':id',
            loadComponent: () => import('./features/invoices/invoice-detail/invoice-detail.component').then(m => m.InvoiceDetailComponent)
          }
        ]
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
