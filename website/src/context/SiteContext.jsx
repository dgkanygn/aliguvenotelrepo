import { createContext, useContext, useState, useEffect } from 'react';
import { fetchCompanyContacts } from '../services/api';

const SiteContext = createContext();

export const SiteProvider = ({ children }) => {
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getContactData = async () => {
      try {
        const data = await fetchCompanyContacts();
        setContactData(data);
      } catch (error) {
        console.error('SiteContext contact data fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    getContactData();
  }, []);

  return (
    <SiteContext.Provider value={{ contactData, loading }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSiteContext = () => {
  return useContext(SiteContext);
};
