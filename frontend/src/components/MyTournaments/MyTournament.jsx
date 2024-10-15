import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import SmallCards from '@components/SmallCards/SmallCards';

export default function MyTournament() {

    const [inscription, setInscription] = useState([]);
    const [creation, setCreation] = useState([]);
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
            console.error("Invalid token:", error);
            return null;
          }
        }
        return null;
      };
    
      const userInfo = getUserInfo();

      useEffect(() => {
        if (!token || !userInfo) {
          navigate('/login');
        } else {
          fetchDataInscription();
          fetchDataCreation();
        }
      }, [token, userInfo, navigate]);

      const fetchDataInscription = async () => {
        if (token) {
          try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/registered-tournaments/${userInfo.sub.id}`, {
              headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`,
              },
            });
          
            setInscription(res.data);
          } catch (error) {
            console.error("erreur lors de la récupération des données:", error);
          }
        }else{
          console.error('Token non disponible');
        }
      };

      const fetchDataCreation = async () => {
        if (token) {
          try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/created-tournaments/${userInfo.sub.id}`, {
              headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`,
              },
            });
            setCreation(res.data);
          } catch (error) {
            console.error('erreur lors de la récupération des données:', error);
          }
        } else {
          console.error('Token non disponible');
        }
      };
    
      return (
        <div>
            <div className="flex flex-col items-center sm:max-w-md md:max-w-xl lg:max-w-4xl mt- mb-24 pb-4 sm:pb-6 md:pb-10 lg:pb-14 mx-auto bg-no-repeat bg-bottom bg-underline-title bg-contain ">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white ">Mes Tournois</h1>
            </div>
            <section className="max-w-7xl mx-auto">
                <article className="mt-8">
                    <h2 className="text-3xl text-white">Tournois effectués :</h2>
                    <div className="flex flex-wrap items-center justify-evenly">
                        {inscription.length === 0 ? (
                            <p className="text-white">Pas de tournois</p>
                        ) : (
                            inscription.map((tournament, index) => (
                                <SmallCards tournament={tournament} index={index} />
                            ))
                        )}
                    </div>
                </article>
                <article className="mt-8">
                    <h2 className="text-3xl text-white">Tournois créés :</h2>
                    <div className="flex flex-wrap items-center justify-evenly">
                        {creation.length === 0 ? (
                            <p className="text-white">Pas de tournois</p>
                        ) : (
                            creation.map((tournament, index) => (
                                <SmallCards tournament={tournament} index={index} />
                            ))
                        )}
                    </div>
                </article>
            </section>
        </div>
    );
}