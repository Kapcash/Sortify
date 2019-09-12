import { ConfigService } from './config/config.service';
import { Injectable, Logger } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { join } from 'path';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {

  private readonly logger = new Logger(TypeOrmConfigService.name);

  constructor(private config: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    this.logger.debug(`Connecting to mongo database at ${this.config.mongoIp}:${this.config.mongoPort}`);
    return {
      type: 'mongodb',
      host: this.config.mongoIp,
      port: this.config.mongoPort,
      database: 'sortify',
      entities: [join(__dirname, '**/**.entity.ts')],
      synchronize: true,
    };
  }
}
