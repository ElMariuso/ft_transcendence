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
import { useProfileStore } from '@/stores/ProfileStore'
import { checkJWT } from '@/services/auth-helpers';

import HomeView from '@/views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import Login2faView from '../views/Login2faView.vue';
import CommunityView from '../views/CommunityView.vue';
import ProfileView from '../views/ProfileView.vue';
import SettingsView from '../views/SettingsView.vue';
import QRcodeView from '../views/QRcodeView.vue';

// Define the routes for the Vue application
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
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
      component: CommunityView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView
    },
    {
      path: '/QRcode/:id',
      name: 'QRcode',
      component: QRcodeView
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
	const profileStore = useProfileStore();

	checkJWT(authStore, profileStore).then(() => {
		if (to.name === 'login' && authStore.isAuthenticated)
			return next({ name: 'home' });
		else if (to.name === 'login' && to.query.code !== undefined) {
			localStorage.setItem('token', to.query.code.toString());
			if (profileStore.twoFactorAuth)
				return next({ name: 'login2fa' });
			return next({ name: 'home' });
		}
				
		// Guards all views if not authenticated
		else if (to.name !== 'login' && !authStore.isAuthenticated)
			return next({ name: 'login'});
		next();
	});
	
	// } else if (to.meta.requiresAuth && !authStore.isAuthenticated) {
	// 	// Scenario 3: Route requires authentication but user is not authenticated
	// 	next({ name: 'home' });
	// } else {
	// 	next();
	// }
})

// Export the router for use in the Vue application
export default router