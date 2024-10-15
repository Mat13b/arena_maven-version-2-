import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModalDetailsGuild from '@components/Modal/ModalDetailsGuild';

const GuildList = () => {
  const [guilds, setGuilds] = useState([]);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedGuild, setSelectedGuild] = useState(null);

  useEffect(() => {
    const fetchGuilds = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/guild`);
        console.log('Response data:', response.data);
        setGuilds(response.data[0]); // Assumer que response.data est un tableau de guildes
      } catch (err) {
        console.error('Error fetching guilds:', err);
        setError(err.message || 'Error fetching guilds');
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const tokenPayload = token.split('.')[1];
        const decodedToken = JSON.parse(atob(tokenPayload));
        setUserId(decodedToken.sub.id);
      } catch (error) {
        console.error('Erreur lors du décodage du token:', error);
      }
    }

    fetchGuilds();
  }, []);

  const handleViewMore = (guild) => {
    setSelectedGuild(guild);
    setShowModal(true);
  };

  const handleJoin = async (guildId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/guild/${guildId}/join`, { userId }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setGuilds(prevGuilds => {
        return prevGuilds.map(guild => {
          if (guild.id === guildId) {
            return { ...guild, members: [...guild.members, userId] };
          }
          return guild;
        });
      });
    } catch (error) {
      console.error('Erreur lors de l\'inscription à la guilde:', error);
    }
  };

  const handleLeave = async (guildId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/guild/${guildId}/leave`, { userId }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setGuilds(prevGuilds => {
        return prevGuilds.map(guild => {
          if (guild.id === guildId) {
            return { ...guild, members: guild.members.filter(memberId => memberId !== userId) };
          }
          return guild;
        });
      });
    } catch (error) {
      console.error('Erreur lors de la désinscription de la guilde:', error);
    }
  };

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  if (!Array.isArray(guilds) || guilds.length === 0) {
    return <div>Aucune guilde disponible</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mt-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Trouvez votre guilde</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {guilds.map(guild => (
            <div key={guild.id} className="bg-grey overflow-hidden shadow-md rounded-lg">
              <div className="px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{guild.name}</h2>
                <p className="text-sm text-gray-700 mb-4">{guild.description}</p>
                <div className="text-sm text-gray-500 mb-4">Créé par: {guild.creator_id}</div>
                {guild.image && (
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/${guild.image}`}
                    alt={guild.name}
                    className="w-full rounded-lg"
                  />
                )}
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => handleViewMore(guild)}
                >
                  Voir plus
                </button>

                {/* Affichage du nombre de membres et des membres */}
                {guild.members && Array.isArray(guild.members) && (
                  <>
                    <p className="mt-4"><strong>Nombre de membres:</strong> {guild.members.length}</p>
                    <p><strong>Membres:</strong> {guild.members.length > 0 ? guild.members.join(', ') : 'Pas d\'informations'}</p>
                  </>
                )}

                {/* Bouton d'inscription/désinscription */}
                {guild.members && guild.members.includes(userId) ? (
                  <button
                    className="bg-secondary hover:bg-primary text-white font-bold py-2 px-4 rounded mt-4"
                    onClick={() => handleLeave(guild.id)}
                  >
                    Désinscription
                  </button>
                ) : (
                  <button
                    className="bg-secondary hover:bg-primary text-white font-bold py-2 px-4 rounded mt-4"
                    onClick={() => handleJoin(guild.id)}
                  >
                    Inscription
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Affichage du modal pour les détails de la guilde sélectionnée */}
      {selectedGuild && (
        <ModalDetailsGuild
          showModal={showModal}
          setShowModal={setShowModal}
          guildDetails={selectedGuild}
          userId={userId}
        />
      )}
    </div>
  );
};

export default GuildList;