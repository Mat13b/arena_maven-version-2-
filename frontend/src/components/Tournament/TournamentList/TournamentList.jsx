import React, { useEffect, useState } from "react";
import axios from "axios";
import Cards from '@components/Cards/Cards';


const TournamentList = () => {
  const [tournaments, setTournaments] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/tournament`);
      const tournamentsData = res.data;

      // Fetch participants pour chaque participants
      const tournamentsWithParticipants = await Promise.all(
        tournamentsData.map(async (tournament) => {
          const participantsRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/participation/tournament/${tournament.id}`);
          tournament.participants = participantsRes.data;
          return tournament;
        })
      );

      setTournaments(tournamentsWithParticipants);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="bg-gradient-to-tr from-black via-vertBG to-black p-4">
      <div className="flex flex-col items-center mb-12">
        <h1 className="text-4xl font-bold text-white">Découvrir</h1>
        <div className="w-full h-20 flex justify-center absolute top-3.5 right-3.5">
        </div>
      </div>
      <article className="mt-8">
        <h2 className="text-3xl text-white">Tournois à venir :</h2>
        {tournaments.length > 0 ? (
          <div className="flex flex-wrap items-center justify-evenly">
            <Cards tournaments={tournaments} />
          </div>
        ) : (
          <p className="text-white">Aucun tournoi trouvé.</p>
        )}
      </article>
    </div>
  );
}

export default TournamentList;


// import React, { useState, useEffect } from 'react';

// const TournamentList = () => {
//   const [isTokenValid, setIsTokenValid] = useState(false);
//   const [tournaments, setTournaments] = useState([]);

//   const checkToken = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setIsTokenValid(false);
//         return;
//       }

//       const response = await fetch('/api/auth/check-token', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         setIsTokenValid(true);
//         // Charge la liste des tournois une fois le token validé
//         loadTournaments(token);
//       } else {
//         setIsTokenValid(false);
//       }
//     } catch (error) {
//       console.error('Error checking token:', error);
//     }
//   };

//   const loadTournaments = async (token) => {
//     try {
//       const response = await fetch('/api/tournament', {
//         method: 'GET',
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setTournaments(data); // Met à jour l'état avec les tournois récupérés depuis l'API
//       } else {
//         console.error('Failed to fetch tournaments');
//       }
//     } catch (error) {
//       console.error('Error fetching tournaments:', error);
//     }
//   };

//   useEffect(() => {
//     checkToken();
//   }, []);

//   return (
//     <div>
//       {isTokenValid ? (
//         <div>
//           <h1>Tournament List</h1>
//           <ul>
//             {tournaments.map(tournament => (
//               <li key={tournament.id}>
//                 {tournament.name} - {tournament.date}
//                 {/* Ajoutez d'autres détails du tournoi selon vos besoins */}
//               </li>
//             ))}
//           </ul>
//         </div>
//       ) : (
//         <p>Unauthorized access. Please log in.</p>
//       )}
//     </div>
//   );
// };

// export default TournamentList;

// import React, { useState, useEffect } from 'react';

// const TournamentList = () => {
//   const [isTokenValid, setIsTokenValid] = useState(false);
//   const [tournaments, setTournaments] = useState([]);

//   const checkToken = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setIsTokenValid(false);
//         return;
//       }

//       const response = await fetch('/api/auth/check-token', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//          'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         setIsTokenValid(true);
//         // Charge la liste des tournois une fois le token validé
//         loadTournaments(token);
//       } else {
//         setIsTokenValid(false);
//       }
//     } catch (error) {
//       console.error('Error checking token:', error);
//     }
//   };

//   const loadTournaments = async (token) => {
//     try {
//       const response = await fetch('/api/tournament', {
//         method: 'GET',
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setTournaments(data); // Met à jour l'état avec les tournois récupérés depuis l'API
//       } else {
//         console.error('Failed to fetch tournaments');
//       }
//     } catch (error) {
//       console.error('Error fetching tournaments:', error);
//     }
//   };

//   useEffect(() => {
//     checkToken();
//   }, []);

//   return (
//     <div>
//       {isTokenValid ? (
//         <div>
//           <h1>Tournament List</h1>
//           <ul>
//             {tournaments.map(tournament => (
//               <li key={tournament.id}>
//                 {tournament.name} - {tournament.date}
//                 {/* Ajoutez d'autres détails du tournoi selon vos besoins */}
//               </li>
//             ))}
//           </ul>
//         </div>
//       ) : (
//         <p>Unauthorized access. Please log in.</p>
//       )}
//     </div>
//   );
// };

// export default TournamentList;