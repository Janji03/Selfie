import React, { useState } from 'react';
import TimeMachine from '../timemachine/TimeMachine'; 
import Modal from '../common/Modal';

const TimeMachinePreview = ({ onTimeUpdate }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div>
            <div onClick={openModal}>
                🕒
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} title="TimeMachine" zIndex={1000}>
                <TimeMachine onTimeUpdate={onTimeUpdate} /> 
            </Modal>
        </div>
    );
};

export default TimeMachinePreview;

