import axios, { AxiosPromise } from 'axios';
import router from '../router';

class AuthService  {

  constructor() {

    axios.interceptors.request.use(
      (request) => {
        request.headers.Authorization = 'Bearer ' + localStorage.getItem('sortify_jwt');
        return request;
      },
      (error) => error,
    );

    // Add a 401 response interceptor
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        // If not authenticated, go back to login page
        if (error.response.status === 401) {
          this.refreshJwt().then((refreshedJwt) => {
            // Yeah! We get a fresh new Jwt! Go back to login page to handle storing process
            router.push('/login?jwt=' + refreshedJwt.data);
          }).catch((refreshError) => {
            // Well, something went wrong. You're not authenticated anymore, sorry.
            this.deleteJwt();
            router.push('/login?error=refresh_token_error');
          });
        } else if (error.response.status === 500 && error.response.data.includes('ECONNRESET')){
          // TODO: Toast error, connexion with server hang out
        }
        throw new Error(error.response.data);
      }
    );
  }

  public isUserConnected(): boolean {
    return !!localStorage.getItem('sortify_jwt');
  }

  public storeJwt(jwt: string) {
    localStorage.setItem('sortify_jwt', jwt);
  }

  public deleteJwt() {
    localStorage.removeItem('sortify_jwt');
  }

  public refreshJwt(): AxiosPromise<string> {
    return axios.get('/connect/refresh');
  }
}

const authService = new AuthService();

export default authService;
