import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';

import localeEsPe from '@angular/common/locales/es-PE'
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeEsPe);

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    {
      provide : LOCALE_ID, useValue : 'es-PE'
    }
  ]
};
