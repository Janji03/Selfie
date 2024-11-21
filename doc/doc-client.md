# Documentazione Frontend

per Vitto e Lollo il pattern della documentazione è: 

## Sprint N:

## Descrizione

## Funzionalità Implementate

## File Implementati

(lasciare una sola riga di spazio sempre)

## Comandi per Avviare il Frontend

cd client
npm i
npm start

# Overall View

Il frontend dell'app è sviluppato in React.
Lo sviluppo dell'app è stato diviso in sprint con un approccio Scrum.  
Questo file riporta la documentazione di tutti gli sprint svolti.  

## Sprint 0: Setup 

## Descrizione 

in questo sprint è stato fatto il setup delle cartelle server (backend) e client (frontend), installate le prime dependencies come Cors, 
settato il proxy, organizzata la struttura delle cartelle, fatto il setup dei primi file, testato React e Express e testata l'integrazione
tra frontend e backend e aggiunto il collegamento con mongodb. sono state definite anche le Epiche su Taiga

## Funzionalità Implementate

nessuna

## File Implementati

niente di rilevante 

## Sprint 1: Autenticazione e Profilo Utente

## Descrizione 

in questo sprint è stato implementato un sistema di login e signup per permettere all'utente di registrarsi 
e una sezione profilo utente che include... (da completare LOLLO)

## Funzionalità Implementate 

Implementato un sistema di autenticazione utente. Il sistema permette agli utenti di:

1. Registrarsi con un nome, email e password.
2. Accedere con il proprio nome e password.
3. Visualizzare le funzionalità protette dopo l'autenticazione.

Questo sistema utilizza il components **AuthContext** per gestire lo stato dell'utente autenticato e protegge le rotte tramite un componente `ProtectedRoute`.
Implementato una interfaccia che permette all'utente di:
1. Visualizzare le informazioni personali del proprio profilo.
2. Modificare le informazioni personali del proprio profilo.
3. Cancellare il proprio profilo dal database dell'applicazione.
4. Effettuare il logout dall'applicazione.

## File implementati

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

- **`src/components/profile/EditProfileForm.js`**
  - Componente per modificare le informazioni personali dell'utente

- **`src/services/authService.js`**
    - `signup`: registra un nuovo utente.
    - `login`: autentica un utente e restituisce un token JWT.

- **`src/services/userService.js`**
    - `getUser`: ritorna le informazioni personali di un utente.
    - `updateUser`: aggiorna le informazioni personali di un utente.
    - `updateUserProfilePicture`: aggiorna l'immagine profilo di un utente.
    - `deleteUser`: cancella l'account di un utente.

- **`src/App.js`**
  - Configura le rotte utilizzando `react-router-dom`.
  - Wrappa l'intera applicazione con `AuthProvider` per fornire il contesto dell'autenticazione.

## Sprint 2 : Recupero e Cambio Password

## Descrizione

in questo sprint è stato completato il sistema di protezione delle rotte ed è stato implementato 
un sistema di cambio password.

## Funzionalità Implementate

1. Sistema di Recupero della Password (Forgot Password)
È stato implementato un modulo che consente all'utente di inviare una richiesta per il recupero della password tramite email.
Quando un utente dimentica la propria password, può inserire il proprio indirizzo email e ricevere un'email con le istruzioni per resettare la password.

2. Sistema di Reset della Password
Una volta che l'utente ha ricevuto l'email con il link di reset, può inserire una nuova password nella pagina di reset, utilizzando un token di validazione. 
Il token è unico e valido solo per un periodo limitato di tempo.

3. Miglioramento della Protezione delle Rotte
Le rotte protette sono state implementate in modo da rendere l'accesso solo agli utenti autenticati.
Utilizzando il AuthContext, viene verificata la validità del token e se l'utente non è autenticato, viene reindirizzato alla pagina di login.
In aggiunta allo Sprint 1 è stato fixato il reindirizzamento in caso di reload della pagina 

