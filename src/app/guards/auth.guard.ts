import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  constructor(private apiService: ApiService, private router: Router) { }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean>
  {
    return this.apiService.isAuthenticated.pipe(
      filter(val => val !== null), // Filtrer la valeur de sujet initiale du comportement
      take(1), // Sinon, l'Observable ne se termine pas!
      map(isAuthenticated => {
        if (isAuthenticated) {
          return true;
        } else {
          this.router.navigateByUrl('/login');
          return false;
        }
      })
    );
  }
}
