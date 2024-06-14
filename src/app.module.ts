import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { configuration } from './config/configuration';
import { ExchangeRateModule } from './modules/exchange-rate/exchange-rate.module';
import { MailerModule } from './modules/mailer/mailer.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    ScheduleModule.forRoot(),
    ExchangeRateModule,
    SubscriptionModule,
    MailerModule,
  ],
  providers: [],
})
export class AppModule {}
