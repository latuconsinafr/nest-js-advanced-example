import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { IsNumber, IsString, validateSync } from 'class-validator';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { DbModule } from './db.module';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';

class EnvironmentVariables {
  @IsString()
  DB_HOST: string;

  @IsNumber()
  DB_PORT: number;

  @IsString()
  DB_USERNAME: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_NAME: string;

  @IsString()
  JWT_SECRET: string;

  @IsNumber()
  JWT_EXPIRATION_TIME: number;
}

function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}

@Module({
  imports: [
    ConfigModule.forRoot({ validate, cache: true }),
    DbModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    PostsModule,
  ],
})
export class AppModule {}
