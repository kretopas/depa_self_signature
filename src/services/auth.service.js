import api from "./api";
import TokenService from "./token.service";

class AuthService {
    login(user) {
        return api.post(
            '/login', {
                username: user.username,
                password: user.password
            }
        ).then(response => {
            if (response.data.access_token) {
                TokenService.setUser(response.data);
                return Promise.resolve(response.data);
            } else {
                return Promise.reject('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง<br/>กรุณาตรวจสอบอีกครั้ง');
            }
        });
    }

    logout() {
        TokenService.removeUser();
    }
}

export default new AuthService()