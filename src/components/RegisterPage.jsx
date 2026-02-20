// Importation des hooks React et de l'instance API
import { useState } from 'react';
import api from '../api';

const RegisterPage = ({ onSwitch }) => {
  // États pour les champs et les messages
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fonction de soumission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Requête POST vers l'API d'inscription
      await api.post('/auth/register', { username, password });
      setMessage('Compte créé avec succès ! Vous pouvez vous connecter.');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription");
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded shadow-md w-96">
        <h2 className="mb-6 text-2xl font-bold text-center">Inscription</h2>
        {message && <p className="mb-4 text-sm text-green-500">{message}</p>}
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
        <button type="submit" className="w-full p-2 text-white bg-green-500 rounded hover:bg-green-600">
          S'inscrire
        </button>
        <p className="mt-4 text-center">
          Déjà un compte ?{' '}
          <button type="button" onClick={onSwitch} className="text-blue-500 hover:underline">
            Se connecter
          </button>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
