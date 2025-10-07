import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { JobService } from './job.service';
import { NotificationExpiresModule } from '../notification/notification-expires/notification-expires.module';

@Module({
  imports: [ScheduleModule.forRoot(), NotificationExpiresModule],
  providers: [JobService],
  exports: [JobService],
})
export class JobsModule {}
