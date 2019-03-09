import { Track } from './track.interface';

export interface Playlist {
  readonly _id: string,
  readonly owner: string,
  readonly name: string,
  snapshot: string,
  tracks: Array<Track>,
  tracksHref: string,
}