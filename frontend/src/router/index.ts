/**
 * Vue Router
 *
 * This module initializes and exports the Vue Router instance for the application,
 * defining the available routes and any route guards or hooks.
 *
 * Routes are defined with associated components. A navigation guard (`beforeEach`)
 * is implemented to manage the authentication status in various scenarios:
 * - If a JWT token is present in the URL, it is stored in localStorage and 
 *   the user is authenticated.
 * - If a JWT token is present in localStorage, its validity is checked. If valid, 
 *   the user remains authenticated, otherwise, the user is logged out.
 * - Routes that require authentication are protected and redirect unauthenticated 
 *   users to the home page.
*/
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthenticationStore } from '@/stores/AuthenticationStore'
import { checkJWT } from '@/services/auth-helpers';
import Cookies from 'js-cookie';

import HomeView from '@/views/HomeView.vue';
import IntroView from '@/views/IntroView.vue';
import LoginView from '../views/LoginView.vue';
import Login2faView from '../views/Login2faView.vue';
import CommunityView from '../views/CommunityView.vue';
import ProfileView from '../views/ProfileView.vue';
import OtherProfileView from '../views/OtherProfileView.vue';
import SettingsView from '../views/SettingsView.vue';
import GameView from '../views/GameView.vue';
import jwt_decode from 'jwt-decode';
import { JwtPayload } from "@/models/jwtPayload.model";

// Define the routes for the Vue application
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      	path: '/',
      	name: 'home',
      	component: HomeView,
		meta: { requiresAuth: true }
    },
    {
		path: '/intro',
		name: 'intro',
		component: IntroView,
		meta: { requiresAuth: true }
  },
	{
		path: '/login',
		name: 'login',
		component: LoginView
	},
    {
      	path: '/login2fa',
      	name: 'login2fa',
      	component: Login2faView
    },
    {
      	path: '/community',
      	name: 'community',
      	component: CommunityView,
		meta: { requiresAuth: true }
    },
    {
      	path: '/profile/id=:id',
      	name: 'profile',
      	component: ProfileView,
		meta: { requiresAuth: true }
    },
	{
		path: '/otherprofile/id=:id',
		name: 'otherprofile',
		component: OtherProfileView,
		meta: { requiresAuth: true }
	},
    {
      	path: '/settings',
      	name: 'settings',
      	component: SettingsView,
		meta: { requiresAuth: true }
    },
	{
		path: '/game/:roomId',
		name: 'game',
		component: GameView,
		props: true
	}
  ]
})

/**
 * Navigation Guard: `beforeEach`
 * 
 * The `beforeEach` navigation guard manages user authentication by evaluating
 * the presence and validity of a JWT token in either the URL or localStorage.
 *
 * Scenarios:
 * 1. If a token is present in the URL, it is stored, and the user is authenticated and redirected to 'home'.
 * 2. If a token is present in localStorage, its validity is checked via `checkJWT()`.
 *    - If valid: The user's authentication state is persisted.
 *    - If invalid: The user is logged out and the token is removed.
 * 3. If attempting to access a route that requires authentication without being authenticated, 
 *    redirect to 'home'.
 * 
 * The guard also ensures that users are redirected appropriately based on their authentication state and 
 * the route they are attempting to access.
 */

router.beforeEach((to, from, next) => {
	const authStore = useAuthenticationStore();

	checkJWT(authStore).then(status => {
		if ((to.name === 'login' || to.name === 'login2fa') && authStore.isAuthenticated)
			return next({ name: 'home' });

		else if (to.name === 'login' && to.query.code !== undefined && to.query.code !== null) {
			Cookies.set('token', to.query.code.toString(), { expires: 7 });
			
			const token: any = Cookies.get('token');
			const decodedToken: JwtPayload = jwt_decode(token);
			const twoFactorAuthEnabled: any = decodedToken.twoFactorAuthEnabled;

			if (twoFactorAuthEnabled) {
				return next({ name: 'login2fa' });
			}
			return next({ name: 'home' });
		}
				
		// Guards all views if not authenticated
		else if (to.matched.some(record => record.meta.requiresAuth) && !authStore.isAuthenticated) {
			return next({ name: 'login'});
		}

		next();
	});
})

// Export the router for use in the Vue application
export default router