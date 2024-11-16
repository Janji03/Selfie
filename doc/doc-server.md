# Documentazione Backend

## Comandi per Avviare il Frontend
cd server
npm i
npm start

# Overall View

Il backend dell'app è sviluppato usando Express.js.
Lo sviluppo dell'app è stato diviso in sprint con un approccio Scrum.  
Questo file riporta la documentazione di tutti gli sprint svolti.  

## Sprint 1: Autenticazione e Profilo Utente

### Autenticazione

### Profilo Utente
Implementato la gestione del profilo utente.

1. Implementato lo schema MongoDB per salvare le informazioni relative ad un utente.
2. Implementate le rotte per la gestione degli utenti.
3. Implementate le funzioni per gestire le operazioni riguardanti gli utenti.
4. Implementato un sistema di autenticazione per garantire l'accesso autenticato alle rotte.

---
#### File implementati

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