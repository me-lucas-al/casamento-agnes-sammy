import type { GiftSuggestion } from "../types";
import { STORES as S } from "./stores";
import { suggestionBuilders } from "./suggestion-builders";

const fundBuilder = suggestionBuilders("casa-nova", "cota-livre");
const bigPurchase = suggestionBuilders("casa-nova", "eletrodomestico");
const furniture = suggestionBuilders("casa-nova", "movel");

export const NEW_HOME_FUNDS: GiftSuggestion[] = [
  fundBuilder.fund("Fundo livre da casa nova", "Contribua com qualquer valor para ajudar a montar o lar de vocês.", 1000000, 2000, "dinheiro casa cota livre"),
  fundBuilder.fund("Cota livre para o que a casa precisar", "Vocês escolhem como usar, e quem presenteia escolhe quanto dar.", 500000, 2000, "dinheiro livre vaquinha"),
  fundBuilder.fund("Fundo livre de móveis", "Ajuda a escolher os móveis que vão receber a família.", 500000, 5000, "movel sofa mesa dinheiro"),
  fundBuilder.fund("Fundo livre de reforma e pintura", "Para deixar as paredes e os cantinhos com a cara de vocês.", 300000, 5000, "obra pintura reforma dinheiro"),
  fundBuilder.fund("Fundo livre de eletrodomésticos", "Contribuição para completar a cozinha e a área de serviço.", 400000, 5000, "geladeira fogao dinheiro"),
  fundBuilder.fund("Fundo livre de decoração", "Para os quadros, as plantas e os detalhes que fazem a casa ter alma.", 200000, 3000, "decorar dinheiro quadros"),
  fundBuilder.fund("Fundo livre de utensílios de cozinha", "Panelas, pratos e talheres para as primeiras refeições.", 150000, 3000, "panela prato dinheiro"),
  fundBuilder.fund("Fundo livre de imprevistos da casa", "Porque toda casa nova guarda uma surpresinha e um reparo.", 150000, 5000, "reparo emergencia dinheiro"),
  fundBuilder.fund("Fundo livre de plantas e jardim", "Para encher a casa de verde e de vida.", 100000, 2000, "plantas vasos dinheiro"),
  fundBuilder.fund("Fundo livre da primeira compra do mês", "Para encher a despensa e a geladeira logo na chegada.", 80000, 2000, "mercado compras dinheiro"),
  fundBuilder.fund("Fundo livre dos primeiros meses de internet", "Para o wi-fi nunca faltar nas maratonas e no home office.", 60000, 3000, "wifi dinheiro conta"),
  fundBuilder.fund("Fundo livre do enxoval", "Lençóis, toalhas e tudo o que deixa a casa aconchegante.", 200000, 3000, "enxoval cama banho dinheiro"),
  fundBuilder.quota("Cota da mudança", "Ajuda a levar os móveis e as caixas para o novo lar.", 100000, 5, null, "caminhao frete mudanca"),
  bigPurchase.quota("Cota da máquina de lavar roupas", "Cada cota ajuda a manter as roupas de vocês sempre limpinhas.", 220000, 11, S.magalu, "lavadora roupa lavanderia", "maquina de lavar roupas"),
  bigPurchase.quota("Cota da lava e seca", "Roupa limpa e seca em um só passo, mesmo em dia de chuva.", 400000, 10, S.fastShop, "lavadora secadora", "lava e seca"),
  bigPurchase.quota("Cota da secadora de roupas", "Para as roupas secarem mesmo em dias de chuva.", 220000, 10, S.ponto, "secar roupa lavanderia", "secadora de roupas"),
  furniture.quota("Cota do guarda-roupa", "Um espaço bonito e organizado para guardar tudo.", 180000, 6, S.tokStok, "armario roupa quarto", "guarda roupa casal"),
  furniture.quota("Cota das cortinas da casa toda", "Privacidade e charme em todos os cômodos.", 120000, 6, S.leroy, "cortina janela casa", "cortina"),
  furniture.quota("Cota da pintura da casa", "Cada cota pinta um cantinho com as cores de vocês.", 150000, 5, S.leroy, "tinta parede obra", "tinta parede"),
];
