// Importation des hooks React, du contexte Auth et de l'instance API
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';

const LoginPage = ({ onSwitch }) => {
  // États pour les champs de saisie et les erreurs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // Utilisation de la fonction login du contexte
  const { login } = useContext(AuthContext);

  // Fonction de soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Requête POST vers l'API de connexion
      const response = await api.post('/auth/login', { username, password });
      // Appel de la fonction login avec les données reçues
      login(response.data.user, response.data.token);
    } catch (err) {
      // Affichage du message d'erreur si la connexion échoue
      setError(err.response?.data?.message || 'Erreur de connexion');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded shadow-md w-96">
        <h2 className="mb-6 text-2xl font-bold text-center">Connexion</h2>
        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          className="w-full p-2 mb-4 border rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          className="w-full p-2 mb-4 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600">
          Se connecter
        </button>
        <p className="mt-4 text-center">
          Pas de compte ?{' '}
          <button type="button" onClick={onSwitch} className="text-blue-500 hover:underline">
            S'inscrire
          </button>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
