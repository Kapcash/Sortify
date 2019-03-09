import { Schema } from 'mongoose';

export const TrackSchema = new Schema({
  _id: String,
  href: String,
  name: String,
  artists: [Object],
  playlists: { type: [String], default: [] },
}, { _id: false });