## File Implementati

- **`src/components/loginsignup/ForgotPassword.js`**
Componente per il modulo di recupero della password. L'utente inserisce la propria email per ricevere un'email di recupero.
Funzionalità:
Gestisce l'input dell'email.
Invia la richiesta di recupero password al backend tramite la funzione forgotPassword.
Mostra un messaggio di successo o errore a seconda della risposta del backend.

- **`src/components/loginsignup/ResetPassword.js`**
Componente per il reset della password. L'utente inserisce il nuovo valore per la password utilizzando il token ricevuto tramite email.
Funzionalità:
Gestisce l'input della nuova password.
Invia la richiesta di reset della password al backend tramite la funzione resetPassword.
Dopo il reset della password, viene mostrato un messaggio di conferma e l'utente viene reindirizzato alla pagina di login.

- **`src/services/authService.js`**
Servizio per gestire le richieste di autenticazione, recupero e reset della password.
Funzionalità:
forgotPassword: Invia la richiesta di recupero della password al backend.
resetPassword: Gestisce la richiesta di reset della password utilizzando un token di reset.

- **`src/context/AuthContext.js`**
Gestisce lo stato dell'autenticazione dell'utente. Questo contesto fornisce metodi per login, logout e verifica dell'autenticazione tramite token JWT.
Funzionalità:
Fornisce l'autenticazione dell'utente utilizzando localStorage per memorizzare il token JWT.
Implementa il logout e l'aggiornamento dello stato dell'autenticazione.

- **`src/components/loginsignup/ProtectedRoute.js`**
Protegge le rotte dell'applicazione, consentendo l'accesso solo agli utenti autenticati.
Funzionalità:
Se l'utente non è autenticato, viene reindirizzato alla pagina di login.
Se l'utente è autenticato, viene consentito l'accesso al contenuto della rotta protetta.

- **`src/App.js`**
aggiunte le rotte di forgot e reset password

## Sprint 3: Note 

## Descrizione
In questo sprint è stato sviluppato il modulo Note, che permette agli utenti autenticati di:
Creare, Visualizzare, Ordinare ,Modificare, duplicare o eliminare una nota.
Visualizzare i dettagli di una nota selezionata.

## Funzionalità Implementate

Creazione delle note:
Gli utenti possono creare nuove note specificando un titolo, contenuto e categorie.
Viene mostrato un messaggio di errore se il titolo, contenuto o le categorie non vengono forniti.

Visualizzazione e gestione delle note:
Elenco di tutte le note dell'utente. Dettaglio di una nota, con possibilità di modifica e salvataggio.

Duplicazione di una nota esistente.

Eliminazione di una nota selezionata.

Ordinamento:
Ordinamento alfabetico per titolo.
Ordinamento per data di creazione.
Ordinamento in base alla lunghezza del contenuto.
Ordinamento alfabetico in base alla categoria.

## File Implementati

- **`src/components/notes/Notes.js`**
Componente principale per la gestione delle note.
Include:
Il form per creare nuove note.
La visualizzazione del dettaglio delle note.
Il modulo di ordinamento.
L'elenco delle note.

- **`src/components/notes/NotesDetail.js`**
Gestisce la visualizzazione e modifica dei dettagli di una singola nota.

- **`src/components/notes/NotesView.js`**
Mostra l'elenco delle note disponibili, con opzioni per aprire, duplicare ed eliminare ogni nota.

- **`src/components/notes/SortNotes.js`**
Fornisce i controlli per ordinare le note in base a diversi criteri.

- **`src/services/noteService.js`**
Contiene le funzioni per interagire con il backend:
getNotes: Ottiene tutte le note associate a un utente.
createNote: Crea una nuova nota.
updateNote: Aggiorna una nota esistente.
deleteNote: Elimina una nota.
duplicateNote: Duplica una nota.