// Importation des hooks React et du contexte Socket
import { useContext } from 'react';
import { SocketContext } from '../context/SocketContext';

const UserList = ({ users, onSelectUser, selectedUser, currentUser }) => {
  // Récupération des utilisateurs en ligne depuis le contexte
  const { onlineUsers } = useContext(SocketContext);

  return (
    <div className="w-1/3 h-full border-r bg-white overflow-y-auto">
      <div className="p-4 border-b bg-gray-50">
        <h3 className="font-bold text-lg">Utilisateurs</h3>
      </div>
      <ul>
        {users.filter(u => u.id !== currentUser.id).map((u) => (
          <li
            key={u.id}
            onClick={() => onSelectUser(u)}
            className={`p-4 border-b cursor-pointer flex items-center justify-between hover:bg-gray-100 ${selectedUser?.id === u.id ? 'bg-blue-50' : ''}`}
          >
            <span className="font-medium">{u.username}</span>
            {/* Indicateur de statut: vert si en ligne, rouge sinon */}
            <div className={`w-3 h-3 rounded-full ${onlineUsers.includes(u.id.toString()) ? 'bg-green-500' : 'bg-red-500'}`}></div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
