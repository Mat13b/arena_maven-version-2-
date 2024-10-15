import React, { useState, useEffect } from 'react';
import axios from 'axios';
import img from '@assets/iconProfile.jpg';

function ProfileCreation() {
  const [user, setUser] = useState({
    nom_utilisateur: '',
    adresse_email: '',
    major: '',
    mot_de_passe: '',
    presentation: '',
    role: '',
    langue: '',
    fuseau_horaire: '',
    niveau: '',
    localisation_geographique: '',
    mode_de_jeu_prefere: '',
    genre_de_jeu: '',
    type_d_evenement_prefere: '',
    parametres_de_confidentialite: '',
    date_de_creation_du_compte: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user`);
        setUser(response.data);
        console.log('user', response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bigShouldersDisplay text-white p-4">
      <div className="relative flex flex-col items-center w-full max-w-4xl sm:max-w-5xl md:max-w-6xl lg:max-w-7xl xl:max-w-8xl">
        <article className="flex flex-col items-center absolute -mt-20">
          <h1 className="text-4xl text-black mb-10">Information du compte</h1>
        </article>
        <div className="flex flex-col md:flex-row gap-4 md:gap-20">
          <div className="p-7 rounded-lg bg-black flex flex-col items-center w-full md:w-1/3">
            <h1>Informations personnelles</h1>
            <p>Nom d'utilisateur: {user.nom_utilisateur}</p>
            <hr className="w-full bg-white" />
            <p>Email: {user.adresse_email}</p>
            <hr className="w-full bg-white" />
            <p>Major: {user.major}</p>
            <hr className="w-full bg-white" />
            <p>Mot de passe: {user.mot_de_passe}</p>
            <hr className="w-full bg-white" />
            <p>Texte de présentation: {user.presentation}</p>
            <hr className="w-full bg-white" />
            <p>Rôle: {user.role}</p>
            <hr className="w-full bg-white" />
          </div>
          <div className="p-7 rounded-lg bg-black flex flex-col items-center w-full md:w-1/3">
            <h1>Préférence de jeu</h1>
            <p>Langue: {user.langue}</p>
            <hr className="w-full bg-white" />
            <p>Fuseau horaire: {user.fuseau_horaire}</p>
            <hr className="w-full bg-white" />
            <p>Niveau: {user.niveau}</p>
            <hr className="w-full bg-white" />
            <p>Localisation géographique: {user.localisation_geographique}</p>
            <hr className="w-full bg-white" />
            <p>Mode de jeu préféré: {user.mode_de_jeu_prefere}</p>
            <hr className="w-full bg-white" />
            <p>Genre de jeu: {user.genre_de_jeu}</p>
            <hr className="w-full bg-white" />
            <p>Type d'événement préféré: {user.type_d_evenement_prefere}</p>
            <hr className="w-full bg-white" />
            <p>Paramètres de confidentialité: {user.parametres_de_confidentialite}</p>
            <hr className="w-full bg-white" />
          </div>
          <div className="p-2 rounded-lg bg-black flex flex-col items-center w-full md:w-1/3">
            <h1>Informations personnelles</h1>
            <section>
              <p>Photo de profil</p>
              <img src={img} alt="Profile" />
              <h2>Date de création du compte: {user.date_de_creation_du_compte}</h2>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileCreation;
