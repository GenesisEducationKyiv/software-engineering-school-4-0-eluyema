import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { ExchangeRateModule } from './modules/exchange-rate/exchange-rate.module';
import { MailerModule } from './modules/mailer/mailer.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { AppConfigModule } from './shared/infrastructure/config/app-config.module';

@Module({
  imports: [
    AppConfigModule,
    ScheduleModule.forRoot(),
    ExchangeRateModule,
    SubscriptionModule,
    MailerModule,
  ],
  providers: [],
})
export class AppModule {}
