// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';
// import { AdminAuthService } from '../services/admin-auth.service';

// export const adminGuard: CanActivateFn = (route, state) => {
//   const authService = inject(AdminAuthService);
//   const router = inject(Router);

//   if (authService.isAuthenticated()) {
//     return true;
//   } else {
//     // Si está en una ruta de admin pero no autenticado, redirige a login de admin
//     if (state.url.startsWith('/admin')) {
//       router.navigate(['/admin/login']);
//     } else {
//       router.navigate(['/']);
//     }
//     return false;
//   }
// };

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminAuthService } from '../services/admin-auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AdminAuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  } else {
    // Si está en una ruta de admin pero no autenticado, redirige a login de admin
    if (state.url.startsWith('/admin')) {
      router.navigate(['/admin/login']);
    } else {
      router.navigate(['/']);
    }
    return false;
  }
};
