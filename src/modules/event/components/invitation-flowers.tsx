import Image from "next/image";

const CORNERS = [
  { name: "flowers-top-left", width: 235, height: 300, position: "left-0 top-0" },
  { name: "flowers-top-right", width: 235, height: 310, position: "right-0 top-0" },
  { name: "flowers-bottom-left", width: 122, height: 112, position: "bottom-0 left-0" },
  { name: "flowers-bottom-right", width: 145, height: 132, position: "bottom-0 right-0" },
];

export function InvitationFlowers() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {CORNERS.map((corner) => (
        <Image
          key={corner.name}
          src={`/brand/${corner.name}.png`}
          alt=""
          width={corner.width}
          height={corner.height}
          className={`absolute w-[26%] max-w-[180px] ${corner.position}`}
        />
      ))}
    </div>
  );
}
