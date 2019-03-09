import { Document } from 'mongoose';

export interface SortifyUser extends Document {
  readonly _id: string,
  readonly href: string,
  readonly uri: string,
  readonly displayName: string,
  readonly email: string,
  readonly imageUrl: string,
}