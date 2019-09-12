import { Module, Global } from '@nestjs/common';
import { ConfigService } from './config.service';

@Global()
@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(`env/${process.env.NODE_ENV ? process.env.NODE_ENV : 'dev' }.env`),
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {}
