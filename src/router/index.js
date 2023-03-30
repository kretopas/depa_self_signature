import { createRouter, createWebHistory } from 'vue-router'
import SigningPage from '../views/SigningPage.vue'
import LoginPage from '../views/LoginPage.vue'

const routes = [{
        path: '/',
        name: 'signingPage',
        component: SigningPage,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/login',
        name: 'login',
        component: LoginPage,
        meta: {
            requiresGuest: true
        }
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some((x) => x.meta.requiresAuth);
    const requiresGuest = to.matched.some((x) => x.meta.requiresGuest);
    // const isLoggedIn = store.getters.isLoggedIn;
    const currentUser = localStorage.getItem('user');
    if (requiresAuth && !currentUser) {
        next({ name: 'login' });
    } else if (requiresGuest && currentUser) {
        next({ name: 'signingPage' });
    } else {
        next();
    }
})

export default router