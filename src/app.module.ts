import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MoviesModule } from './movies/movies.module';
import { UsersModule } from './users/users.module';
import { EmailService } from './email/email.service';
import { ConfigModule } from '@nestjs/config';
import emailConfig from './config/emailConfig';
import { validationSchema } from './config/validationSchema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [emailConfig],
      isGlobal: true,
      validationSchema,
    }),
    MoviesModule,
    UsersModule
  ],
  controllers: [AppController],
  providers: [EmailService],
})
export class AppModule {}