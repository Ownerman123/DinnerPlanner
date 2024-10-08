import { jwtDecode } from 'jwt-decode';




const AuthAPI = import.meta.env.VITE_AUTH_URL || `http://localhost:4001`;

class AuthService {
    getProfile() {
        return jwtDecode(this.getToken());
    }
    async loggedIn() {
        let token = this.getToken();
        const refreshToken = JSON.parse(this.getRefToken());

        if (this.isTokenExpired(token)) {
            console.log('getting new token');
            const data = await fetch(`${AuthAPI}/token`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ token: refreshToken })
                }
            );
            //console.log(data);

            const newtoken = await data.json();
            //console.log("data:", newtoken.token);
            if (!newtoken.token) {
                console.log('no token')
                await this.logout();
            } else {
                //   console.log('yes token')
                localStorage.setItem("authToken", newtoken.token);
            }
            token = this.getToken();
        }
        return !!token && !this.isTokenExpired(token);
    }
    isTokenExpired(token) {
        try {
            const decoded = jwtDecode(token);
            if (decoded.exp < Date.now() / 1000) {
                return true;
            } else return false;
        } catch (err) {
            return false;
        }
    }
    getToken() {
        return localStorage.getItem("authToken");
    }
    getRefToken() {
        return localStorage.getItem("refreshToken");
    }
    login(idToken) {
        localStorage.setItem("authToken", idToken);
        window.location.assign("/");
    }
    async logout() {
        const token = JSON.parse(this.getRefToken());

        await fetch(`${AuthAPI}/logout`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: token })
        });
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        window.location.assign("/");
    }
}
export default new AuthService();
