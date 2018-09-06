export interface SortifyUser{
  imageLink: string;
  displayName: string;
  accountType: 'premium' | 'basic';
  id: string;
  accountHref: string;
}

export class SpotifyUser implements SortifyUser {
  constructor(userFromSpotifyApi: any) {
    this.imageLink = userFromSpotifyApi.images[0].url;
    this.displayName = userFromSpotifyApi.display_name;
    this.accountType = userFromSpotifyApi.product;
    this.id = userFromSpotifyApi.id;
    this.accountHref = userFromSpotifyApi.href;
  }

  imageLink: string;
  displayName: string;
  accountType: 'premium' | 'basic';
  id: string;
  accountHref: string;
}