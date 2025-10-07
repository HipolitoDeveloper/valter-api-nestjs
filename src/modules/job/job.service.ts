import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { NotificationExpiresService } from '../notification/notification-expires/notification-expires.service';

@Injectable()
export class JobService {
  constructor(private notificationExpiresService: NotificationExpiresService) {}
  private readonly logger = new Logger(JobService.name);

  @Cron('10 * * * * *')
  async handleCron() {
    this.logger.debug('[notify-expirations] tick at second 45');
    try {
      await this.notificationExpiresService.callNotificationsExpires();
      this.logger.debug('[notify-expirations] done');
    } catch (err) {
      this.logger.error(
        '[notify-expirations] failed',
        err.stack || err.message,
      );
    }
  }
}
