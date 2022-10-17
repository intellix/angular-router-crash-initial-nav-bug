import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Route, Router } from '@angular/router';
import { tap, timer } from 'rxjs';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';
import { HeroesComponent } from './heroes/heroes.component';

@Injectable()
export class RouteService {
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: any, private router: Router) {
    this.isBrowser = isPlatformBrowser(platformId);

    // Listen to router events and store them
    if (this.isBrowser) {
      router.events.subscribe((routerEvent) => {
        (window as any).appEvents = [
          ...((window as any).appEvents || []),
          routerEvent,
        ];
      });
    }
  }

  setup() {
    if (this.isBrowser) {
      (window as any).appEvents = [
        ...((window as any).appEvents || []),
        'setup()',
      ];
    }

    // Simulate going to CMS to get routes
    return timer(100).pipe(
      tap(() => {
        const routes: Route[] = [
          { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
          { path: 'dashboard', component: DashboardComponent },
          { path: 'detail/:id', component: HeroDetailComponent },
          { path: 'heroes', component: HeroesComponent },
        ];

        this.router.config.push(...routes);

        if (this.isBrowser) {
          (window as any).appEvents = [
            ...((window as any).appEvents || []),
            `add ${routes.length} routes`,
          ];
        }

        this.router.initialNavigation();
      })
    );
  }
}
