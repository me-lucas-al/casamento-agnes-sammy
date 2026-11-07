import Link from "next/link";

type ViewerModeBannerProps = { switchHref: string; switchLabel: string };

export function ViewerModeBanner({ switchHref, switchLabel }: ViewerModeBannerProps) {
  return (
    <div role="status" className="bg-wine px-4 py-2 text-center text-sm text-white">
      <span>Modo visitante: dá para explorar tudo, mas nada pode ser alterado e os dados pessoais aparecem mascarados.</span>{" "}
      <Link href={switchHref} className="font-semibold underline underline-offset-4">
        {switchLabel}
      </Link>
    </div>
  );
}
