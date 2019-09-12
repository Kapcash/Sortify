import { Module } from '@nestjs/common';
import { SpotifyDbService } from './spotify-db/spotify-db.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SortifyUser } from '../models/user/sortifyUser.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SortifyUser]),
  ],
  controllers: [],
  providers: [SpotifyDbService],
  exports: [SpotifyDbService],
})
export class OrmModule {}
