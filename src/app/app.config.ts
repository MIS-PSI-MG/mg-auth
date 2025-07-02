import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'mis-inov-1',
        appId: '1:81912050519:web:69d1274d373d5adc0a0412',
        storageBucket: 'mis-inov-1.firebasestorage.app',
        apiKey: 'AIzaSyCYPWsM0pQ9wDH4PesiEdidEgXqvN3V3bo',
        authDomain: 'mis-inov-1.firebaseapp.com',
        messagingSenderId: '81912050519',
        measurementId: 'G-ZRZN5GZ761',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
};
