import type { GiftSuggestion } from "../types";
import { STORES as S } from "./stores";
import { suggestionBuilders } from "./suggestion-builders";

const utensil = suggestionBuilders("cozinha", "utensilio");
const table = suggestionBuilders("cozinha", "mesa-posta");

export const KITCHEN_UTENSILS: GiftSuggestion[] = [
  utensil.single("Jogo de panelas antiaderentes", "A base de toda cozinha feliz, do arroz ao molho.", 35000, S.camicado, "panela conjunto cozinhar"),
  utensil.single("Frigideira antiaderente", "Ovos, panquecas e bifes sem grudar.", 12000, S.mercadoLivre, "panela fritar"),
  utensil.single("Caçarola de ferro fundido", "Retém o calor e deixa o cozido com sabor de vó.", 25000, S.tokStok, "panela ferro cozido"),
  utensil.single("Panela de pressão tradicional", "Feijão no ponto em poucos minutos.", 18000, S.magalu, "feijao pressao"),
  utensil.single("Jogo de facas com cepo", "Cortes precisos e seguros para cozinhar a quatro mãos.", 12000, S.camicado, "faca churrasco chef"),
  utensil.single("Conjunto de potes herméticos", "Marmitas e sobras sempre organizadas e fresquinhas.", 9000, S.tokStok, "pote marmita guardar"),
  utensil.single("Potes de vidro para mantimentos", "Arroz, feijão e farinhas organizados e bonitos.", 10000, S.camicado, "pote despensa organizar"),
  utensil.single("Balança digital de cozinha", "Receitas certinhas, do pão ao bolo de aniversário.", 5000, S.mercadoLivre, "peso receita"),
  utensil.single("Kit de assadeiras e formas", "Para lasanhas, bolos e tortas que vão virar tradição.", 12000, S.amazon, "forma bolo assar"),
  utensil.single("Kit de utensílios de silicone", "Espátulas, colheres e pegadores que não arranham as panelas.", 8000, S.amazon, "espatula colher pegador"),
  utensil.single("Conjunto de tábuas de corte", "Tábuas de tamanhos diferentes para cada ingrediente.", 8000, S.tokStok, "tabua bambu cortar"),
  utensil.single("Escorredor de louça de inox", "Mantém a bancada organizada e a louça secando rápido.", 10000, S.amazon, "pia secar louca"),
  utensil.single("Ralador e peneiras", "Aqueles itens pequenos que sempre fazem falta.", 5000, S.mercadoLivre, "ralar peneira"),
  utensil.single("Abridor de vinho e acessórios", "Para o brinde de sexta começar sem esforço.", 6000, S.tokStok, "saca rolhas vinho"),
  utensil.single("Garrafa térmica", "Café quente o dia todo, do cafezinho à tarde.", 12000, S.mercadoLivre, "cafe termica"),
  utensil.single("Porta-temperos giratório", "Temperos sempre à mão e organizados.", 9000, S.tokStok, "tempero condimentos"),
  utensil.single("Lixeira de cozinha com pedal", "Higiene e praticidade com as mãos ocupadas.", 12000, S.leroy, "lixo pedal inox"),
  utensil.single("Tapete de cozinha", "Conforto para os pés enquanto cozinham juntos.", 7000, S.casasBahia, "tapete antiderrapante"),
  table.single("Aparelho de jantar de 20 peças", "Mesa bonita para receber a família e os amigos.", 25000, S.camicado, "prato louca jantar"),
  table.single("Faqueiro de 24 peças", "Garfos, facas e colheres para as refeições do dia a dia.", 16000, S.camicado, "talher garfo colher"),
  table.single("Jogo de taças de vidro", "Para brindar cada conquista nova da casa.", 12000, S.camicado, "taca agua suco"),
  table.single("Jogo de taças para vinho", "Elegância para as taças da noite de vinho a dois.", 14000, S.tokStok, "vinho brinde espumante"),
  table.single("Jogo de copos de vidro", "Copos resistentes para o dia a dia da casa.", 8000, S.camicado, "copo agua suco"),
  table.single("Jogo de xícaras de café", "Para o cafezinho depois do almoço de domingo.", 6000, S.camicado, "xicara cafe porcelana"),
  table.single("Jogo de canecas", "Canecas para chocolate quente e dias frios.", 7000, S.tokStok, "caneca cha chocolate"),
  table.single("Travessas de vidro com tampa", "Do forno à mesa e depois direto para a geladeira.", 9000, S.camicado, "assadeira vidro refratario"),
  table.single("Saladeira de vidro", "Para as saladas coloridas e almoços leves.", 7000, S.camicado, "tigela salada"),
  table.single("Jarra de suco", "Suco geladinho na mesa em qualquer refeição.", 6000, S.tokStok, "jarra vidro agua"),
  table.single("Jogo americano com seis peças", "Mesa posta com charme sem fazer esforço.", 7000, S.camicado, "jogo americano mesa"),
  table.single("Toalha de mesa", "Para deixar as refeições em família ainda mais especiais.", 9000, S.tokStok, "toalha mesa linho"),
  table.single("Sousplats", "Um toque elegante para a mesa dos jantares especiais.", 8000, S.camicado, "sousplat mesa posta"),
];
