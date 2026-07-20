import * as React from "react";
import { useReducedMotion } from "framer-motion";

export interface HexagonBackgroundProps extends React.ComponentProps<"div"> {
  hexagonSize?: number;
  hexagonMargin?: number;
  hexagonProps?: React.ComponentProps<"div">;
  /** Base glow color as an "r, g, b" triplet (no rgb() wrapper) */
  glowColor?: string;
  /** Peak/accent color the shimmer sweeps through, as an "r, g, b" triplet */
  accentColor?: string;
}

export function HexagonBackground({
  hexagonSize = 60,
  hexagonMargin = 4,
  hexagonProps,
  glowColor = "90, 62, 28",
  accentColor = "212, 175, 120",
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

    let cachedCells: HTMLDivElement[] | null = null;
    let animId: number | null = null;

    let targetX = -999;
    let targetY = -999;
    let currX = -999;
    let currY = -999;
    let isHovering = false;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      // Check if cursor is roughly within or near the hero container
      if (
        e.clientX >= rect.left - 100 &&
        e.clientX <= rect.right + 100 &&
        e.clientY >= rect.top - 100 &&
        e.clientY <= rect.bottom + 100
      ) {
        targetX = e.clientX - rect.left;
        targetY = e.clientY - rect.top;
        isHovering = true;
      } else {
        isHovering = false;
      }
    };

    const handleMouseLeave = () => {
      isHovering = false;
    };

    const tick = () => {
      if (isHovering) {
        if (currX === -999) {
          currX = targetX;
          currY = targetY;
        } else {
          currX += (targetX - currX) * 0.18;
          currY += (targetY - currY) * 0.18;
        }
      } else {
        targetX = -999;
        targetY = -999;
        currX += (-999 - currX) * 0.1;
        currY += (-999 - currY) * 0.1;
      }

      el.style.setProperty("--mouse-x", `${currX}px`);
      el.style.setProperty("--mouse-y", `${currY}px`);

      if (!cachedCells) {
        cachedCells = Array.from(el.querySelectorAll<HTMLDivElement>(`.hex-cell-${id}`));
      }

      if (cachedCells.length > 0) {
        const radius = 220;

        cachedCells.forEach((cell) => {
          const cellX = parseFloat(cell.getAttribute("data-x") || "0");
          const cellY = parseFloat(cell.getAttribute("data-y") || "0");

          const dx = currX - cellX;
          const dy = currY - cellY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < radius && currX > -500) {
            const rawInfluence = 1 - dist / radius;
            const influence = Math.pow(rawInfluence, 1.8); // smooth cubic falloff

            const bgAlpha = 0.1 + influence * 0.55;
            const borderAlpha = 0.35 + influence * 0.65;
            const shadowRadius = influence * 28;
            const shadowAlpha = influence * 0.75;
            const scale = 1 + influence * 0.14;

            // Pause the CSS shimmer keyframes on this cell while JS is
            // driving it — otherwise the animation and the inline styles
            // below both write to background/border/box-shadow/opacity
            // every frame and stomp on each other, causing flicker.
            cell.style.animationPlayState = "paused";
            cell.style.backgroundColor = `rgba(${accentColor}, ${bgAlpha})`;
            cell.style.borderColor = `rgba(${accentColor}, ${borderAlpha})`;
            cell.style.transform = `scale(${scale})`;
            cell.style.boxShadow = `0 0 ${shadowRadius}px rgba(${accentColor}, ${shadowAlpha})`;
            cell.style.zIndex = Math.round(influence * 10).toString();
            cell.style.opacity = `${0.55 + influence * 0.45}`;
          } else if (cell.style.transform !== "") {
            cell.style.animationPlayState = "";
            cell.style.backgroundColor = "";
            cell.style.borderColor = "";
            cell.style.transform = "";
            cell.style.boxShadow = "";
            cell.style.zIndex = "";
            cell.style.opacity = "";
          }
        });
      }

      animId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    animId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [dims, hexWidth, hexHeight, id, shouldReduceMotion, accentColor]);

  const hexClip =
    "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

  // How long one shimmer sweep takes to cross the whole grid before looping.
  const LOOP_DURATION = 6;

  // Build a properly centered grid: pad one extra ring of hexagons on every
  // side so edges are always fully covered, then shift the whole grid so
  // it's centered in the container instead of anchored to the top-left
  // (which is what caused the ragged/uneven edges before).
  const cols = dims.width ? Math.ceil(dims.width / colSpacing) + 4 : 0;
  const rows = dims.height ? Math.ceil(dims.height / rowSpacing) + 4 : 0;

  const gridWidth = cols * colSpacing;
  const gridHeight = rows * rowSpacing;
  const offsetX = (dims.width - gridWidth) / 2;
  const offsetY = (dims.height - gridHeight) / 2;

  type Cell = { x: number; y: number; key: string; delay: number };
  const cells: Cell[] = [];

  for (let row = -2; row < rows - 2; row++) {
    for (let col = -2; col < cols - 2; col++) {
      const x =
        col * colSpacing +
        offsetX +
        (((row % 2) + 2) % 2 === 1 ? colSpacing / 2 : 0);
      const y = row * rowSpacing + offsetY;
      cells.push({ x, y, key: `${row}-${col}`, delay: 0 });
    }
  }

  // Diagonal shimmer sweep: stagger each cell's animation delay by its
  // position along the top-left -> bottom-right diagonal, so a band of
  // light travels across the whole grid on a continuous loop.
  if (cells.length > 0) {
    const diagValues = cells.map((c) => c.x + c.y);
    const minDiag = Math.min(...diagValues);
    const maxDiag = Math.max(...diagValues);
    const span = maxDiag - minDiag || 1;
    for (const cell of cells) {
      const t = (cell.x + cell.y - minDiag) / span; // 0 -> 1 across the sweep
      cell.delay = -t * LOOP_DURATION;
    }
  }

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${className}`}
      style={{
        ...style,
        ["--glow-rgb" as string]: glowColor,
        ["--accent-rgb" as string]: accentColor,
      }}
      {...props}
    >
      <style>
        {`
          @keyframes hexShimmer-${id} {
            0% {
              background-color: rgba(var(--glow-rgb), 0.2);
              border-color: rgba(var(--glow-rgb), 0.55);
              box-shadow: 0 0 0px rgba(var(--accent-rgb), 0);
              opacity: 0.7;
            }
            45% {
              background-color: rgba(var(--glow-rgb), 0.2);
              border-color: rgba(var(--glow-rgb), 0.55);
              box-shadow: 0 0 0px rgba(var(--accent-rgb), 0);
              opacity: 0.7;
            }
            55% {
              background-color: rgba(var(--accent-rgb), 0.6);
              border-color: rgba(var(--accent-rgb), 1);
              box-shadow: 0 0 20px rgba(var(--accent-rgb), 0.75);
              opacity: 1;
            }
            65% {
              background-color: rgba(var(--glow-rgb), 0.2);
              border-color: rgba(var(--glow-rgb), 0.55);
              box-shadow: 0 0 0px rgba(var(--accent-rgb), 0);
              opacity: 0.7;
            }
            100% {
              background-color: rgba(var(--glow-rgb), 0.2);
              border-color: rgba(var(--glow-rgb), 0.55);
              box-shadow: 0 0 0px rgba(var(--accent-rgb), 0);
              opacity: 0.7;
            }
          }
          .hex-cell-${id} {
            animation: hexShimmer-${id} ${LOOP_DURATION}s linear infinite;
            will-change: opacity, box-shadow, background-color, border-color;
          }
          /* Only applies when JS proximity tracking isn't driving this
             cell (e.g. touch devices, reduced-motion users, or the brief
             gap before the first mousemove tick fires). Once JS takes
             over it pauses the animation and sets inline styles, which
             this rule can no longer override — avoiding a visible snap. */
          .hex-cell-${id}:hover {
            background-color: rgba(var(--accent-rgb), 0.75);
            border-color: rgba(var(--accent-rgb), 1);
            box-shadow: 0 0 26px rgba(var(--accent-rgb), 0.8);
            opacity: 1;
          }
        `}
      </style>
      <div
        className="pointer-events-none absolute inset-0 hidden sm:block"
        style={{
          background: `radial-gradient(260px circle at var(--mouse-x, -999px) var(--mouse-y, -999px), rgba(${accentColor}, 0.36), transparent 75%)`,
          zIndex: 5,
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
              backgroundColor: `rgba(${glowColor}, 0.2)`,
              border: "1.25px solid rgba(90, 62, 28, 0.75)",
              animationDelay: `${cell.delay}s`,
              transition:
                "background-color 0.35s ease-out, border-color 0.35s ease-out, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease-out",
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