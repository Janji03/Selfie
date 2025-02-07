### Server

Il server è sviluppato con Node.js ed Express.

#### Index.js
Il punto di ingresso dell'applicazione backend.

#### Config
Contiene le variabili d'ambiente e il setup di agenda.js.

#### Controllers
Contiene la logica di gestione delle richieste per le varie rotte dell'applicazione.

- **authController.js**

- **eventController.js**

- **messageController.js**

- **notesController.js**

- **pomodoroController.js**

- **taskController.js**

- **timeMachineController.js**

- **userController.js**

#### Jobs
Contiene i job che vengono schedulati da agenda.js.

- **eventNotificationJob.js**

- **inviteNotificationJob.js**

- **overdueNotificationJob.js**

- **taskNotificationJob.js**

#### Models
Contiene lo schema dei modelli MongoDB.

- **Event.js**

- **Message.js**

- **Note.js**

- **Pomodoro.js**

- **Task.js**

- **TimeMachine.js**

- **User.js**

#### Routes
Definisce le API endpoint dell'applicazione.

- **authRoutes.js**

- **eventRoutes.js**

- **messageRoutes.js**

- **notesRoutes.js**

- **pomodoroRoutes.js**

- **taskRoutes.js**

- **timeMachineRoutes.js**

- **userRoutes.js**

#### Scheduler
Contiene gli scheduler che si occupano di lanciare i job.

- **eventNotificationScheduler.js**

- **overdueTaskScheduler.js**

- **taskNotificationScheduler.js**

#### Uploads
Cartella dedicata al salvataggio delle foto profilo degli utenti.

#### Utils
Contiene funzioni riutilizzabili.

- **generateEmail.js**

- **getRecurrenceSummary.js**

- **removeTemporaryTasks.js**

- **sendEmailNotification.js**

- **timeMachineNotification.js**

- **uploadUtils**

## File: `userModel.js`

Questo file definisce il modello di `User` che viene utilizzato per interagire con il database. Contiene la logica di crittografia della password e la validazione delle credenziali.

### Schema dell'Utente

- **name** (stringa): Il nome dell'utente (obbligatorio).
- **email** (stringa): L'email dell'utente (univoca e obbligatoria). Deve corrispondere a un pattern di email valido.
- **password** (stringa): La password dell'utente (obbligatoria).
- **profilePicture** (stringa): Il percorso dell'immagine del profilo (predefinito: "uploads/default.jpg").
- **bio** (stringa): La biografia dell'utente (predefinita: vuota).
- **birthday** (data): La data di nascita dell'utente (predefinita: `null`).
- **sex** (stringa): Il sesso dell'utente. Può essere uno tra: "male", "female", "prefer not to say" (predefinito: "prefer not to say").
- **resetPasswordToken** (stringa): Il token per il reset della password (opzionale).
- **resetPasswordExpires** (data): La data di scadenza del token per il reset della password (opzionale).

### Metodi

#### 1. **pre("save")**

- **Descrizione**: Questo metodo viene eseguito prima del salvataggio di un nuovo utente o quando viene modificata la password. Crittografa la password usando `bcrypt`.
- **Funzione**: Se la password è modificata, viene crittografata utilizzando un "salt" di 10 round.

#### 2. **matchPassword(password)**

- **Descrizione**: Confronta la password inserita con quella memorizzata nel database.
- **Input**: `password` (stringa): la password inserita dall'utente.
- **Output**: Restituisce `true` se la password corrisponde, altrimenti `false`.

---

## File: `userController.js`

Questo file contiene le funzioni di controllo per la gestione degli utenti, come il recupero, l'aggiornamento, la cancellazione e la gestione della foto profilo.

### Funzioni

#### 1. **getUser(req, res)**

- **Descrizione**: Recupera i dettagli di un utente specificato dall'ID.
- **Input**:
  - `id` (ObjectId): ID dell'utente da recuperare.
- **Output**:
  - Restituisce i dettagli dell'utente, escluso il campo `password`.
  - Restituisce un errore se l'utente non viene trovato.
- **Flusso**:
  1. Trova l'utente nel database usando l'ID.
  2. Restituisce i dettagli dell'utente se trovato.

#### 2. **updateUser(req, res)**

