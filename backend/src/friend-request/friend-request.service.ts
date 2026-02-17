import { BadRequestException, Injectable, NotFoundException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { CreateFriendRequestDto } from './dto/create-friend-request.dto';
import { EntityManager } from '@mikro-orm/postgresql';
import { User } from '../user/entities/user.entity';
import { FriendRequest } from './entities/friend-request.entity';
import { FriendRequestStatus } from './types/friend-request.type';
import { AuthGuard } from '../common/guards/auth.guard';

@UseGuards(AuthGuard)
@Injectable()
export class FriendRequestService {
  constructor(private readonly em: EntityManager) { }
  async send(createFriendRequestDto: CreateFriendRequestDto, senderId: string) {

    const sender = await this.em.findOne(User, { id: senderId })
    const receiver = await this.em.findOne(User, { id: createFriendRequestDto.receiverId })
    if (!sender || !receiver) throw new NotFoundException("Sender or receiver not found");
    const dbsernderId = (sender as any).id as string;
    if (senderId === receiver.id) throw new NotFoundException("you can not send friend request to yourself");

    const existing = await this.em.findOne(FriendRequest, { sender, receiver })
    if (existing) throw new BadRequestException('you alreadyt send friedn reuqest');

    const newFriendRequest = this.em.create(FriendRequest, {
      sender,
      receiver,
      status: FriendRequestStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    await this.em.persistAndFlush(newFriendRequest);
    return {
      message: "Friend request sent successfully",
      requestId: newFriendRequest.id,
    };
  }

  async viewReceivedRequests(correntUserId: string) {
    const user = await this.em.findOne(User, { id: correntUserId });
    if (!user) throw new UnauthorizedException("you are not registered yet");

    const receivedRequests = await this.em.find(FriendRequest,
      { receiver: user }, { populate: ['sender'] }
    )

    return receivedRequests.map(fr => ({
      id: fr.id,
      sender: {
        id: fr.sender.id,
        name: fr.sender.name,
        email: fr.sender.email,
        phone: fr.sender.phone,
        profileImage: fr.sender.profileImage,
      },
      status: fr.status,
      createdAt: fr.createdAt,
    }))

  }

  async accept(senderId: string, receiverId: string) {
    const sender = await this.em.findOne(User, { id: senderId })
    const receiver = await this.em.findOne(User, { id: receiverId })
    if (!sender || !receiver) throw new NotFoundException('User not found');

    const request = await this.em.findOne(FriendRequest,
      { sender, receiver, status: FriendRequestStatus.PENDING, })

    if (!request) throw new NotFoundException('Friend request not found or already handled');
    request.status = FriendRequestStatus.ACCEPTED;
    request.updatedAt = new Date();

    await this.em.persistAndFlush(request);

    return {
      message: 'Friend request accepted',
      request,
    };


    return `This action returns all friendRequest`;
  }

  reject(id: number) {
    return `This action removes a #${id} friendRequest`;
  }

  async cancel() {
    return `This action returns all friendRequest`;
  }



}
