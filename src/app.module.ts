import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

import { MoviesModule } from './movies/movies.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [MoviesModule, UsersModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}