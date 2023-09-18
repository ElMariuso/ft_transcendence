import { useRouter } from 'next/router';

export default function ProfilePage() {
  const router = useRouter();
  const accessToken = router.query.access_token || '';

  return (
    <div>
      <p>Profile</p>
      {accessToken && (
        <div>
          <p>Access Token: {accessToken}</p>
          {/* Now you can use the access token for authenticated API requests */}
        </div>
      )}
    </div>
  );
}