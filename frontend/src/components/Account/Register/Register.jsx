import React, { useState } from "react";
import axios from 'axios';

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";

const initialValues = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // State to manage success/error messages

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Fonction pour déterminer la couleur du label
  const getLabelColor = (errors, touched, fieldName) => {
    if (touched[fieldName] && errors[fieldName]) {
      return 'text-red-500'; // Rouge si le champ a une erreur
    } else if (touched[fieldName] && !errors[fieldName]) {
      return 'text-green-500'; // Vert si le champ est valide
    }
    return '';
  };

  // Fonction pour déterminer la couleur de la bordure du champ
  const getFieldBorderColor = (value, fieldName) => {
    if (value === "") {
      return 'border-red-500'; // Rouge si le champ est vide
    } else if (fieldName === "email" && value.includes("@") && value.includes(".")) {
      return 'border-green-500'; // Vert si l'email contient un @ et un point
    } else if (fieldName !== "email" && value !== "") {
      return 'border-green-500'; // Vert si le champ n'est pas vide
    }
    return '';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bigShouldersDisplay text-white p-4">
      <div className="relative flex flex-col items-center w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl">
        <article className="flex flex-col items-center absolute -mt-20">
          <h1 className="text-4xl text-black -mb-10">Création de compte</h1>
        </article>
      </div>
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl mt-10 bg-primary p-4">
        <Formik
          initialValues={initialValues}
          validationSchema={yup.object({
            username: yup.string().required("Un nom d'utilisateur est requis"),
            email: yup.string().email("Email invalide").required("L'email est requis"),
            password: yup
              .string()
              .min(8, "Le mot de passe doit contenir au moins 8 caractères")
              .required("Le mot de passe est requis"),
            confirmPassword: yup
              .string()
              .oneOf([yup.ref('password'), null], 'Les mots de passe ne correspondent pas')
              .required('La confirmation du mot de passe est requise'),
          })}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            if (values.password !== values.confirmPassword) {
              setSubmitStatus({ type: 'error', message: 'Les mots de passe ne correspondent pas' });
              return;
            }
            try {
              const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/register`, {
                username: values.username,
                email: values.email,
                password: values.password,
              });
              console.log('Utilisateur inscrit avec succès:', response.data);
              setSubmitStatus({ type: 'success', message: 'Inscription réussie! Vous pouvez maintenant vous connecter.' });
              resetForm();
            } catch (error) {
              console.error('Erreur lors de l\'inscription:', error);
              setSubmitStatus({ type: 'error', message: error.response?.data?.message || 'Erreur lors de l\'inscription. Veuillez réessayer.' });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ errors, touched, handleChange, handleBlur, values, isSubmitting }) => (
            <Form className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-3 mb-5 rounded-lg">
                <label htmlFor="username" className={`block mb-2 ${getLabelColor(errors, touched, 'username')}`}>
                  Nom d'utilisateur
                </label>
                <Field
                  name="username"
                  id="username"
                  placeholder="Entrez votre nom d'utilisateur"
                  className={`w-full p-2 text-black rounded-lg ${getFieldBorderColor(values.username, 'username')}`}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.username}
                />
                <ErrorMessage name="username" component="div" className="text-red-500" />
              </div>
              <div className="p-3 mb-5 rounded-lg">
                <label htmlFor="email" className={`block mb-2 ${getLabelColor(errors, touched, 'email')}`}>
                  Email
                </label>
                <Field
                  name="email"
                  id="email"
                  placeholder="Entrez votre email"
                  className={`w-full p-2 text-black rounded-lg ${getFieldBorderColor(values.email, 'email')}`}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                />
                <ErrorMessage name="email" component="div" className="text-red-500" />
              </div>
              <div className="p-3 mb-5 rounded-lg">
                <label htmlFor="password" className={`block mb-2 flex items-center ${getLabelColor(errors, touched, 'password')}`}>
                  Mot de passe
                </label>
                <Field
                  name="password"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Entrez votre mot de passe"
                  className={`w-full p-2 text-black rounded-lg ${getFieldBorderColor(values.password, 'password')}`}
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
                  className="w-7 ml-2 cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
                <ErrorMessage name="password" component="div" className="text-red-500" />
              </div>
              <div className="p-3 mb-5 rounded-lg">
                <label htmlFor="confirmPassword" className={`block mb-2 ${getLabelColor(errors, touched, 'confirmPassword')}`}>
                  Confirmer le mot de passe
                </label>
                <Field
                  name="confirmPassword"
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirmez votre mot de passe"
                  className={`w-full p-2 text-black rounded-lg ${getFieldBorderColor(values.confirmPassword, 'confirmPassword')}`}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.confirmPassword}
                />
                <ErrorMessage name="confirmPassword" component="div" className="text-red-500" />
              </div>
              <div className="col-span-2 flex justify-center">
                <button
                  type="submit"
                  className="bg-black p-2 w-full text-white rounded-lg"
                  disabled={isSubmitting}
                >
                  Envoyer
                </button>
              </div>
            </Form>
          )}
        </Formik>
        {submitStatus && (
          <div className={`text-center mt-4 p-2 ${submitStatus.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
            {submitStatus.message}
          </div>
        )}
      </div>
    </div>
  );
}

export default Register
