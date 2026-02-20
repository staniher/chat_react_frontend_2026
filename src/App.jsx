// Importation des hooks React et des contextes
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import UserList from './components/UserList';
import ChatWindow from './components/ChatWindow';
import api from './api';

function App() {
  // Récupération de l'utilisateur et de la fonction déconnexion du contexte
  const { user, logout } = useContext(AuthContext);
  // États pour gérer l'affichage des pages et les données du chat
  const [isRegistering, setIsRegistering] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // Effet pour charger la liste des utilisateurs une fois connecté
  useEffect(() => {
    if (user) {
      const fetchUsers = async () => {
        try {
          const response = await api.get('/messages/users');
          setUsers(response.data);
        } catch (err) {
          console.error("Erreur lors du chargement des utilisateurs", err);
        }
      };
      fetchUsers();
    }
  }, [user]);

  // Si l'utilisateur n'est pas connecté, afficher Login ou Register
  if (!user) {
    return isRegistering ? (
      <RegisterPage onSwitch={() => setIsRegistering(false)} />
    ) : (
      <LoginPage onSwitch={() => setIsRegistering(true)} />
    );
  }

  // Si l'utilisateur est connecté, afficher l'interface principale du chat
  return (
    <div className="flex flex-col h-screen bg-gray-200 p-4">
      <div className="flex items-center justify-between bg-white p-4 rounded-t-lg shadow-sm">
        <h1 className="text-xl font-bold text-blue-600">Chat Réactif Ciblé</h1>
        <div className="flex items-center gap-4">
          <span className="font-medium text-gray-700">Bonjour, {user.username}</span>
          <button
            onClick={logout}
            className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Déconnexion
          </button>
        </div>
      </div>
      
      {/* Mise en page principale avec la liste des utilisateurs et la fenêtre de chat */}
      <div className="flex flex-1 overflow-hidden bg-white rounded-b-lg shadow-sm">
        <UserList
          users={users}
          onSelectUser={setSelectedUser}
          selectedUser={selectedUser}
          currentUser={user}
        />
        <ChatWindow
          selectedUser={selectedUser}
          currentUser={user}
        />
      </div>
    </div>
  );
}

export default App;
