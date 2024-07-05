import { Inject, Injectable } from '@nestjs/common';

import { TriggerSendExchangeRateNotificationApplication } from './interfaces/trigger-send-exchange-rate-notification.application.interface';
import { SubscriptionService } from '../domain/services/interfaces/subscription.service.interface';
import { NotificationService } from '../infrastructure/notification/interfaces/notification.service.interface';
import { TYPES } from '../ioc';

@Injectable()
export class TriggerSendExchangeRateNotificationApplicationImpl
  implements TriggerSendExchangeRateNotificationApplication
{
  constructor(
    @Inject(TYPES.services.SubscriptionService)
    private readonly subscriptionService: SubscriptionService,
    @Inject(TYPES.infrastructure.NotificationService)
    private readonly notificationService: NotificationService,
  ) {}

  async execute() {
    const subscribers = await this.subscriptionService.getSubscribers();

    await this.notificationService.sendNotify(subscribers);
  }
}
