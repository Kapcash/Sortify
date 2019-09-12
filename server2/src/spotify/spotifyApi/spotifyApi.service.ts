import { Injectable, HttpService } from '@nestjs/common';
import { SortifyUser } from '../../models/user/sortifyUser.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SpotifyApiService {

  constructor(private readonly httpService: HttpService,
              @InjectRepository(SortifyUser)
              private readonly userRepository: Repository<SortifyUser>,
  ) {
    this.httpService.axiosRef.interceptors.request.use(req => {
      console.log('BONJOUE');
      return req;
    });
    this.httpService.axiosRef.interceptors.response.use(res => {
      console.log('AU REVOIE');
      return res;
    });
  }

  /**
   * Get the spotify user informations
   * @see SpotifyUser Type model
   */
  getUserInfosFromDb(userId: string): Promise<SortifyUser> {
    // Auto add jwt header here
    return this.userRepository.findOne({ id: userId });
  }
}
