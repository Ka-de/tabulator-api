import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PageModule } from './page/page.module';
import { HttpErrorFilter } from './shared/http-error.filter';
import { LoggingInterceptor } from './shared/logger.interceptor';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { AuthenticationsModule } from './authentications/authentications.module';
import { TablesModule } from './tables/tables.module';
import { ValidateRow } from './shared/row.validator';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/crater-server',
      {
        useNewUrlParser: true,
        useFindAndModify: true,
        useCreateIndex: true,
      }
    ),
    PageModule,
    SubscriptionsModule,
    AuthenticationsModule,
    TablesModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor
    }
  ],
})
export class AppModule { }
