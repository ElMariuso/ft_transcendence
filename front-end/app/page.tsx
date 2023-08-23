"use client";

import { useEffect } from 'react';
import api from './utils/api';

export default function Home() {
	
  const startOAuthFlow = async () => {
    try {
      const response = await api.get('/auth/start-oauth');
      console.log('Authorization URL:', response.data.authorizationUrl);
      window.location.href = response.data.authorizationUrl;
    } catch (error) {
      console.error('Error starting OAuth flow:', error);
    }
  };

  useEffect(() => {
    startOAuthFlow();
  }, []);

  return (
    <div>
      <p>Starting OAuth flow...</p>
    </div>
  );
}
