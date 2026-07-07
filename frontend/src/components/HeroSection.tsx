import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  ChevronLeft, ChevronRight, ArrowRight, MessageSquare,
  Shield, Truck, BadgeCheck, Headphones,
  Cpu, Monitor, MemoryStick, HardDrive,
  CreditCard, RefreshCw, GraduationCap, Building2,
} from "lucide-react";
import api from "../services/api";
import { HexagonBackground } from "../components/backgrounds/hexagon";
import MagneticButton from "./animations/MagneticButton";
import Reveal from "./animations/Reveal";

interface HeroData {
  id: number; title: string; subtitle: string;
  button_text: string; button_link: string;
  image_url: string; image_position: string; is_active: boolean;
  tag?: string;
  processor?: string;
  ram?: string;
  storage?: string;
  display?: string;
  graphics?: string;
}
interface SlideItem {
  tag: string; title: string; subtitle: string; image: string;
  alt: string; button_text: string; button_link: string;
  image_position: string; enquiry: string;
  processor?: string;
  ram?: string;
  storage?: string;
  display?: string;
  graphics?: string;
}
interface HeroSectionProps { onEnquire?: (title: string) => void; }

const fallbackSlides: SlideItem[] = [
  { tag: "Special Offer", title: "Power. Performance.\nMade for Winners.",
    subtitle: "Experience next-level performance with the latest laptops built for gamers, creators and professionals.",
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=700&q=85&fit=crop",
    alt: "Premium Laptop", button_text: "Explore Laptops", button_link: "#products",
    image_position: "right", enquiry: "Premium Laptop" },
  { tag: "Best Seller", title: "Dell XPS 15 — Built for\nCreators & Professionals",
    subtitle: "Ultra-thin design meets powerhouse internals for the modern creator.",
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=700&q=85&fit=crop",
    alt: "Dell XPS 15", button_text: "Browse Products", button_link: "#products",
    image_position: "right", enquiry: "Dell XPS 15" },
  { tag: "Gaming Pick", title: "ASUS ROG Zephyrus G14\nRTX 4060 Powerhouse",
    subtitle: "Dominate every game with unmatched GPU performance and vivid display.",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=700&q=85&fit=crop",
    alt: "ASUS ROG Gaming Laptop", button_text: "Browse Products", button_link: "#products",
    image_position: "right", enquiry: "ASUS ROG Zephyrus G14" },
  { tag: "Office Ready", title: "HP EliteBook 840 G10\nSlim, Secure & Fast",
    subtitle: "Enterprise-grade security and performance in an ultra-portable form.",
    image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=700&q=85&fit=crop",
    alt: "HP EliteBook", button_text: "Browse Products", button_link: "#products",
    image_position: "right", enquiry: "HP EliteBook 840 G10" },
];

const trustItems = [
  { icon: Shield,     title: "100% Original Products", desc: "Genuine laptops from trusted brands."   },
  { icon: Truck,      title: "Fast & Secure Delivery", desc: "Quick delivery across India."           },
  { icon: BadgeCheck, title: "1 Year Warranty",        desc: "Complete assurance on all laptops."     },
  { icon: Headphones, title: "24/7 Support",           desc: "We're here to help, anytime you need." },
];
const serviceCards = [
  { icon: CreditCard,    title: "No Cost EMI Available",            desc: "Easy monthly payments on leading banks."  },
  { icon: RefreshCw,     title: "Exchange Offer Up to ₹15,000 Off", desc: "Exchange your old laptop and save more."  },
  { icon: GraduationCap, title: "Student Discount Up to 10% Off",   desc: "Exclusive offers for students."           },
  { icon: Building2,     title: "Corporate Deals Custom Solutions",  desc: "Best prices for bulk and business needs." },
];

const C = {
  gold: "#C9A96E", gold2: "#A07840", gold3: "#D6B98C",
  brown: "#5B3E28", brown2: "#3D2812", brown3: "#7A5C3E",
  sand: "#F5EDE0", sandLight: "#F9F4ED", white: "#FFFDF7",
};

