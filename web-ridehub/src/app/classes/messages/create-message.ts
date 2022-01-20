export class CreateMessage {
    id_chat: string;
    id_viagem: number;
    id_utilizador: number;
    mensagem: string;
    
    constructor(id_chat: string, id_viagem: number, id_utilizador: number, mensagem: string) {
        this.id_chat = id_chat;
        this.id_viagem = id_viagem;
        this.id_utilizador = id_utilizador;
        this.mensagem = mensagem;
    }
}
