import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import * as fs from 'fs';

export interface EnvConfig {
  [key: string]: string;
}

/**
 * env files model
 */
const envVarsSchema: Joi.ObjectSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid(['dev', 'prod'])
    .default('dev'),
  SERVER_PORT: Joi.number().default(3000),
  spotify_client_id: Joi.string().required(),
  spotify_client_secret: Joi.string().required(),
  spotify_scopes: Joi.string(),
  jwt_key_name: Joi.string().default('sortify_jwt'),
  MONGO_IP: Joi.string().required(),
  MONGO_PORT: Joi.number().required(),
});

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(filePath: string) {
    this.envConfig = this.validateInput(dotenv.parse(fs.readFileSync(filePath)));
  }

  private validateInput(envConfig: EnvConfig): EnvConfig {
    const { error, value: validatedEnvConfig } = Joi.validate(
      envConfig,
      envVarsSchema,
    );

    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }

  get(key: string): string {
    return this.envConfig[key];
  }

  get serverPort(): number {
    return Number(this.envConfig.SERVER_PORT);
  }

  get mongoIp(): string {
    return this.envConfig.MONGO_IP;
  }

  get mongoPort(): number {
    return Number(this.envConfig.MONGO_PORT);
  }

  get clientId(): string {
    return this.envConfig.spotify_client_id;
  }

  get clientSecret(): string {
    return this.envConfig.spotify_client_secret;
  }

  get scopes(): string {
    return this.envConfig.spotify_scopes;
  }

  get redirectUri(): string {
    return this.envConfig.redirectUri;
  }

  get jwtKeyName(): string {
    return this.envConfig.jwt_key_name;
  }
}
