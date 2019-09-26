import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SortifyUser } from '../../models/user/sortifyUser.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SpotifyDbService {

  constructor(@InjectRepository(SortifyUser)
    private readonly userRepository: Repository<SortifyUser>,
  ) {
  }

  public getUser(userId: string): Promise<SortifyUser> {
    return this.userRepository.findOne({where: {
      _id: userId,
    }});
  }

  public saveUser(user: SortifyUser): Promise<SortifyUser> {
    return this.userRepository.save({_id: user.id, ...user});
  }
}
