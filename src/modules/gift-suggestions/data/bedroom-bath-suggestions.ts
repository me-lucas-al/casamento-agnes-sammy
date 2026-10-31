import type { GiftSuggestion } from "../types";
import { SUGGESTION_CATEGORY_NAMES } from "./category-names";
import { quotaSuggestions, singleSuggestions } from "./suggestion-builders";

const item = singleSuggestions(SUGGESTION_CATEGORY_NAMES.bedroomBath, "item");
const bigItem = quotaSuggestions(SUGGESTION_CATEGORY_NAMES.bedroomBath, "item");

export const BEDROOM_BATH_SUGGESTIONS: GiftSuggestion[] = [
  item({ id: "quarto-jogo-cama-queen", name: "Jogo de cama queen", description: "Lençóis macios para noites de sono tranquilo.", priceCents: 35000 }),
  item({ id: "quarto-edredom", name: "Edredom casal", description: "Quentinho para os dias frios e para dormir de conchinha.", priceCents: 30000 }),
  item({ id: "quarto-travesseiros", name: "Par de travesseiros", description: "Para descansar bem depois de um dia cheio.", priceCents: 16000 }),
  item({ id: "quarto-protetor-colchao", name: "Protetor de colchão", description: "Cuida do colchão e deixa a cama mais confortável.", priceCents: 15000 }),
  item({ id: "quarto-manta-microfibra", name: "Manta de microfibra", description: "Leve, macia e ótima para cobrir os pés frios.", priceCents: 14000 }),
  item({ id: "quarto-cortina-blackout", name: "Cortina blackout", description: "Escuridão total para dormir até mais tarde nos fins de semana.", priceCents: 22000 }),
  item({ id: "quarto-abajures", name: "Par de abajures", description: "Luz aconchegante para ler antes de dormir.", priceCents: 18000 }),
  item({ id: "quarto-espelho-corpo", name: "Espelho de corpo inteiro", description: "Para conferir o look antes de sair juntos.", priceCents: 25000 }),
  item({ id: "quarto-ferro-vapor", name: "Ferro a vapor", description: "Roupas bem passadas para os compromissos de vocês.", priceCents: 18000 }),
  item({ id: "quarto-secador", name: "Secador de cabelo", description: "Cabelo pronto em minutos, sem atrasar o passeio.", priceCents: 20000 }),
  item({ id: "banho-kit-toalhas", name: "Kit de toalhas de banho", description: "Cinco toalhas macias para a rotina de vocês.", priceCents: 20000 }),
  item({ id: "banho-roupao", name: "Par de roupões", description: "Para ficar quentinho depois do banho.", priceCents: 25000 }),
  item({ id: "banho-tapetes", name: "Kit de tapetes de banheiro", description: "Evita escorregões e deixa o banheiro mais aconchegante.", priceCents: 9000 }),
  item({ id: "banho-acessorios", name: "Kit de acessórios para banheiro", description: "Saboneteira, porta-escova e lixeira combinando.", priceCents: 13000 }),
  item({ id: "banho-cesto-roupa", name: "Cesto de roupa suja", description: "Para a roupa suja não invadir o quarto.", priceCents: 12000 }),
  bigItem({ id: "quarto-cama-box", name: "Cota da cama box queen com colchão", description: "Cada cota é um passo para as noites mais confortáveis.", priceCents: 250000 }, 10),
  bigItem({ id: "quarto-ar-condicionado", name: "Cota do ar-condicionado split", description: "Para dormir fresquinho nas noites de verão.", priceCents: 220000 }, 11),
];
