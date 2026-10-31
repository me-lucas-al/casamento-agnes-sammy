import { CountdownTimer } from "./countdown-timer";

type GuestGreetingProps = { guestName: string; eventAtIso: string };

export function GuestGreeting({ guestName, eventAtIso }: GuestGreetingProps) {
  return (
    <section className="flex flex-col gap-4 rounded-3xl bg-blush px-4 py-8 text-center md:px-10">
      <p className="text-lg">Olá,</p>
      <h1 className="font-heading text-4xl italic text-crimson md:text-5xl">{guestName}</h1>
      <p className="text-lg">Falta pouco para o nosso grande dia!</p>
      <CountdownTimer targetIso={eventAtIso} />
    </section>
  );
}
