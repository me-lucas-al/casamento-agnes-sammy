import type { GiftSuggestion } from "../types";
import { SUGGESTION_CATEGORY_NAMES } from "./category-names";
import { fundSuggestions, singleSuggestions } from "./suggestion-builders";

const funItem = singleSuggestions(SUGGESTION_CATEGORY_NAMES.fun, "item");
const funExperience = singleSuggestions(SUGGESTION_CATEGORY_NAMES.fun, "experience");
const funFund = fundSuggestions(SUGGESTION_CATEGORY_NAMES.fun, "experience");

export const FUN_SUGGESTIONS: GiftSuggestion[] = [
  funExperience({ id: "zoeira-brigadeiro-na-cama", name: "Cota do primeiro jantar de brigadeiro na cama", description: "Jantar sem talher, com colher e muito chocolate.", priceCents: 6000 }),
  funExperience({ id: "zoeira-pizza-das-pazes", name: "Pizza da primeira DR resolvida", description: "Para fazer as pazes com a barriga cheia e o coração leve.", priceCents: 8000 }),
  funExperience({ id: "zoeira-delivery-primeiro", name: "Primeiro delivery da vida a dois", description: "Porque ninguém tem energia de cozinhar no dia da mudança.", priceCents: 7000 }),
  funExperience({ id: "zoeira-pizza-pos-mudanca", name: "Noite de pizza pós-mudança", description: "Caixas no chão, pizza na mão e muita gratidão.", priceCents: 9000 }),
  funExperience({ id: "zoeira-pipoca-maratona", name: "Vale-pipoca para maratona de séries", description: "Pipoca, cobertor e aquele episódio que vira cinco.", priceCents: 5000 }),
  funExperience({ id: "zoeira-cafezinho-meia-noite", name: "Cafezinho do casal à meia-noite", description: "Para as conversas longas que só acontecem de madrugada.", priceCents: 5000 }),
  funExperience({ id: "zoeira-macarrao-instantaneo", name: "Estoque de macarrão instantâneo do mestre-cuca", description: "Garantia de jantar nos dias em que ninguém quer cozinhar.", priceCents: 4000 }),
  funItem({ id: "zoeira-anti-ronco", name: "Kit de sono tranquilo anti-ronco", description: "Tampões de ouvido e fita nasal para a paz noturna do casal.", priceCents: 5000 }),
  funItem({ id: "zoeira-meias-desparceiradas", name: "Enxoval de meias que vão se desparceirar", description: "Para a máquina de lavar ter com quem brincar.", priceCents: 3500 }),
  funItem({ id: "zoeira-papel-higienico", name: "Estoque de papel higiênico para um ano", description: "Presente prático e que nunca vai sobrar.", priceCents: 18000 }),
  funItem({ id: "zoeira-adote-planta", name: "Adote uma plantinha (e tente não matar)", description: "Um desafio de cuidado e carinho para a casa nova.", priceCents: 6000 }),
  funItem({ id: "zoeira-jogos-tabuleiro", name: "Jogo de tabuleiro para noites de desafio", description: "Para descobrir quem é o mais competitivo da casa.", priceCents: 15000 }),
  funItem({ id: "zoeira-dois-cobertores", name: "Dois cobertores para evitar a disputa", description: "A solução definitiva para o puxa-puxa noturno.", priceCents: 12000 }),
  funItem({ id: "zoeira-tacas-apelidos", name: "Taças de brinde com os apelidos de vocês", description: "Para brindar com o carinho de quem sabe os apelidos secretos.", priceCents: 9000 }),
  funItem({ id: "zoeira-escorredor-dos-sonhos", name: "Escorredor de louça dos sonhos", description: "Para encerrar de vez o debate sobre onde a louça seca.", priceCents: 12000 }),
  funFund({ id: "zoeira-fundo-pao-de-queijo", name: "Fundo do pão de queijo da madrugada", description: "Ajuda a manter a fome sob controle quando bater a vontade.", priceCents: 20000 }, 1000),
  funFund({ id: "zoeira-fundo-tapete-gato", name: "Fundo do primeiro tapete que o gato vai arranhar", description: "Homenagem antecipada ao novo morador de quatro patas.", priceCents: 25000 }, 1000),
  funFund({ id: "zoeira-fundo-sorvete-dr", name: "Fundo do sorvete da DR resolvida", description: "Porque toda conversa difícil fica mais leve com sorvete.", priceCents: 30000 }, 1000),
];
