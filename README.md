# DOMU App : Frontend

https://domu-app-frontend.onrender.com

---

## Description

Frontend Angular de l’application **DOMU**, permettant:

* Connexion / inscription
* Gestion des tâches
* Gestion des dépenses
* Visualisation des dettes
* Interface en temps réel

---

## Technologies

* Angular
* TypeScript
* RxJS
* Socket.io-client
* CSS

---

## Installation locale

```bash
git clone https://github.com/loismichelant/DOMU_App_Frontend.git
cd DOMU_App_Frontend
npm install
ng serve
```

Application disponible sur:

```text
http://localhost:4200
```

---

## Configuration API

Dans les services Angular:

```ts
private api = 'https://domu-app.onrender.com';
```

---

## Build production

```bash
npm run build
```

Le build est généré dans:

```text
dist/DOMU-APP-FE/browser
```

---

## Structure

```text
src/
  app/
    components/
    services/
  styles.css
```

---

## Fonctionnalités

* Interface responsive simple
* Création / modification / suppression de tâches
* Gestion des dépenses partagées
* Calcul des dettes en temps réel
* WebSocket pour mise à jour instantanée
* UX claire avec sidebar + dashboard

---

## Temps réel

Connexion via Socket.io:

* réception des nouvelles tâches
* réception des nouvelles dépenses

---

## Configuration Render

* Build command:
  `npm install; npm run build`

* Publish directory:
  `dist/DOMU-APP-FE/browser`

* Rewrite rule:
  `/* & /index.html`

---

## Auteur

Projet réalisé dans le cadre d’un projet académique.
