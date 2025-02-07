# Client

Il client dell'applicazione è sviluppato con React.

## public
- **index.html**: Il file principale HTML che React utilizza come punto di ingresso.

## src

- **App.js**: Il componente principale dell'applicazione contenente le rotte.

- **index.js**: Il file di ingresso di React che renderizza l'applicazione.

- **assets**: Contiene le risorse statiche come immagini e icone.

- **context**: Contiene i file relativi alla gestione degli state React globali.
  1. **AuthContext**

  2. **TimeMachineContext**
  - *time:* 
  - *isTimeMachineActive:* 

- **fonts**: 

- **services**: Contiene le funzioni per effettuare chiamate API al backend.

- **styles**: Contiene i file CSS.

- **components**: Contiene i componenti dell'applicazione.
  1. **calendar**
  - events
  - tasks
  - Calendar.js
  - DateUtilites.js
  - InvitationHandler.js
  - TabSwitcher.js
  - TimeZoneForm.js
  - UserForm.js

  2. **common**
  - Modal.js

  3. **homepage**
  - Homepage.js

  4. **loginsignup**
  - ForgotPassword.js
  - Login.js
  - ProtectedRoute.js
  - ResetPassword.js
  - Signup.js

  5. **notes**
  - MarkdownLegend.js
  - Notes.js
  - NotesDetail.js
  - NotesFilter.js
  - NotesView.js
  - SearchNotes.js
  - SortNotes.js

  6. **pomodoro**
  - Pomodoro.js
  - PomodoroAnimation.js
  - PomodoroEmailSender.js

  7. **preview** 
  - CalendarPreview.js
  - NotesPreview.js
  - PomodoroPreview.js
  - ProfilePreview.js
  - TimeMachinePreview.js

  8. **profile**
  - EditProfileForm.js
  - Inbox.js
  - Profile.js

  9. **timemachine**
  - TimeMachine.js




# 4. 

## Login.js
- **Descrizione**: Questo file contiene il componente per la gestione della pagina di login dell'applicazione. Permette agli utenti di autenticarsi utilizzando email e password.
- **Funzionalità**:
  - Gestione dello stato per email e password.
  - Autenticazione dell'utente tramite il servizio di login.
  - Gestione degli errori di autenticazione.
  - Navigazione verso la homepage in caso di login riuscito.
- **Componenti Utilizzati**:
  - useNavigate (da react-router-dom) per la navigazione.
  - useContext (da React) per l'accesso al contesto di autenticazione.

## Signup.js
- **Descrizione**: Questo file contiene il componente per la registrazione di nuovi utenti nell'applicazione. Permette la creazione di un nuovo account con nome, email e password.
- **Funzionalità**:
  - Gestione dello stato per nome, email e password.
  - Registrazione dell'utente tramite il servizio di signup.
  - Salvataggio del token di autenticazione e dell'ID utente nel localStorage.
  - Autenticazione automatica dell'utente dopo la registrazione.
  - Navigazione verso la homepage dopo la registrazione.
- **Componenti Utilizzati**:
  - useNavigate (da react-router-dom) per la navigazione.
  - useContext (da React) per l'accesso al contesto di autenticazione.


# 5.

## MarkdownLegend.js

- **Descrizione**: Questo file contiene il componente che fornisce una guida interattiva sull'utilizzo della sintassi Markdown. Gli utenti possono visualizzare esempi di formattazione per testo, liste, link, immagini e codice.
- **Funzionalità**:
  - Mostra una finestra modale con una guida Markdown.
  - Include esempi interattivi di sintassi Markdown.
  - Consente di chiudere la finestra di guida con un pulsante.
- **Componenti Utilizzati**:
  - `useState` (da React) per la gestione dello stato di visibilità.
  - Immagini e asset locali per esempi visivi.

## Notes.js

- **Descrizione**: Questo file contiene il componente principale per la gestione delle note. Permette agli utenti autenticati di creare, visualizzare e organizzare le loro note.
- **Funzionalità**:
  - Recupera e visualizza l'elenco delle note associate all'utente.
  - Consente la creazione di nuove note con supporto Markdown.
  - Permette di selezionare la visibilità delle note (pubblica, privata, ristretta).
  - Integra una sezione di anteprima Markdown.
  - Consente la selezione degli utenti per la condivisione delle note.
  - Gestisce errori e validazioni nel processo di creazione delle note.
