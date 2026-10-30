import Link from "next/link";

const SHORTCUTS = [
  { href: "/presentes", title: "Presentes", hint: "Escolha um presente para os noivos" },
  { href: "/confirmar-presenca", title: "Confirmar presença", hint: "Responda ao convite" },
  { href: "/recados", title: "Recados", hint: "Deixe uma mensagem carinhosa" },
  { href: "/galeria", title: "Galeria", hint: "Veja e envie fotos" },
] as const;

export function ShortcutLinks() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {SHORTCUTS.map((shortcut) => (
        <li key={shortcut.href}>
          <Link
            href={shortcut.href}
            className="flex h-full flex-col gap-1 rounded-2xl border border-gold/40 bg-blush px-4 py-4 transition-colors hover:bg-rose hover:text-white"
          >
            <span className="font-heading text-xl italic">{shortcut.title}</span>
            <span className="text-base">{shortcut.hint}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