- **Descrizione**: Aggiorna le informazioni di un utente specificato dall'ID.
- **Input**:
  - `id` (ObjectId): ID dell'utente da aggiornare.
  - Dati opzionali nel corpo della richiesta:
    - `name` (stringa): Nuovo nome dell'utente.
    - `email` (stringa): Nuovo indirizzo email dell'utente.
    - `bio` (stringa): Nuova bio dell'utente.
    - `birthday` (data): Nuova data di nascita dell'utente.
    - `sex` (stringa): Nuovo sesso dell'utente.
- **Output**:
  - Restituisce le informazioni aggiornate dell'utente.
  - Restituisce un errore se l'utente non viene trovato.
- **Flusso**:
  1. Trova l'utente nel database.
  2. Aggiorna i campi dell'utente.
  3. Restituisce i dati aggiornati.

#### 3. **updateUserProfilePicture(req, res)**

- **Descrizione**: Aggiorna la foto del profilo di un utente specificato dall'ID.
- **Input**:
  - `id` (ObjectId): ID dell'utente da aggiornare.
  - `file` (file): Nuova immagine del profilo.
- **Output**:
  - Restituisce un messaggio di successo e il percorso dell'immagine aggiornata.
  - Restituisce un errore se l'utente non viene trovato o se c'è un problema nel caricamento del file.
- **Flusso**:
  1. Trova l'utente nel database.
  2. Carica e salva il percorso del file nel campo `profilePicture`.
  3. Restituisce il percorso dell'immagine aggiornata.

#### 4. **deleteUser(req, res)**

- **Descrizione**: Elimina un utente specificato dall'ID.
- **Input**:
  - `id` (ObjectId): ID dell'utente da eliminare.
- **Output**:
  - Restituisce un messaggio di successo se l'utente è stato eliminato.
  - Restituisce un errore se l'utente non viene trovato.
- **Flusso**:
  1. Trova l'utente nel database.
  2. Elimina l'utente dal database.
  3. Restituisce un messaggio di successo.

#### 5. **getAllUserIdsAndNames(req, res)**

- **Descrizione**: Recupera una lista di tutti gli utenti con ID e nome.
- **Output**:
  - Restituisce un array con gli ID e i nomi di tutti gli utenti.
  - Restituisce un errore se non ci sono utenti nel sistema.
- **Flusso**:
  1. Recupera tutti gli utenti con ID e nome dal database.
  2. Restituisce la lista di utenti.

#### 6. **getAllUsersBasicInfo(req, res)**

- **Descrizione**: Recupera una lista di tutti gli utenti con ID, nome ed email.
- **Output**:
  - Restituisce un array con gli ID, i nomi e le email di tutti gli utenti.
  - Restituisce un errore se non ci sono utenti nel sistema.
- **Flusso**:
  1. Recupera tutti gli utenti con ID, nome e email dal database.
  2. Restituisce la lista di utenti.

---

## File: `userRoutes.js`

Questo file contiene le rotte per gestire le operazioni sugli utenti. Ogni rotta è associata a una funzione di controllo definita in `userController.js`.

### Rotte

#### 1. **GET `/users`**

- **Funzione**: Recupera tutti gli utenti con ID e nome.
- **Controllore**: `getAllUserIdsAndNames`.

#### 2. **GET `/users/:id`**

- **Funzione**: Recupera i dettagli di un utente specificato dall'ID.
- **Controllore**: `getUser`.

#### 3. **PUT `/users/:id`**

- **Funzione**: Aggiorna le informazioni di un utente specificato dall'ID.
- **Controllore**: `updateUser`.

#### 4. **PUT `/users/:id/pfp`**

- **Funzione**: Aggiorna la foto del profilo di un utente specificato dall'ID.
- **Controllore**: `updateUserProfilePicture`.

#### 5. **DELETE `/users/:id`**

- **Funzione**: Elimina un utente specificato dall'ID.
- **Controllore**: `deleteUser`.

---

## File: `authController.js`

Questo file contiene le funzioni di autenticazione, incluse quelle per la registrazione, il login, la richiesta di reset della password e il reset effettivo della password.

### Funzioni

#### 1. **registrazione(req, res)**

- **Descrizione**: Gestisce la registrazione di un nuovo utente.
- **Input**: 
  - `nome` (stringa): nome dell'utente.
  - `email` (stringa): email dell'utente.
  - `password` (stringa): password dell'utente.
