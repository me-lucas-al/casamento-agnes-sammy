import { MockField } from "./mock-field";
import { PanelWindow } from "./panel-window";

export function EventFormMockup() {
  return (
    <PanelWindow title="Evento" label="Exemplo da tela Evento do painel">
      <div className="grid grid-cols-2 gap-2">
        <MockField label="Tipo da chave Pix" value="E-mail" isHighlighted />
        <MockField label="Cidade do recebedor" value="Itatiba" isHighlighted />
        <MockField label="Chave Pix" value="noivos@exemplo.com" isHighlighted className="col-span-2" />
        <MockField label="Nome do recebedor" value="Como está no banco" isHighlighted className="col-span-2" />
        <MockField label="Local" value="Restaurante Fazenda" className="col-span-2" />
        <MockField label="Endereço" value="Av. Mal. Castelo Branco, 760" className="col-span-2" />
        <MockField label="Link do mapa" value="maps.app.goo.gl/..." />
        <MockField label="Prazo do RSVP" value="31/10/2026" />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold">Nossa história</span>
        <p className="rounded-lg border border-input/60 bg-paper px-3 py-2 text-base italic leading-snug">
          Nos conhecemos num dia comum e, de repente, já era a nossa vida inteira...
        </p>
      </div>
      <span className="w-fit rounded-full bg-rose px-5 py-1.5 text-base font-semibold text-white">Salvar</span>
    </PanelWindow>
  );
}
