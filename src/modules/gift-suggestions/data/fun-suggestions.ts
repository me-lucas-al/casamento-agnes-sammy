import type { GiftSuggestion } from "../types";
import { STORES as S } from "./stores";
import { suggestionBuilders } from "./suggestion-builders";

const funItem = suggestionBuilders("divertidos", "divertido");
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
  funItem.single("Kit de sono tranquilo anti-ronco", "Tampões de ouvido e fita nasal para a paz noturna do casal.", 5000, S.mercadoLivre, "ronco dormir tampao"),
  funItem.single("Enxoval de meias que vão se desparceirar", "Para a máquina de lavar ter com quem brincar.", 3500, S.mercadoLivre, "meia lavanderia"),
  funItem.single("Estoque de papel higiênico para um ano", "Presente prático e que nunca vai sobrar.", 18000, S.carrefour, "papel higienico banheiro"),
  funItem.single("Adote uma plantinha (e tente não matar)", "Um desafio de cuidado e carinho para a casa nova.", 6000, S.mercadoLivre, "planta suculenta cuidado", "muda de suculenta"),
  funItem.single("Jogo de tabuleiro para noites de desafio", "Para descobrir quem é o mais competitivo da casa.", 15000, S.amazon, "jogo tabuleiro brincadeira", "jogo de tabuleiro"),
  funItem.single("Jogo de cartas para casais", "Perguntas e desafios para se conhecerem ainda mais.", 6000, S.amazon, "cartas perguntas casal", "jogo de cartas para casais"),
  funItem.single("Quebra-cabeça de mil peças", "Para montar juntos nas tardes de chuva.", 8000, S.amazon, "puzzle passatempo", "quebra cabeca 1000 pecas"),
  funItem.single("Dois cobertores para evitar a disputa", "A solução definitiva para o puxa-puxa noturno.", 12000, S.casasBahia, "cobertor casal disputa", "cobertor casal"),
  funItem.single("Taças de brinde com os apelidos de vocês", "Para brindar com o carinho de quem sabe os apelidos secretos.", 9000, S.mercadoLivre, "taca personalizada nome", "taca personalizada"),
  funItem.single("Escorredor de louça dos sonhos", "Para encerrar de vez o debate sobre onde a louça seca.", 12000, S.tokStok, "louca debate escorredor", "escorredor de louca"),
  funItem.single("Avental personalizado de casal", "Para cozinharem juntos com muito estilo.", 8000, S.mercadoLivre, "cozinha avental nome", "avental casal personalizado"),
  funItem.single("Canecas de casal com frases", "Cafés da manhã com amor e bom humor.", 7000, S.mercadoLivre, "caneca presente frase", "caneca casal"),
  funItem.single("Pijamas combinando", "Para dormir de pijama de casal sem vergonha.", 15000, S.magalu, "pijama casal dormir", "pijama casal"),
  funItem.single("Chinelos de casal", "Conforto e pés quentinhos pela casa toda.", 6000, S.mercadoLivre, "chinelo pantufa casal", "pantufa casal"),
  funItem.single("Máscaras de dormir e pantufas", "Sono tranquilo mesmo com a luz da rua.", 8000, S.amazon, "descansar dormir mascara", "mascara de dormir"),
  funItem.single("Placa de regras da casa", "Regras bem-humoradas para colocar na parede.", 7000, S.mercadoLivre, "quadro frase parede", "quadro regras da casa"),
  funMoment.fund("Fundo do pão de queijo da madrugada", "Ajuda a manter a fome sob controle quando bater a vontade.", 20000, 1000, "lanche madrugada dinheiro"),
  funMoment.fund("Fundo do primeiro tapete que o gato vai arranhar", "Homenagem antecipada ao novo morador de quatro patas.", 25000, 1000, "pet gato dinheiro"),
  funMoment.fund("Fundo do sorvete da DR resolvida", "Porque toda conversa difícil fica mais leve com sorvete.", 30000, 1000, "sorvete briga dinheiro"),
  funMoment.fund("Fundo do delivery de madrugada", "Para o lanche das duas da manhã nunca faltar.", 15000, 1000, "lanche entrega dinheiro"),
  funMoment.fund("Fundo da cerveja gelada na geladeira", "Para sempre ter uma geladinha esperando em casa.", 20000, 1000, "bebida geladeira dinheiro"),
  funMoment.fund("Fundo do pet que ainda vai chegar", "Para o futuro bichinho ter caminha, ração e muito carinho.", 30000, 1000, "cachorro gato dinheiro"),
];
