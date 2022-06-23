import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pokemon } from '../../interfaces/game.interfaces';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-tablero',
  templateUrl: './tablero.component.html',
  styleUrls: ['./tablero.component.css']
})
export class TableroComponent implements OnInit {

  public primerMovimiento: boolean  = false;
  public movimientos:       number  = 0;
  public parejas:           number  = 0;
  public level:             string  = '';
  public levelNum:          number  = 0;
  public columns:           string  = '';
  public rows:              string  = '';
  public finDeJuego:        boolean = false;
  public pokemones:         Pokemon[] = [];
  private repetido:         boolean = false;
  private giroCarta:        number  = 0;
  private primeraCarta:     any;
  private segundaCarta:     any;
  private idPrimeraCarta:   string  = '';
  private idSegundaCarta:   string  = '';
  @ViewChild('carta') carta!: ElementRef;

  constructor(
    private rutaActiva: ActivatedRoute, 
    private gameService: GameService,
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.level = this.rutaActiva.snapshot.params['level'];
    this.seleccionarNivel();
  }

  seleccionarNivel(): void{
    switch(this.level){
      case 'level1':
        this.levelNum = 8;
        this.columns = 'repeat(4, auto)';
        this.rows    = 'repeat(4, auto)';
        this.generarPokemones(8, 16, 15);
        break;
      case 'level2':
        this.levelNum = 12;
        this.columns = 'repeat(6, auto)';
        this.rows    = 'repeat(4, auto)';
        this.generarPokemones(12, 24, 23);
        break;
      case 'level3':
        this.levelNum = 15;
        this.columns = 'repeat(6, auto)';
        this.rows    = 'repeat(5, auto)';
        this.generarPokemones(15, 30, 29);
        break;
      default:
        this.columns = '';
        this.rows    = '';
        break;
    }
  }

