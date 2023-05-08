import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './models/user.model';
import { config } from './config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config.db.host,
      port: Number.parseInt(config.db.port),
      username: config.db.username,
      password: config.db.password,
      database: config.db.name,
      entities: [User],
      logging: true,
      synchronize: true,
      // ssl: { rejectUnauthorized: true },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
