import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import mikroOrmConfig from './config/orm.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),  // loads .env
    MikroOrmModule.forRoot(mikroOrmConfig),    // correct config
    AuthModule,
    ConfigModule.forRoot({isGlobal: true,}),
    RedisModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
