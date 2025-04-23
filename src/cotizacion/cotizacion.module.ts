import { Module } from '@nestjs/common';
import { CotizacionService } from './cotizacion.service';
import { CotizacionController } from './cotizacion.controller';

import { TwitterModule } from 'src/twitter/twitter.module';

@Module({
  imports:[TwitterModule],
  controllers: [CotizacionController],
  providers: [CotizacionService],
})
export class CotizacionModule {}
