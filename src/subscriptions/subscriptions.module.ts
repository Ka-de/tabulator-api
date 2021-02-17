import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';

@Module({
  imports: [
    MongooseModule.forFeature()
  ],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService]
})
export class SubscriptionsModule {}
