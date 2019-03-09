import { Schema } from 'mongoose';
import { TrackSchema } from './track.schema';

export const PlaylistSchema = new Schema({
  _id: String,
  userId: String,
  owner: String,
  name: String,
  tracks: { type: [{
    added_at: Date,
    is_local: Boolean,
    track: TrackSchema
  }], default: [] },
  tracksHref: String,
  snapshot: String,
}, { _id: false });