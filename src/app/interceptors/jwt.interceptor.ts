import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { ApiService } from '../services/api.service';
import { catchError, finalize, switchMap, filter, take, } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  // Utilisé pour les appels d'API en file d'attente lors de l'actualisation des jetons
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  isRefreshingToken = false;

  constructor(private apiService: ApiService, private toastCtrl: ToastController) { }

  // Intercepter chaque appel HTTP
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
  {
    // Vérifiez si nous avons besoin d'une logique de jeton supplémentaire ou non
    if (this.isInBlockedList(request.url)) {
      return next.handle(request);
    }
    else {
      return next.handle(this.addToken(request)).pipe(
        catchError(err => {
          if (err instanceof HttpErrorResponse) {
            switch (err.status) {
              case 400:
                return this.handle400Error(err);
              case 401:
                return this.handle401Error(request, next);
              default:
                return throwError(err);
            }
          } else {
            return throwError(err);
          }
        })
      );
    }
  }

  // Filtrez les URL auxquelles vous ne souhaitez pas ajouter le jeton!
  private isInBlockedList(url: string): Boolean {
    // Exemple: filtrer notre appel d'API de connexion et de déconnexion
    if (url == `${environment.api_url}/roles` //||
      //url == `${environment.api_url}/auth/logout`
    ) {
      return true;
    } else {
      return false;
    }
  }

  // Ajoutez notre jeton d'accès actuel du service s'il est présent
  private addToken(req: HttpRequest<any>) {
    if (this.apiService.currentAccessToken) {
      return req.clone({
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.apiService.currentAccessToken}`
        })
      });
    } else {
      return req;
    }
  }

  // Nous ne sommes pas seulement autorisés, nous n'avons pas pu actualiser le jeton
  // ou autre chose le long de la mise en cache a mal tourné!
  private async handle400Error(err) {
    // Vérifiez potentiellement la raison exacte de l'erreur pour le 400
    // puis déconnectez l'utilisateur automatiquement
    const toast = await this.toastCtrl.create({
      message: 'Logged out due to authentication mismatch',
      duration: 2000
    });
    toast.present();
    this.apiService.logout();
    return of(null);
  }

  // Indique que notre jeton d'accès n'est pas valide, essayez d'en charger un nouveau
  private handle401Error(request: HttpRequest < any >, next: HttpHandler): Observable < any > {
    // Vérifiez si un autre appel utilise déjà la logique d'actualisation
    if(!this.isRefreshingToken) {

      // Défini sur null pour que les autres requêtes attendent
      // jusqu'à ce que nous ayons un nouveau jeton!
      this.tokenSubject.next(null);
      this.isRefreshingToken = true;
      this.apiService.currentAccessToken = null;

      // Tout d'abord, obtenez un nouveau jeton d'accès
      return this.apiService.getNewAccessToken().pipe(
        switchMap((token: any) => {
          if (token) {
            // Stocker le nouveau jeton
            const accessToken = token.token;
            const refreshToken = token.refresh_token;
            return this.apiService.storeAccessToken(accessToken, refreshToken).pipe(
              switchMap(_ => {
                // Utilisez le sujet pour que les autres appels puissent continuer avec le nouveau jeton
                this.tokenSubject.next(accessToken);

                // Exécutez à nouveau la demande initiale avec le nouveau jeton
                return next.handle(this.addToken(request));
              })
            );
          } else {
            // Aucun nouveau jeton ou autre problème n'est survenu
            return of(null);
          }
        }),
        finalize(() => {
          // Débloquez la logique de rechargement des jetons lorsque tout est terminé
          this.isRefreshingToken = false;
        })
      );
    } else {
      // "Mettre en file d'attente" les autres appels pendant que nous chargeons un nouveau jeton
      return this.tokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => {
          // Exécutez à nouveau la demande maintenant que nous avons un nouveau jeton!
          return next.handle(this.addToken(request));
        })
      );
    }
  }
}