- **Output**: 
  - Restituisce un token JWT se l'utente viene registrato correttamente.
  - Restituisce un messaggio di errore se l'utente esiste già.
- **Flusso**:
  1. Verifica se l'utente esiste già nel database.
  2. Crea un nuovo utente e una `TimeMachine` associata.
  3. Genera un token JWT per l'autenticazione.
  4. Risponde con il token e l'ID dell'utente.

#### 2. **login(req, res)**

- **Descrizione**: Gestisce il login dell'utente.
- **Input**:
  - `email` (stringa): email dell'utente.
  - `password` (stringa): password dell'utente.
- **Output**:
  - Restituisce un token JWT se le credenziali sono corrette.
  - Restituisce un messaggio di errore se le credenziali sono errate.
- **Flusso**:
  1. Verifica se l'utente esiste.
  2. Confronta la password inviata con quella memorizzata.
  3. Restituisce un token JWT se la password è corretta.
  4. Resetta il tempo nella `TimeMachine` dell'utente.

#### 3. **richiestaResetPassword(req, res)**

- **Descrizione**: Gestisce la richiesta di reset della password.
- **Input**:
  - `email` (stringa): email dell'utente che ha richiesto il reset.
- **Output**:
  - Invia un'email con il link per il reset della password.
  - Restituisce un messaggio di errore se l'utente non è trovato.
- **Flusso**:
  1. Verifica se l'utente esiste nel database.
  2. Crea un token per il reset e lo associa all'utente.
  3. Invia un'email con il link per il reset.

#### 4. **resetPassword(req, res)**

- **Descrizione**: Gestisce il reset della password.
- **Input**:
  - `token` (stringa): il token per il reset della password.
  - `password` (stringa): la nuova password.
- **Output**:
  - Restituisce un messaggio di successo se la password è aggiornata correttamente.
  - Restituisce un messaggio di errore se il token non è valido o è scaduto.
- **Flusso**:
  1. Confronta il token con quello memorizzato.
  2. Verifica se il token è ancora valido.
  3. Aggiorna la password dell'utente.

---


## File: `authRoutes.js`

Questo file contiene le rotte per la gestione delle operazioni di autenticazione, come la registrazione, il login e la gestione del reset della password.

### Rotte

#### 1. **POST `/signup`**

- **Funzione**: Registra un nuovo utente.
- **Controllore**: `registrazione`.

#### 2. **POST `/login`**

- **Funzione**: Esegue il login dell'utente.
- **Controllore**: `login`.

#### 3. **POST `/forgot-password`**

- **Funzione**: Invia un'email per il reset della password.
- **Controllore**: `richiestaResetPassword`.

#### 4. **POST `/reset-password/:token`**

- **Funzione**: Esegue il reset della password utilizzando il token.
- **Controllore**: `resetPassword`.

---

## File: `messageModel.js`

Questo file definisce il modello di `Message` che rappresenta un messaggio nel sistema. Utilizza Mongoose per interagire con il database MongoDB.

### Schema del Messaggio

- **content** (stringa): Il contenuto del messaggio (obbligatorio).
- **sender** (ObjectId): Riferimento all'utente che invia il messaggio. È un campo obbligatorio.
- **recipients** (array di ObjectId): Lista di utenti destinatari del messaggio (obbligatorio). Ogni destinatario è un riferimento a un oggetto `User`.
- **completed** (booleano): Indica se il messaggio è stato completato. Default: `false`.
- **timestamps** (oggetti): Questo campo è automaticamente gestito da Mongoose e include `createdAt` e `updatedAt`.

---

## File: `messageController.js`

Questo file contiene le funzioni di controllo per la gestione dei messaggi, come l'invio, la lettura, la cancellazione e la marcatura dei messaggi come completati.

### Funzioni

#### 1. **getMessages(req, res)**

- **Descrizione**: Recupera i messaggi associati a un utente specifico.
- **Input**:
  - `userID` (stringa): ID dell'utente di cui recuperare i messaggi.
- **Output**:
  - Restituisce una lista di messaggi con informazioni sul mittente (nome, email).
  - Restituisce un errore se non riesce a recuperare i messaggi.
- **Flusso**:
  1. Recupera i messaggi dalla collezione `Message` che sono destinati all'utente con `userID`.
  2. Popola i dati del mittente utilizzando il riferimento al modello `User`.
  3. Restituisce i messaggi.

