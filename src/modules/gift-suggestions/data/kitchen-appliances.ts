import type { GiftSuggestion } from "../types";
import { STORES as S } from "./stores";
import { suggestionBuilders } from "./suggestion-builders";

const large = suggestionBuilders("cozinha", "eletrodomestico");
const portable = suggestionBuilders("cozinha", "eletroportatil");

export const KITCHEN_APPLIANCES: GiftSuggestion[] = [
  portable.single("Air fryer", "Para os jantares rápidos e crocantes da semana corrida.", 45000, S.magalu, "fritadeira sem oleo airfryer"),
  portable.single("Cafeteira elétrica", "O cheirinho de café fresco para começar bem cada manhã a dois.", 15000, S.mercadoLivre, "cafe filtro"),
  portable.single("Cafeteira de cápsulas", "Um cafezinho de cafeteria em casa, sem complicação.", 40000, S.amazon, "capsula expresso cafe"),
  portable.single("Máquina de café espresso", "Para o café da manhã ter cara de domingo todos os dias.", 120000, S.magalu, "espresso cafe barista"),
  portable.single("Liquidificador potente", "Vitaminas, sucos e molhos prontos em segundos.", 20000, S.magalu, "suco vitamina triturar"),
  portable.single("Batedeira planetária", "Bolos de domingo e receitas de família com muito mais facilidade.", 65000, S.fastShop, "bolo massa confeitaria"),
  portable.single("Batedeira portátil", "Prática para bater claras, cremes e massas leves.", 15000, S.mercadoLivre, "bolo mixer manual"),
  portable.single("Processador de alimentos", "Corta, rala e pica enquanto vocês cuidam de outras coisas.", 28000, S.amazon, "multiprocessador ralar picar"),
  portable.single("Mixer de mão", "Faz sopas, purês e vitaminas direto na panela ou no copo.", 15000, S.magalu, "sopa pure triturador"),
  portable.single("Panela de pressão elétrica", "Feijão, risoto e carnes macias sem precisar vigiar o fogo.", 50000, S.magalu, "multicooker pressao"),
  portable.single("Panela elétrica de arroz", "Arroz soltinho sempre, sem se preocupar com o ponto.", 16000, S.casasBahia, "arroz cozedor"),
  portable.single("Forno elétrico de bancada", "Gratina, assa e esquenta sem acender o forno grande.", 55000, S.casasBahia, "forno assar gratinar"),
  portable.single("Sanduicheira elétrica", "Lanche quente e rápido nas noites de preguiça.", 9000, S.mercadoLivre, "lanche misto quente"),
  portable.single("Grill elétrico", "Carnes e legumes grelhados sem fumaça na cozinha.", 18000, S.amazon, "churrasco grelha bife"),
  portable.single("Torradeira", "Pão crocante para o café da manhã sem demora.", 12000, S.mercadoLivre, "torrada pao cafe da manha"),
  portable.single("Chaleira elétrica", "Água quente em minutos para chá, café e macarrão.", 10000, S.amazon, "cha agua quente"),
  portable.single("Espremedor elétrico de frutas", "Suco de laranja fresquinho todas as manhãs.", 8000, S.mercadoLivre, "laranja suco fruta"),
  portable.single("Pipoqueira elétrica", "Para as sessões de cinema em casa ficarem completas.", 9000, S.mercadoLivre, "pipoca cinema"),
  portable.single("Panificadora", "Pão quentinho feito em casa com cheirinho de padaria.", 30000, S.amazon, "pao caseiro maquina de pao"),
  portable.single("Cooktop de indução portátil", "Fogão compacto, rápido e seguro para qualquer cantinho.", 28000, S.amazon, "inducao fogao eletrico"),
  large.single("Micro-ondas", "Praticidade para aquecer o jantar de ontem e a pipoca de hoje.", 65000, S.magalu, "esquentar microondas"),
  large.single("Purificador de água", "Água gelada e filtrada sempre à mão na cozinha.", 70000, S.fastShop, "filtro agua gelada"),
  large.single("Cota do frigobar", "Cada cota ajuda a manter as bebidas sempre geladinhas.", 130000, S.magalu, "geladeira pequena frigobar", "frigobar"),
  large.quota("Cota da geladeira frost free", "Cada cota ajuda a manter a cozinha de vocês sempre fresquinha.", 400000, 10, S.magalu, "refrigerador duplex", "geladeira frost free"),
  large.quota("Cota do fogão de 5 bocas", "Para o fogo da cozinha de vocês acender com estilo.", 150000, 5, S.carrefour, "fogao cozinha", "fogao 5 bocas"),
  large.quota("Cota do cooktop de 5 bocas", "Uma ajudinha para o cooktop deixar a cozinha moderna.", 120000, 6, S.casasBahia, "fogao embutir", "cooktop 5 bocas"),
  large.quota("Cota da coifa", "Para a cozinha ficar sem cheiro de fritura.", 100000, 5, S.leroy, "depurador exaustor", "coifa de parede"),
  large.quota("Cota do forno de embutir", "Assados de domingo com a cara da casa nova.", 250000, 10, S.fastShop, "forno eletrico embutir", "forno de embutir"),
  large.quota("Cota da máquina de lavar louças", "Menos louça na pia e mais tempo juntos no sofá.", 300000, 10, S.fastShop, "lava loucas", "lava loucas 14 servicos"),
  large.quota("Cota da adega climatizada", "Para guardar os vinhos que vão brindar os melhores momentos.", 200000, 8, S.magalu, "vinho adega", "adega climatizada"),
];
