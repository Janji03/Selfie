import React, { useState, useEffect } from 'react';
import messageService from '../../services/messageService';
import { getAllUsersBasicInfo } from '../../services/userService';
import "../../styles/Inbox.css";

const Inbox = () => {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const userID = localStorage.getItem("userID");

    useEffect(() => {
        messageService.getMessages(userID)
            .then(setMessages)
            .catch(error => console.error('Error fetching messages:', error));

        getAllUsersBasicInfo()
            .then(setUsers)
            .catch(error => console.error('Error fetching users:', error));
    }, [userID]);

    const handleComplete = (id) => {
        messageService.completeMessage(id)
            .then(() => {
                setMessages(messages.map(msg =>
                    msg._id === id ? { ...msg, completed: true } : msg
                ));
            })
            .catch(error => console.error('Error completing message:', error));
    };

    const handleDelete = (id) => {
        messageService.deleteMessage(id)
            .then(() => {
                setMessages(messages.filter(msg => msg._id !== id));
            })
            .catch(error => console.error('Error deleting message:', error));
    };


    const handleSend = () => {
        const payload = {
            content: newMessage,
            recipients: selectedUsers,
            sender: userID,
        };

        messageService.sendMessage(payload)
            .then(() => {
                setNewMessage('');
                setSelectedUsers([]);
                alert('Message sent successfully');
            })
            .catch(error => console.error('Error sending message:', error));
    };

    const handleUserSelection = (userId) => {
        setSelectedUsers(prevSelectedUsers =>
            prevSelectedUsers.includes(userId)
                ? prevSelectedUsers.filter(id => id !== userId)
                : [...prevSelectedUsers, userId]
        );
    };

    return (
        <div>
            <h1>Inbox</h1>
            <ul>
                {messages.map(msg => (
                    <li key={msg._id}>
                        <span>{msg.content}</span>
                        <div>
                            <strong>Sender:</strong> {msg.sender.name} ({msg.sender.email})
                        </div>
                        <button onClick={() => handleComplete(msg._id)}>Complete</button>
                        <button onClick={() => handleDelete(msg._id)}>Delete</button>
                    </li>
                ))}
            </ul>


            <h2>Send a Message</h2>
            <textarea value={newMessage} onChange={e => setNewMessage(e.target.value)} />
            <h3>Select Recipients</h3>
            <ul>
                {users.map(user => (
                    <li key={user._id}>
                        <label>
                            <input
                                type="checkbox"
                                value={user._id}
                                checked={selectedUsers.includes(user._id)}
                                onChange={() => handleUserSelection(user._id)}
                            />
                            {user.name} ({user.email})
                        </label>
                    </li>
                ))}
            </ul>
            <button onClick={handleSend}>Send Message</button>
        </div>
    );
};

export default Inbox;
