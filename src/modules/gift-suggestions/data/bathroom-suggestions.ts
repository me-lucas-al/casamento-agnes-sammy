import type { GiftSuggestion } from "../types";
import { STORES as S } from "./stores";
import { suggestionBuilders } from "./suggestion-builders";

const linen = suggestionBuilders("quarto-banho", "cama-banho");
const bathroom = suggestionBuilders("quarto-banho", "organizacao");

export const BATHROOM_SUGGESTIONS: GiftSuggestion[] = [
  linen.single("Kit de toalhas de banho", "Cinco toalhas macias para a rotina de vocês.", 20000, S.camicado, "toalha banho"),
  linen.single("Jogo de toalhas de rosto", "Toalhas macias para o lavabo e o dia a dia.", 8000, S.camicado, "toalha rosto"),
  linen.single("Toalhas de lavabo", "Para receber as visitas com capricho.", 5000, S.camicado, "toalha lavabo mao"),
  linen.single("Toalha de piso", "Evita escorregões na saída do banho.", 5000, S.casasBahia, "tapete banheiro toalha"),
  linen.single("Par de roupões", "Para ficar quentinho depois do banho.", 25000, S.camicado, "roupao banho casal"),
  linen.single("Kit de tapetes de banheiro", "Evita escorregões e deixa o banheiro mais aconchegante.", 9000, S.casasBahia, "tapete banheiro"),
  linen.single("Cortina de box", "Para o banho sem molhar o banheiro todo.", 6000, S.leroy, "box cortina banheiro"),
  bathroom.single("Kit de acessórios para banheiro", "Saboneteira, porta-escova e lixeira combinando.", 13000, S.camicado, "saboneteira porta escova"),
  bathroom.single("Cesto de roupa suja", "Para a roupa suja não invadir o quarto.", 12000, S.tokStok, "cesto roupa lavanderia"),
  bathroom.single("Lixeira de banheiro", "Pequena, discreta e prática.", 5000, S.leroy, "lixo banheiro pedal"),
  bathroom.single("Balança digital de banheiro", "Para acompanhar a saúde com tranquilidade.", 9000, S.amazon, "peso corporal digital"),
  bathroom.single("Espelho de banheiro", "Mais luz e amplitude para o lavabo.", 15000, S.leroy, "espelho lavabo parede"),
  bathroom.single("Prateleira organizadora de banheiro", "Cada item no seu lugar, sem bagunça.", 10000, S.leroy, "prateleira banheiro box"),
  bathroom.single("Chuveiro elétrico", "Banho quentinho para as manhãs geladas.", 15000, S.leroy, "ducha eletrica banho"),
  bathroom.single("Kit spa em casa", "Velas, sais e esfoliantes para o banho de domingo.", 12000, S.camicado, "relaxar sais banho vela"),
];
