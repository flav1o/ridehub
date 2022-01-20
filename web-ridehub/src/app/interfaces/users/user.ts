export interface User {
    id_utilizador: number,
    nome: string,
    genero: 'M' | 'F' | 'NS',
    descricao: string,
    email: string,
    password: string,
    n_telemovel: string,
    saldo: number,
    estado_conta: 'A' | 'D',
    instagram?: null,
    twitter?: null,
    snapchat?: null;
}
