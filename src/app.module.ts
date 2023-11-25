import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import * as Joi from 'joi';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('developement', 'production', 'test'),
        MONGO: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRE_IN: Joi.string().required(),
      }),
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.NODE_ENV == 'test'
        ? process.env.MONGO_TEST
        : process.env.MONGO,
    ),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRE_IN },
      global: true,
    }),
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
