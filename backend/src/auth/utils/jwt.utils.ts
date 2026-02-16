import jwt, { verify } from 'jsonwebtoken';
import { JwtPayload } from '../../common/types/types';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access_secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret';

export function signAccessToken(payload:JwtPayload){
    return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: '15d',
    })
}

export function signRefreshToken(payload: string) {
  return jwt.sign({payload}, REFRESH_SECRET, {
    expiresIn: '15d',
  });
}

export const verifyAccessToken = (token?: string): JwtPayload => {
  if (!token) {
    throw new Error('Access token must be provided');
  }
  return verify(token, ACCESS_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token?: string): JwtPayload => {
  if (!token) {
    throw new Error('Refresh token must be provided');
  }
  return verify(token, REFRESH_SECRET) as JwtPayload;
};

