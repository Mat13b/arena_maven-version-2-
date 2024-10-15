import { useEffect, useState } from 'react';
import axios from 'axios';
import ModalVisuTournament from '@components/Modals/ModalVisuTournament/ModalVisuTournament';


export default function SmallCards({ tournament, index }) {
  const [showModal, setShowModal] = useState(false);
  const [participants, setParticipants] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/participation/tournament/${tournament.id}`);
      
        setParticipants(res.data);
      } catch (error) {
        console.error("erreur lors de la récupération des données:", error);
      }
    };
    fetchData();
  }, []);

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`;

  const remainingSlots = tournament.total_players - participants.length;

    return (
      <>
        <div onClick={() => setShowModal(true)} key={index} className="cursor-pointer relative w-96 h-48 overflow-hidden rounded-lg m-5 transform transition-transform duration-300 hover:scale-105">
          <h3 className="text-xl text-white absolute bottom-2 left-2 bg-black rounded-lg bg-opacity-40 p-1">{tournament.name}</h3>
          {tournament.total_players > participants.length && tournament.date > formattedDate ? (
                <span className="absolute top-2 right-2 bg-primary text-white text-xs font-bold py-1 px-2 rounded-full">
                  Inscriptions ouvertes
                </span>
              ) : (
                <span className="absolute top-2 right-2 bg-warning text-white text-xs font-bold py-1 px-2 rounded-full">
                  Inscriptions fermées
                </span>
              )}
          <img  className="w-full h-full object-cover" src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${tournament.tournament_img}`} alt={`image tournois ${tournament.name}`} />
        </div>
        <ModalVisuTournament showModal={showModal} setShowModal={setShowModal} tournament={tournament} remainingSlots={remainingSlots} formattedDate={formattedDate} />
      </>
    );
  }
  