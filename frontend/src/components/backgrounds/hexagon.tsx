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

    const parent = el.parentElement || el;
    let cachedCells: HTMLDivElement[] | null = null;
    let rAFId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      const clientX = e.clientX;
      const clientY = e.clientY;

      if (rAFId) return;

      rAFId = requestAnimationFrame(() => {
        rAFId = null;
        if (!cachedCells) {
          cachedCells = Array.from(el.querySelectorAll<HTMLDivElement>(`.hex-cell-${id}`));
        }
        if (cachedCells.length === 0) return;

        const rect = el.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        el.style.setProperty("--mouse-x", `${x}px`);
        el.style.setProperty("--mouse-y", `${y}px`);

        const radius = 180;
        cachedCells.forEach((cell) => {
          const cellX = parseFloat(cell.getAttribute("data-x") || "0");
          const cellY = parseFloat(cell.getAttribute("data-y") || "0");

          const dx = x - cellX;
          const dy = y - cellY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < radius) {
            const influence = 1 - dist / radius;
            cell.style.backgroundColor = `rgba(201, 169, 110, ${0.12 + influence * 0.4})`;
            cell.style.borderColor = `rgba(201, 169, 110, ${0.3 + influence * 0.5})`;
            cell.style.transform = `scale(${1 + influence * 0.08})`;
            cell.style.boxShadow = `0 0 ${influence * 15}px rgba(201, 169, 110, ${influence * 0.3})`;
            cell.style.zIndex = "1";
            cell.style.opacity = `${0.45 + influence * 0.55}`;
          } else if (cell.style.transform !== "") {
            cell.style.backgroundColor = "";
            cell.style.borderColor = "";
            cell.style.transform = "";
            cell.style.boxShadow = "";
            cell.style.zIndex = "";
            cell.style.opacity = "";
          }
        });
      });
    };

    const handleMouseLeave = () => {
      if (rAFId) {
        cancelAnimationFrame(rAFId);
        rAFId = null;
      }
      el.style.setProperty("--mouse-x", `-999px`);
      el.style.setProperty("--mouse-y", `-999px`);
      if (!cachedCells) {
        cachedCells = Array.from(el.querySelectorAll<HTMLDivElement>(`.hex-cell-${id}`));
      }
      cachedCells.forEach((cell) => {
        if (cell.style.transform !== "") {
          cell.style.backgroundColor = "";
          cell.style.borderColor = "";
          cell.style.transform = "";
          cell.style.boxShadow = "";
          cell.style.zIndex = "";
          cell.style.opacity = "";
        }
      });
    };

    parent.addEventListener("mousemove", handleMouseMove);
    parent.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      parent.removeEventListener("mousemove", handleMouseMove);
      parent.removeEventListener("mouseleave", handleMouseLeave);
      if (rAFId) cancelAnimationFrame(rAFId);
    };
  }, [dims, hexWidth, hexHeight, id, shouldReduceMotion]);

  const cols = dims.width ? Math.ceil(dims.width / colSpacing) + 2 : 0;
  const rows = dims.height ? Math.ceil(dims.height / rowSpacing) + 2 : 0;

  const hexClip =
    "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

  const cells: { x: number; y: number; key: string; delay: number }[] = [];
  const midRow = rows / 2;
  const midCol = cols / 2;
  for (let row = -1; row < rows + 1; row++) {
    for (let col = -1; col < cols + 1; col++) {
      const x = col * colSpacing + (row % 2 === 1 ? colSpacing / 2 : 0);
      const y = row * rowSpacing;
      
      const dx = col - midCol;
      const dy = row - midRow;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const delay = dist * 0.22;
      
      cells.push({ x, y, key: `${row}-${col}`, delay });
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
          @keyframes hexWave-${id} {
            0% {
              opacity: 0.45;
            }
            15% {
              opacity: 1.0;
            }
            30%, 100% {
              opacity: 0.45;
            }
          }
          .hex-cell-${id} {
            animation: hexWave-${id} 5s ease-in-out infinite;
          }
          .hex-cell-${id}:hover {
            background-color: rgba(150, 111, 51, 0.55) !important;
            border-color: rgba(150, 111, 51, 0.9) !important;
            opacity: 1 !important;
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
            data-x={cell.x + hexWidth / 2}
            data-y={cell.y + hexHeight / 2}
            style={{
              left: cell.x,
              top: cell.y,
              width: hexWidth,
              height: hexHeight,
              clipPath: hexClip,
              backgroundColor: "rgba(90, 62, 28, 0.18)",
              border: "1px solid rgba(90, 62, 28, 0.4)",
              animationDelay: `${cell.delay}s`,
              transition: "background-color 0.3s, border-color 0.3s, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
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