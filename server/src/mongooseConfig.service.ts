import { MongooseOptionsFactory, MongooseModuleOptions } from "@nestjs/mongoose";
import { ConfigService } from './config.service';
import { Injectable } from "@nestjs/common";

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {

  constructor(private config: ConfigService){

  }

  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: `mongodb://${this.config.get('MONGO_IP')}:32768/sortify`,
    };
  }
}