// /** @type {import('next').NextConfig} */
// const nextConfig = {}

// module.exports = nextConfig

module.exports = {
    async rewrites() {
      return [
        {
          source: '/api/auth/start-oauth',
          destination: 'http://localhost:3000/auth/start-oauth', // Update with your backend's URL
        },
      ];
    },
  };