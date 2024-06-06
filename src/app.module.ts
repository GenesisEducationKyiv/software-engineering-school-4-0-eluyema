import { ConfigModule } from '@nestjs/config';
import { configuration } from './config/configuration';
import { Module } from '@nestjs/common';
import { ExchangeRateModule } from './modules/exchange-rate/exchange-rate.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { MailerModule } from './modules/mailer/mailer.module';
import { ScheduleModule } from '@nestjs/schedule';

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
