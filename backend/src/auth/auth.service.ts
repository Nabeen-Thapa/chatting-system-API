import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/create-user.dto';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
constructor(
  @Inject(forwardRef(() => UserService))
  private readonly userService: UserService,
) {}
  async create(RegisterDto: RegisterDto) {
    const user= await this.userService.create(RegisterDto)
    return user;
  }

   async login(loginDto: LoginDto) {
    const user= await this.userService.login(loginDto);
    console.log(loginDto)
    return user;
  }

}
