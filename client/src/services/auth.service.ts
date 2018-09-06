import axios from 'axios';
import router from '../router';

class AuthService  {

  constructor() {

    axios.interceptors.request.use(
      (request) => {
        request.headers.Authorization = 'Bearer ' + localStorage.getItem('sortify_jwt');
        return request;
      },
      (error) => {
        return error;
      }
    );

    // Add a 401 response interceptor
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        // If not authenticated, go back to login page
        if (error.response.status === 401) {
          router.push('/login?error=401');
        }
        return error;
        // TODO: Handle expired token
      }
    );
  }

  public isUserConnected(): boolean {
    return !!localStorage.getItem('sortify_jwt');
  }

  public storeJwt(jwt: string) {
    localStorage.setItem('sortify_jwt', jwt);
  }
}

const authService = new AuthService();

export default authService;
