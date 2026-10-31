import type { GiftSuggestion } from "../types";
import { STORES as S } from "./stores";
import { suggestionBuilders } from "./suggestion-builders";

const linen = suggestionBuilders("quarto-banho", "cama-banho");
const furniture = suggestionBuilders("quarto-banho", "movel");
const comfort = suggestionBuilders("quarto-banho", "eletroportatil");
const organizing = suggestionBuilders("quarto-banho", "organizacao");

export const BEDROOM_SUGGESTIONS: GiftSuggestion[] = [
  linen.single("Jogo de cama queen", "Lençóis macios para noites de sono tranquilo.", 35000, S.camicado, "lencol fronha casal"),
  linen.single("Jogo de lençol extra para casal", "Sempre um reserva limpo para a troca de roupa de cama.", 22000, S.camicado, "lencol cama casal"),
  linen.single("Edredom casal", "Quentinho para os dias frios e para dormir de conchinha.", 30000, S.camicado, "cobertor inverno cama"),
  linen.single("Colcha para cama de casal", "Deixa o quarto arrumado e bonito em segundos.", 28000, S.tokStok, "cobre leito manta cama"),
  linen.single("Cobertor de casal", "Aquele cobertor macio para os dias de frio.", 20000, S.camicado, "manta inverno"),
  linen.single("Manta de microfibra", "Leve, macia e ótima para cobrir os pés frios.", 14000, S.casasBahia, "cobertor fino"),
  linen.single("Par de travesseiros", "Para descansar bem depois de um dia cheio.", 16000, S.camicado, "travesseiro dormir"),
  linen.single("Travesseiro de corpo", "Para dormir abraçadinho e confortável.", 8000, S.mercadoLivre, "travesseiro longo gestante"),
  linen.single("Jogo de fronhas", "Fronhas extras para sempre ter reserva.", 8000, S.camicado, "fronha travesseiro"),
  linen.single("Protetor de colchão", "Cuida do colchão e deixa a cama mais confortável.", 15000, S.casasBahia, "colchao capa"),
  linen.single("Cortina blackout", "Escuridão total para dormir até mais tarde nos fins de semana.", 22000, S.leroy, "cortina escura janela"),
  linen.single("Tapete de quarto", "Pés quentinhos ao levantar da cama.", 25000, S.tokStok, "tapete cama felpudo"),
  furniture.single("Par de criados-mudos", "Apoio para o abajur, o livro e o celular.", 45000, S.tokStok, "mesa de cabeceira"),
  furniture.single("Cômoda", "Mais espaço para guardar roupas e lembranças.", 60000, S.magalu, "comoda gaveta"),
  furniture.single("Sapateira", "Todos os pares organizados e à mostra.", 25000, S.leroy, "sapato organizador armario"),
  furniture.single("Espelho de corpo inteiro", "Para conferir o look antes de sair juntos.", 25000, S.leroy, "espelho quarto"),
  furniture.single("Par de abajures", "Luz aconchegante para ler antes de dormir.", 18000, S.camicado, "luminaria cabeceira"),
  furniture.quota("Cota da cama box queen com colchão", "Cada cota é um passo para as noites mais confortáveis.", 250000, 10, S.magalu, "cama box colchao queen", "cama box queen"),
  furniture.quota("Cota do colchão queen", "Para dormir como em hotel todos os dias.", 160000, 8, S.mercadoLivre, "colchao molas ortopedico", "colchao queen"),
  comfort.single("Ferro a vapor", "Roupas bem passadas para os compromissos de vocês.", 18000, S.magalu, "passar roupa vapor"),
  comfort.single("Vaporizador de roupas", "Tira as dobras sem precisar da tábua de passar.", 20000, S.amazon, "steamer roupa vapor"),
  comfort.single("Secador de cabelo", "Cabelo pronto em minutos, sem atrasar o passeio.", 20000, S.magalu, "cabelo secar"),
  comfort.single("Ventilador de torre", "Ar fresco para as noites quentes.", 35000, S.magalu, "ventilador quarto"),
  comfort.single("Umidificador de ar", "Ajuda a respirar melhor nos dias secos.", 15000, S.amazon, "ar umidificar"),
  comfort.single("Rádio relógio despertador", "Para acordar com música e sem susto.", 6000, S.mercadoLivre, "despertador relogio"),
  comfort.quota("Cota do ar-condicionado split", "Para dormir fresquinho nas noites de verão.", 220000, 11, S.fastShop, "ar condicionado inverter", "ar condicionado split"),
  organizing.single("Kit de cabides", "Cabides de qualidade para um guarda-roupa organizado.", 6000, S.mercadoLivre, "cabide roupa armario"),
  organizing.single("Kit de organizadores para guarda-roupa", "Gavetas e divisórias para encontrar tudo fácil.", 9000, S.tokStok, "organizador gaveta colmeia"),
  organizing.single("Aromatizador de ambiente", "Deixa o quarto com cheirinho de hotel.", 6000, S.camicado, "home spray perfume"),
];
