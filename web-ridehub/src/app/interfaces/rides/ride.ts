export interface Rides {
  id_viagem?: string,
  data: string,
  origem: string,
  destino: string,
  custo: number,
  lugares_disponiveis: number,
  descricao: string,
  estado: string,
  id_utilizador: number,
  id_viatura: number,
  geo_destino: string,
  geo_origem: string,
  id_chat: string,
  nome: string,
  userDescricao: string,
  n_telemovel: string,
  utilizadorDescricao?: string
}
