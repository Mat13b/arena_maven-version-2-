import React, { useState, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";

import { Link, useNavigate } from "react-router-dom";

import axios from "axios";
import { AuthContext } from "./AuthProvider";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const { login, isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (values, { setSubmitting, setFieldError, resetForm }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/login`,
        {
          email: values.adresse_email,
          mot_de_passe: values.mot_de_passe,
        }
      );
      console.log("Utilisateur connecté avec succès:", response.data);
      setSubmitStatus({ type: 'success', message: 'Connexion réussie!' });
      resetForm();
      localStorage.setItem("token", response.data.token);
      console.log("Données de la réponse:", response.data);

      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        
        // Décodage du token pour obtenir les informations de l'utilisateur
        const tokenPayload = JSON.parse(atob(response.data.token.split('.')[1]));
        const userData = tokenPayload.sub;
      
        if (userData && userData.email) {
          login(userData);
          setSubmitStatus({ type: 'success', message: 'Connexion réussie!' });
          navigate('/');
        } else {
          console.warn('Données utilisateur incomplètes dans le token');
          setSubmitStatus({ type: 'error', message: 'Erreur lors de la connexion. Veuillez réessayer.' });
        }
      } else {
        console.warn('Structure de la réponse invalide:', JSON.stringify(response.data, null, 2));
        setSubmitStatus({ type: 'error', message: 'Erreur lors de la connexion. Veuillez réessayer.' });
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      if (error.response) {
        if (error.response.status === 401) {
          setFieldError("adresse_email", "Adresse email ou mot de passe incorrect");
          setFieldError("mot_de_passe", "Adresse email ou mot de passe incorrect");
        } else if (error.response.status === 500) {
          setSubmitStatus({ type: 'error', message: 'Erreur serveur. Veuillez réessayer plus tard.' });
        } else {
          setSubmitStatus({ type: 'error', message: 'Erreur lors de la connexion. Veuillez réessayer.' });
        }
      } else {
        setSubmitStatus({ type: 'error', message: 'Erreur réseau. Veuillez vérifier votre connexion.' });
      }
    }
    setSubmitting(false);
  };

  if (isAuthenticated) {
    return (
      <div>
        <p>Bienvenue, {user.name}</p>
        <button onClick={() => navigate('/dashboard')}>Aller au tableau de bord</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bigShouldersDisplay text-white p-4">
      <div className="relative flex flex-col items-center w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl">
        <article className="flex flex-col items-center absolute -mt-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl text-black -mb-10">
            Se connecter
          </h1>
        </article>
      </div>
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl mt-10 bg-primary mt-20">
        <article className="p-6">
          <Formik
            initialValues={{ adresse_email: "", mot_de_passe: "" }}
            validationSchema={yup.object().shape({
              adresse_email: yup
                .string()
                .email("Email invalide")
                .required("L'adresse email est requise"),
              mot_de_passe: yup
                .string()
                .min(
                  8,
                  "Le mot de passe doit contenir au moins 8 caractères"
                )
                .required("Le mot de passe est requis"),
            })}
            onSubmit={handleLogin}
          >
            {({ handleChange, handleBlur, values, isSubmitting }) => (
              <Form>
                <div className="p-3 mb-5 rounded-lg">
                  <label htmlFor="email" className="block mb-2">
                    Adresse email
                  </label>
                  <Field
                    name="adresse_email"
                    id="adresse_email"
                    placeholder="Entrez votre adresse email"
                    className="w-full p-2 text-black rounded-lg"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.adresse_email}
                  />
                  <ErrorMessage
                    name="adresse_email"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                <div className="p-3 mb-5 rounded-lg">
                  <label htmlFor="password" className="block mb-2">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Field
                      name="password"
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Entrez votre mot de passe"
                      className="w-full p-2 text-black rounded-lg"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="absolute right-2 top-2 w-7 bg-black cursor-pointer"
                      onClick={togglePasswordVisibility}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                    <label
                      htmlFor="password"
                      className="text-white flex justify-end underline"
                    >
                      Mot de passe oublié
                    </label>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-danger"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-black text-white p-2 w-full rounded-lg"
                  disabled={isSubmitting}
                >
                  Envoyer
                </button>

                <Link
                  to="/Register"
                  className="text-white underline flex justify-center mt-4"
                >
                  Vous n'avez pas de compte ? Inscrivez-vous
                </Link>
              </Form>
            )}
          </Formik>
          {submitStatus && (
            <div className={`text-center mt-4 p-2 ${submitStatus.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
              {submitStatus.message}
            </div>
          )}
        </article>
      </div>
    </div>
  );
}

export default Login;