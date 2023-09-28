
import { createRouter, createWebHistory } from 'vue-router';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import CommunityView from '../views/CommunityView.vue';
import ProfileView from '../views/ProfileView.vue';
import ProfileSetupView from '../views/ProfileSetupView.vue';

import AboutView from '../views/AboutView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: AboutView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
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
      path: '/profileSetup',
      name: 'profileSetup',
      component: ProfileSetupView
    }
  ]
})

async function checkJWT() {
	const status = {
		isAuthenticated: false,
		jwtValid: false,
		profileSetupCompleted: false,
	}

	const token = localStorage.getItem('token')
  	status.isAuthenticated = (token !== null)
	if (token) {
		// Handle 2FA
		const TwoFactorAuthEnabled = jwt_decode(token).TwoFactorAuthEnabled;
		if (TwoFactorAuthEnabled) {
			await axios.get('/auth/jwt/verify', {
				headers: {
					Authorization: 'Bearer ' + token
				}
			}).then(res => {
				status.jwtValid = res.data;
			});
			if (status.jwtValid)
				console.log(status.jwtValid)
			// redirect to auth/2fa
			// get a new jwt token
		}
		return status
	}
	return status;
}

router.beforeEach((to, from, next) => {

	
	checkJWT().then(Status => {
		// Detects if a token exists and verifies it + checks if 2fa enabled
		if (to.name === 'login' && to.query.code !== undefined) {
			localStorage.setItem('token', to.query.code.toString());
			axios.defaults.headers.common['Authorization'] = 'Bearer ' + to.query.code.toString();
			
			const jwtDecoded = jwt_decode(to.query.code.toString())
			const TwoFactorAuthEnabled = jwtDecoded['TwoFactorAuthEnabled'];
			
			if (TwoFactorAuthEnabled) {
				return next({ name: '2fa' });
			}
		
			return next({ name: 'home' });
		}
		
		// Guards all views if not authenticated
		else if (to.name !== 'login' && !Status.isAuthenticated) {
			return next({ name: 'login'});
		}

		next();
	});
})

export default router

