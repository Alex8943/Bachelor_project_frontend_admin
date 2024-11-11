// RolesContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getRoles } from '../../service/apiclient';

const RolesContext = createContext([]);

export const RolesProvider = ({ children }) => {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData = await getRoles();
        setRoles(rolesData);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    fetchRoles();
  }, []);

  return (
    <RolesContext.Provider value={roles}>
      {children}
    </RolesContext.Provider>
  );
};

export const useRoles = () => useContext(RolesContext);
