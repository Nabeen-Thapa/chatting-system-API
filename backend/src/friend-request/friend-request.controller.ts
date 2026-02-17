import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';
import { CreateFriendRequestDto } from './dto/create-friend-request.dto';
import { UpdateFriendRequestDto } from './dto/update-friend-request.dto';

@Controller('friend-request')
export class FriendRequestController {
  constructor(private readonly friendRequestService: FriendRequestService) { }

  @Post()
  send(@Body() createFriendRequestDto: CreateFriendRequestDto) {
    return this.friendRequestService.send(createFriendRequestDto);
  }

  @Post()
  accept() {
    return this.friendRequestService.findAll();
  }

  @Delete(':id')
  reject(@Param('id') id: string) {
    return this.friendRequestService.remove(+id);
  }

  @Post()
  pending() {
    return this.friendRequestService.findAll();
  }

  @Get()
  sent() {
    return this.friendRequestService.findAll();
  }

  //sender can cancel reuqest
  @Post()
  cancel() {
    return this.friendRequestService.findAll();
  }

  @Get()
  View() {
    return this.friendRequestService.findAll();
  } 
}
