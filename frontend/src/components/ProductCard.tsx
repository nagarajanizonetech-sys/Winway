import { motion, useMotionValue, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import {
  Cpu,
  MemoryStick,
  HardDrive,
  Gpu,
  Sparkles,
} from "lucide-react";
import MagneticButton from "./animations/MagneticButton";

interface Product {
  id: number;
  name: string;
  processor: string;
  ram: string;
  storage: string;
  display: string;
  graphics: string;
  price: number | null;
  image_url: string | null;
}

interface ProductCardProps {
  product: Product;
  onEnquire: (product: Product) => void;
  onClick: (product: Product) => void;
}

export default function ProductCard({ product, onEnquire, onClick }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { damping: 25, stiffness: 150 });
  const springY = useSpring(y, { damping: 25, stiffness: 150 });

  const rotateX = useTransform(springY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-6, 6]);

  const rectRef = useRef<DOMRect | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || window.innerWidth < 768 || (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches)) return;
    const el = cardRef.current;
    if (!el) return;

    if (!rectRef.current) {
      rectRef.current = el.getBoundingClientRect();
    }
    const rect = rectRef.current;
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    rectRef.current = null;
    x.set(0);
    y.set(0);
  };

  const formattedPrice = product.price
    ? `₹${Number(product.price).toLocaleString("en-IN")}`
    : "Request Quote";

  return (
    <motion.div
      ref={cardRef}
      id={`product-${product.id}`}
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 100, damping: 16 }}
      whileHover={{
        y: -10,
        scale: 1.02,
        boxShadow: "0 20px 45px rgba(91, 70, 54, 0.12)",
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick(product)}
      className="relative overflow-hidden rounded-[2rem] bg-white border border-[rgba(214,185,140,0.3)] flex flex-col h-full group shadow-[0_12px_35px_-15px_rgba(91,70,54,0.06)] cursor-pointer scroll-mt-28 target:ring-2 target:ring-[#D6B98C] target:scale-[1.02] target:shadow-[0_0_30px_rgba(214,185,140,0.2)] transition-all duration-500"
      style={{
        rotateX: shouldReduceMotion ? 0 : rotateX,
        rotateY: shouldReduceMotion ? 0 : rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
    >
      {/* Premium Obsidian Sheen Light Sweep Reflection on Hover */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1.2s] ease-out bg-gradient-to-r from-transparent via-[#D6B98C]/15 to-transparent pointer-events-none z-20"></div>

      {/* Nestled Image Container */}
      <div className="p-3" style={{ transformStyle: "preserve-3d" }}>
        <div className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl bg-[#F3E9DC] border border-[rgba(214,185,140,0.25)]" style={{ transformStyle: "preserve-3d" }}>
          {product.image_url ? (
            <img
              src={product.image_url.split(",")[0]}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]"
              style={{
                transform: shouldReduceMotion ? "none" : "translateZ(30px)",
                transformStyle: "preserve-3d",
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-white/5 to-transparent text-[#7a6153] text-xs">
              No Image Available
            </div>
          )}

          {/* Vignette Shadow Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#5B4636]/15 via-transparent to-transparent opacity-80 z-10 pointer-events-none"></div>

          {/* Featured Badge with Neon Glow */}
          <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-[#D6B98C]/95 backdrop-blur-md px-3 py-1 text-[8px] font-black uppercase tracking-[0.2em] text-[#5B4636] shadow-lg border border-[rgba(214,185,140,0.3)] z-15">
            <Sparkles className="h-2.5 w-2.5 text-[#5B4636] animate-pulse" />
            Featured
          </div>

          {/* Display Size Glass Badge Overlay */}
          {product.display && (
            <div className="absolute bottom-3 right-3 bg-[#FFFDF7]/90 backdrop-blur-md border border-[rgba(214,185,140,0.3)] rounded-xl px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-[#5B4636] z-15 shadow-md">
              {product.display}
            </div>
          )}
        </div>
      </div>

      {/* Details Area */}
      <div className="flex flex-col flex-grow gap-4.5 px-5 pb-5 pt-1 relative z-10">
        
        {/* Product Title */}
        <h3 
          className="text-base font-extrabold text-[#5B4636] tracking-tight line-clamp-2 h-12 leading-snug group-hover:text-[#D6B98C] transition-colors duration-300"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          {product.name}
        </h3>

        {/* Specs 2x2 Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { icon: <Cpu size={13} />, label: "CPU", value: product.processor },
            { icon: <MemoryStick size={13} />, label: "RAM", value: product.ram },
            { icon: <HardDrive size={13} />, label: "SSD", value: product.storage },
            { icon: <Gpu size={13} />, label: "GPU", value: product.graphics },
          ].map(({ icon, label, value }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-xl bg-[#F3E9DC]/40 border border-[rgba(214,185,140,0.2)] p-2 hover:bg-[#D6B98C]/15 hover:border-[#D6B98C]/50 transition-all duration-300 group/spec"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#FFFDF7] text-[#D6B98C] border border-[rgba(214,185,140,0.25)] group-hover/spec:bg-[#D6B98C] group-hover/spec:text-[#5B4636] transition-all duration-300">
                {icon}
              </div>
              <div className="min-w-0">
                <p className="text-[7.5px] font-black uppercase tracking-[0.15em] text-[#7a6153] leading-none">
                  {label}
                </p>
                <p className="mt-0.5 text-[10.5px] font-bold text-[#5B4636] truncate transition-colors duration-300">
                  {value || "—"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Price & Action Block */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-[rgba(214,185,140,0.25)]">
          <div>
            <span className="block text-[8px] font-black text-[#7a6153] uppercase tracking-widest leading-none">Starting at</span>
            <p 
              className="text-xl font-extrabold text-[#5B4636] tracking-tight mt-1"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              {formattedPrice}
            </p>
          </div>
          <MagneticButton>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 4px 15px rgba(214,185,140,0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onEnquire(product);
              }}
              className="rounded-full bg-gradient-to-r from-[#D6B98C] to-[#b8936a] px-5 py-2.5 text-[9px] font-black uppercase tracking-widest text-[#5B4636] shadow-md border border-[rgba(214,185,140,0.3)] transition-all duration-300"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Enquire
            </motion.button>
          </MagneticButton>
        </div>
      </div>
    </motion.div>
  );
}