import { 
  Component, 
  EventEmitter, 
  Input, 
  OnChanges, 
  Output, 
  SimpleChanges, 
  Renderer2
} from '@angular/core';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnChanges {

  @Input() public movimientos:       number  = 0;
  @Input() public parejas:           number  = 0;
  @Input('levelNum') public level:   number  = 0;
  @Input() public primerMovimiento!: boolean;
  @Output() public finDeJuego = new EventEmitter<boolean>();
  
  public seconds:      number  = 59;
  public tiempo:       string  = "1:00";
  public temporizador: any;
  
  ngOnChanges(changes: SimpleChanges): void {
    if(this.primerMovimiento){
      this.primerMovimiento = false;
      this.tiempoDeJuego();
    }
  }

  public tiempoDeJuego(): void {
    this.temporizador = setInterval( () => {
      if(this.parejas == this.level){
        this.seconds++;
        clearInterval(this.temporizador);
        this.cambiarColorCartas("#0af167", "!Ganaste!");
      } else if(this.seconds == -1){
        this.seconds++;
        clearInterval(this.temporizador);
        this.cambiarColorCartas("#e80033", "!Perdiste!");
        this.finDeJuego.emit(true);
      } else if(this.seconds < 10){
        const second10 = document.getElementById("tiempo");
        this.renderer.setStyle(second10, 'color', 'red');
        this.tiempo = "0:0" + this.seconds--;
      } else {
        this.tiempo = "0:" + this.seconds--;
      }
    }, 1000);
  }

  public cambiarColorCartas(color: string, mensaje: string){
    const muestraMovimientos = document.getElementById("muestraMovimientos");
    const muestraParejas     = document.getElementById("muestraParejas");
    const muestraTiempo      = document.getElementById("muestraTiempo");
    this.renderer.setStyle(muestraMovimientos, "background-color", color);
    this.renderer.setStyle(muestraParejas, "background-color", color);
    this.renderer.setStyle(muestraTiempo, "background-color", color);
    this.renderer.setStyle(muestraMovimientos, "color", "#ffffff");
    this.renderer.setStyle(muestraParejas, "color", "#ffffff");
    this.renderer.setStyle(muestraTiempo, "color", "#ffffff");
    this.renderer.setStyle(muestraTiempo?.children[0], "color", "#ffffff");
    this.tiempo = mensaje;
  }
  
  constructor(private renderer: Renderer2) { }
}