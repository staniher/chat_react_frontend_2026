// Importation des hooks React, du contexte Socket et de l'instance API
import { useState, useEffect, useContext, useRef } from 'react';
import { SocketContext } from '../context/SocketContext';
import MessageItem from './MessageItem';
import api from '../api';

const ChatWindow = ({ selectedUser, currentUser }) => {
  // États pour les messages et le champ de saisie
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  // Utilisation du socket depuis le contexte
  const { socket } = useContext(SocketContext);
  // Référence pour le défilement automatique vers le bas
  const messagesEndRef = useRef(null);

  // Effet pour charger l'historique des messages lors de la sélection d'un utilisateur
  useEffect(() => {
    if (selectedUser) {
      const fetchMessages = async () => {
        try {
          const response = await api.get(`/messages/${currentUser.id}/${selectedUser.id}`);
          setMessages(response.data);
        } catch (err) {
          console.error("Erreur lors du chargement des messages", err);
        }
      };
      fetchMessages();
    }
  }, [selectedUser, currentUser.id]);

  // Effet pour écouter les nouveaux messages via socket
  useEffect(() => {
    if (socket) {
      const handleReceiveMessage = (message) => {
        // Ajout du message si l'expéditeur est l'utilisateur sélectionné
        if (message.sender_id === selectedUser?.id) {
          setMessages((prev) => [...prev, message]);
        }
      };
      
      const handleMessageSent = (message) => {
        // Ajout du message si le destinataire est l'utilisateur sélectionné
        if (message.receiver_id === selectedUser?.id) {
          setMessages((prev) => [...prev, message]);
        }
      };

      socket.on('receiveMessage', handleReceiveMessage);
      socket.on('messageSent', handleMessageSent);

      return () => {
        socket.off('receiveMessage', handleReceiveMessage);
        socket.off('messageSent', handleMessageSent);
      };
    }
  }, [socket, selectedUser?.id]);

  // Effet pour faire défiler vers le bas à chaque nouveau message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fonction d'envoi de message
  const handleSend = (e) => {
    e.preventDefault();
    if (inputText.trim() && selectedUser && socket) {
      const messageData = {
        sender_id: currentUser.id,
        receiver_id: selectedUser.id,
        text: inputText
      };
      // Émission de l'événement sendMessage vers le serveur
      socket.emit('sendMessage', messageData);
      setInputText('');
    }
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 text-gray-400">
        Sélectionnez un utilisateur pour commencer à discuter
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      {/* En-tête de la fenêtre de chat */}
      <div className="p-4 border-b flex items-center bg-gray-50">
        <h3 className="font-bold">{selectedUser.username}</h3>
      </div>
      {/* Zone d'affichage des messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
        {messages.map((m, index) => (
          <MessageItem key={m.id || index} message={m} currentUser={currentUser} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      {/* Zone de saisie */}
      <form onSubmit={handleSend} className="p-4 border-t flex items-center gap-2">
        <input
          type="text"
          placeholder="Écrivez votre message..."
          className="flex-1 p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition">
          Envoyer
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
