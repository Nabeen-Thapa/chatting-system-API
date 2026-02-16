import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { AuthMiddleware } from '../common/middleware/auth.middleware';

@Module({
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'chat/view', method: RequestMethod.GET },
      );
  }
}
