import { useState, useEffect } from 'react';

export const useCookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isAccepted = localStorage.getItem('cookieConsent');
    if (!isAccepted) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  return {
    isVisible,
    acceptCookies
  };
};
