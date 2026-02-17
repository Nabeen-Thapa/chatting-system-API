import { forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { AuthMiddleware } from '../common/middleware/auth.middleware';

@Module({
  imports: [    
    forwardRef(() => AuthModule),   
    MikroOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [UserService],
    exports: [UserService],           
})
export class UserModule implements NestModule{ 
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware)
    .forRoutes(
      {path:'user/all', method: RequestMethod.GET}
    )
  }
}
