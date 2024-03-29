import axiosInstance from './api';
import TokenService from './token.service';

const setup = (store) => {
    axiosInstance.interceptors.request.use(
        (config) => {
            const token = TokenService.getLocalAccessToken();
            if (token) {
                config.headers["Authorization"] = 'Bearer ' + token;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    )
    axiosInstance.interceptors.response.use(
        (res) => {
            return res;
        },
        async(err) => {
            const originalConfig = err.config;
            if (originalConfig.url !== "/login" && err.response) {
                if (err.response.status === 403 && !originalConfig._retry) {
                    originalConfig._retry = true;
                    try {
                        const rs = await axiosInstance.post("/refresh", {
                            token: TokenService.getLocalRefreshToken(),
                        });
                        const { access_token } = rs.data;
                        store.dispatch('auth/refreshToken', access_token);
                        TokenService.updateLocalAccesstoken(access_token);
                        return axiosInstance(originalConfig);
                    } catch (_error) {
                        return Promise.reject(_error);
                    }
                }
            }
            return Promise.reject(err);
        }
    );
};

export default setup;