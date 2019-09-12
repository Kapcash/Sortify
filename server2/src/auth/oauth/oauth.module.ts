import { Module } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({ secret: 'sortify' }),
  ],
  providers: [OauthService],
  exports: [OauthService],
})
export class OauthModule {}