- **Componenti Utilizzati**:
  - `useContext` (da React) per l'accesso al contesto di autenticazione.
  - `useState` e `useEffect` per la gestione dello stato locale e il recupero dati.
  - `createNote` e `getNotes` (da noteService) per interagire con il backend delle note.
  - `getAllUsersBasicInfo` (da userService) per recuperare l'elenco degli utenti.
  - `NotesView`, `NotesDetail`, `SortNotes`, `MarkdownLegend` per la gestione dell'interfaccia utente.
  - `marked` (libreria esterna) per la conversione del Markdown in HTML.

## NotesDetail.js

- **Descrizione**: Questo componente visualizza i dettagli di una nota, permettendo all'utente di modificarne il titolo, contenuto, categorie e visibilità. Inoltre, consente di vedere un'anteprima Markdown del contenuto.
- **Funzionalità**:
  - Mostra i dettagli della nota selezionata (titolo, contenuto, categorie e visibilità).
  - Consente di entrare in modalità di modifica della nota.
  - Permette di modificare titolo, contenuto, categorie e visibilità della nota.
  - Gestisce la selezione di utenti per note con visibilità "ristretta".
  - Fornisce un'anteprima Markdown del contenuto.
  - Salva le modifiche o annulla l'operazione.
- **Componenti Utilizzati**:
  - `useState` e `useEffect` (da React) per la gestione dello stato e la gestione delle modifiche.
  - `updateNote` (da noteService) per aggiornare la nota nel backend.
  - `getAllUsersBasicInfo` (da userService) per ottenere l'elenco degli utenti da selezionare nelle note con visibilità "ristretta".
  - `marked` (libreria esterna) per generare l'anteprima Markdown.
  
---

## NotesFilter.js

- **Descrizione**: Questo componente permette agli utenti di filtrare le note in base alla loro visibilità. Fornisce un menu a discesa per scegliere tra tutte, pubbliche, private o ristrette.
- **Funzionalità**:
  - Consente di selezionare la visibilità delle note da visualizzare.
  - Si integra con altri componenti per filtrare le note in base alla visibilità selezionata.
- **Componenti Utilizzati**:
  - `useState` (da React) per la gestione dello stato del filtro.
  
---

## NotesView.js

- **Descrizione**: Questo componente visualizza l'elenco delle note, con opzioni per visualizzare, duplicare o eliminare le note. Include anche filtri di visibilità e ricerca per categoria.
- **Funzionalità**:
  - Mostra un elenco di note con il titolo, le categorie, una parte del contenuto e la visibilità.
  - Permette di selezionare una nota per visualizzarne i dettagli.
  - Consente di duplicare ed eliminare le note.
  - Filtra le note in base alla visibilità e/o alla categoria.
  - Mostra icone per indicare se una nota contiene Markdown o è privata.
- **Componenti Utilizzati**:
  - `useState` (da React) per la gestione dello stato di visibilità del filtro e la ricerca per categoria.
  - `deleteNote` e `duplicateNote` (da noteService) per interagire con il backend delle note.
  - `VisibilityFilter` per il filtro di visibilità delle note.
  - Immagini locali per rappresentare le icone di Markdown, blocco e ricerca.

## SortNotes.js

- **Descrizione**: Questo componente consente agli utenti di ordinare un elenco di note in base a diversi criteri, come ordine alfabetico, data di creazione, lunghezza del contenuto o categoria. Mostra un menu a discesa per selezionare il tipo di ordinamento desiderato.
- **Funzionalità**:
  - Mostra un pulsante che apre un menu a discesa per selezionare il tipo di ordinamento.
  - Permette di ordinare le note in base ai seguenti criteri:
    - **Ordine Alfabetico**: Ordina le note in base al titolo in ordine crescente.
    - **Data**: Ordina le note dalla più recente alla più vecchia in base alla data di creazione.
    - **Lunghezza Contenuto**: Ordina le note in base alla lunghezza del contenuto, dalla più lunga alla più corta.
    - **Categoria**: Ordina le note in base alla categoria (se presente) in ordine alfabetico.
  - Aggiorna l'elenco delle note ordinate nel componente padre tramite `setNotes`.
- **Componenti Utilizzati**:
  - `useState` (da React) per la gestione dello stato del menu di ordinamento.


# 7.

## NotesPreview.js