#### 2. **sendMessage(req, res)**

- **Descrizione**: Invia un messaggio a uno o più destinatari.
- **Input**:
  - `sender` (ObjectId): ID dell'utente mittente.
  - `recipients` (array di ObjectId): Lista di destinatari del messaggio.
  - `content` (stringa): Contenuto del messaggio.
- **Output**:
  - Restituisce un messaggio di successo se il messaggio è inviato correttamente e l'email di notifica è stata inviata.
  - Restituisce un errore se il mittente o il destinatario non sono trovati.
- **Flusso**:
  1. Crea un nuovo messaggio utilizzando i dati ricevuti dalla richiesta.
  2. Verifica se il mittente e almeno un destinatario esistono nel database.
  3. Invia una notifica via email al destinatario.
  4. Restituisce il messaggio creato.

#### 3. **deleteMessage(req, res)**

- **Descrizione**: Elimina un messaggio specificato dal sistema.
- **Input**:
  - `id` (ObjectId): ID del messaggio da eliminare.
- **Output**:
  - Restituisce un messaggio di successo se il messaggio viene eliminato correttamente.
  - Restituisce un errore se non riesce a eliminare il messaggio.
- **Flusso**:
  1. Trova e elimina il messaggio dal database utilizzando l'ID passato come parametro.
  2. Restituisce un messaggio di successo.

#### 4. **completeMessage(req, res)**

- **Descrizione**: Marca un messaggio come "completato".
- **Input**:
  - `id` (ObjectId): ID del messaggio da aggiornare.
- **Output**:
  - Restituisce il messaggio aggiornato con il campo `completed` impostato su `true`.
  - Restituisce un errore se non riesce a completare l'operazione.
- **Flusso**:
  1. Trova il messaggio usando l'ID passato.
  2. Aggiorna il campo `completed` a `true`.
  3. Restituisce il messaggio aggiornato.

---

## File: `messageRoutes.js`

Questo file contiene le rotte per gestire i messaggi. Ogni rotta è associata a una funzione di controllo definita in `messageController.js`.

### Rotte

#### 1. **GET `/messages/:userID`**

- **Funzione**: Recupera tutti i messaggi per un utente.
- **Controllore**: `getMessages`.

#### 2. **POST `/messages`**

- **Funzione**: Invia un nuovo messaggio a uno o più destinatari.
- **Controllore**: `sendMessage`.

#### 3. **DELETE `/messages/:id`**

- **Funzione**: Elimina un messaggio specificato.
- **Controllore**: `deleteMessage`.

#### 4. **PATCH `/messages/:id`**

- **Funzione**: Marca un messaggio come completato.
- **Controllore**: `completeMessage`.

---

## File: `noteModel.js`

Questo file definisce il modello di `Note` che rappresenta una nota nel sistema. Utilizza Mongoose per interagire con il database MongoDB.

### Schema della Nota

- **title** (stringa): Titolo della nota (obbligatorio).
- **content** (stringa): Contenuto della nota (obbligatorio).
- **categories** (array di stringhe): Categorie assegnate alla nota (default: array vuoto).
- **userID** (ObjectId): Riferimento all'utente che ha creato la nota (obbligatorio).
- **accessList** (array di ObjectId): Lista di utenti autorizzati a visualizzare la nota se la visibilità è "restricted" (default: array vuoto).
- **visibility** (stringa): Visibilità della nota, che può essere "open", "restricted", o "private" (default: "open").
- **createdAt** (data): Data di creazione della nota (default: data corrente).

---

## File: `noteController.js`

Questo file contiene le funzioni di controllo per la gestione delle note, come la creazione, la lettura, l'aggiornamento, la cancellazione e la duplicazione delle note.

### Funzioni

#### 1. **createNote(req, res)**

- **Descrizione**: Crea una nuova nota e la salva nel sistema.
- **Input**:
  - `title` (stringa): Titolo della nota (obbligatorio).
  - `content` (stringa): Contenuto della nota (obbligatorio).
  - `categories` (array di stringhe): Categorie della nota (obbligatorio).
  - `userID` (ObjectId): ID dell'utente che crea la nota (obbligatorio).
  - `visibility` (stringa): Visibilità della nota, che può essere "open", "restricted", o "private".
  - `accessList` (array di ObjectId): Lista di utenti autorizzati a visualizzare la nota, necessaria se la visibilità è "restricted".
