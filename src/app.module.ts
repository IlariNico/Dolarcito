import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CotizacionModule } from './cotizacion/cotizacion.module';
import { TwitterModule } from './twitter/twitter.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(),CotizacionModule, TwitterModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
