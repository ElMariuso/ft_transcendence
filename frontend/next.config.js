// /** @type {import('next').NextConfig} */
// const nextConfig = {}

// module.exports = nextConfig

module.exports = {
    async rewrites() {
      return [
        {
          source: '/api/auth/start-oauth',
          destination: 'http://backend-dev:3000/auth/start-oauth',
        },
		{
			source: '/token/auth/oauth-token',
			destination: 'http://localhost:3000/auth/oauth-token',
		},
      ];
    },
  };