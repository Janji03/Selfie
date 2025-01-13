import React, { useState } from "react";
import Modal from "../common/Modal";
import { sendPomodoroEmail } from "../../services/pomodoroService";

const PomodoroEmailSender = ({ studyTime, breakTime, cycles }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");

  const handleSendEmail = async () => {
    if (!email) {
      alert("Inserisci un'email valida.");
      return;
    }

    try {
      await sendPomodoroEmail(email, { studyTime, breakTime, cycles });
      alert("Email inviata con successo!");
      setIsModalOpen(false);
      setEmail('')
    } catch (error) {
      console.error("Errore invio email:", error);
      alert("Errore durante l'invio dell'email. Riprova.");
    }
  };

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>Condividi impostazioni Pomodoro</button>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Condividi le impostazioni Pomodoro"
          zIndex={1000}
        >
          <div>
            <label>
              Email destinatario:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Inserisci l'email"
                required
              />
            </label>

            <div>
              <h3>Impostazioni Pomodoro:</h3>
              <ul>
                <li><strong>Tempo di studio:</strong> {studyTime} minuti</li>
                <li><strong>Tempo di pausa:</strong> {breakTime} minuti</li>
                <li><strong>Cicli:</strong> {cycles}</li>
              </ul>
            </div>

            <button onClick={handleSendEmail}>Invia</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PomodoroEmailSender;
