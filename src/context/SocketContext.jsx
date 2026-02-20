// Importation des hooks React et de la bibliothèque socket.io-client
import { createContext, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';

// Création du contexte Socket
export const SocketContext = createContext();
// Fournisseur du contexte Socket
export const SocketProvider = ({ children }) => {
  // Récupération de l'utilisateur depuis le contexte Auth
  const { user } = useContext(AuthContext);
  // État pour stocker l'instance du socket
  const [socket, setSocket] = useState(null);
  // État pour stocker la liste des utilisateurs en ligne
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Effet pour gérer la connexion/déconnexion du socket en fonction de l'utilisateur
  useEffect(() => {
    if (user) {
      // Connexion au serveur Socket.IO si l'utilisateur est connecté
      const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
      const newSocket = io(SOCKET_URL);
      setSocket(newSocket);

      // Enregistrement de l'utilisateur auprès du serveur
      newSocket.emit('registerUser', user.id);

      // Écoute de la mise à jour des utilisateurs en ligne
      newSocket.on('onlineUsers', (users) => {
        setOnlineUsers(users);
      });

      // Nettoyage lors de la déconnexion ou fermeture du composant
      return () => {
        newSocket.close();
      };
    } else {
      // Fermeture du socket si l'utilisateur se déconnecte
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [user]);

  // Mise à disposition du socket et des utilisateurs en ligne dans le contexte
  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
