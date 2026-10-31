import type { GiftSuggestion } from "../types";
import { STORES as S } from "./stores";
import { suggestionBuilders } from "./suggestion-builders";

const furniture = suggestionBuilders("sala", "movel");
const tech = suggestionBuilders("sala", "eletronico");

export const LIVING_ROOM_FURNITURE_TECH: GiftSuggestion[] = [
  furniture.single("Mesa de centro", "O ponto de encontro das conversas, dos cafés e dos jogos.", 50000, S.tokStok, "mesa sala centro"),
  furniture.single("Rack para a TV", "Organiza a sala e abriga as lembranças da casa.", 90000, S.magalu, "painel tv estante"),
  furniture.single("Aparador", "Charme para a entrada ou a sala de jantar.", 70000, S.tokStok, "buffet aparador console"),
  furniture.single("Poltrona confortável", "Um cantinho de leitura só de vocês.", 80000, S.tokStok, "poltrona leitura cadeira"),
  furniture.single("Puff redondo", "Assento extra para quando chegam as visitas.", 25000, S.mercadoLivre, "puff banqueta"),
  furniture.single("Estante para livros", "Espaço para livros, plantas e lembranças.", 60000, S.leroy, "estante livros nichos"),
  furniture.single("Jogo de quatro cadeiras", "Para a mesa de jantar receber muita gente querida.", 60000, S.tokStok, "cadeira jantar mesa"),
  furniture.quota("Cota do sofá retrátil", "Cada cota ajuda a montar o cantinho mais confortável da casa.", 300000, 10, S.magalu, "sofa sala retratil", "sofa retratil"),
  furniture.quota("Cota da mesa de jantar", "Cada cota ajuda a montar a mesa dos almoços em família.", 180000, 6, S.tokStok, "mesa jantar sala", "mesa de jantar"),
  furniture.quota("Cota da mesa de jantar de quatro lugares", "Para o jantar a dois e as visitas ocasionais.", 150000, 5, S.leroy, "mesa jantar pequena", "mesa de jantar 4 lugares"),
  tech.single("Caixa de som bluetooth", "A trilha sonora de cada jantar e faxina animada.", 35000, S.amazon, "som musica portatil"),
  tech.single("Soundbar", "Som de cinema para as maratonas em casa.", 80000, S.fastShop, "som tv cinema"),
  tech.single("Assistente virtual com caixa de som", "Música, lembretes e receitas só pedindo em voz alta.", 35000, S.amazon, "alexa echo smart speaker"),
  tech.single("Kit de lâmpadas inteligentes", "Luzes que mudam de cor pelo celular.", 12000, S.amazon, "lampada smart wifi"),
  tech.single("Roteador wi-fi", "Internet forte em todos os cômodos da casa.", 25000, S.kabum, "wifi internet mesh"),
  tech.single("Streaming box 4K", "Transforma qualquer TV em smart TV.", 40000, S.amazon, "tv box chromecast fire"),
  tech.single("Projetor para filmes", "Cinema na parede da sala nas noites de sábado.", 90000, S.kabum, "cinema projetor tela"),
  tech.single("Tomada inteligente", "Controla aparelhos pelo celular de qualquer lugar.", 5000, S.amazon, "smart plug wifi"),
  tech.single("Aspirador de pó vertical", "Limpeza rápida sem arrastar fios pela casa.", 40000, S.magalu, "aspirador sem fio vertical"),
  tech.single("Ventilador de teto", "Frescor para a sala nos dias quentes.", 30000, S.leroy, "ventilador luz teto"),
  tech.quota("Cota da smart TV de 50 polegadas", "Para as noites de filme, série e pipoca de vocês.", 240000, 8, S.magalu, "televisao 4k smart tv", "smart tv 50 polegadas"),
  tech.quota("Cota do aspirador robô", "Menos faxina e mais tempo para aproveitar a casa.", 180000, 6, S.amazon, "robo limpeza aspirador", "aspirador robo"),
];
