import { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function OAuthCallbackPage() {
  const router = useRouter();
  useEffect(() => {
    const { code } = router.query;

    if (code) {
      // Exchange the code for an access token using the POST request
      axios.post('/auth/oauth-token', { code })
        .then(response => {
          console.log('Access Token:', response.data);
        })
        .catch(error => {
          console.error('Error exchanging code for token:', error);
        });
    }
  }, [router.query]);

  return (
    <div>
      <p>Handling OAuth callback...</p>
    </div>
  );
}