export class Track {
  
  public _id: string;
  public href: string;
  public name: string;
  public artists: any[];
  public saved_at: Date;

  constructor() {}

  fromSpotifyTrack(track: SpotifyApi.TrackObjectFull): Track {
    this._id = track.id;
    this.name = track.name;
    this.href = track.href;
    this.artists = track.artists;
    return this;
  }

  getFullName(): string {
    return `${this.name} - ${this.artists.join(', ')}`;
  }
}