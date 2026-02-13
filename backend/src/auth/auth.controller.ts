import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login-user.dto';

@Controller('user/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() registerDto: RegisterDto) {
    return this.authService.create(registerDto);
  }

  @Post("login")
  login(@Body() loginDto: LoginDto){
    console.log("controller auth: ", loginDto)
    return this.authService.login(loginDto)
  }

}
