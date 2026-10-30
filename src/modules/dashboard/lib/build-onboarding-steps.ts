import type { OnboardingFacts, OnboardingStatus, OnboardingStep } from "../types";

export function buildOnboardingStatus(facts: OnboardingFacts): OnboardingStatus {
  const steps: OnboardingStep[] = [
    {
      key: "pix",
      title: "Cadastrar a chave Pix",
      description: "Informe a chave, o nome do recebedor e a cidade para os convidados pagarem os presentes.",
      href: "/painel/evento",
      isDone: facts.hasPixData,
    },
    {
      key: "story",
      title: "Escrever a nossa história",
      description: "Conte como vocês se conheceram. O texto aparece na página do casamento.",
      href: "/painel/evento",
      isDone: facts.hasStory,
    },
    {
      key: "photos",
      title: "Enviar as fotos do casal",
      description: "Suba as primeiras fotos para a galeria.",
      href: "/painel/fotos",
      isDone: facts.photoCount > 0,
    },
    {
      key: "gifts",
      title: "Cadastrar os presentes",
      description: "Monte a lista de presentes com preços e categorias.",
      href: "/painel/presentes",
      isDone: facts.giftCount > 0,
    },
  ];
  const doneCount = steps.filter((step) => step.isDone).length;
  return { steps, doneCount, isComplete: doneCount === steps.length };
}
