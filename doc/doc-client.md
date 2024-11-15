# Documentazione Frontend

## Comandi per Avviare il Frontend
cd client
npm i
npm start

# Overall View

Il frontend dell'app è sviluppato in React.
Lo sviluppo dell'app è stato diviso in sprint con un approccio Scrum.  
Questo file riporta la documentazione di tutti gli sprint svolti.  

## Sprint 1: Autenticazione e Profilo Utente

### Autenticazione
Implementato un sistema di autenticazione utente. Il sistema permette agli utenti di:

1. Registrarsi con un nome, email e password.
2. Accedere con il proprio nome e password.
3. Visualizzare le funzionalità protette dopo l'autenticazione.

Questo sistema utilizza il components **AuthContext** per gestire lo stato dell'utente autenticato e protegge le rotte tramite un componente `ProtectedRoute`.

### Profilo Utente
Implementato una interfaccia che permette all'utente di:

1. Visualizzare le informazioni personali del proprio profilo.
2. Modificare le informazioni personali del proprio profilo.
3. Cancellare il proprio profilo dal database dell'applicazione.
4. Effettuare il logout dall'applicazione.

---
#### File implementati

- **`src/context/AuthContext.js`**
  - Gestisce lo stato dell'autenticazione dell'utente.
  - Utilizza `localStorage` per memorizzare il token JWT dell'utente.
  - Fornisce metodi per effettuare il login e il logout.

- **`src/components/loginsignup/Login.js`**
  - Componente per il modulo di login.
  - Effettua richieste al backend per verificare le credenziali e ottiene un token JWT.

- **`src/components/loginsignup/Signup.js`**
  - Componente per la registrazione di nuovi utenti.
  - Invia i dati dell'utente (nome, email e password) al backend per creare un nuovo account.

- **`src/components/loginsignup/ProtectedRoute.js`**
  - Wrappa i componenti protetti.
  - Verifica se l'utente è autenticato tramite il contesto `AuthContext`. In caso contrario, reindirizza al login.

- **`src/components/profile/Profile.js`**
  - Componente per mostrare le informazioni personali dell'utente.
  - Permette all'utente di modificare le informazioni.
  - Permette all'utente di eseguire il logout.
  - Permette all'utente di cancellare il proprio account.

- **`src/services/authService.js`**
    - `signup`: registra un nuovo utente.
    - `login`: autentica un utente e restituisce un token JWT.

- **`src/services/userService.js`**
    - `getUser`: ritorna le informazioni personali di un utente.
    - `updateUser`: aggiorna le informazioni personali di un utente.
    - `updateUserPfp`: aggiorna l'immagine profilo di un utente.
    - `deleteUser`: cancella l'account di un utente.

- **`src/App.js`**
  - Configura le rotte utilizzando `react-router-dom`.
  - Wrappa l'intera applicazione con `AuthProvider` per fornire il contesto dell'autenticazione.

---

