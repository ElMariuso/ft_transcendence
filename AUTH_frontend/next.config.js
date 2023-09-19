// // /** @type {import('next').NextConfig} */
// // const nextConfig = {}

// // module.exports = nextConfig

// backend = "backend-" + process.env.MODE
// module.exports = {
//     async rewrites() {
// 	console.log(backend)
//       return [
//         {
//           source: '/api/auth/start-oauth',
//           destination: `http://${backend}:3000/auth/start-oauth`,
//         },
// 		{
// 			source: '/token/auth/oauth-token',
// 			destination: `http://${backend}:3000/auth/oauth-token`,
// 		},
//       ];
//     },
//   };

/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true,
  // swcMinify: true,
};