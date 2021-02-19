import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';

import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthenticationGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        // request.authentication = await this.validate(request);
        
        return !!request.headers.authentication;
    }

    async validate(request: any) {
        const token = request.headers.authentication;        
        if (!token) return false;

        try {
            const authentication = await jwt.verify(token, process.env.SECRET);
            return authentication;
        } catch (error) {
            const message = `Token error ${error.message || error.name}`;
            throw new HttpException(message, HttpStatus.NON_AUTHORITATIVE_INFORMATION);
        }
    }
}