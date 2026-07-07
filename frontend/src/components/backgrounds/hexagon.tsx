import * as React from "react";
import { useReducedMotion } from "framer-motion";

export interface HexagonBackgroundProps extends React.ComponentProps<"div"> {
  hexagonSize?: number;
  hexagonMargin?: number;
  hexagonProps?: React.ComponentProps<"div">;
}

export function HexagonBackground({
  hexagonSize = 60,
  hexagonMargin = 4,
  hexagonProps,
  className = "",
  style,
  children,
  ...props
}: HexagonBackgroundProps) {
  const id = React.useId().replace(/:/g, "");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [dims, setDims] = React.useState({ width: 0, height: 0 });
  const shouldReduceMotion = useReducedMotion();

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      setDims({ width: el.offsetWidth, height: el.offsetHeight });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hexWidth = hexagonSize;
  const hexHeight = hexagonSize * 1.1547;
  const rowSpacing = hexHeight * 0.75 + hexagonMargin;
  const colSpacing = hexWidth + hexagonMargin;

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el || shouldReduceMotion) return;

    const isTouch = matchMedia("(hover: none)").matches;
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      el.style.setProperty("--mouse-x", `${x}px`);
      el.style.setProperty("--mouse-y", `${y}px`);

      const cells = el.querySelectorAll<HTMLDivElement>(`.hex-cell-${id}`);
      if (!cells) return;

      const radius = 150;
      cells.forEach((cell) => {
        const cellX = cell.offsetLeft + hexWidth / 2;
        const cellY = cell.offsetTop + hexHeight / 2;

        const dx = x - cellX;
        const dy = y - cellY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < radius) {
          const influence = 1 - dist / radius;
          cell.style.backgroundColor = `rgba(201, 169, 110, ${0.18 + influence * 0.35})`;
          cell.style.borderColor = `rgba(201, 169, 110, ${0.4 + influence * 0.4})`;
          cell.style.transform = `scale(${1 + influence * 0.05})`;
          cell.style.boxShadow = `0 0 ${influence * 12}px rgba(201, 169, 110, ${influence * 0.25})`;
          cell.style.zIndex = "1";
        } else {
          cell.style.backgroundColor = "";
          cell.style.borderColor = "";
          cell.style.transform = "";
          cell.style.boxShadow = "";
          cell.style.zIndex = "";
        }
      });
    };

    const handleMouseLeave = () => {
      el.style.setProperty("--mouse-x", `-999px`);
      el.style.setProperty("--mouse-y", `-999px`);
      const cells = el.querySelectorAll<HTMLDivElement>(`.hex-cell-${id}`);
      if (!cells) return;
      cells.forEach((cell) => {
        cell.style.backgroundColor = "";
        cell.style.borderColor = "";
        cell.style.transform = "";
        cell.style.boxShadow = "";
        cell.style.zIndex = "";
      });
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [dims, hexWidth, hexHeight, id, shouldReduceMotion]);

  const cols = dims.width ? Math.ceil(dims.width / colSpacing) + 2 : 0;
  const rows = dims.height ? Math.ceil(dims.height / rowSpacing) + 2 : 0;

  const hexClip =
    "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

  const cells: { x: number; y: number; key: string; delay: number }[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * colSpacing + (row % 2 === 1 ? colSpacing / 2 : 0);
      const y = row * rowSpacing;
      cells.push({ x, y, key: `${row}-${col}`, delay: (row + col) * 0.15 });
    }
  }

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${className}`}
      style={style}
      {...props}
    >
      <style>
        {`
          @keyframes hexPulse-${id} {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }
          .hex-cell-${id} {
            animation: hexPulse-${id} 3.5s ease-in-out infinite;
          }
          .hex-cell-${id}:hover {
            background-color: rgba(150, 111, 51, 0.55) !important;
            border-color: rgba(150, 111, 51, 0.9) !important;
          }
        `}
      </style>
      <div 
        className="pointer-events-none absolute inset-0 hidden sm:block" 
        style={{
          background: "radial-gradient(180px circle at var(--mouse-x, -999px) var(--mouse-y, -999px), rgba(210, 170, 110, 0.28), transparent 70%)",
          zIndex: 5
        }}
      />
      <div className="absolute inset-0">
        {cells.map((cell) => (
          <div
            key={cell.key}
            className={`absolute hex-cell-${id}`}
            style={{
              left: cell.x,
              top: cell.y,
              width: hexWidth,
              height: hexHeight,
              clipPath: hexClip,
              backgroundColor: "rgba(90, 62, 28, 0.18)",
              border: "1px solid rgba(90, 62, 28, 0.4)",
              animationDelay: `${cell.delay}s`,
              transition: "background-color 0.2s, border-color 0.2s",
              ...hexagonProps?.style,
            }}
            {...hexagonProps}
          />
        ))}
      </div>
      {children}
    </div>
  );
}