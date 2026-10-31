import type { GiftSuggestion } from "../types";
import { STORES as S } from "./stores";
import { suggestionBuilders } from "./suggestion-builders";

const tool = suggestionBuilders("casa-nova", "ferramenta");
const cleaning = suggestionBuilders("casa-nova", "organizacao");
const security = suggestionBuilders("casa-nova", "eletronico");

export const NEW_HOME_TOOLS: GiftSuggestion[] = [
  tool.single("Kit de ferramentas básico", "Martelo, chaves e alicate para os pequenos reparos.", 20000, S.leroy, "martelo alicate chave"),
  tool.single("Furadeira com parafusadeira", "Para pendurar quadros e montar móveis sem sufoco.", 35000, S.leroy, "furadeira parafusadeira bateria"),
  tool.single("Caixa de ferramentas", "Cada ferramenta no seu lugar e fácil de achar.", 10000, S.leroy, "organizador ferramentas maleta"),
  tool.single("Trena e nível", "Para pendurar tudo reto e no lugar certo.", 5000, S.leroy, "medir trena nivel"),
  tool.single("Escada doméstica dobrável", "Para alcançar prateleiras, lâmpadas e cortinas.", 25000, S.leroy, "escada dobravel alumínio"),
  tool.single("Kit de pintura com rolos e pincéis", "Tudo para dar uma cara nova às paredes.", 9000, S.leroy, "rolo pincel tinta"),
  tool.single("Lavadora de alta pressão", "Garagem, quintal e varanda limpos com facilidade.", 50000, S.leroy, "karcher lavar quintal"),
  tool.single("Aspirador de água e pó", "Limpeza pesada depois da obra ou da mudança.", 40000, S.leroy, "aspirador obra"),
  tool.single("Mangueira de jardim com esguicho", "Para regar as plantas e lavar a varanda.", 12000, S.leroy, "jardim regar agua"),
  tool.single("Kit de plantas e vasos para varanda", "Um cantinho verde para tomar café de manhã.", 12000, S.leroy, "varanda jardim vasos"),
  tool.single("Kit churrasco", "Para o primeiro churrasco com amigos na casa nova.", 15000, S.carrefour, "churrasqueira espeto faca"),
  tool.single("Mesa e cadeiras de varanda", "Um cantinho para o café e o pôr do sol.", 50000, S.tokStok, "varanda mesa cadeira"),
  cleaning.single("Kit de limpeza completo", "Vassoura, rodo, balde e panos para começar bem.", 15000, S.casasBahia, "vassoura rodo balde"),
  cleaning.single("Varal de chão", "Roupa secando sem ocupar espaço e sem bagunça.", 12000, S.casasBahia, "varal roupa lavanderia"),
  cleaning.single("Tábua de passar roupa", "Indispensável para as roupas do dia a dia.", 12000, S.americanas, "passar roupa ferro"),
  cleaning.single("Kit de caixas organizadoras", "Para guardar tudo o que sobra depois da mudança.", 9000, S.tokStok, "caixa organizar armario"),
  cleaning.single("Filtros de linha e extensões", "Mais tomadas e mais segurança para os aparelhos.", 6000, S.kabum, "extensao tomada energia"),
  security.single("Fechadura digital", "Entrar em casa com mais segurança e sem procurar a chave.", 70000, S.amazon, "fechadura biometria senha"),
  security.single("Câmera de segurança wi-fi", "Tranquilidade para acompanhar a casa pelo celular.", 20000, S.amazon, "camera vigilancia wifi"),
  security.single("Lanterna e kit de emergência", "Para qualquer queda de energia ou imprevisto.", 6000, S.mercadoLivre, "lanterna pilha emergencia"),
];
