import { cn } from "@/shared/lib/styling/utils";

type PageHeadingProps = {
  title: string;
  description?: string;
  align?: "center" | "start";
};

export function PageHeading({ title, description, align = "center" }: PageHeadingProps) {
  const isCentered = align === "center";
  return (
    <header className={cn("flex flex-col gap-2", isCentered ? "items-center text-center" : "items-start")}>
      <h1 className="font-heading text-4xl italic leading-tight text-wine md:text-5xl">{title}</h1>
      {description ? <p className="max-w-prose text-lg text-muted-foreground">{description}</p> : null}
      <div aria-hidden className="flex w-40 items-center gap-2 text-rose-soft">
        <span className="h-px flex-1 bg-gold/60" />
        <span className="text-xs">&#9829;</span>
        <span className="h-px flex-1 bg-gold/60" />
      </div>
    </header>
  );
}
