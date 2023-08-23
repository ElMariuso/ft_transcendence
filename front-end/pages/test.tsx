import { useEffect } from 'react';
import { useRouter } from 'next/router';
import token from './../app/utils/token';

export default function testPage() {
	const router = useRouter();

	const getToken = async () => {
		const { code } = router.query;

		if (code) {
			const response = await token.post('/auth/oauth-token', { code })
			.then(response => { console.log('Access Token:', response.data); })
			.catch(error => { console.error('Error exchanging code for token:', error); });
		}
	}

	useEffect(() => {
		getToken();
	}, [router.query]);

	return (
		<div>
			<p>Generating auth token...</p>
		</div>
	);
}