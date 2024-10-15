import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ModalDetailsGuild = ({ showModal, setShowModal, guildDetails, userId }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (guildDetails) {
      setName(guildDetails.name || '');
      setDescription(guildDetails.description || '');
      setMembers(guildDetails.members ? JSON.parse(guildDetails.members) : []); // Assurez-vous que guildDetails.members est bien initialisé comme un tableau
      setImage(null);
    }
  }, [guildDetails]);

  const handleEditGuild = async () => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      if (image) {
        formData.append('image', image);
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };

      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/guild/${guildDetails.id}`, formData, config);
      console.log('Guild updated:', response.data);
      setShowModal(false);
    } catch (error) {
      console.error('Error updating guild:', error);
    }
  };

  if (!showModal || !guildDetails) return null;

  const isCreator = guildDetails.creator_id === userId;

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
              <h3 className="text-3xl font-semibold">Détails de la Guilde</h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => setShowModal(false)}
              >
                <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">×</span>
              </button>
            </div>
            <div className="relative p-6 flex-auto">
              <p><strong>Nom:</strong></p>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                readOnly={!isCreator} 
                className="border rounded p-2 w-full"
              />
              <p className="mt-4"><strong>Description:</strong></p>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                readOnly={!isCreator} 
                className="border rounded p-2 w-full"
              />
              <p className="mt-4"><strong>Image:</strong></p>
              <input 
                type="file" 
                onChange={(e) => setImage(e.target.files[0])} 
                disabled={!isCreator} 
                className="border rounded p-2 w-full"
              />
              {guildDetails.image && (
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}/${guildDetails.image}`}  
                  alt={guildDetails.name}
                  className="w-full rounded-lg mt-4"
                />
              )}
              <p className="mt-4"><strong>Créateur ID:</strong> {guildDetails.creator_id || 'Pas d\'informations'}</p>
              <p className="mt-4"><strong>Nombre de membres:</strong> {members.length || 'Pas d\'informations'}</p>
              <p className="mt-4"><strong>Membres:</strong></p>
              <ul className="list-disc list-inside">
  {Array.isArray(members) && members.length > 0 ? (
    members.map((member, index) => (
      <li key={index}>{member}</li>
    ))
  ) : (
    <li>Pas d'informations</li>
  )}
</ul>
            </div>
            <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
              {isCreator && (
                <button
                  className="bg-blue-500 text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                  type="button"
                  onClick={handleEditGuild}
                >
                  Modifier
                </button>
              )}
              <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setShowModal(false)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default ModalDetailsGuild;