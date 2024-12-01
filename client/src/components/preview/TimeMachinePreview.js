import React, { useState } from 'react';
import TimeMachine from '../timemachine/TimeMachine'; 
import Modal from '../common/Modal';

const TimeMachinePreview = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div>
            <div onClick={openModal}>
                🕒
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} title="TimeMachine">
                <TimeMachine />
            </Modal>
        </div>
    );
};


export default TimeMachinePreview;
