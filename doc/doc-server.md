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