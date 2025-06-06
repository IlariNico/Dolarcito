import { Module } from '@nestjs/common';
import { TwitterService } from './twitter.service';
import { TwitterController } from './twitter.controller';

@Module({
  controllers: [TwitterController],
  providers: [TwitterService],
  exports:[TwitterService]
})
export class TwitterModule {}
