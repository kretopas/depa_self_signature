import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { auth } from './auth.module';

export default createStore({
    state: {},
    getters: {
        accessToken: (state) => {
            return state.accessToken;
        },
        //refreshToken: (state) => {
        //    return state.refreshToken
        //},
        isLoggedIn: (state) => {
            return state.isLoggedIn
        }
    },
    mutations: {
        accessToken(state, accessToken) {
            state.user = accessToken;
        },
        //refreshToken(state, refreshToken) {
        //    state.refreshToken = refreshToken;
        //},
        isLoggedIn(state, isLoggedIn) {
            state.isLoggedIn = isLoggedIn;
        }
    },
    actions: {
        accessToken(context, accessToken) {
            context.commit('accessToken', accessToken);
        },
        //refreshToken(context, refreshToken) {
        //    context.commit('refreshToken', refreshToken);
        //},
        isLoggedIn(context, isLoggedIn) {
            context.commit('isLoggedIn', isLoggedIn);
        }
    },
    modules: {
        auth
    },
    plugins: [
        createPersistedState()
    ]
})