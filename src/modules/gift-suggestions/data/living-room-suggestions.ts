import type { GiftSuggestion } from "../types";
import { SUGGESTION_CATEGORY_NAMES } from "./category-names";
import { quotaSuggestions, singleSuggestions } from "./suggestion-builders";

const item = singleSuggestions(SUGGESTION_CATEGORY_NAMES.livingRoom, "item");
const bigItem = quotaSuggestions(SUGGESTION_CATEGORY_NAMES.livingRoom, "item");

export const LIVING_ROOM_SUGGESTIONS: GiftSuggestion[] = [
  item({ id: "sala-tapete", name: "Tapete de sala", description: "Deixa o ambiente mais aconchegante e combina com qualquer estilo.", priceCents: 45000 }),
  item({ id: "sala-kit-quadros", name: "Kit de quadros decorativos", description: "Três quadros para dar personalidade às paredes da casa nova.", priceCents: 18000 }),
  item({ id: "sala-vasos", name: "Vasos decorativos", description: "Para plantas, flores e aquele toque de verde na estante.", priceCents: 12000 }),
  item({ id: "sala-almofadas", name: "Kit de almofadas", description: "Quatro almofadas para os cochilos de domingo no sofá.", priceCents: 14000 }),
  item({ id: "sala-manta-sofa", name: "Manta para sofá", description: "Companheira de maratonas de filme em dias frios.", priceCents: 10000 }),
  item({ id: "sala-luminaria-piso", name: "Luminária de piso", description: "Luz suave e aconchegante para as noites em casa.", priceCents: 25000 }),
  item({ id: "sala-espelho", name: "Espelho decorativo grande", description: "Amplia a sala e deixa tudo mais iluminado.", priceCents: 30000 }),
  item({ id: "sala-mesa-centro", name: "Mesa de centro", description: "O ponto de encontro das conversas, dos cafés e dos jogos.", priceCents: 50000 }),
  item({ id: "sala-porta-retratos", name: "Kit de porta-retratos", description: "Espaço para guardar as melhores fotos de vocês dois.", priceCents: 8000 }),
  item({ id: "sala-caixa-som", name: "Caixa de som bluetooth", description: "A trilha sonora de cada jantar e faxina animada.", priceCents: 35000 }),
  item({ id: "sala-difusor", name: "Difusor de aromas", description: "Um cheirinho gostoso que faz a casa parecer um abraço.", priceCents: 9000 }),
  item({ id: "sala-relogio-parede", name: "Relógio de parede", description: "Para contar as horas e cada momento da vida a dois.", priceCents: 13000 }),
  item({ id: "sala-rack-tv", name: "Rack para a TV", description: "Organiza a sala e abriga as lembranças da casa.", priceCents: 90000 }),
  bigItem({ id: "sala-sofa", name: "Cota do sofá retrátil", description: "Cada cota ajuda a montar o cantinho mais confortável da casa.", priceCents: 300000 }, 10),
  bigItem({ id: "sala-smart-tv", name: "Cota da smart TV de 50 polegadas", description: "Para as noites de filme, série e pipoca de vocês.", priceCents: 240000 }, 8),
  bigItem({ id: "sala-aspirador-robo", name: "Cota do aspirador robô", description: "Menos faxina e mais tempo para aproveitar a casa.", priceCents: 180000 }, 6),
];
