import api from "./api";

class UserService {
    getUserCurrent() {
        return api.get('/user/current');
    }
    
    getAllSigners() {
        return api.get('/all/signer');
    }
}

export default new UserService()