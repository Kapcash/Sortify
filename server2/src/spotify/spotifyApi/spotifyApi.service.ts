import { Injectable, HttpService } from '@nestjs/common';
import { SortifyUser } from '../../models/user/sortifyUser.entity';
import { SpotifyDbService } from '../../orm/spotify-db/spotify-db.service';

@Injectable()
export class SpotifyApiService {

  constructor(private readonly httpService: HttpService,
              private readonly spotifyDbService: SpotifyDbService,
  ) {}

  /**
   * Get the spotify user informations
   * @see SpotifyUser Type model
   */
  getUserInfosFromDb(userId: string): Promise<SortifyUser> {
    // Auto add jwt header here
    return this.spotifyDbService.getUser(userId);
  }
}
