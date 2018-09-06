import axios from 'axios';

class SortifyApiService  {

  public getUserInfos(): any {
    return axios.get('/spotify/me');
  }

}

export default new SortifyApiService();
