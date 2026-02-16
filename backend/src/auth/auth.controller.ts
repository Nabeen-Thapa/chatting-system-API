import { Controller, Post, Body, Res, Get, Req, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login-user.dto';
import { setAuthCookies } from './utils/authCookie.utils';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtAuthGuard } from './jwt/jwt.guard';

@Controller('user/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  create(@Body() registerDto: RegisterDto) {
    return this.authService.create(registerDto);
  }

  @Post("login")
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {

    const data = await this.authService.login(loginDto);
    console.log("autn controler: ", data)
    setAuthCookies(res, data.accessToken, data.refreshToken);
    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getCurrentUser(@CurrentUser() user: any) {
    return {
      message: 'User authenticated',
      user,
    };
  }

}
