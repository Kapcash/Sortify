export interface SortifyUser {
  imageLink: string;
  displayName: string;
  accountType: string;
  id: string;
  href: string;
}

export class SpotifyUser implements SortifyUser {
  constructor(userFromSpotifyApi: SpotifyApi.UserObjectPrivate) {
    this.imageLink = userFromSpotifyApi.images[0].url;
    this.displayName = userFromSpotifyApi.display_name;
    this.accountType = userFromSpotifyApi.product;
    this.id = userFromSpotifyApi.id;
    this.href = userFromSpotifyApi.href;
  }

  imageLink: string;
  displayName: string;
  accountType: string; // ('premium' | 'basic')
  id: string;
  href: string;
}