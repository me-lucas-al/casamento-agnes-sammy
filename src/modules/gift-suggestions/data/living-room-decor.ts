import type { GiftSuggestion } from "../types";
import { STORES as S } from "./stores";
import { suggestionBuilders } from "./suggestion-builders";

const decor = suggestionBuilders("sala", "decoracao");

export const LIVING_ROOM_DECOR: GiftSuggestion[] = [
  decor.single("Tapete de sala", "Deixa o ambiente mais aconchegante e combina com qualquer estilo.", 45000, S.tokStok, "tapete sala felpudo"),
  decor.single("Kit de quadros decorativos", "Três quadros para dar personalidade às paredes da casa nova.", 18000, S.tokStok, "quadro parede moldura"),
  decor.single("Quadro canvas grande", "Uma peça de destaque para a parede principal da sala.", 25000, S.mercadoLivre, "quadro tela arte"),
  decor.single("Vasos decorativos", "Para plantas, flores e aquele toque de verde na estante.", 12000, S.camicado, "vaso planta flor"),
  decor.single("Cachepôs de cerâmica", "Deixam as plantinhas ainda mais charmosas.", 7000, S.leroy, "cachepo vaso planta"),
  decor.single("Plantas artificiais", "Verde sem trabalho para cantos com pouca luz.", 9000, S.mercadoLivre, "planta falsa folhagem"),
  decor.single("Kit de almofadas", "Quatro almofadas para os cochilos de domingo no sofá.", 14000, S.camicado, "almofada capa sofa"),
  decor.single("Manta para sofá", "Companheira de maratonas de filme em dias frios.", 10000, S.casasBahia, "manta cobertor sofa"),
  decor.single("Cesto organizador de mantas", "Guarda as mantas e ainda decora o canto da sala.", 12000, S.tokStok, "cesto manta organizador"),
  decor.single("Luminária de piso", "Luz suave e aconchegante para as noites em casa.", 25000, S.leroy, "luz abajur coluna"),
  decor.single("Luminária de mesa", "Um brilho aconchegante para o aparador ou a estante.", 12000, S.camicado, "abajur mesa luz"),
  decor.single("Fita de LED para TV", "Iluminação de fundo que deixa o cinema em casa mais bonito.", 7000, S.kabum, "led luz rgb tv"),
  decor.single("Espelho decorativo grande", "Amplia a sala e deixa tudo mais iluminado.", 30000, S.leroy, "espelho parede redondo"),
  decor.single("Kit de porta-retratos", "Espaço para guardar as melhores fotos de vocês dois.", 8000, S.tokStok, "porta retrato foto moldura"),
  decor.single("Difusor de aromas", "Um cheirinho gostoso que faz a casa parecer um abraço.", 9000, S.camicado, "aromatizador varetas essencia"),
  decor.single("Velas aromáticas", "Para noites tranquilas com perfume de casa nova.", 6000, S.camicado, "vela aroma"),
  decor.single("Castiçais decorativos", "Detalhes que deixam a mesa e a estante mais elegantes.", 8000, S.tokStok, "castical vela mesa"),
  decor.single("Bandeja decorativa", "Organiza a mesa de centro e serve com charme.", 6000, S.tokStok, "bandeja mesa centro"),
  decor.single("Relógio de parede", "Para contar as horas e cada momento da vida a dois.", 13000, S.mercadoLivre, "relogio parede sala"),
  decor.single("Nichos decorativos", "Prateleiras para livros, plantas e lembranças de viagem.", 15000, S.leroy, "prateleira nicho parede"),
  decor.single("Cortina para sala", "Filtra a luz e deixa o ambiente mais acolhedor.", 30000, S.leroy, "cortina voil janela"),
  decor.single("Capacho de entrada", "Boas-vindas bonitas para quem chega à casa de vocês.", 5000, S.leroy, "tapete porta entrada"),
  decor.single("Kit de mesas laterais", "Apoio extra para o café, o livro e o controle remoto.", 35000, S.tokStok, "mesa canto apoio"),
];
