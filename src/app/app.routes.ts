import { Routes } from '@angular/router';
import { LoginComponent } from './auth/page/login/login.component';
import { RegisterComponent } from './auth/page/register/register.component';
import { HomeComponent } from './public/page/home/home.component';
import { EventByIdComponent } from './public/page/event-by-id/event-by-id.component';

export const routes: Routes = [
    {
        path: '',
        component : HomeComponent
    },
    {
        path: 'login',
        component : LoginComponent
    },
    {
        path: 'register',
        component : RegisterComponent
    },
    {
        path: 'event/:id',
        component : EventByIdComponent
    },
    {
        path: '**',
        redirectTo : '',
        pathMatch: 'full'
    },
];