  //--- Generar numero aleatorio
  public random(min:number, max:number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  //--- Obtener pokemones 
  public generarPokemones(cantidadPokemones: number, longitud: number, max: number): void{
    for(let i = 0; i < cantidadPokemones; i++){
      let numTemp = 0;
      let numPokemon: number = this.random(1, 700);
      if(numPokemon == numTemp) numPokemon = this.random(1, 700);
      numTemp = numPokemon;
      this.gameService.getPokemon(numPokemon).subscribe(
        {
          next: (pokemon) => {
            this.pokemones.push({
              nombre: pokemon.name,
              imagen: pokemon.sprites.front_default,
              id: this.pokemones.length
            });
            this.pokemones.push({
              nombre: pokemon.name,
              imagen: pokemon.sprites.front_default,
              id: this.pokemones.length
            });
            if(this.pokemones.length == longitud) this.arrayAleatorio(longitud, max);
          }
        }
      );
    }
  }

  getFinDeJuego(e: any){
    this.finDeJuego = e;
  }

  //--- Cambiar la posicion de las cartas
  public arrayAleatorio(longitud: number, max: number): void{
    let nuevoArray: Pokemon[] = [];
    let numRandomAnterior: number[] = [longitud];
    //--Recorrer cartas de cada pokemon
    for(let i = 0; i < longitud; i++){
      let numRandom = this.random(0, max);
      //-- Recorrer numeros aleatorios anteriores
      for(let j = 0; j < numRandomAnterior.length; j++){
        //-- Comprobar que el nuevo numero aleatorio no sea el mismo que en los anteriores
        if(numRandom != numRandomAnterior[j]){
          this.repetido = false;
        } else {
          this.repetido = true;
          break;
        }
      }
      if(!this.repetido){//-- Validamos si el numero aleatorio esta repetido
        if(this.pokemones[numRandom] != null){ //--Validamos que el pokemon no sea nulo
          nuevoArray[i] = this.pokemones[numRandom];
          numRandomAnterior.push(numRandom);
        }
      } else {
        //-- Si el numero aleatorio es repetido se le resta a la variable i para no contar la vuelta
        i--;
      } 
   }//--FIN de recorrer cartas de cada pokemon
    this.pokemones = nuevoArray;
  }

  //--- Rotacion de la carta
  rotarImagen(id: any): void {
    if (!this.finDeJuego) {
      const getCard = document.getElementById(id)!;
      this.renderer.addClass(getCard.children[0], 'rotateFront');//--- Girar carta de enfrente
      this.renderer.addClass(getCard.children[1], 'rotateBack');//--- Girar carta de atras
      this.renderer.setStyle(getCard, 'pointerEvents', 'none');//--- Cancelar los clics a la carta

      if (!this.primerMovimiento) {
        this.primerMovimiento = true;
      }

      if (this.giroCarta == 0) {
        this.primeraCarta = getCard.classList[0];//--- Obtener la primera clase de la carta
        this.idPrimeraCarta = getCard.id;//--- Obtener el id de la primera carta
        this.giroCarta++;//--- Aumentar giro
      } else if (this.giroCarta == 1) {
        this.idSegundaCarta = getCard.classList[0];//--- Obtener la segunda clase de la carta
        this.idSegundaCarta = getCard.id;//--- Obtener el id de la segunda carta
        this.giroCarta++;//--- Aumentar giro
        const getCards = this.elementRef.nativeElement.getElementsByClassName('no-match');
        // console.log(getCards);
        for (let index = 0; index < getCards.length; index++) {//--- recorrer cartas 
          this.renderer.setStyle(getCards[index], 'pointerEvents', 'none');//--- Cancelar clics a las cartas
        }
        setTimeout(() => {
          this.coincidenciaCartas();
        }, 1000);
      } else {
        this.giroCarta = 0;
      }
    }
  }

  //--- Validacion de carta
  coincidenciaCartas(): void {
    const carta1 = document.getElementById(this.idPrimeraCarta);
    const carta2 = document.getElementById(this.idSegundaCarta);
    const nombre1 = carta1?.children[1].children[1].id;
    const nombre2 = carta2?.children[1].children[1].id;
    // console.log(nombre1, nombre2);
    if(nombre1 != nombre2){
      // console.log("No Match");
      this.renderer.removeClass(carta1?.children[0], 'rotateFront');
      this.renderer.removeClass(carta1?.children[1], 'rotateBack');
      this.renderer.removeClass(carta2?.children[0], 'rotateFront');
      this.renderer.removeClass(carta2?.children[1], 'rotateBack');
      const getCards = this.elementRef.nativeElement.getElementsByClassName('no-match');
      for (let index = 0; index < getCards.length; index++) {//--- recorrer cartas 
        this.renderer.setStyle(getCards[index], 'pointerEvents', 'all');//--- Cancelar clics a las cartas
      }
    } else {
      // console.log("Match");
      this.renderer.setStyle(carta1?.children[1], 'background-color', '#cccccc');
      this.renderer.setStyle(carta2?.children[1], 'background-color', '#cccccc');
      this.renderer.removeClass(carta1, "no-match");
      this.renderer.removeClass(carta2, "no-match");
      this.parejas++;
      if(this.parejas == this.levelNum){
        const getCards = this.elementRef.nativeElement.getElementsByClassName('carta');
        for (let index = 0; index < getCards.length; index++) {//--- recorrer cartas 
          this.renderer.setStyle(getCards[index].children[1], 'background-color', '#0af167');//--- Cancelar clics a las cartas
        }
      } else{
        const getCards = this.elementRef.nativeElement.getElementsByClassName('no-match');
        for (let index = 0; index < getCards.length; index++) {//--- recorrer cartas 
          this.renderer.setStyle(getCards[index], 'pointerEvents', 'all');//--- Cancelar clics a las cartas
        }
      }
    }
    this.giroCarta = 0;
    this.movimientos++;
  }

}