- **Output**:
  - Restituisce la nota creata.
  - Restituisce errori se mancano campi obbligatori o se la visibilità è invalida.
  - Invia un'email di notifica se la nota è "restricted" a tutti gli utenti nella `accessList`.
- **Flusso**:
  1. Verifica la validità dei dati di input.
  2. Crea una nuova nota.
  3. Salva la nota nel database.
  4. Invia un'email ai destinatari se la visibilità è "restricted".

#### 2. **getNotes(req, res)**

- **Descrizione**: Recupera tutte le note visibili per un utente, comprese le note pubbliche, private e le note ristrette a cui l'utente ha accesso.
- **Input**:
  - `userID` (ObjectId): ID dell'utente per il quale recuperare le note.
- **Output**:
  - Restituisce una lista di note visibili per l'utente.
  - Restituisce un errore se non riesce a recuperare le note.
- **Flusso**:
  1. Esegue una query per trovare tutte le note con visibilità "open" o quelle a cui l'utente ha accesso (visibilità "restricted").

#### 3. **updateNote(req, res)**

- **Descrizione**: Modifica una nota esistente.
- **Input**:
  - `id` (ObjectId): ID della nota da modificare.
  - `title` (stringa): Titolo della nota (obbligatorio).
  - `content` (stringa): Contenuto della nota (obbligatorio).
  - `categories` (array di stringhe): Categorie della nota (obbligatorio).
  - `visibility` (stringa): Nuova visibilità della nota (opzionale).
  - `accessList` (array di ObjectId): Lista aggiornata di utenti autorizzati a visualizzare la nota (opzionale).
- **Output**:
  - Restituisce la nota aggiornata.
  - Restituisce errori se la nota non esiste o se mancano dati obbligatori.
  - Invia un'email di notifica se la visibilità della nota è stata aggiornata a "restricted" e la `accessList` è stata modificata.
- **Flusso**:
  1. Verifica la validità dei dati di input.
  2. Trova la nota nel database.
  3. Modifica la nota con i nuovi dati.
  4. Invia un'email ai destinatari se la visibilità è "restricted" e la lista di accesso è aggiornata.

#### 4. **deleteNote(req, res)**

- **Descrizione**: Elimina una nota esistente.
- **Input**:
  - `id` (ObjectId): ID della nota da eliminare.
  - `userID` (ObjectId): ID dell'utente che richiede l'eliminazione.
- **Output**:
  - Restituisce un messaggio di successo se la nota è eliminata correttamente.
  - Restituisce errori se la nota non esiste o se l'utente non ha i permessi per eliminarla.
- **Flusso**:
  1. Trova la nota nel database.
  2. Verifica che l'utente sia l'autore della nota o abbia accesso a essa.
  3. Elimina la nota dal database.

#### 5. **duplicateNote(req, res)**

- **Descrizione**: Duplica una nota esistente.
- **Input**:
  - `id` (ObjectId): ID della nota da duplicare.
  - `userID` (ObjectId): ID dell'utente che sta duplicando la nota.
- **Output**:
  - Restituisce la copia della nota creata.
  - Restituisce errori se la nota originale non viene trovata.
- **Flusso**:
  1. Trova la nota originale nel database.
  2. Crea una copia della nota con un nuovo titolo e la visibilità impostata su "private".
  3. Salva la copia nel database.

---

## File: `noteRoutes.js`

Questo file contiene le rotte per gestire le note. Ogni rotta è associata a una funzione di controllo definita in `noteController.js`.

### Rotte

#### 1. **POST `/notes`**

- **Funzione**: Crea una nuova nota.
- **Controllore**: `createNote`.

#### 2. **GET `/notes`**

- **Funzione**: Recupera tutte le note visibili per un utente.
- **Controllore**: `getNotes`.

#### 3. **PUT `/notes/:id`**

- **Funzione**: Modifica una nota esistente.
- **Controllore**: `updateNote`.

#### 4. **DELETE `/notes/:id`**

- **Funzione**: Elimina una nota esistente.
- **Controllore**: `deleteNote`.

#### 5. **POST `/notes/:id/duplicate`**

- **Funzione**: Duplica una nota esistente.
- **Controllore**: `duplicateNote`.

---