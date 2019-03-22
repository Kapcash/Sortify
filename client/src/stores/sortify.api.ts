import axios from 'axios';
import SortifyVuex from './sortify.vuex';
// import {
//   UserSubmit,
//   UserResponse,
//   User,
//   ArticlesResponse,
//   Profile,
//   ProfileResponse,
//   UserForUpdate,
// } from './models';

// TODO Methods for http calls only

export async function initializeApp(user): Promise<any> {
  return axios.post('/spotify/init', {user})
  .catch((error) => {
    console.log(error);
  });
}

export async function unsortedTracks(user): Promise<any> {
  return axios.post('/spotify/unsorted-tracks', {user})
  .catch((error) => {
    console.log(error);
  });
}
