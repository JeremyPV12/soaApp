import { Routes } from '@angular/router';
import { LoginComponent } from './auth/page/login/login.component';
import { RegisterComponent } from './auth/page/register/register.component';
import { HomeComponent } from './public/page/home/home.component';

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
        path: '**',
        redirectTo : '',
        pathMatch: 'full'
    },
];
