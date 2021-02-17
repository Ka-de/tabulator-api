import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Types } from 'mongoose';
import { AuthenticationsService } from './authentications.service';
import { AuthenticationDTO } from './dto/authentications.dto';

@Controller('authentications')
export class AuthenticationsController {
    constructor(private authenticationService: AuthenticationsService) { }

    @Post()
    create(@Body() data: AuthenticationDTO) {
        return this.authenticationService.create(data);
    }

    @Get(':/id')
    findById(@Param('id') id: Types.ObjectId, @Body() data: AuthenticationDTO) {
        return this.authenticationService.create(data);
    }
}
