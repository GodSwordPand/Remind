import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { Plugins } from '@capacitor/core';
import { Router } from '@angular/router';
const { Storage } = Plugins;

const ACCESS_TOKEN_KEY = 'my-access-token';
const REFRESH_TOKEN_KEY = 'my-refresh-token';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // Initialise à null pour filtrer la première valeur du guard!
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  currentAccessToken = null;
  url = environment.api_url;

  constructor(private http: HttpClient, private router: Router) {
    this.loadToken();
  }

  // Charger accessToken au démarrage
  async loadToken() {
    const token = await Storage.get({ key: ACCESS_TOKEN_KEY });
    if (token && token.value) {
      this.currentAccessToken = token.value;
      console.log(token.value);
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }


  // Créer un nouvel utilisateur
  signUp(credentials: {username, password}): Observable<any> {
    return this.http.post(`${this.url}/users`, credentials);
  }

  // Connectez un utilisateur et stockez le jeton d'accès et d'actualisation
  login(credentials: {mail, password}): Observable<any> {
    return this.http.post(`${this.url}/login_check`, credentials).pipe(
      switchMap((tokens: {token, refresh_token }) => {
        this.currentAccessToken = tokens.token;
        const storeAccess = Storage.set({key: ACCESS_TOKEN_KEY, value: tokens.token});
        const storeRefresh = Storage.set({key: REFRESH_TOKEN_KEY, value: tokens.refresh_token});
        return from(Promise.all([storeAccess, storeRefresh]));
      }),
      tap(_ => {
        this.isAuthenticated.next(true);
      })
    )
  }

  // Effectuez potentiellement une opération de déconnexion dans votre API
  // ou supprimez simplement tous les jetons locaux et accédez à la connexion
  logout() {
    return this.http.post(`${this.url}/auth/logout`, {}).pipe(
      switchMap(_ => {
        this.currentAccessToken = null;
        // Supprimer tous les jetons stockés
        const deleteAccess = Storage.remove({ key: ACCESS_TOKEN_KEY });
        const deleteRefresh = Storage.remove({ key: REFRESH_TOKEN_KEY });
        return from(Promise.all([deleteAccess, deleteRefresh]));
      }),
      tap(_ => {
        this.isAuthenticated.next(false);
        this.router.navigateByUrl('/', { replaceUrl: true });
      })
    ).subscribe();
  }

  // Chargez le jeton d'actualisation à partir du stockage
  // puis attachez-le comme en-tête pour un appel d'API spécifique
  getNewAccessToken() {
    const refreshToken = from(Storage.get({ key: REFRESH_TOKEN_KEY }));
    return refreshToken.pipe(
      switchMap(token => {
        if (token && token.value) {
          const httpOptions = {
            refresh_token: token.value
          }
          return this.http.post(`${this.url}/token_refresh`, httpOptions);
        } else {
          // Aucun jeton d'actualisation stocké
          return of(null);
        }
      })
    );
  }

  // Stocker un nouveau jeton d'accès
  storeAccessToken(accessToken, refreshToken) {
    console.log("Nouveau Token")
    this.currentAccessToken = accessToken;
    Storage.set({ key: REFRESH_TOKEN_KEY, value: refreshToken });
    return from(Storage.set({ key: ACCESS_TOKEN_KEY, value: accessToken }));
  }

  // Renvoie les données en JSON de la demande data
  ask(data){
    return this.http.get(`${this.url}/` + data + ".json");
  }
}
