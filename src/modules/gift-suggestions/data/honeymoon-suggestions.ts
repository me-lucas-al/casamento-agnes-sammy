import type { GiftSuggestion } from "../types";
import { SUGGESTION_CATEGORY_NAMES } from "./category-names";
import { fundSuggestions, quotaSuggestions, singleSuggestions } from "./suggestion-builders";

const experience = singleSuggestions(SUGGESTION_CATEGORY_NAMES.honeymoon, "experience");
const quotaExperience = quotaSuggestions(SUGGESTION_CATEGORY_NAMES.honeymoon, "experience");
const fund = fundSuggestions(SUGGESTION_CATEGORY_NAMES.honeymoon, "experience");

export const HONEYMOON_SUGGESTIONS: GiftSuggestion[] = [
  quotaExperience({ id: "lua-passagens-aereas", name: "Cotas das passagens aéreas", description: "Ajude os noivos a levantar voo rumo à lua de mel.", priceCents: 300000 }, 12),
  quotaExperience({ id: "lua-hospedagem-cinco-noites", name: "Cotas de cinco noites de hospedagem", description: "Cada cota paga um pedacinho do cantinho onde vão descansar.", priceCents: 300000 }, 5),
  quotaExperience({ id: "lua-aluguel-carro", name: "Cotas do aluguel de carro", description: "Liberdade para explorar cada cantinho do destino.", priceCents: 60000 }, 3),
  quotaExperience({ id: "lua-ensaio-fotografico", name: "Cotas do ensaio fotográfico do casal", description: "Para eternizar a viagem em fotos lindas.", priceCents: 70000 }, 7),
  experience({ id: "lua-jantar-romantico", name: "Jantar romântico à luz de velas", description: "Uma noite especial só para os dois, com direito a brinde.", priceCents: 40000 }),
  experience({ id: "lua-passeio-barco", name: "Passeio de barco no pôr do sol", description: "Para ver o dia terminar juntinhos, com vista para o mar.", priceCents: 30000 }),
  experience({ id: "lua-massagem-casal", name: "Massagem para o casal", description: "Relaxamento a dois depois de tanta correria de casamento.", priceCents: 45000 }),
  experience({ id: "lua-cafe-na-cama", name: "Café da manhã na cama", description: "Para começar um dia de lua de mel sem pressa.", priceCents: 12000 }),
  experience({ id: "lua-passeio-buggy", name: "Passeio de buggy", description: "Aventura, vento no rosto e boas risadas.", priceCents: 35000 }),
  experience({ id: "lua-mergulho", name: "Mergulho com snorkel", description: "Para descobrir juntos o mundo debaixo da água.", priceCents: 25000 }),
  experience({ id: "lua-transfer", name: "Transfer do aeroporto ao hotel", description: "Chegada tranquila, sem se preocupar com malas e trânsito.", priceCents: 15000 }),
  experience({ id: "lua-seguro-viagem", name: "Seguro viagem do casal", description: "Para viajar com tranquilidade e só pensar em aproveitar.", priceCents: 25000 }),
  experience({ id: "lua-upgrade-vista-mar", name: "Upgrade para quarto com vista para o mar", description: "Acordar olhando o horizonte faz toda a diferença.", priceCents: 50000 }),
  experience({ id: "lua-day-spa", name: "Dia de spa a dois", description: "Um dia inteiro para relaxar e se cuidar juntos.", priceCents: 50000 }),
  fund({ id: "lua-fundo-lua-de-mel", name: "Fundo livre da lua de mel", description: "Contribua com o valor que o coração mandar para a viagem dos sonhos.", priceCents: 1000000 }, 5000),
  fund({ id: "lua-fundo-passeios", name: "Fundo livre de passeios", description: "Ajuda a pagar as aventuras e os passeios da viagem.", priceCents: 300000 }, 5000),
  fund({ id: "lua-fundo-jantares", name: "Fundo livre de jantares especiais", description: "Para brindar com um bom jantar em cada noite da viagem.", priceCents: 200000 }, 3000),
  fund({ id: "lua-fundo-lembrancinhas", name: "Fundo livre de lembranças da viagem", description: "Para trazer na mala um mimo para cada pessoa querida.", priceCents: 100000 }, 2000),
];
