import { Injectable } from '@nestjs/common';

import {CotizacionDto} from './dto/cotizacion.dto'
import { TwitterService } from 'src/twitter/twitter.service';
const axios=require('axios')
@Injectable()
export class CotizacionService {


  

  async getCotization() {
    // Rutas para obtener la cotización del dólar
    const rutaDolar = 'https://dolarapi.com/v1/dolares/blue';
    const rutaDolarFecha = 'https://api.argentinadatos.com/v1/cotizaciones/dolares/blue/';
  
    // Obtener fecha de hoy y de ayer
    const hoy = new Date();
    const ayer = new Date(hoy);
    ayer.setDate(hoy.getDate() - 1);
  
    // Formatear año, mes y día de ayer en formato YYYY/MM/DD
    const año = ayer.getFullYear();
    const mes = String(ayer.getMonth() + 1).padStart(2, '0');
    const dia = String(ayer.getDate()).padStart(2, '0');
  
    try {
      // Obtener cotización de hoy y de ayer desde las APIs
      const [dolarHoy, dolarAyer] = await Promise.all([
        axios.get(rutaDolar),
        axios.get(`${rutaDolarFecha}${año}/${mes}/${dia}`),
      ]);
  
      // Obtener valores de compra y venta de ambas cotizaciones
      const { venta: ventaHoy, compra: compraHoy } = dolarHoy.data;
      const { venta: ventaAyer, compra: compraAyer } = dolarAyer.data;
  
      // Calcular la variación de venta y compra
      const variacionVenta = this.calcularVariacion(ventaHoy, ventaAyer);
      const variacionCompra = this.calcularVariacion(compraHoy, compraAyer);
  
      // Crear el objeto de cotización con los resultados
      const cotizacionDolar = new CotizacionDto(
        'USD',
        ventaHoy,
        compraHoy,
        variacionVenta,
        variacionCompra,
      );
  
      return cotizacionDolar;
    } catch (error) {
      console.error('Error al obtener cotización:', error);
      throw error;
    }
  }

  async getCotizacionHistorica(){
    const rutaCotizacion='https://api.argentinadatos.com/v1/cotizaciones/dolares/blue'
    try {
      const response = await axios.get(rutaCotizacion);
      return response.data;  
  } catch (error) {
      console.error('Error al obtener cotización:', error);
      throw error
  }
  }
  
  private calcularVariacion(valorAct:number,valorAnt:number):number{
    return parseFloat((((valorAct-valorAnt)/valorAnt)*100).toFixed(2))
  }


  generarTweet(cotizacion: CotizacionDto): string {
    const { compra, venta, variacionCompra, variacionVenta } = cotizacion;

    const getVariationSymbol = (variation: number) => {
      if (variation > 0) return '🟢↑';
      if (variation < 0) return '🔴↓';
      return '⚪️➖';
    };

    const formatCurrency = (value: number) => value.toLocaleString('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    const symbolCompra = getVariationSymbol(variacionCompra);
    const symbolVenta = getVariationSymbol(variacionVenta);

    return `💰 #DólarBlue | Actualización Diaria
    
      💵 Compra: $${formatCurrency(compra)} ${symbolCompra} ${Math.abs(variacionCompra)}%
      💵 Venta: $${formatCurrency(venta)} ${symbolVenta} ${Math.abs(variacionVenta)}%

      🕒 Actualizado: ${new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
      #Dolar #Economia #Dolarcito`;
  }
}
