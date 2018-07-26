import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  clientId: string = 'a472f46b5cf54b64852ac85b69792cf1';
  clientSecret: string = '704a963a243b4b25a124c32396856a6c'; // TODO: Hide secret
  redirectURI: string = '/home'; // TODO: get correct redirect uri
  scopes: string = 'user-read-private playlist-read-private playlist-modify-private playlist-modify-public user-library-read user-library-modify';

  root(): string {
    return 'Hello World!';
  }

  createPlaylist(): string {
    return 'Creating playlist';
  }

  listUnsortedSongs(): string {
    return 'Listing unsorted songs';
  }
}
