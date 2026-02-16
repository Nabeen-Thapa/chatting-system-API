import { Request, Response } from 'express';
import { verifyAccessToken } from './jwt.utils';
import { UnauthorizedException } from '@nestjs/common';

export async function getCurrentUser(req: Request, res: Response) {
  const accessToken = req.cookies?.access_token;
  try {
    if (!accessToken) throw new UnauthorizedException('Access token must be provided');
    const payload = verifyAccessToken(accessToken);

    if (!payload) throw new UnauthorizedException('Unauthorized');

    return {
      message: 'User authenticated',
      user: payload,
    };
  } catch (error: any) {
    throw new UnauthorizedException('Invalid or expired token');
  }
}