function LaptopIllustration() {
  return (
    <svg viewBox="0 0 440 300" fill="none" xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[180px] sm:max-w-[240px] lg:max-w-[300px] xl:max-w-[330px]"
      style={{ filter: "drop-shadow(0 20px 40px rgba(91,70,54,0.18))" }}>
      <defs>
        <linearGradient id="sgH" x1="55" y1="22" x2="385" y2="228" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#D6B98C" stopOpacity=".09"/>
          <stop offset="100%" stopColor="#C9A96E" stopOpacity=".03"/>
        </linearGradient>
        <radialGradient id="ggH" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#C9A96E" stopOpacity=".18"/>
          <stop offset="100%" stopColor="#C9A96E" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx="220" cy="265" rx="185" ry="28" fill="url(#ggH)"/>
      <rect x="42" y="12" width="356" height="228" rx="14" fill="#2a1f14" stroke="#5B3E28" strokeWidth="1.5"/>
      <rect x="55" y="24" width="330" height="204" rx="8" fill="#120c07"/>
      <rect x="55" y="24" width="330" height="204" rx="8" fill="url(#sgH)"/>
      <rect x="68" y="36" width="304" height="180" rx="5" fill="#0e0804"/>
      <rect x="82" y="48" width="180" height="4" rx="2" fill="#c9a96e" opacity=".55"/>
      <rect x="82" y="57" width="110" height="2.5" rx="1.5" fill="#7a5c3e" opacity=".45"/>
      <rect x="82" y="72" width="290" height="72" rx="7" fill="#1a0f07" opacity=".85"/>
      <rect x="94" y="83" width="110" height="4.5" rx="2" fill="#c9a96e" opacity=".65"/>
      <rect x="94" y="93" width="80" height="3" rx="1.5" fill="#7a5c3e" opacity=".5"/>
      <rect x="94" y="105" width="88" height="9" rx="4.5" fill="#5B3E28" opacity=".85"/>
      {[210,229,248,267,286].map((x,i)=><rect key={x} x={x} y={[88,95,84,92,79][i]} width="13" height={[32,25,36,28,41][i]} rx="2.5" fill={["#c9a96e","#a07840","#d6b98c","#c9a96e","#a07840"][i]} opacity={[.5,.5,.6,.45,.55][i]}/>)}
      <rect x="82" y="156" width="148" height="2.5" rx="1.5" fill="#7a5c3e" opacity=".3"/>
      <rect x="82" y="165" width="104" height="2.5" rx="1.5" fill="#7a5c3e" opacity=".25"/>
      <rect x="82" y="174" width="124" height="2.5" rx="1.5" fill="#7a5c3e" opacity=".2"/>
      <rect x="250" y="152" width="108" height="52" rx="7" fill="#1a0f07" opacity=".8"/>
      <circle cx="304" cy="168" r="13" fill="none" stroke="#c9a96e" strokeWidth="1.5" opacity=".5"/>
      <circle cx="304" cy="168" r="7" fill="#c9a96e" opacity=".18"/>
      <circle cx="220" cy="18" r="3" fill="#3d2812"/>
      <circle cx="220" cy="18" r="1.5" fill="#5B3E28"/>
      <rect x="22" y="240" width="396" height="18" rx="4" fill="#3d2812"/>
      <rect x="0" y="258" width="440" height="10" rx="5" fill="#5B3E28"/>
      <g opacity=".3" fill="#c9a96e">
        {[68,80,92,104,116,128].map(x=><rect key={x} x={x} y="250" width="8" height="5" rx="1"/>)}
        <rect x="180" y="250" width="80" height="5" rx="1"/>
        {[290,302,314,326].map(x=><rect key={x} x={x} y="250" width="8" height="5" rx="1"/>)}
      </g>
      <rect x="176" y="256" width="88" height="10" rx="3" fill="#4a3220" opacity=".65"/>
    </svg>
  );
}

const specsContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const specItem: Variants = {
  hidden: {
    opacity: 0,
    x: 100
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6
    }
  }
};

