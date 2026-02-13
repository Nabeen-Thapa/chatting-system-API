import { ConflictException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EntityManager } from '@mikro-orm/postgresql';
import { User } from './entities/user.entity';
import { RegisterDto } from '../auth/dto/create-user.dto';
import { AuthService } from '../auth/auth.service';
import { LoginDto } from '../auth/dto/login-user.dto';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class UserService {
  constructor(
    private readonly em: EntityManager,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly redisService: RedisService,
  ) { }


  async create(data: RegisterDto) {
    const cacheKey = `user:email:${data.email}`;
    const cachedUser = await this.redisService.get(cacheKey);
    if (cachedUser) throw new ConflictException("user already eixist with this email")

    const user = this.em.create(User, data);
    await this.em.persistAndFlush(user);

    await this.redisService.set(cacheKey, user, 3600);
    return user;
  }

  async login(data: LoginDto) {

    const cachedUser = await this.redisService.get(`user:email:${data.email}`);
   
    return 'This action login user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
