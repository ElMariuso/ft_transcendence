// page.tsx 
import Image from 'next/image'

// export default function Home() {
//   return (
//     <main className="flex min-h-screen flex-col items-center justify-between p-24">
//     </main>
//   )
// }

"use client";
import { useEffect } from 'react';
import api from './utils/api';
import axios from 'axios';

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
