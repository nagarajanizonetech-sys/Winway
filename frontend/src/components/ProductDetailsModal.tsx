import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Cpu,
  MemoryStick,
  HardDrive,
  Monitor,
  Gpu,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
} from "lucide-react";

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

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onEnquire: (product: Product) => void;
}

export default function ProductDetailsModal({
  isOpen,
  onClose,
  product,
  onEnquire,
}: ProductDetailsModalProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  // Reset slide index when modal is opened for a different product
  useEffect(() => {
    if (isOpen) {
      setActiveIdx(0);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  // Split comma-separated URLs
  const imageUrls = product.image_url
    ? product.image_url.split(",").filter((url) => url.trim() !== "")
    : [];

  const handleNext = () => {
    if (activeIdx < imageUrls.length - 1) {
      setActiveIdx((prev) => prev + 1);
    } else {
      setActiveIdx(0); // Loop back
    }
  };

  const handlePrev = () => {
    if (activeIdx > 0) {
      setActiveIdx((prev) => prev - 1);
    } else {
      setActiveIdx(imageUrls.length - 1); // Loop to end
    }
  };

  const formattedPrice = product.price
    ? `₹${Number(product.price).toLocaleString("en-IN")}`
    : "Request Quote";


  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-[#35251A]/60 backdrop-blur-xl selection:bg-[#D6B98C] selection:text-[#5B4636]">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          onClick={onClose}
        />

        {/* Modal content */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          className="relative z-10 w-full max-w-4xl rounded-[2.5rem] border border-[rgba(214,185,140,0.3)] bg-gradient-to-b from-[#FFFDF7]/95 to-[#F3E9DC]/98 p-5 md:p-8 shadow-2xl flex flex-col md:flex-row gap-6 md:gap-8 overflow-hidden max-h-[90vh]"
        >
          {/* Neon Floating Ambient Backgrounds */}
          <div className="absolute -left-20 -top-20 -z-10 h-40 w-40 rounded-full bg-[#D6B98C]/15 blur-[80px] pointer-events-none"></div>
          <div className="absolute -right-20 -bottom-20 -z-10 h-40 w-40 rounded-full bg-[#D6B98C]/15 blur-[80px] pointer-events-none"></div>

          {/* Close X Button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute right-5 top-5 z-30 rounded-full border border-[rgba(214,185,140,0.25)] bg-[#FFFDF7]/60 p-2.5 text-[#5B4636] transition hover:bg-[#F3E9DC] hover:text-[#5B4636] hover:border-[rgba(214,185,140,0.5)] shadow-md"
          >
            <X className="h-4.5 w-4.5" />
          </motion.button>

          {/* Left Column - Swipeable Image Gallery */}
          <div className="flex-1 flex flex-col items-center justify-center relative min-h-[260px] sm:min-h-[320px] md:min-h-[400px] bg-[#F3E9DC]/30 rounded-3xl border border-[rgba(214,185,140,0.2)] overflow-hidden p-4 group">
            {imageUrls.length > 0 ? (
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.div
                    key={activeIdx}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.4}
                    onDragEnd={(_, info) => {
                      const swipe = info.offset.x;
                      if (swipe < -40) {
                        handleNext();
                      } else if (swipe > 40) {
                        handlePrev();
                      }
                    }}
                    className="cursor-grab active:cursor-grabbing w-full h-full flex items-center justify-center touch-pan-y"
                  >
                    <motion.img
                      src={imageUrls[activeIdx]}
                      alt={`${product.name} gallery image ${activeIdx + 1}`}
                      className="max-h-[220px] sm:max-h-[280px] md:max-h-[350px] w-auto rounded-2xl object-contain select-none shadow-[0_15px_30px_rgba(91,70,54,0.08)]"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Left/Right Desktop Navigation Arrows */}
                {imageUrls.length > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-20 hidden md:flex h-9 w-9 items-center justify-center rounded-full bg-[#FFFDF7]/80 border border-[rgba(214,185,140,0.3)] text-[#5B4636] backdrop-blur-sm transition hover:bg-[#D6B98C] hover:text-[#5B4636] hover:scale-105"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-20 hidden md:flex h-9 w-9 items-center justify-center rounded-full bg-[#FFFDF7]/80 border border-[rgba(214,185,140,0.3)] text-[#5B4636] backdrop-blur-sm transition hover:bg-[#D6B98C] hover:text-[#5B4636] hover:scale-105"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </>
                )}

                {/* Micro Swipe Helper Tag */}
                <div className="absolute top-3 left-3 bg-[#FFFDF7]/85 backdrop-blur-sm px-2 py-0.5 border border-[rgba(214,185,140,0.2)] rounded-full text-[8px] font-black uppercase tracking-wider text-[#7a6153]">
                  Swipe to view ({activeIdx + 1}/{imageUrls.length})
                </div>
              </div>
            ) : (
              <div className="text-[#7a6153] text-xs py-10 flex flex-col items-center gap-2">
                <div className="h-10 w-10 bg-white/5 rounded-full flex items-center justify-center text-[#7a6153]">No Image</div>
                <span>No Images Available</span>
              </div>
            )}

            {/* Slide Pagination Dots */}
            {imageUrls.length > 1 && (
              <div className="flex justify-center gap-1.5 mt-4 z-20">
                {imageUrls.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === activeIdx ? "w-5 bg-[#D6B98C]" : "w-1.5 bg-[#5B4636]/20 hover:bg-[#5B4636]/40"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product details */}
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1">
            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#D6B98C]/95 px-2.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-[#5B4636] shadow-sm border border-[rgba(214,185,140,0.3)] mb-2.5">
                <Sparkles className="h-2.5 w-2.5 text-[#5B4636] animate-pulse" />
                Premium Device
              </span>
              <h2
                className="text-xl md:text-2xl font-black text-[#5B4636] leading-tight tracking-tight"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                {product.name}
              </h2>
            </div>

            {/* Pricing block */}
            <div className="py-3 px-4 rounded-2xl bg-[#FFFDF7] border border-[rgba(214,185,140,0.2)] flex items-center justify-between">
              <div>
                <span className="text-[8px] font-black text-[#7a6153] uppercase tracking-widest block leading-none">Starting pricing</span>
                <p
                  className="text-lg md:text-xl font-black text-[#5B4636] tracking-tight mt-1"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {formattedPrice}
                </p>
              </div>
              <span className="text-[9px] font-bold text-[#5B4636] border border-[#D6B98C]/30 rounded-full px-2.5 py-0.5 bg-[#D6B98C]/10">
                In Stock
              </span>
            </div>

            {/* Specifications list */}
            <div className="space-y-2.5">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D6B98C]">Technical Specifications</h3>
              
              <div className="grid grid-cols-1 gap-2">
                {[
                  { icon: <Cpu size={14} />, label: "Processor (CPU)", value: product.processor },
                  { icon: <MemoryStick size={14} />, label: "Memory (RAM)", value: product.ram },
                  { icon: <HardDrive size={14} />, label: "Storage (SSD)", value: product.storage },
                  { icon: <Monitor size={14} />, label: "Display Size", value: product.display },
                  { icon: <Gpu size={14} />, label: "Graphics (GPU)", value: product.graphics },
                ].map(({ icon, label, value }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 rounded-2xl bg-[#FFFDF7] border border-[rgba(214,185,140,0.25)] px-4 py-3 hover:bg-[#F3E9DC]/50 hover:border-[#D6B98C]/40 transition duration-300"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#F3E9DC] text-[#D6B98C] border border-[rgba(214,185,140,0.2)]">
                      {icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[8px] font-black uppercase tracking-wider text-[#7a6153] leading-none">
                        {label}
                      </p>
                      <p className="mt-1 text-xs font-bold text-[#5B4636] truncate">
                        {value || "—"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Action buttons */}
            <div className="mt-auto pt-4 border-t border-[rgba(214,185,140,0.25)] flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="flex-1 rounded-full border border-[rgba(214,185,140,0.3)] bg-[#FFFDF7] py-3.5 text-xs font-black uppercase tracking-widest text-[#5B4636] transition hover:bg-[#F3E9DC]"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Close
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 4px 15px rgba(214,185,140,0.4)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onEnquire(product);
                  onClose();
                }}
                className="flex-[1.5] flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#D6B98C] to-[#b8936a] py-3.5 text-xs font-black uppercase tracking-widest text-[#5B4636] shadow-md border border-[rgba(214,185,140,0.3)]"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                <MessageSquare className="h-4.5 w-4.5" />
                Enquire Now
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
