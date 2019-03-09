import { Schema } from 'mongoose';

export const UserSchema = new Schema({
  _id: String,
  href: String,
  uri: String,
  displayName: String,
  email: String,
  imageUrl: String,
}, { _id: false });