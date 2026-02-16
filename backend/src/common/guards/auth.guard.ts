import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();

        const token = request.cookies?.access_token;
        if (!token) throw new UnauthorizedException("toke is not found");

        try {
            const decode = jwt.verify(token, process.env.JWT_ACCESS_SECRET || "");
            request.user = decode;
            return true;
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}