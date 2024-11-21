# Documentazione Backend

per Vitto e Lollo il pattern della documentazione è: 

## Sprint N:

## Descrizione

## Funzionalità Implementate

## File Implementati

(lasciare una sola riga di spazio sempre)

## Comandi per Avviare il Backend

cd server
npm i
npm start

# Overall View

Il backend dell'app è sviluppato usando Express.js.
Lo sviluppo dell'app è stato diviso in sprint con un approccio Scrum.  
Questo file riporta la documentazione di tutti gli sprint svolti.  

## Sprint 1: Autenticazione e Profilo Utente

## Descizione 

## Funzionalità Implementate

Implementato la gestione del profilo utente.
1. Implementato lo schema MongoDB per salvare le informazioni relative ad un utente.
2. Implementate le rotte per la gestione degli utenti.
3. Implementate le funzioni per gestire le operazioni riguardanti gli utenti.
4. Implementato un sistema di autenticazione per garantire l'accesso autenticato alle rotte.

## File implementati

- **`controllers/authController.js`**
    Contiene le funzioni per gestire le operazioni relative all'autenticazione degli utenti.
    1. `signup`: effettua la registrazione di un nuovo utente nel database.
    2. `login`: effettua il login di un utente già precedentemente registrato nel database.

- **`controllers/userController.js`**
    Contiene le funzioni per gestire le operazioni relative alle informazioni degli utenti.
    1. `getUser`: ottiene dal database i dati di un utente tramite il suo ID.
    2. `updateUser`: aggiorna le informazioni dell'utente sul database tramite il suo ID.
    3. `updateUserProfilePicture`: aggiorna la foto del profilo dell'utente sul database tramite il suo ID.
    4. `deleteUser`: cancella un utente dal database tramite il suo ID.

- **`models/User.js`**
    Definisce lo schema MongoDB per il modello User, che rappresenta un utente nel database.

- **`routes/userRoutes.js`**
    Definisce le rotte per la gestione degli utenti.

- **`utils/uploadUtils.js`**
    Contiene le utility per la gestione dell'upload dell'immagine del profilo dell'utente.

- **`config/config.js`**
    Contiene la la chiave segreta per la firma dei token JWT, le credenziali di accesso al database e il numero di porta.

- **`config/db.js`**
    Contiene la logica per connettere l'applicazione al database MongoDB.

- **`index.js`**
    Punto di ingresso dell'applicazione:
    1. Viene avviato il server Express.
    2. Vengono configurate i middleware e le rotte.
    3. Viene gestita la connessione al database.

## Sprint 2 : Recupero e Reset Password

## Descrizione

In questo sprint è stato implementato il sistema di recupero e reset della password per gli utenti.
L'utente può richiedere il recupero della password tramite email, che invia un link per il reset della password.
Inoltre, è stato implementato un token di reset che ha una durata limitata.

## Funzionalità implementate

Recupero Password:
È stato creato un sistema per richiedere il reset della password. Gli utenti possono inviare una richiesta di reset password inserendo la loro email.
Se l'utente esiste, viene generato un token di reset temporaneo e un'email contenente il link di reset viene inviata all'utente.

Reset Password:
Gli utenti possono accedere al link di reset, che contiene un token univoco per la sicurezza. Una volta che l'utente clicca sul link, viene indirizzato alla pagina per inserire una nuova password.
Il token di reset ha una durata limitata, dopo la quale scade.
Il sistema aggiorna la password dell'utente nel database e cancella il token di reset.

Validazione e Sicurezza:
Il token di reset è crittografato per prevenire usi non autorizzati.
È stato implementato un sistema che verifica che il token non sia scaduto prima di permettere il reset della password.

Librerie:
jsonwebtoken (JWT):
è utilizzata per la generazione e la verifica di token JWT (JSON Web Tokens), che vengono usati per gestire l'autenticazione degli utenti.
Il token JWT viene creato sia durante la registrazione dell'utente (signup) che durante il login (login). 
Il token contiene un ID utente (userId) e viene firmato utilizzando una chiave segreta configurata nel file config.js.

crypto:
libreria built-in di Node.js utilizzata per la generazione di criptografie, come la creazione di hash e la generazione di token casuali.
Viene utilizzata per creare un token di reset della password unico, che viene poi criptato e memorizzato nel database per garantire la sicurezza.
Inoltre, viene utilizzata per verificare l'integrità del token di reset durante la fase di reset della password.

nodemailer:
utilizzata per inviare email in Node.js. Viene configurata per inviare un'email all'utente contenente il link di reset della password.
Dopo aver generato il token di reset della password, un'email contenente il link di reset viene inviata all'utente tramite un server SMTP (in questo caso, Mailtrap).

## File implementati

- **`models/User.js`**
campi aggiuntivi per il token di reset della password e la data di scadenza del token (resetPasswordToken e resetPasswordExpires).

- **`controllers/authController.js`**
forgotPassword: Funzione che gestisce la richiesta di recupero della password. Viene generato un token univoco, salvato nel database e inviata un'email all'utente con il link di reset.
resetPassword: Funzione che gestisce il reset della password. Verifica la validità del token di reset e aggiorna la password nel database.

- **`routes/authRoutes.js`**
Aggiunta di nuove rotte per la gestione delle richieste di recupero e reset della password:
POST /forgot-password: Per inviare la richiesta di recupero.
POST /reset-password/:token: Per resettare la password.

- **`config/config.js`**
Configurazione delle credenziali per il servizio di invio email (Mailtrap).

## Sprint 3: Note

## Descrizione

In questo sprint è stato implementato il modulo per la gestione delle note degli utenti.
Le note possono essere create, lette, aggiornate, eliminate e duplicate.
Ogni nota è associata a un utente specifico tramite il suo ID.

## Funzionalità Implementate

Creazione di Note:
Gli utenti possono creare una nuova nota fornendo un titolo, contenuto e categorie associate.

Recupero delle Note
Possibilità di ottenere tutte le note di un utente specifico tramite il suo ID

Aggiornamento delle Note
Gli utenti possono modificare il titolo, contenuto e categorie di una nota esistente.

Eliminazione delle Note
Gli utenti possono eliminare una nota specifica.

Duplicazione delle Note
Gli utenti possono creare una copia di una nota esistente. La nuova nota avrà il prefisso "Copia di" nel titolo.

## File Implementati

- **`models/Note.js`**
Definisce lo schema MongoDB per il modello Note, che rappresenta una nota nel database:
title: Titolo della nota (obbligatorio).
content: Contenuto della nota (obbligatorio).
categories: Categorie associate alla nota (array di stringhe).
userID: Riferimento all'ID dell'utente (obbligatorio).
createdAt: Data di creazione della nota.

- **`controllers/notesController.js`**
Contiene le funzioni per la gestione delle operazioni CRUD relative alle note:
createNote: Crea una nuova nota nel database.
getNotes: Recupera tutte le note associate a un utente.
updateNote: Aggiorna il titolo, contenuto e categorie di una nota esistente.
deleteNote: Cancella una nota specifica dal database.
duplicateNote: Duplica una nota esistente creando una copia.

- **`routes/noteRoutes.js`**
Definisce le rotte per la gestione delle note:
POST /: Crea una nuova nota.
GET /: Recupera tutte le note di un utente.
PUT /:id: Aggiorna una nota esistente.
DELETE /:id: Elimina una nota specifica.
POST /:id/duplicate: Duplica una nota esistente.