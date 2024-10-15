import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ModalBracket from '@components/Modals/ModalBracket/ModalBracket';

const BracketGenerator = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [participants, setParticipants] = useState([]);
  const [brackets, setBrackets] = useState([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [scores, setScores] = useState([]);
  const [results, setResults] = useState([]);
  const [winner, setWinner] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [matchIds, setMatchIds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/participation/tournament/${id}`);
        setParticipants(res.data);
      } catch (error) {
        console.error('Error fetching participants:', error);
      }
    };

    fetchData();
  }, [id]);

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const startTournament = async () => {
    try {
      const shuffledParticipants = shuffleArray(participants);
      await generateBrackets(shuffledParticipants);
    } catch (error) {
      console.error('erreur lors de la démarrage du tournoi:', error);
    }
  };

  const generateBrackets = async (participants) => {
    const generatedBrackets = [];
    const initialScores = participants.map(() => [0, 0]);
    setScores(initialScores);

    for (let i = 0; i < participants.length; i += 2) {
      if (participants[i + 1]) {
        generatedBrackets.push([participants[i], participants[i + 1]]);
      } else {
        generatedBrackets.push([participants[i], null]);
      }
    }

    setCurrentRound(1);
    setResults([]);
    setWinner(null);

    const roundMatches = generatedBrackets.map((match) => ({
      tournament_id: id,
      player1_id: match[0]?.id,
      player2_id: match[1]?.id,
      round: 1,
      winner_id: null,
      score: null,
    }));

    const matchIdPromises = roundMatches.map(async (match) => {
      try {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/tournament_matches`, match);
        return res.data.id;
      } catch (error) {
        console.error('erreur lors de la création du match:', error);
        throw error; // Propagate the error up
      }
    });

    try {
      const ids = await Promise.all(matchIdPromises);
      setMatchIds(ids);
      setBrackets([generatedBrackets]);
    } catch (error) {
      console.error('erreur lors de la définition des IDs des matchs:', error);
      throw error; // Propagate the error up
    }
  };

  const handleScoreChange = (event, matchIndex, playerIndex) => {
    const { value } = event.target;
    if (value >= 0 && value <= 3) {
      setScores((prevScores) => {
        const updatedScores = [...prevScores];
        updatedScores[matchIndex][playerIndex] = parseInt(value);
        return updatedScores;
      });
    }
  };

  const nextRound = async () => {
    const winners = [];
    const currentMatches = brackets[currentRound - 1];
    const roundResults = [];

    for (let matchIndex = 0; matchIndex < currentMatches.length; matchIndex++) {
      const match = currentMatches[matchIndex];
      const player1 = match[0];
      const player2 = match[1];
      const player1Score = scores[matchIndex][0];
      const player2Score = scores[matchIndex][1];
      let winner = null;

      if (player1 && player1Score === 3) {
        winners.push(player1);
        winner = player1;
      }
      if (player2 && player2Score === 3) {
        winners.push(player2);
        winner = player2;
      }

      roundResults.push({
        matchIndex,
        player1,
        player1Score,
        player2,
        player2Score,
      });

      const matchId = matchIds[matchIndex];
      const updatedMatch = {
        score: `${player1Score} : ${player2Score}`,
        winner_id: winner?.id || null,
        id: matchId,
      };

      try {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/tournament_matches/${matchId}`, updatedMatch);
      } catch (error) {
        console.error('erreur lors de la mise à jour du match:', error);
        throw error; // Propagate the error up
      }
    }

    setResults((prevResults) => [...prevResults, { round: currentRound, matches: roundResults }]);

    if (winners.length === 1) {
      setWinner(winners[0]);
      setBrackets((prevBrackets) => [...prevBrackets, [[winners[0], null]]]);
    } else if (winners.length > 1) {
      const newBrackets = [];
      for (let i = 0; i < winners.length; i += 2) {
        if (winners[i + 1]) {
          newBrackets.push([winners[i], winners[i + 1]]);
        } else {
          newBrackets.push([winners[i], null]);
        }
      }
      setBrackets((prevBrackets) => [...prevBrackets, newBrackets]);
      setCurrentRound(currentRound + 1);
      const initialScores = winners.map(() => [0, 0]);
      setScores(initialScores);

      const roundMatches = newBrackets.map((match) => ({
        tournament_id: id,
        player1_id: match[0]?.id,
        player2_id: match[1]?.id,
        round: currentRound + 1,
        winner_id: null,
        score: null,
      }));

      const newMatchIdPromises = roundMatches.map(async (match) => {
        try {
          const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/tournament_matches`, match);
          return res.data.id;
        } catch (error) {
          console.error('erreur lors de la création du match:', error);
          throw error; // Propagate the error up
        }
      });

      try {
        const ids = await Promise.all(newMatchIdPromises);
        setMatchIds(ids);
      } catch (error) {
        console.error('erreur lors de la définition des IDs des matchs:', error);
        throw error; // Propagate the error up
      }
      console.log("id au deuxieme round", matchIds);
    }
  };

  const endTournament = () => {
    setShowModal(false);
    navigate('/tournaments');
  };

  return (
    <div className="flex flex-col gap-10 w-full">
      <div className="flex justify-center mt-4">
        <button onClick={startTournament} className="bg-primary hover:bg-secondary text-2xl text-white font-bold py-2 px-4 border-b-4 border-secondary hover:border-tertiary rounded">Start Tournament</button>
      </div>
      <div className="flex justify-center gap-20 mt-6">
        <div className="bg-gray-900 text-white rounded-lg p-6">
          <h3 className="text-2xl font-semibold mb-6 text-center text-green-400">Matchs</h3>
          <ul>
            {brackets[currentRound - 1]?.map((match, matchIndex) => (
              <li key={matchIndex} className="flex justify-between items-center p-2 bg-gray-800 rounded-lg mb-2">
                <span className="text-lg font-semibold">{match[0] ? match[0].username : 'Bye'}</span>
                <input
                  type="number"
                  min="0"
                  max="3"
                  value={scores[matchIndex] ? scores[matchIndex][0] : ''}
                  onChange={(e) => handleScoreChange(e, matchIndex, 0)}
                  className="w-16 p-1 text-black rounded"
                  disabled={!match[0]}
                />
                <span className="text-sm text-green-400">vs</span>
                <input
                  type="number"
                  min="0"
                  max="3"
                  value={scores[matchIndex] ? scores[matchIndex][1] : ''}
                  onChange={(e) => handleScoreChange(e, matchIndex, 1)}
                  className="w-16 p-1 text-black rounded"
                  disabled={!match[1]}
                />
                <span className="text-lg font-semibold">{match[1] ? match[1].username : 'Bye'}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-gray-900 text-white rounded-lg p-6">
          <h3 className="text-2xl font-semibold mb-6 text-center text-green-400">Résultats</h3>
          <div className="flex flex-col justify-center items-center h-full">
            {winner ? (
              <span className="text-xl text-gray-500">{winner.username} a gagné</span>
            ) : (
              results.map((result, roundIndex) => (
                <div key={roundIndex} className="mb-4">
                  <h4 className="text-lg font-semibold text-green-400">Tour {result.round}</h4>
                  <ul>
                    {result.matches.map((match, matchIndex) => (
                      <li key={matchIndex} className="flex justify-between items-center p-2 bg-gray-800 rounded-lg mb-2">
                        <span>{match.player1 ? match.player1.username : 'Bye'}: {match.player1Score}</span>
                        <span className="text-sm text-green-400">vs</span>
                        <span>{match.player2 ? match.player2.username : 'Bye'}: {match.player2Score}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-10 mt-6">
        <button onClick={nextRound} className="bg-primary hover:bg-secondary text-2xl text-white font-bold py-2 px-4 border-b-4 border-secondary hover:border-tertiary rounded">Tour suivant</button>
        <button onClick={() => setShowModal(true)} className="bg-primary hover:bg-secondary text-2xl text-white font-bold py-2 px-4 border-b-4 border-secondary hover:border-tertiary rounded">Finir le tournoi</button>
      </div>
      <ModalBracket showModal={showModal} setShowModal={setShowModal} endTournament={endTournament}></ModalBracket>
    </div>
  );
};

export default BracketGenerator;
