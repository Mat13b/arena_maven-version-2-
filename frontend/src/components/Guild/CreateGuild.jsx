import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import ModalGuild from '@components/Modal/Modalguild';

export default function CreateGuild() {
  const [showModal, setShowModal] = useState(false);
  const [guildDetails, setGuildDetails] = useState(null);
  const navigate = useNavigate();

  
  const getToken = () => {
    return localStorage.getItem('token');
  };
  const token = getToken();
  
  const getUserInfo = () => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        return decodedToken; // { id, username, email, role }
      } catch (error) {
        console.error("Token invalide:", error);
        return null;
      }
    }
    return null;
  };
  const userInfo = getUserInfo();
  
  useEffect(() => {
    if (!token || !userInfo) {
      navigate('/login');
    }
  }, [token, navigate]);

  const formik = useFormik({
    initialValues: {
      nom: '',
      description: '',
      image: '',
    },
    validationSchema: Yup.object({
      nom: Yup.string().required('Requis'),
      description: Yup.string().required('Requis'),
      image: Yup.mixed().required('Requis'),
    }),
    onSubmit: async (values) => {
      console.log('Soumission du formulaire avec les valeurs:', values);

      const data = new FormData();
      data.append('nom', values.nom);
      data.append('description', values.description);
      data.append('image', values.image);

      // Récupérer et décoder le token pour obtenir l'ID de l'utilisateur


      let creatorId;
      try {
        // Décoder le token pour obtenir l'ID de l'utilisateur
        const tokenPayload = token.split('.')[1];
        const decodedToken = JSON.parse(atob(tokenPayload));
        creatorId = decodedToken.sub.id;
        if (!creatorId) {
          throw new Error('ID de l\'utilisateur non trouvé dans le token');
        }
      } catch (error) {
        console.error('Erreur lors du décodage du token:', error);
        return;
      }

      data.append('creator_id', creatorId);

      try {
        // Envoyer la requête POST pour créer la guilde
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/guild`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          },
        });
        console.log('Guild créée avec succès:', response.data);
        setGuildDetails(response.data); // Store guild details
        setShowModal(true); // Afficher la modal après la création réussie
      } catch (error) {
        console.error('Erreur lors de la création de la guilde:', error.response?.data || error.message);
      }
    },
  });

    // Fonction pour rejoindre une guilde
  const handleJoinGuild = async (guildId) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId'); // Récupérez l'ID de l'utilisateur depuis localStorage

      // Envoyez la requête POST pour rejoindre la guilde avec `userId` dans le corps
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/guild/${guildId}/join`, { id_utilisateur: userId }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Mettre à jour l'état ou effectuer d'autres actions après l'inscription
    } catch (error) {
      console.error('Erreur lors de la participation à la guilde:', error);
    }
  };

  return (
    <div>
      <form
        onSubmit={formik.handleSubmit}
        className="bg-primary rounded-xl m-5 p-5 max-w-3xl mx-auto flex flex-wrap justify-center items-center"
      >
        <div className="w-full m-2">
          <label htmlFor="name">Nom de la guilde</label>
          <input
            className="w-full bg-white p-1 rounded-md"
            type="text"
            id="name"
            name="name"
            placeholder="Name.."
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          {formik.touched.name && formik.errors.name ? (
            <div className="text-red-500">{formik.errors.name}</div>
          ) : null}
        </div>
        <div className="w-full m-2">
          <label htmlFor="description">Description de la guilde</label>
          <textarea
            className="w-full min-h-16 bg-white p-1 rounded-md"
            id="description"
            name="description"
            placeholder="Description.."
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
          />
          {formik.touched.description && formik.errors.description ? (
            <div className="text-red-500">{formik.errors.description}</div>
          ) : null}
        </div>
        <div className="w-full m-2">
          <label htmlFor="image">Image de la guilde</label>
          <input
            className="w-full"
            type="file"
            id="image"
            accept=".jpg, .jpeg, .png, .gif, .webp"
            name="image"
            onChange={(event) => {
              formik.setFieldValue('image', event.currentTarget.files[0]);
            }}
          />
          {formik.touched.image && formik.errors.image ? (
            <div className="text-red-500">{formik.errors.image}</div>
          ) : null}
        </div>
        <input
          className="bg-primary hover:bg-secondary text-2xl text-white font-bold py-2 px-4 border-b-4 border border-secondary hover:border-tertiary rounded"
          type="submit"
          value="Envoyer"
        />
        <ModalGuild showModal={showModal} setShowModal={setShowModal} guildDetails={guildDetails} />
      </form>
    </div>
  );
}