- **Descrizione**: Questo componente mostra una panoramica delle ultime note dell'utente, con la possibilità di filtrare in base alla visibilità (pubbliche, private, ristrette) e di configurare il numero di note da visualizzare. Mostra un elenco di note recenti, con titolo, categorie, contenuto parziale e visibilità.
- **Funzionalità**:
  - Recupera le note dell'utente autenticato e le filtra in base alla visibilità (tutte, pubbliche, private, ristrette).
  - Ordina le note per data di creazione (le più recenti in cima).
  - Permette di configurare il numero di note da visualizzare (da 1 a 5).
  - Visualizza un'anteprima delle note con titolo, categorie e un estratto del contenuto.
  - Mostra la visibilità della nota (pubblica, privata, ristretta).
  - Fornisce un link per accedere alla pagina completa delle note.
- **Componenti Utilizzati**:
  - `useState` e `useEffect` (da React) per la gestione dello stato e il recupero delle note.
  - `AuthContext` per ottenere lo stato di autenticazione dell'utente.
  - `Link` (da `react-router-dom`) per la navigazione tra le pagine.
  - `getNotes` (da `noteService`) per recuperare le note dal backend.
  - Icona locale per rappresentare le note.


# 8.

## Profile.js

- **Descrizione**: Questo componente gestisce la visualizzazione e modifica del profilo dell'utente. L'utente può modificare le proprie informazioni, cambiare la foto del profilo, fare il logout e cancellare il proprio account.
- **Funzionalità**:
  - Visualizza le informazioni del profilo dell'utente (nome, email, bio, compleanno, sesso, foto profilo).
  - Consente all'utente di modificare le informazioni del profilo tramite un form.
  - Permette di aggiornare la foto del profilo.
  - Fornisce un'opzione per fare il logout o cancellare il proprio account.
  - Apre un modal per la modifica del profilo.
  - Gestisce gli errori durante il recupero, l'aggiornamento o la cancellazione del profilo.
- **Componenti Utilizzati**:
  - `useState` e `useEffect` per la gestione dello stato e il recupero dei dati dell'utente.
  - `useNavigate` per la navigazione tra le pagine.
  - `AuthContext` per gestire l'autenticazione e il logout.
  - `Modal` per visualizzare un modal per l'editing del profilo.
  - `EditProfileForm` per il form di modifica del profilo.
  - Funzioni da `userService` per gestire l'utente: `getUser`, `updateUser`, `updateUserProfilePicture`, `deleteUser`.
  - Icona predefinita per la foto del profilo.

## Inbox.js

- **Descrizione**: Questo componente gestisce la visualizzazione e la gestione dei messaggi dell'utente. L'utente può leggere, completare, eliminare messaggi e inviare nuovi messaggi a uno o più destinatari.
- **Funzionalità**:
  - Recupera i messaggi dell'utente tramite `messageService`.
  - Permette di filtrare i messaggi in base al loro stato (completati, non completati, tutti).
  - Consente di completare o eliminare i messaggi.
  - Permette di inviare nuovi messaggi, selezionando uno o più destinatari.
  - Mostra la lista degli utenti disponibili a cui inviare messaggi.
- **Componenti Utilizzati**:
  - `useState` e `useEffect` per la gestione dello stato e il recupero dei messaggi.
  - `useNavigate` per la navigazione tra le pagine.
  - `messageService` per gestire le operazioni sui messaggi (recupero, completamento, eliminazione, invio).
  - Funzione `getAllUsersBasicInfo` per ottenere le informazioni di base degli utenti a cui inviare messaggi.
  - Icona di completamento per i messaggi completati.

## EditProfileForm.js

- **Descrizione**: Questo componente è un form per modificare le informazioni del profilo dell'utente, come nome, bio, data di nascita, sesso e foto del profilo.
- **Funzionalità**:
  - Permette di modificare il nome, la bio, la data di nascita, il sesso e la foto del profilo.
  - Gestisce la selezione di un file per la foto del profilo.
  - Invia i dati modificati tramite il form quando viene sottomesso.
  - Fornisce un'opzione per annullare la modifica.
- **Componenti Utilizzati**:
  - `useState` per gestire i dati del form.
  - Funzione `handleInputChange` per aggiornare i dati del form.
  - Funzione `handleFileChange` per gestire la selezione della foto del profilo.
  - Funzione `handleFormSubmit` per inviare i dati del form.
  - Gestisce l'invio dei dati al backend tramite i servizi di aggiornamento utente.
