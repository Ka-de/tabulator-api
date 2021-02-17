import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Types } from 'mongoose';
import { AuthenticationsService } from './authentications.service';
import { AuthenticationDTO } from './dto/authentications.dto';

@Controller('authentications')
export class AuthenticationsController {
    constructor(private authenticationService: AuthenticationsService) { }

    @Get('')
    find(@Query('id') id: Types.ObjectId) {
        if(id) return this.authenticationService.findById(id);
        return this.authenticationService.find();
    }

    @Get(':/id')
    findById(@Param('id') id: Types.ObjectId, @Body() data: AuthenticationDTO) {
        return this.authenticationService.create(data);
    }

    @Post()
    create(@Body() data: AuthenticationDTO) {
        return this.authenticationService.create(data);
    }
}
