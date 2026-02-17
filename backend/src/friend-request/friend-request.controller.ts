import { Controller, Get, Post, Body, Param, Delete, Req, UnauthorizedException } from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';
import { CreateFriendRequestDto } from './dto/create-friend-request.dto';
import { UpdateFriendRequestDto } from './dto/update-friend-request.dto';
import type { Request } from 'express';

@Controller('friend-request')
export class FriendRequestController {
  constructor(private readonly friendRequestService: FriendRequestService) { }

  @Post("send")
  send(@Body() createFriendRequestDto: CreateFriendRequestDto, @Req() req: Request) {
    if (!req.user) throw new UnauthorizedException("you are not authorized")
    const senderId = (req.user as any).userId;
    return this.friendRequestService.send(createFriendRequestDto, senderId);
  }

  @Get("requests")
  View(@Req() req: Request) {
    if (!req.user) throw new UnauthorizedException("you are not authorized")
    const currentUser = (req.user as any).userId;
    return this.friendRequestService.viewReceivedRequests(currentUser);
  }

  @Post("accept/:senderId")
  accept(@Param('senderId') senderId: string, @Req() req: Request) {
    if (!req.user) throw new UnauthorizedException("you are not authorized")
    const receiverId = (req.user as any).userId;
    return this.friendRequestService.accept(senderId, receiverId);
  }

  @Delete(':id')
  reject(@Param('id') id: string) {
    return this.friendRequestService.reject(+id);
  }

  //sender can cancel reuqest
  @Post()
  cancel() {
    return this.friendRequestService.cancel();
  }

}
