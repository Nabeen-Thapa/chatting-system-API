import { ConflictException, forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EntityManager } from '@mikro-orm/postgresql';
import { User } from './entities/user.entity';
import { RegisterDto } from '../auth/dto/create-user.dto';
import { AuthService } from '../auth/auth.service';
import { LoginDto } from '../auth/dto/login-user.dto';
import { RedisService } from '../redis/redis.service';
import * as bcrypt from 'bcrypt';
import { signAccessToken, signRefreshToken } from '../auth/utils/jwt.utils';

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

    const user = await this.em.findOne(User, { email: data.email })
    if (user) throw new ConflictException("user already eixist with this email")

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = this.em.create(User, {
      ...data,
      password: hashedPassword,
    });
    await this.em.persistAndFlush(newUser);

    await this.redisService.set(cacheKey, user, 3600);
    return newUser;
  }

  async login(data: LoginDto) {
    const cacheKey = `user:email:${data.email}`;
    let user = await this.redisService.get(cacheKey) as User | null;
    if (!user) {
      user = await this.em.findOne(User, { email: data.email })
      if (!user) throw new UnauthorizedException('Invalid email');
      await this.redisService.set(cacheKey, user, 3600);
    }

    const isValid = await bcrypt.compare(
      data.password,
      user.password,
    );

    if (!isValid) throw new UnauthorizedException('Invalid email or password');

    const payload = {
      userId: user.id,
      email: user.email,
      name: user.name,
    };


    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken({ userId: user.id });

    // 5️⃣ Store refresh token in Redis
    await this.redisService.set(
      `refresh:${user.id}`,
      refreshToken,
      7 * 24 * 60 * 60,
    );

    return {
      message: 'Login successful',
      accessToken,
      refreshToken,
    };
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
