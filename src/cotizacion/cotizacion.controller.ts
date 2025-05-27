import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CotizacionService } from './cotizacion.service';
import { TwitterService } from 'src/twitter/twitter.service';
import { Cron, CronExpression } from '@nestjs/schedule';


@Controller('cotizacion')
export class CotizacionController {
  
  constructor(private readonly cotizacionService: CotizacionService,private readonly twitterService:TwitterService) {}



  @Get('/dolar')
  getCotizacionDolar() {
    return this.cotizacionService.getCotization();
  }


  @Cron(CronExpression.MONDAY_TO_FRIDAY_AT_5PM)
  @Get('/dolar/tweet')
  async tweetCotizacionDolar() {
    try {
      const cotizacion=await this.cotizacionService.getCotization();
      const tweet=this.cotizacionService.generarTweet(cotizacion);
      this.twitterService.tweet(tweet)
      console.log('tweet send')
      return "tweet send"
    } catch (error) {
      console.log(error)
      return "tweet don't send"
    }
    
  }

  @Get('/dolar/historica')
  getCotizacionHistoricaDolar() {
    return this.cotizacionService.getCotizacionHistorica();
  }

  
}
