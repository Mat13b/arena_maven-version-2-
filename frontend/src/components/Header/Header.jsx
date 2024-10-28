import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../Account/Login/AuthProvider";
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import iconProfile from '../../assets/iconProfile.jpg';
import headerVector from '../../assets/headerVector.svg';
import logout from '../../components/Account/Login/logout.jsx';

const navigation = [
  { name: 'Accueil', href: '/', current: true },
  { name: 'Découvrir', href: '/decouvrir', current: false },
  { name: 'Mes tournois', href: '/mes-tournois', current: false },
  { name: 'Contact', href: '/contact', current: false },
  { name: 'Créer une guilde', href: '/create-guild', current: false },
  { name: 'Guildes', href: '/guilds', current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Header() {
  const { userData, isAuthenticated, handleLogout } = useContext(AuthContext);

  const navigate = useNavigate();

  return (
    <Disclosure as="nav" className="bg-opacity-0">
      {({ open }) => (
        <>
          <div className="mx-auto">
            <div className="relative flex h-20 items-center justify-between">
              {/* On cache le bouton burger si l'utilisateur est connecté */}
              <div className={`absolute inset-y-0 left-0 flex items-center ${isAuthenticated ? 'hidden' : 'bp1000:hidden'}`}>
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-primary hover:text-white focus:outline-none">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Ouvrir le menu principal</span>
                  {open ? (
                    <XMarkIcon className="block h-12 w-12" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-12 w-12" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>

              {/* Navigation buttons - toujours visible si connecté */}
              <div className="flex flex-1 items-center justify-center bp1000:justify-center">
                <div className={`${isAuthenticated ? 'block' : 'hidden bp1000:block'}`}>
                  <div className="flex space-x-4 mx-auto">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          item.current ? 'bg-primary text-white' : 'text-white hover:bg-53B84A hover:text-white',
                          'relative rounded-md px-3 py-2 text-sm font-medium before:ease overflow-hidden text-white shadow-2xl transition-all before:absolute before:top-1/2 before:h-0 before:w-64 before:origin-center before:-translate-x-20 before:rotate-45 before:bg-primary before:duration-300 hover:text-white hover:shadow-[0_4px_6px_-1px_rgba(83,184,74,1),0_2px_4px_-2px_rgba(83,184,74,1)] hover:before:h-64 hover:before:-translate-y-32'
                        )}
                        data-text={item.name}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        <span className="relative z-10 text-3xl">{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Header Vector */}
              <div className="absolute right-0 top-0 mt-0" style={{ transform: 'translateY(-15%)' }}>
                <img src={headerVector} alt="Header Vector" className="h-auto w-auto" />
              </div>

              <div className="absolute inset-y-0 right-0 flex items-center pr-2 bp1000:static bp1000:inset-auto bp1000:ml-6 bp1000:pr-0">
                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="relative flex rounded-full text-sm focus:outline-none">
                      <span className="absolute" />
                      <span className="sr-only">Ouvrir le menu utilisateur</span>
                      <img
                        className="h-10 w-10 rounded-full -translate-x-14 -translate-y-3"
                        src={iconProfile}
                        alt=""
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/profil"
                            className={classNames(active ? 'bg-primary' : '', 'block px-4 py-2 text-sm text-black hover:text-white')}
                          >
                            Votre Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/logout"
                            className={classNames(active ? 'bg-primary' : '', 'block px-4 py-2 text-sm text-black hover:text-white')}
                          >
                           Deconnexion
                          </Link>
                        )}
                      </Menu.Item>
                      {!isAuthenticated && (
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/login"
                              className={classNames(
                                active ? "bg-primary" : "",
                                "block px-4 py-2 text-sm text-black hover:text-white"
                              )}
                            >
                              Connexion
                            </Link>
                          )}
                        </Menu.Item>
                      )}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          {/* Mobile navigation - caché si connecté */}
          {!isAuthenticated && (
            <Disclosure.Panel className="bp1000:hidden min-[320px]">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as={Link}
                    to={item.href}
                    className={classNames(
                      item.current ? 'bg-primary text-white' : 'text-white hover:bg-primary hover:text-white',
                      'block rounded-md px-3 py-2 text-base font-medium glitch-btn'
                    )}
                    data-text={item.name}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </Disclosure.Panel>
          )}
        </>
      )}
    </Disclosure>
  );
}
