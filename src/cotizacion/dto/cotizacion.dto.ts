export class CotizacionDto{
    
    constructor(
        public readonly moneda: string,
        public readonly venta: number,
        public readonly compra: number,
        public readonly variacionVenta: number,
        public readonly variacionCompra: number
      ) {}
}
