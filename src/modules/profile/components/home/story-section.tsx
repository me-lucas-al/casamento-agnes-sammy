type StorySectionProps = { story: string | null };

export function StorySection({ story }: StorySectionProps) {
  const hasStory = Boolean(story?.trim());
  return (
    <section className="flex flex-col gap-3 rounded-3xl bg-blush px-4 py-6 md:px-8">
      <h2 className="font-heading text-2xl italic text-crimson">Nossa história</h2>
      <p className="whitespace-pre-line text-lg leading-relaxed">
        {hasStory ? story : "Em breve contaremos aqui um pouco da nossa história."}
      </p>
    </section>
  );
}