export default function HeroSection({ onEnquire }: HeroSectionProps) {
  const [slides, setSlides]       = useState<SlideItem[]>([]);
  const [current, setCurrent]     = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const [loading, setLoading]     = useState(true);
  const [isMobile, setIsMobile]   = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res  = await api.get("/hero-section/all");
        const data: HeroData[] = res.data;
        setSlides(data?.length
          ? data.map(h => ({
              tag: h.tag || "Special Offer", title: h.title, subtitle: h.subtitle,
              image: h.image_url, alt: h.title, button_text: h.button_text,
              button_link: h.button_link, image_position: h.image_position, enquiry: h.title,
              processor: h.processor, ram: h.ram, storage: h.storage,
              display: h.display, graphics: h.graphics,
            }))
          : fallbackSlides);
      } catch { setSlides(fallbackSlides); }
      finally { setLoading(false); }
    })();
  }, []);

  const goTo = (idx: number, _d?: number) => {
    setCurrent((idx + slides.length) % slides.length);
  };
  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);
  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, 4500);
  };
  useEffect(() => {
    if (slides.length <= 1) return;
    timerRef.current = setInterval(next, 4500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [current, slides.length]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: "#F3E9DC" }}>
      <div className="h-9 w-9 animate-spin rounded-full border-4"
        style={{ borderColor: C.gold3, borderTopColor: "transparent" }}/>
    </div>
  );
  if (!slides.length) return null;

  const slide = slides[current];

  const currentSpecs = [
    { icon: Cpu,         name: "Processor", val: slide.processor || "Intel Core i9" },
    { icon: Monitor,     name: "Graphics",  val: slide.graphics  || "NVIDIA RTX 4070" },
    { icon: MemoryStick, name: "Memory",    val: slide.ram       || "16GB DDR5 RAM" },
    { icon: HardDrive,   name: "Storage",   val: slide.storage   || "1TB SSD" },
  ];



  const glassCard: React.CSSProperties = {
    background: "rgba(255,253,247,0.60)",
    backdropFilter: "blur(24px) saturate(160%)",
    WebkitBackdropFilter: "blur(24px) saturate(160%)",
    border: "1.5px solid rgba(255,255,255,0.78)",
    boxShadow: "0 12px 72px rgba(91,70,54,0.15), 0 2px 20px rgba(201,169,110,0.10), inset 0 1.5px 0 rgba(255,255,255,0.65)",
    overflow: "hidden",
  };

  const arrowStyle: React.CSSProperties = {
    background: "rgba(255,253,247,0.96)",
    border: "1.5px solid rgba(201,169,110,0.45)",
    color: C.brown,
    boxShadow: "0 6px 22px rgba(91,70,54,0.18)",
    borderRadius: "50%",
    width: 40, height: 40,
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", flexShrink: 0,
    transition: "transform 0.15s, box-shadow 0.15s",
  };

  const specPill: React.CSSProperties = {
    background: "rgba(255,253,247,0.75)",
    borderColor: "rgba(201,169,110,0.22)",
    boxShadow: "0 2px 10px rgba(91,70,54,0.06)",
  };

  const multiSlide = slides.length > 1;

  return (
    <>
      <section
        id="home"
        className="relative overflow-hidden pt-[108px] pb-8 sm:pb-10 lg:pb-12"
        style={{
          background: `linear-gradient(160deg, ${C.white} 0%, ${C.sand} 55%, #EDE0CC 100%)`,
        }}
      >
        {/* Hexagon background restricted to the left side and faded out */}
        <HexagonBackground 
          className="absolute inset-y-0 left-0 w-full sm:w-[50%] lg:w-[42%] z-0 pointer-events-none"
          style={{
            maskImage: "linear-gradient(to right, rgba(0,0,0,1) 30%, rgba(0,0,0,0.5) 65%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,1) 30%, rgba(0,0,0,0.5) 65%, rgba(0,0,0,0) 100%)",
          }}
          hexagonSize={64}
          hexagonMargin={6}
          hexagonProps={{
            style: {
              backgroundColor: "rgba(201, 169, 110, 0.06)",
              borderColor: "rgba(201, 169, 110, 0.15)",
            }
          }}
        />

        <div className="absolute pointer-events-none"
          style={{ top:-60, right:"18%", width:460, height:460, background:"rgba(214,185,140,0.26)", borderRadius:"50%", filter:"blur(120px)" }}/>
        <div className="absolute pointer-events-none"
          style={{ bottom:-80, left:"6%", width:340, height:340, background:"rgba(201,169,110,0.13)", borderRadius:"50%", filter:"blur(90px)" }}/>

        <div className="relative z-10 mx-auto w-full max-w-[1520px] px-3 sm:px-5 lg:px-6 xl:px-8">
          <div className="flex items-center gap-0 sm:gap-3 lg:gap-4">

            {/* LEFT arrow — not rendered at all on mobile (JS width check), shown sm+ */}
            {multiSlide && !isMobile && (
              <button
                onClick={() => { prev(); resetTimer(); }}
                aria-label="Previous slide"
                className="flex shrink-0"
                style={arrowStyle}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
              >
                <ChevronLeft size={18}/>
              </button>
            )}

            {/* GLASS CARD — occupies full width on mobile since arrows take no space there */}
            <div
              className="flex-1 w-full min-w-0 sm:h-[400px] lg:h-[440px]"
              style={{
                ...glassCard,
                borderRadius: "1.25rem",   /* rounded on mobile too */
              }}
            >
              <div className="flex flex-col px-5 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7 sm:h-full">

                <div className="sm:flex-1 sm:min-h-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-3 lg:gap-5 items-center">
                  {/* TEXT column */}
                  {(() => {
                    let headingWordCounter = 0;
                    const totalHeadingWords = slide.title.split(/\s+/).filter(Boolean).length;
                    const titleLines = slide.title.split("\n");
                    return (
                      <motion.div
                        key={`text-col-${current}`}
                        className="order-2 sm:order-1 sm:col-span-1 lg:col-span-5 flex flex-col justify-center gap-2 min-h-0"
                      >
                        <motion.span
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          className="self-start inline-flex items-center gap-1.5 rounded-full px-3 py-1"
                          style={{ background:"rgba(201,169,110,0.14)", border:"1px solid rgba(201,169,110,0.38)" }}
                        >
                          <span className="animate-pulse h-1.5 w-1.5 rounded-full inline-block" style={{ background:C.gold }}/>
                          <span className="text-[9.5px] font-bold uppercase tracking-[0.22em]" style={{ color:C.gold2 }}>
                            {slide.tag}
                          </span>
                        </motion.span>

                        <motion.h1
                          className="m-0 font-black leading-[1.08] tracking-[-0.025em]"
                          style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            color: C.brown2,
                            fontSize: "clamp(1.2rem, 2.4vw + 0.7rem, 2.55rem)",
                          }}
                        >
                          {titleLines.map((line, lineIdx) => {
                            const words = line.split(" ");
                            const isGold = lineIdx === 1;
                            return (
                              <span key={lineIdx} className={lineIdx > 0 ? "block mt-1" : "block"}>
                                {words.map((word) => {
                                  const currentIdx = headingWordCounter++;
                                  const delay = currentIdx * 0.08;
                                  return (
                                    <motion.span
                                      key={`${current}-${currentIdx}`}
                                      className="inline-block mr-[0.25em]"
                                      initial={{ opacity: 0, y: 70 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
                                      style={isGold ? {
                                        background: `linear-gradient(135deg, ${C.gold} 0%, ${C.gold2} 100%)`,
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                        backgroundClip: "text",
                                      } : undefined}
                                    >
                                      {word}
                                    </motion.span>
                                  );
                                })}
                              </span>
                            );
                          })}
                        </motion.h1>

                        {slide.subtitle && (
                          <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.12 + totalHeadingWords * 0.06 + 0.08, ease: [0.22, 1, 0.36, 1] }}
                            className="line-clamp-2 leading-6"
                            style={{
                              color: C.brown3,
                              fontSize: "clamp(0.72rem, 0.8vw + 0.32rem, 0.88rem)",
                              maxWidth: "30rem",
                            }}
                          >
                            {slide.subtitle}
                          </motion.p>
                        )}

                        {/* CTAs — names unchanged, kept exactly as original */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: 0.12 + totalHeadingWords * 0.06 + 0.22, ease: [0.22, 1, 0.36, 1] }}
                          className="flex flex-wrap items-center gap-2"
                        >
                          <MagneticButton>
                            <a
                              href={slide.button_link}
                              className="inline-flex items-center gap-1.5 rounded-full font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                              style={{
                                background:`linear-gradient(135deg,${C.brown} 0%,${C.brown2} 100%)`,
                                color: C.white, textDecoration: "none",
                                boxShadow: "0 5px 16px rgba(61,40,18,0.24)",
                                padding: "0.45rem 1.1rem",
                                fontSize: "clamp(0.7rem, 0.8vw + 0.22rem, 0.85rem)",
                              }}
                            >
                              {slide.button_text}<ArrowRight size={13}/>
                            </a>
                          </MagneticButton>
                          <MagneticButton>
                            <button
                              onClick={() => onEnquire?.(slide.enquiry)}
                              className="inline-flex items-center gap-1.5 rounded-full font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
                              style={{
                                background: "rgba(255,253,247,0.55)",
                                color: C.brown,
                                border: `1.5px solid rgba(201,169,110,0.48)`,
                                padding: "0.42rem 0.9rem",
                                fontSize: "clamp(0.7rem, 0.8vw + 0.22rem, 0.85rem)",
                              }}
                            >
                              <MessageSquare size={12} color={C.gold3}/>Enquire Now
                            </button>
                          </MagneticButton>
                        </motion.div>
                      </motion.div>
                    );
                  })()}

                  {/* IMAGE column */}
                  <div className="order-1 sm:order-2 sm:col-span-1 lg:col-span-4 flex items-center justify-center relative h-[210px] sm:h-full">
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div style={{
                        width:"65%", height:"65%",
                        background:"radial-gradient(ellipse, rgba(214,185,140,0.30) 0%, transparent 70%)",
                        borderRadius:"50%",
                      }}/>
                    </div>

                    <motion.div
                      key={`img-entrance-${current}`}
                      initial={{
                        opacity: 0,
                        scale: 0.8,
                        y: 70
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0
                      }}
                      transition={{
                        duration: 1,
                        ease: [0.22, 1, 0.36, 1]
                      }}
                      className="relative z-10 w-full flex justify-center px-3"
                    >
                      <motion.div
                        animate={shouldReduceMotion ? {} : { y: [0, -18, 0] }}
                        transition={shouldReduceMotion ? {} : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="w-full flex justify-center"
                      >
                        {slide.image && !slide.image.includes("unsplash") ? (
                          <img src={slide.image} alt={slide.alt}
                            className="w-full max-w-[185px] sm:max-w-[270px] lg:max-w-[560px] xl:max-w-[650px] object-contain"
                            style={{ filter:"drop-shadow(0 20px 36px rgba(91,70,54,0.18))", maxHeight:"350px" }}
                          />
                        ) : (
                          <div className="max-h-[185px] sm:max-h-none overflow-hidden flex items-center justify-center">
                            <LaptopIllustration/>
                          </div>
                        )}
                      </motion.div>
                    </motion.div>

                    {slide.display && (
                      <div className="absolute bottom-3 right-3 bg-[#FFFDF7]/90 backdrop-blur-md border border-[rgba(214,185,140,0.3)] rounded-xl px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-[#5B4636] z-20 shadow-md">
                        {slide.display}
                      </div>
                    )}

                    {/* Dots sm+ */}
                    {multiSlide && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 hidden sm:flex gap-1.5 z-20">
                        {slides.map((_,i) => (
                          <button key={i}
                            onClick={() => { goTo(i, i>current?1:-1); resetTimer(); }}
                            aria-label={`Slide ${i+1}`}
                            className="h-1.5 rounded-full transition-all duration-300"
                            style={{ width:i===current?20:7, background:i===current?C.gold3:"rgba(91,70,54,0.25)" }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* SPEC CARDS — desktop only */}
                  <motion.div
                    key={`specs-${current}`}
                    className="order-3 lg:col-span-3 hidden lg:flex flex-col justify-center gap-2"
                    initial="hidden"
                    animate="visible"
                    variants={specsContainer}
                  >
                    {currentSpecs.map(({ icon:Icon, name, val }) => (
                      <motion.div
                        key={name}
                        variants={specItem}
                        className="flex items-center gap-2.5 rounded-2xl border p-2.5"
                        style={specPill}
                      >
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl"
                          style={{ background:C.sand }}>
                          <Icon size={13} color={C.gold2} strokeWidth={1.5}/>
                        </div>
                        <div className="flex flex-col leading-tight min-w-0">
                          <span className="text-[12px] font-semibold truncate" style={{ color:C.brown2 }}>{name}</span>
                          <span className="text-[10.5px] truncate" style={{ color:C.brown3 }}>{val}</span>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                {/* Mobile/tablet: spec scroll + dots */}
                <div className="mt-3 lg:hidden">
                  <motion.div
                    key={`specs-mobile-${current}`}
                    className="-mx-5 sm:-mx-6 flex gap-2 overflow-x-auto px-5 sm:px-6 pb-0.5 [scrollbar-width:none] [-ms-overflow-style:none]"
                    initial="hidden"
                    animate="visible"
                    variants={specsContainer}
                  >
                    {currentSpecs.map(({ icon:Icon, name, val }) => (
                      <motion.div
                        key={name}
                        variants={specItem}
                        className="flex flex-shrink-0 items-center gap-2 rounded-xl border px-3 py-2 min-w-[150px]"
                        style={specPill}
                      >
                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg"
                          style={{ background:C.sand }}>
                          <Icon size={11} color={C.gold2} strokeWidth={1.5}/>
                        </div>
                        <div className="flex flex-col leading-tight">
                          <span className="whitespace-nowrap text-[11px] font-semibold" style={{ color:C.brown2 }}>{name}</span>
                          <span className="whitespace-nowrap text-[10px]" style={{ color:C.brown3 }}>{val}</span>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Mobile dots */}
                  {multiSlide && (
                    <div className="flex sm:hidden items-center justify-center gap-1.5 mt-3">
                      {slides.map((_,i) => (
                        <button key={i}
                          onClick={() => { goTo(i, i>current?1:-1); resetTimer(); }}
                          aria-label={`Slide ${i+1}`}
                          className="h-1.5 rounded-full transition-all duration-300"
                          style={{ width:i===current?20:7, background:i===current?C.gold3:"rgba(91,70,54,0.25)" }}
                        />
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* RIGHT arrow — not rendered at all on mobile (JS width check), shown sm+ */}
            {multiSlide && !isMobile && (
              <button
                onClick={() => { next(); resetTimer(); }}
                aria-label="Next slide"
                className="flex shrink-0"
                style={arrowStyle}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
              >
                <ChevronRight size={18}/>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div style={{
        background: C.white,
        borderTop: "1px solid rgba(201,169,110,0.2)",
        borderBottom: "1px solid rgba(201,169,110,0.2)",
        padding: "1.1rem 1rem",
      }}>
        <motion.div
          className="mx-auto grid max-w-7xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
        >
          {trustItems.map(({ icon:Icon, title, desc }) => (
            <motion.div
              key={title}
              className="flex items-start gap-3"
              variants={{
                hidden: { opacity: 0, y: 60 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.7,
                    ease: "easeOut"
                  }
                }
              }}
            >
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
                style={{ background:C.sand }}>
                <Icon size={16} color={C.gold2} strokeWidth={1.5}/>
              </div>
              <div>
                <p className="text-sm font-semibold leading-5" style={{ color:C.brown2 }}>{title}</p>
                <p className="text-xs leading-5" style={{ color:C.brown3 }}>{desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* SERVICE CARDS */}
      <Reveal>
        <section style={{ padding:"1.75rem 1rem 2.5rem", background:C.sandLight }}>
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {serviceCards.map(({ icon:Icon, title, desc }) => (
                <div key={title} className="flex h-full flex-col gap-3 rounded-[18px] border p-5"
                  style={{ background:C.white, borderColor:"rgba(201,169,110,0.22)" }}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background:C.sand }}>
                    <Icon size={18} color={C.gold2} strokeWidth={1.5}/>
                  </div>
                  <div>
                    <p className="mb-1 text-base font-bold leading-6" style={{ color:C.brown2 }}>{title}</p>
                    <p className="text-sm leading-6" style={{ color:C.brown3 }}>{desc}</p>
                  </div>
                  <div className="mt-auto ml-auto flex h-7 w-7 items-center justify-center rounded-full"
                    style={{ background:C.sand }}>
                    <ArrowRight size={12} color={C.gold2} strokeWidth={2}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>
    </>
  );
}