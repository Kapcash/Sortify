import { SortifyUser } from './sortifyUser.entity';

export class SpotifyUser extends SortifyUser {

  /**
   * Profile picture link
   */
  imageLink: string;

  /**
   * User name
   */
  displayName: string;

  /**
   * ('premium' | 'basic')
   */
  accountType: string;

  /**
   * User id
   */
  id: string;

  /**
   * User href
   */
  href: string;

  constructor(userFromSpotifyApi: SpotifyApi.UserObjectPrivate) {
    super();
    this.imageLink = userFromSpotifyApi.images[0].url;
    this.displayName = userFromSpotifyApi.display_name;
    this.accountType = userFromSpotifyApi.product;
    this.id = userFromSpotifyApi.id;
    this.href = userFromSpotifyApi.href;
  }
}
