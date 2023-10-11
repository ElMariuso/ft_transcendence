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
import { useAuthenticationStore } from '../stores/AuthenticationStore'
import { useProfileStore } from '../stores/ProfileStore'

import HomeView from '../views/HomeView.vue';
import CommunityView from '../views/CommunityView.vue';
import ProfileView from '../views/ProfileView.vue';
import SettingsView from '../views/SettingsView.vue';

import { checkJWT } from '@/services/auth-helpers';

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
	const actualToken = localStorage.getItem('token');
	const urlParams = new URLSearchParams(window.location.search);
	const tokenInURL = urlParams.get('token');

	if (tokenInURL) {
		// Scenario 1: Token in URL
		localStorage.setItem('token', tokenInURL);
    	authStore.login();
    	window.history.replaceState({}, document.title, window.location.pathname);
    	return next({ name: 'home' });
	}

	if (actualToken) {
		// Scenario 2: Token in localStorage
		checkJWT(actualToken, profileStore).then(isTokenValid => {
			if (isTokenValid) {
			  authStore.login();
			  next();
			} else {
			  authStore.logout();
			  next({ name: 'home' });
			}
		  });
	} else if (to.meta.requiresAuth && !authStore.isAuthenticated) {
		// Scenario 3: Route requires authentication but user is not authenticated
		next({ name: 'home' });
	} else {
		next();
	}
})

// Export the router for use in the Vue application
export default router

