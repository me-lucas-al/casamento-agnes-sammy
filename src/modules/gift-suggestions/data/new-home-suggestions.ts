import type { GiftSuggestion } from "../types";
import { SUGGESTION_CATEGORY_NAMES } from "./category-names";
import { fundSuggestions, quotaSuggestions, singleSuggestions } from "./suggestion-builders";

const item = singleSuggestions(SUGGESTION_CATEGORY_NAMES.newHome, "item");
const quotaItem = quotaSuggestions(SUGGESTION_CATEGORY_NAMES.newHome, "item");
const fund = fundSuggestions(SUGGESTION_CATEGORY_NAMES.newHome, "item");

export const NEW_HOME_SUGGESTIONS: GiftSuggestion[] = [
  fund({ id: "casa-fundo-casa-nova", name: "Fundo livre da casa nova", description: "Contribua com qualquer valor para ajudar a montar o lar de vocês.", priceCents: 1000000 }, 2000),
  fund({ id: "casa-fundo-moveis", name: "Fundo livre de móveis", description: "Ajuda a escolher os móveis que vão receber a família.", priceCents: 500000 }, 5000),
  fund({ id: "casa-fundo-reforma", name: "Fundo livre de reforma e pintura", description: "Para deixar as paredes e os cantinhos com a cara de vocês.", priceCents: 300000 }, 5000),
  fund({ id: "casa-fundo-eletrodomesticos", name: "Fundo livre de eletrodomésticos", description: "Contribuição para completar a cozinha e a área de serviço.", priceCents: 400000 }, 5000),
  fund({ id: "casa-fundo-imprevistos", name: "Fundo livre de imprevistos da casa", description: "Porque toda casa nova guarda uma surpresinha e um reparo.", priceCents: 150000 }, 5000),
  fund({ id: "casa-fundo-jardim", name: "Fundo livre de plantas e jardim", description: "Para encher a casa de verde e de vida.", priceCents: 100000 }, 2000),
  fund({ id: "casa-fundo-primeira-compra", name: "Fundo livre da primeira compra do mês", description: "Para encher a despensa e a geladeira logo na chegada.", priceCents: 80000 }, 2000),
  fund({ id: "casa-fundo-internet", name: "Fundo livre dos primeiros meses de internet", description: "Para o wi-fi nunca faltar nas maratonas e no home office.", priceCents: 60000 }, 3000),
  quotaItem({ id: "casa-maquina-lavar-roupas", name: "Cota da máquina de lavar roupas", description: "Cada cota ajuda a manter as roupas de vocês sempre limpinhas.", priceCents: 220000 }, 11),
  quotaItem({ id: "casa-guarda-roupa", name: "Cota do guarda-roupa", description: "Um espaço bonito e organizado para guardar tudo.", priceCents: 180000 }, 6),
  quotaItem({ id: "casa-cortinas", name: "Cota das cortinas da casa toda", description: "Privacidade e charme em todos os cômodos.", priceCents: 120000 }, 6),
  quotaItem({ id: "casa-mudanca", name: "Cota da mudança", description: "Ajuda a levar os móveis e as caixas para o novo lar.", priceCents: 100000 }, 5),
  item({ id: "casa-kit-ferramentas", name: "Kit de ferramentas básico", description: "Martelo, chaves e alicate para os pequenos reparos.", priceCents: 20000 }),
  item({ id: "casa-furadeira", name: "Furadeira com parafusadeira", description: "Para pendurar quadros e montar móveis sem sufoco.", priceCents: 35000 }),
  item({ id: "casa-escada", name: "Escada doméstica dobrável", description: "Para alcançar prateleiras, lâmpadas e cortinas.", priceCents: 25000 }),
  item({ id: "casa-kit-limpeza", name: "Kit de limpeza completo", description: "Vassoura, rodo, balde e panos para começar bem.", priceCents: 15000 }),
  item({ id: "casa-fechadura-digital", name: "Fechadura digital", description: "Entrar em casa com mais segurança e sem procurar a chave.", priceCents: 70000 }),
];
