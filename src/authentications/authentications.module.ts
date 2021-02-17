import { Module } from '@nestjs/common';
import { AuthenticationsService } from './authentications.service';
import { AuthenticationsController } from './authentications.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthenticationSchema, Authentication } from './schema/authentications.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Authentication.name, schema: AuthenticationSchema }
    ])
  ],
  providers: [AuthenticationsService],
  controllers: [AuthenticationsController]
})
export class AuthenticationsModule {}
