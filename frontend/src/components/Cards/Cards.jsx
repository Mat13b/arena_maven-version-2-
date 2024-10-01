import React, { useState } from "react";

import ModalVisuTournament from "@components/Modals/ModalVisuTournament/ModalVisuTournament";

const Cards = ({ tournaments }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`;

  const handleCardClick = (tournament) => {
    setSelectedTournament(tournament);
    setShowModal(true);
  };

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 pt-16">
      {tournaments.map((item) => {
        const remainingSlots = item.total_players - item.participants.length;

        return (
          <div
            onClick={() => handleCardClick(item)}
            key={item.id}
            className="cursor-pointer max-w-sm w-full rounded-lg shadow-xl transform transition-transform duration-300 hover:scale-105 card-custom-bg mb-5"
          >
            <div className="flex flex-col justify-between h-full">
              <div className="relative">
                <img
                  className="w-full h-36 object-cover rounded-t-lg"
                  src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${item.tournament_img}`}
                  alt={item.name}
                />
                {item.total_players > item.participants.length && item.date > formattedDate ? (
                  <span className="absolute top-2 right-2 bg-primary text-white text-xs font-bold py-1 px-2 rounded-full">
                    Inscription ouverte
                  </span>
                ) : (
                  <span className="absolute top-2 right-2 bg-warning text-white text-xs font-bold py-1 px-2 rounded-full">
                    Inscription fermée
                  </span>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-white text-black text-center text-sm py-1">
                  Date de l'événement: {item.date ? item.date.substring(0, 10) : 'N/A'}
                </div>
              </div>
              <div className="p-4">
                <h5 className="text-xl font-bold mb-2">{item.name}</h5>
                <p className="text-base text-gray-700">{item.short_description}</p>
              </div>
              <div className="flex justify-center p-4">
                <button className="w-full text-sm bg-black text-white rounded-full px-2 py-1">
                  S'inscrire
                </button>
              </div>
              <div className="p-4 flex justify-between text-black text-sm">
                <span className="bg-vertBG text-white text-xs font-bold py-1 px-2 rounded-full">
                  Total des joueurs: {item.total_players}
                </span>
                <span className="bg-vertBG text-white text-xs font-bold py-1 px-2 rounded-full">
                  Places restantes: {remainingSlots >= 0 ? remainingSlots : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        );
      })}

      {selectedTournament && (
        <ModalVisuTournament
          showModal={showModal}
          setShowModal={setShowModal}
          tournament={selectedTournament}
          remainingSlots={selectedTournament.total_players - selectedTournament.participants.length}
          formattedDate={formattedDate}
        />
      )}
    </div>
  );
};

export default Cards;