import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import Header from './components/Header/Header.jsx';
import Footer from '@components/Footer/Footer';
import Homepage from '@components/Homepage/Homepage';
import Contact from '@components/Contact/Contact';
import Page404 from '@components/Page404/Page404';
import BracketGenerator from './utils/BracketGen';
import TournamentList from './components/Tournament/TournamentList/TournamentList';
import MyTournament from '@components/MyTournaments/MyTournament.jsx';
import TournamentRegister from "@components/Tournament/TournamentRegister/TournamentRegister.jsx";
import TournamentRequest from '@components/Tournament/TournamentRequest/TournamentRequest.jsx';
import AboutUs from "@components/AboutUs/AboutUs.jsx";
import Winner from "./utils/Winner.jsx";
import Register from "./components/Account/Register/Register";
import Login from "./components/Account/Login/Login.jsx";
import CreateGuildPage from "./components/Guild/CreateGuildPage";
import Cards from './components/Cards/Cards';
import Profil from './components/Profil/Profil';
import GuildList from './components/Guild/GuildList';
import PrivateRoutes from './utils/PrivatesRoute.jsx';

import './App.css';

import { jwtDecode } from 'jwt-decode';
import ProfileCreation from '@components/Account/ProfileCreation/ProfileCreation';
import AuthProvider, { AuthContext } from './components/Account/Login/AuthProvider';
import React, { useContext } from 'react';

import LoadingUser from '@components/LoadingUser/LoadingUser.jsx';

const App = () => {
  return (
    <div className="bg-gradient-to-tr from-black via-vertBG to-black min-h-screen flex flex-col">
      <Router>
        <AuthProvider>
          <Routes>
            {/* Routes publiques */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Routes privées */}
            <Route element={<PrivateRoutes />}>
              <Route element={<LayoutWithHeaderFooter />}>
                <Route path="/" element={<Homepage />} />
                <Route path="/tournamentRequest" element={<TournamentRequest />} />
                <Route path="/tournament-register/:tournamentId" element={<TournamentRegister />} />
                <Route path="/decouvrir" element={<TournamentList />} />
                <Route path="/mes-tournois" element={<MyTournament />} />
                <Route path="/profile" element={<ProfileCreation />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/create-guild" element={<CreateGuildPage />} />
                <Route path="/guilds" element={<GuildList />} />
                <Route path="/winner" element={<Winner />} />
                <Route path="/tournament/:id/winner" element={<Winner />} />
              </Route>
            </Route>

            {/* Route sans Header et Footer */}
            <Route path="*" element={<Page404 />} />
            <Route path="/loading" element={<LoadingUser />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
};

// Composant AuthStatus modifié pour gérer le cas où user est null
const AuthStatus = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const token = localStorage.getItem('token');

  return (
    <div className="text-white text-center py-2 bg-black">
      Status: {isAuthenticated || token ? 'Connecté' : 'Non connecté'}
      {user && user.username && ` - Utilisateur: ${user.username}`}
    </div>
  );
};

// Layout pour les routes privées
const PrivateLayout = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const token = localStorage.getItem('token');

  if (!isAuthenticated && !token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Header />
      <AuthStatus />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </>
  );
};

// Layout Component with Header and Footer
const LayoutWithHeaderFooter = () => (
  <>
    <Header />
    <AuthStatus />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </>
);

export default App;
