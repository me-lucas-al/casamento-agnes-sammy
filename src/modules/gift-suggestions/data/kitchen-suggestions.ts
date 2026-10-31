import type { GiftSuggestion } from "../types";
import { SUGGESTION_CATEGORY_NAMES } from "./category-names";
import { quotaSuggestions, singleSuggestions } from "./suggestion-builders";

const item = singleSuggestions(SUGGESTION_CATEGORY_NAMES.kitchen, "item");
const bigItem = quotaSuggestions(SUGGESTION_CATEGORY_NAMES.kitchen, "item");

export const KITCHEN_SUGGESTIONS: GiftSuggestion[] = [
  item({ id: "cozinha-air-fryer", name: "Air fryer", description: "Para os jantares rápidos e crocantes da semana corrida.", priceCents: 45000 }),
  item({ id: "cozinha-cafeteira", name: "Cafeteira elétrica", description: "O cheirinho de café fresco para começar bem cada manhã a dois.", priceCents: 15000 }),
  item({ id: "cozinha-liquidificador", name: "Liquidificador potente", description: "Vitaminas, sucos e molhos prontos em segundos.", priceCents: 20000 }),
  item({ id: "cozinha-batedeira", name: "Batedeira planetária", description: "Bolos de domingo e receitas de família com muito mais facilidade.", priceCents: 65000 }),
  item({ id: "cozinha-processador", name: "Processador de alimentos", description: "Corta, rala e pica enquanto vocês cuidam de outras coisas.", priceCents: 28000 }),
  item({ id: "cozinha-panela-pressao-eletrica", name: "Panela de pressão elétrica", description: "Feijão, risoto e carnes macias sem precisar vigiar o fogo.", priceCents: 50000 }),
  item({ id: "cozinha-forno-eletrico", name: "Forno elétrico de bancada", description: "Gratina, assa e esquenta sem acender o forno grande.", priceCents: 55000 }),
  item({ id: "cozinha-micro-ondas", name: "Micro-ondas", description: "Praticidade para aquecer o jantar de ontem e a pipoca de hoje.", priceCents: 65000 }),
  item({ id: "cozinha-jogo-panelas", name: "Jogo de panelas antiaderentes", description: "A base de toda cozinha feliz, do arroz ao molho.", priceCents: 35000 }),
  item({ id: "cozinha-jogo-facas", name: "Jogo de facas com cepo", description: "Cortes precisos e seguros para cozinhar a quatro mãos.", priceCents: 12000 }),
  item({ id: "cozinha-potes-hermeticos", name: "Conjunto de potes herméticos", description: "Marmitas e sobras sempre organizadas e fresquinhas.", priceCents: 9000 }),
  item({ id: "cozinha-tacas-vidro", name: "Jogo de taças de vidro", description: "Para brindar cada conquista nova da casa.", priceCents: 12000 }),
  item({ id: "cozinha-aparelho-jantar", name: "Aparelho de jantar de 20 peças", description: "Mesa bonita para receber a família e os amigos.", priceCents: 25000 }),
  item({ id: "cozinha-talheres", name: "Faqueiro de 24 peças", description: "Garfos, facas e colheres para as refeições do dia a dia.", priceCents: 16000 }),
  item({ id: "cozinha-sanduicheira", name: "Sanduicheira elétrica", description: "Lanche quente e rápido nas noites de preguiça.", priceCents: 9000 }),
  item({ id: "cozinha-balanca-digital", name: "Balança digital de cozinha", description: "Receitas certinhas, do pão ao bolo de aniversário.", priceCents: 5000 }),
  item({ id: "cozinha-assadeiras", name: "Kit de assadeiras e formas", description: "Para lasanhas, bolos e tortas que vão virar tradição.", priceCents: 12000 }),
  bigItem({ id: "cozinha-geladeira", name: "Cota da geladeira frost free", description: "Cada cota ajuda a manter a cozinha de vocês sempre fresquinha.", priceCents: 400000 }, 10),
  bigItem({ id: "cozinha-cooktop", name: "Cota do cooktop de 5 bocas", description: "Uma ajudinha para o fogo da cozinha de vocês acender com estilo.", priceCents: 120000 }, 6),
  bigItem({ id: "cozinha-lava-loucas", name: "Cota da máquina de lavar louças", description: "Menos louça na pia e mais tempo juntos no sofá.", priceCents: 300000 }, 10),
];
