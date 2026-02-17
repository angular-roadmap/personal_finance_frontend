import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { jwtInterceptor } from './interceptors/jwt.interceptor';

import { Chart, registerables } from 'chart.js';

// This registers everything (Pie, Bar, Scale, Legend, etc.) 
// so you don't have to import them one by one.
Chart.register(...registerables);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), provideClientHydration(withEventReplay()),
    provideHttpClient(
      withInterceptors([jwtInterceptor]) // The new way to do interceptors!
    )
  ]
};
