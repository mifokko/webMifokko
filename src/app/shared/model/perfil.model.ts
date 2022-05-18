import { Observable } from "rxjs";

export interface Perfil{
    fotoPerfil:  Observable<string> | undefined,
    fotoPortada:  Observable<string> | undefined,    
}
