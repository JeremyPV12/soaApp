import { Routes } from '@angular/router';
import { LoginComponent } from './auth/page/login/login.component';
import { RegisterComponent } from './auth/page/register/register.component';
import { HomeComponent } from './public/page/home/home.component';
import { EventByIdComponent } from './public/page/event-by-id/event-by-id.component';
import { TicketComponent } from './public/page/ticket/ticket.component';
import { AdminLoginComponent } from './admin/auth/login.component';
import { AdminLayoutComponent } from './admin/layout/admin-layout.component';
import { adminGuard } from './shared/guards/admin.guard';
import { DashboardHomeComponent } from './admin/page/dashboard/dashboard-home.component';
import { EventsComponent } from './admin/page/events/events.component';
import { TicketTypesComponent } from './admin/page/ticketType/ticket-types.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'ticket',
    component: TicketComponent,
  },
  {
    path: 'event/:id',
    component: EventByIdComponent,
  },
  {
    path: 'admin',
    children: [
      {
        path: 'login',
        component: AdminLoginComponent,
      },
      {
        path: '',
        component: AdminLayoutComponent,
        canActivate: [adminGuard],
        children: [
          {
            path: 'dashboard',
            component: DashboardHomeComponent,
          },
          {
            path: 'eventos',
            component: EventsComponent,
          },
          {
            path: 'tipos-ticket',
            component: TicketTypesComponent,
          },
          {
            path: '**',
            redirectTo: 'dashboard',
          },
          {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full',
          },
        ],
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
