import { motion, type Variants } from "framer-motion";
import type { ElementType } from "react";

export interface ServiceCardProps {
  title: string;
  description: string;
  Icon: ElementType;
  featured?: boolean;
  onEnquire: (title: string) => void;
}

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 70,
    scale: 0.94
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  hover: {
    y: -12,
    scale: 1.02,
    transition: {
      duration: 0.3
    }
  }
};

const iconCircleVariants: Variants = {
  hover: {
    scale: 1.12,
    rotate: 6,
    transition: {
      duration: 0.3
    }
  }
};

export default function ServiceCard({
  title,
  description,
  Icon,
  featured = false,
  onEnquire,
}: ServiceCardProps) {
  const isTouch = typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

  return (
    <motion.div
      variants={cardVariants}
      whileHover={isTouch ? undefined : "hover"}
      className={`group h-full flex flex-col justify-between rounded-2xl px-6 py-8 transition-shadow duration-300 ${
        featured ? "bg-[#5B4636]" : "bg-[#F4E9DA]"
      }`}
      style={{
        boxShadow: "0 4px 12px rgba(91, 70, 54, 0.04)"
      }}
    >
      {/* Top: icon + text */}
      <div className="flex flex-col">
        <motion.div
          variants={iconCircleVariants}
          className={`flex size-14 items-center justify-center rounded-full mb-5 ${
            featured ? "bg-[#4a3a2c]" : "bg-[#E8D9C5]"
          }`}
        >
          <Icon className={`w-6 h-6 ${featured ? "text-[#D6B98C]" : "text-[#5B4636]"}`} />
        </motion.div>
        <h3 className={`text-base font-bold mb-2 ${featured ? "text-white" : "text-[#5B4636]"}`}>
          {title}
        </h3>
        <p className={`text-sm ${featured ? "text-[#D6B98C]/80" : "text-[#7a6153]"}`}>
          {description}
        </p>
      </div>

      {/* Bottom: action */}
      <div className="mt-6">
        {featured ? (
          <button
            onClick={() => onEnquire(title)}
            className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-white hover:text-[#5B4636] active:scale-95"
          >
            Enquire Now
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">→</span>
          </button>
        ) : (
          <button
            onClick={() => onEnquire(title)}
            className="text-sm font-medium text-[#b8936a] flex items-center gap-1 transition-colors duration-300 group-hover:text-[#5B4636]"
          >
            Learn More
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">→</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}