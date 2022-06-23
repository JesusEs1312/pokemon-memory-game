import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Pokemon } from '../interfaces/game.interfaces';
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class GameService {
    private pokeAPI: string = "https://pokeapi.co/api/v2";

    public getPokemon(id: number){
        const url = `${this.pokeAPI}/pokemon/${id}`;
        return this.http.get<any>(url);
    }

    constructor(private http: HttpClient){}
}