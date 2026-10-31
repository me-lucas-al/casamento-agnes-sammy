import Image from "next/image";
import { cn } from "@/shared/lib/utils";

const CORNERS = [
  { name: "flowers-top-left", width: 235, height: 300, position: "left-0 top-0", area: "top" },
  { name: "flowers-top-right", width: 235, height: 310, position: "right-0 top-0", area: "top" },
  { name: "flowers-bottom-left", width: 122, height: 112, position: "bottom-0 left-0", area: "bottom" },
  { name: "flowers-bottom-right", width: 145, height: 132, position: "bottom-0 right-0", area: "bottom" },
] as const;

type FloralCornersProps = {
  area?: "top" | "all";
  className?: string;
};

export function FloralCorners({ area = "all", className }: FloralCornersProps) {
  const visibleCorners = CORNERS.filter((corner) => area === "all" || corner.area === area);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {visibleCorners.map((corner) => (
        <Image
          key={corner.name}
          src={`/brand/${corner.name}.png`}
          alt=""
          loading={corner.area === "top" ? "eager" : "lazy"}
          width={corner.width}
          height={corner.height}
          className={cn("absolute", corner.position, className ?? "w-[26%] max-w-[180px]")}
        />
      ))}
    </div>
  );
}
