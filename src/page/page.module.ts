import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PageController } from './page.controller';
import { PageEntity } from './page.model';
import { PageService } from './page.service';

@Module({
  imports: [
    MongooseModule.forFeature([PageEntity])
  ],
  controllers: [PageController],
  providers: [PageService]
})
export class PageModule {}
