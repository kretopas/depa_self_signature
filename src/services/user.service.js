import axios from "axios";
import authHeader from './auth-header';

class UserService {
    getUserCurrent() {
        return axios.get(`${process.env.VUE_APP_API}/user/current`, { headers: authHeader() })
    }
}

export default new UserService()