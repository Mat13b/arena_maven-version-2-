import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import ModalCreaTournament from '@components/Modals/ModalCreaTournament/ModalCreaTournament';
import { jwtDecode } from "jwt-decode";


export default function TournamentRequest() {
// Declaration of useState and useNavigate
const [showModal, setShowModal] = useState(false);
const navigate = useNavigate();

// Function to retrieve the token stored in local storage
const getToken = () => {
  return localStorage.getItem('token');
};
const token = getToken();

// Function to get user information from the token
const getUserInfo = () => {
  if (token) {
    try {
      const decodedToken = jwtDecode(token); // Use jwt-decode to get the info stored in the payload
      return decodedToken; // { id, username, email, role }
    } catch (error) {
      console.error("Token invalide:", error);
      return null;
    }
  }
  return null;
};
const userInfo = getUserInfo();

// Redirect if no token or token is invalid
useEffect(() => {
  if (!token || !userInfo) {
    navigate('/login');
  }
}, [token, navigate]);

// Initialize Formik for form handling and validation
const formik = useFormik({
  initialValues: {
    tname: '',
    tdate: '',
    nbPlayer: '2',
    tdescription: '',
    timage: null,
  },
  validationSchema: Yup.object({
    tname: Yup.string().required('Required'),
    tdate: Yup.date().required('Required'),
    nbPlayer: Yup.string().required('Required'),
    tdescription: Yup.string().required('Required'),
    timage: Yup.mixed().required('Required'),
  }),
  onSubmit: async (values) => {
    const userInfo = getUserInfo();
    const torganizer_id = userInfo ? userInfo.sub.id : null; // Use optional chaining to get the ID from user info
    console.log("torganizer_id", torganizer_id);

    const data = new FormData(); // Create a FormData object to send multipart/form-data
    data.append('tname', values.tname);
    data.append('tdate', values.tdate);
    data.append('nbPlayer', values.nbPlayer);
    data.append('tdescription', values.tdescription);
    data.append('timage', values.timage);
    data.append('torganizer_id', torganizer_id);

    console.log('Données envoyées:', {
      tname: values.tname,
      tdate: values.tdate,
      nbPlayer: values.nbPlayer,
      tdescription: values.tdescription,
      timage: values.timage,
      torganizer_id: torganizer_id,
    });

    if (token) {
      try {
        // Send a POST request to create a new tournament with the provided data
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/tournament`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
          },
        });
        console.log('Tournament created successfully:', response.data);
        setShowModal(true); // Show the modal on successful creation
      } catch (error) {
        console.error('Error creating tournament:', error); // Log error message if the request fails
      }
    } else {
      console.error('Token is not available'); // Log error message if the token is not available
    }
  },
});

  return (
    <div>
      <div className="flex flex-col items-center sm:max-w-md md:max-w-xl lg:max-w-4xl mt-10 pb-4 sm:pb-6 md:pb-10 lg:pb-14 mx-auto bg-no-repeat bg-bottom bg-underline-title bg-contain ">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white ">Créer un tournois</h1>
      </div>
      <section className="my-16 mx-4">
        <form
          onSubmit={formik.handleSubmit}
          className="bg-primary rounded-xl m-5 p-5 max-w-3xl mx-auto flex flex-wrap justify-center items-center"
        >
          <div className="w-full m-2">
            <label htmlFor="tname">Nom du tournois :</label>
            <input
              className="w-full bg-white text-black p-1 rounded-md"
              type="text"
              id="tname"
              name="tname"
              placeholder="Nom.."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.tname}
            />
            {formik.touched.tname && formik.errors.tname ? (
              <div className="text-warning">{formik.errors.tname}</div>
            ) : null}
          </div>
          <div className="w-full m-2">
            <label htmlFor="tdate">Date du tournois :</label>
            <input
              className="w-full bg-white text-black p-1 rounded-md"
              type="date"
              id="tdate"
              name="tdate"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.tdate}
            />
            {formik.touched.tdate && formik.errors.tdate ? (
              <div className="text-warning">{formik.errors.tdate}</div>
            ) : null}
          </div>
          <div className="w-full m-2">
            <label htmlFor="nbPlayer">Nombre de joueurs :</label>
            <select
              id="nbPlayer"
              name="nbPlayer"
              className=" bg-white text-black p-1 rounded-md"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.nbPlayer}
            >
              <option value="">Choisir le nombre de joueurs</option>
              <option value="2">2</option>
              <option value="4">4</option>
              <option value="8">8</option>
            </select>
            {formik.touched.nbPlayer && formik.errors.nbPlayer ? (
              <div className="text-warning">{formik.errors.nbPlayer}</div>
            ) : null}
          </div>
          <div className="w-full m-2">
            <label htmlFor="tdescription">Description :</label>
            <textarea
              className="w-full min-h-16 bg-white text-black p-1 rounded-md"
              id="tdescription"
              name="tdescription"
              placeholder="Description.."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.tdescription}
            />
            {formik.touched.tdescription && formik.errors.tdescription ? (
              <div className="text-warning">{formik.errors.tdescription}</div>
            ) : null}
          </div>
          <div className="w-full m-2">
            <label htmlFor="timage">Bannière du tournois :</label>
            <input
              className="w-full"
              type="file"
              id="timage"
              accept=".jpg, .jpeg, .png, .gif, .webp"
              name="timage"
              onChange={(event) => {
                formik.setFieldValue('timage', event.currentTarget.files[0]);
              }}
            />
            {formik.touched.timage && formik.errors.timage ? (
              <div className="text-warning">{formik.errors.timage}</div>
            ) : null}
          </div>
          <input
            className="bg-primary hover:bg-secondary text-2xl text-white font-bold py-2 px-4 border-b-4 border border-secondary hover:border-tertiary rounded"
            type="submit"
            value="Soumettre"
          />
          <ModalCreaTournament showModal={showModal} setShowModal={setShowModal} />
        </form>
      </section>
    </div>
  );
}
