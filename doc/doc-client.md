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
