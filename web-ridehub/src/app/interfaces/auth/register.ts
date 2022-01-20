export interface Register {
    email: string,
    n_telemovel: number,
    nome: string,
    password: string,
    saldo: string,
    descricao: string,
    genero: "F" | "M" | "NS",
    estado_conta: "A" | "D"
}
