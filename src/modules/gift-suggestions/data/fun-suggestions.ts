import type { GiftSuggestion } from "../types";
import { suggestionBuilders } from "./suggestion-builders";

const funMoment = suggestionBuilders("divertidos", "divertido", "experience");

export const FUN_SUGGESTIONS: GiftSuggestion[] = [
  funMoment.single("Cota do primeiro jantar de brigadeiro na cama", "Jantar sem talher, com colher e muito chocolate.", 6000, null, "doce chocolate cama"),
  funMoment.single("Pizza da primeira DR resolvida", "Para fazer as pazes com a barriga cheia e o coração leve.", 8000, null, "pizza briga pazes"),
  funMoment.single("Primeiro delivery da vida a dois", "Porque ninguém tem energia de cozinhar no dia da mudança.", 7000, null, "comida entrega mudanca"),
  funMoment.single("Noite de pizza pós-mudança", "Caixas no chão, pizza na mão e muita gratidão.", 9000, null, "pizza mudanca caixas"),
  funMoment.single("Vale-pipoca para maratona de séries", "Pipoca, cobertor e aquele episódio que vira cinco.", 5000, null, "serie filme pipoca"),
  funMoment.single("Cafezinho do casal à meia-noite", "Para as conversas longas que só acontecem de madrugada.", 5000, null, "cafe madrugada conversa"),
  funMoment.single("Estoque de macarrão instantâneo do mestre-cuca", "Garantia de jantar nos dias em que ninguém quer cozinhar.", 4000, null, "miojo jantar preguica"),
  funMoment.single("Vale-sorvete de domingo", "Sobremesa garantida na tarde de preguiça.", 4000, null, "sorvete domingo sobremesa"),
  funMoment.single("Noite de fondue em casa", "Queijo, chocolate e muitas risadas na sala.", 15000, null, "queijo chocolate jantar"),
  funMoment.single("Vale-churrasco com os amigos", "Para o primeiro churrasco da casa nova.", 25000, null, "carne amigos churrasqueira"),
  funMoment.single("Noite de karaokê em casa", "Para desafinar juntos e rir muito.", 8000, null, "musica cantar festa"),
  funMoment.single("Vale-cinema com pipoca gigante", "Uma noite de filme fora de casa e balde de pipoca.", 12000, null, "cinema filme passeio"),
  funMoment.single("Comemoração do primeiro boleto pago sem susto", "Porque pagar as contas em dia merece brinde.", 5000, null, "conta dinheiro brinde"),
  funMoment.single("Dia de sopa e filme no sofá", "Para os dias de chuva e preguiça de sair.", 6000, null, "sopa chuva filme"),
  funMoment.fund("Fundo do pão de queijo da madrugada", "Ajuda a manter a fome sob controle quando bater a vontade.", 20000, 1000, "lanche madrugada dinheiro"),
  funMoment.fund("Fundo do primeiro tapete que o gato vai arranhar", "Homenagem antecipada ao novo morador de quatro patas.", 25000, 1000, "pet gato dinheiro"),
  funMoment.fund("Fundo do sorvete da DR resolvida", "Porque toda conversa difícil fica mais leve com sorvete.", 30000, 1000, "sorvete briga dinheiro"),
  funMoment.fund("Fundo do delivery de madrugada", "Para o lanche das duas da manhã nunca faltar.", 15000, 1000, "lanche entrega dinheiro"),
  funMoment.fund("Fundo da cerveja gelada na geladeira", "Para sempre ter uma geladinha esperando em casa.", 20000, 1000, "bebida geladeira dinheiro"),
  funMoment.fund("Fundo do pet que ainda vai chegar", "Para o futuro bichinho ter caminha, ração e muito carinho.", 30000, 1000, "cachorro gato dinheiro"),
];
