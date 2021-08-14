# Remind

Idée d'un projet d'application mobile.  

Objectif : Permettre à des utilisateurs de créer des profiles (pouvant être partage par plusieurs utilisateur) et d'enregistrer des audios sur ces differents profiles.


## Prérequis

```
node.js >= 13.11.0
ionic >= 6.12.2
```

Avoir le serveur de l'api [Remind-api](https://gitlab.sio.lyceefulbert.fr/vieira/remind-api) demarré.

## Installation

#### Importer

En premier lieu, importez le projet :

``` bash
git clone https://gitlab.sio.lyceefulbert.fr/vieira/remind.git
cd remind
```

#### Configuration de la l'API [Remind-api](https://gitlab.sio.lyceefulbert.fr/vieira/remind-api)

Adaptez le fichier __environment.ts__ en fonction de l'adresse utilisée par votre API.
```
# src\environments\environment.ts
api_url: 'http://127.0.0.1:8000/api'
```

## Démarrage

Tout est prêt pour lancer l'émulation de l'application sur le navigateur.
```bash
ionic serve
```
#### Alternative

Si vous souhaitez visualiser l'application sur différentes plateformes demarrez l'émulation avec:
```bash
ionic serve -l
```

## Test

Apres avoir démarré ionic une page web devrait s'ouvrir sur votre navigateur, autrement ouvrez une page web à http://localhost:8100/,
si vous utilisé Ionic Lab à http://localhost:8200/.  
La page de connexion devrait s'afficher, si vous avez ajouté les données fictives fournit avec [Remind-api](https://gitlab.sio.lyceefulbert.fr/vieira/remind-api) vous pouvez utilisée les identifiants fournit.
```
Email : azerty@test.fr
Mot de passe : azerty1234
```
