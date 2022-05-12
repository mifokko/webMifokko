import { Observable } from "rxjs";

export interface Perfil{
    FotoPerfil:  Observable<string> | undefined,
    FotoPortada:  Observable<string> | undefined,    
}
