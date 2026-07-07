import { Sparkles, MessageSquare, ArrowRight } from "lucide-react";

interface HeroData {
  id: number;
  title: string;
  subtitle: string;
  button_text: string;
  button_link: string;
  image_url: string;
  image_position: string; // "right" | "center" | "left"
  is_active: boolean;
  tag?: string;
  processor?: string;
  ram?: string;
  storage?: string;
  display?: string;
  graphics?: string;
}

interface HeroSectionPreviewProps {
  slide: HeroData | null;
}

export default function HeroSectionPreview({ slide }: HeroSectionPreviewProps) {
  if (!slide) {
    return (
      <div className="flex h-48 items-center justify-center rounded-3xl border border-[rgba(214,185,140,0.2)] bg-[#F3E9DC]/30 text-xs text-[#7a6153]">
        No active slide chosen for preview
      </div>
    );
  }

  // Auto-alignment mapping
  let containerFlexClass = "flex-col md:flex-row";
  let textAlignmentClass = "text-center md:text-left";
  let buttonGroupFlexClass = "justify-center md:justify-start";
  let imageAlignClass = "justify-center md:justify-end";

  if (slide.image_position === "left") {
    containerFlexClass = "flex-col md:flex-row-reverse";
    textAlignmentClass = "text-center md:text-right";
    buttonGroupFlexClass = "justify-center md:justify-end";
    imageAlignClass = "justify-center md:justify-start";
  } else if (slide.image_position === "center") {
    containerFlexClass = "flex-col items-center justify-center text-center gap-6";
    textAlignmentClass = "text-center max-w-xl mx-auto";
    buttonGroupFlexClass = "justify-center";
    imageAlignClass = "justify-center w-full max-w-sm";
  }

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-[rgba(214,185,140,0.3)] bg-gradient-to-br from-[#FFFDF7] to-[#F3E9DC] p-6 md:p-10 shadow-md">
      {/* Glow overlays */}
      <div className="absolute -left-10 -top-10 -z-10 h-32 w-32 rounded-full bg-[#D6B98C]/15 blur-[60px]" />
      <div className="absolute -right-10 -bottom-10 -z-10 h-32 w-32 rounded-full bg-[#D6B98C]/15 blur-[60px]" />

      <div className={`flex items-center gap-6 md:gap-10 ${containerFlexClass}`}>
        
        {/* Text Area */}
        <div className={`flex-1 min-w-0 ${textAlignmentClass}`}>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D6B98C]/15 border border-[#D6B98C]/30 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-[#5B4636] mb-4 leading-none">
            <Sparkles className="h-2.5 w-2.5 text-[#D6B98C]" />
            {slide.tag || "Special Offer"}
          </span>

          <h3 className="text-lg sm:text-xl md:text-2xl font-black text-[#5B4636] leading-snug tracking-tight mb-3 whitespace-pre-line">
            {slide.title.split("\n")[0]} <br />
            {slide.title.split("\n")[1] && (
              <span className="text-[#D6B98C] font-black">{slide.title.split("\n")[1]}</span>
            )}
          </h3>

          <p className="text-[11px] text-[#7a6153] leading-relaxed mb-4 max-w-lg">
            {slide.subtitle || "No descriptive subtitle provided. Add some text to wow your customers."}
          </p>

          {(slide.processor || slide.ram || slide.storage || slide.graphics || slide.display) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {slide.processor && (
                <span className="text-[9px] font-bold bg-[#F3E9DC]/60 text-[#5B4636] px-2 py-0.5 rounded-lg border border-[rgba(214,185,140,0.25)]">
                  CPU: {slide.processor}
                </span>
              )}
              {slide.ram && (
                <span className="text-[9px] font-bold bg-[#F3E9DC]/60 text-[#5B4636] px-2 py-0.5 rounded-lg border border-[rgba(214,185,140,0.25)]">
                  RAM: {slide.ram}
                </span>
              )}
              {slide.storage && (
                <span className="text-[9px] font-bold bg-[#F3E9DC]/60 text-[#5B4636] px-2 py-0.5 rounded-lg border border-[rgba(214,185,140,0.25)]">
                  SSD: {slide.storage}
                </span>
              )}
              {slide.graphics && (
                <span className="text-[9px] font-bold bg-[#F3E9DC]/60 text-[#5B4636] px-2 py-0.5 rounded-lg border border-[rgba(214,185,140,0.25)]">
                  GPU: {slide.graphics}
                </span>
              )}
              {slide.display && (
                <span className="text-[9px] font-bold bg-[#F3E9DC]/60 text-[#5B4636] px-2 py-0.5 rounded-lg border border-[rgba(214,185,140,0.25)]">
                  Screen: {slide.display}
                </span>
              )}
            </div>
          )}

          <div className={`flex flex-wrap gap-2.5 ${buttonGroupFlexClass}`}>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#D6B98C] to-[#b8936a] px-4 py-2 text-[10px] font-bold text-[#5B4636] shadow-md">
              {slide.button_text}
              <ArrowRight className="h-3 w-3" />
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(214,185,140,0.3)] bg-[#FFFDF7]/70 px-4 py-2 text-[10px] font-bold text-[#5B4636]">
              <MessageSquare className="h-3 w-3 text-[#D6B98C]" />
              Enquire Now
            </span>
          </div>
        </div>

        {/* Image Area */}
        <div className={`flex-shrink-0 flex items-center ${imageAlignClass} h-36 md:h-48 w-full md:w-auto relative`}>
          <div className="absolute -inset-2 bg-[#D6B98C]/10 blur-[20px] rounded-full pointer-events-none"></div>
          <img
            src={slide.image_url}
            alt={slide.title}
            className="h-full w-auto max-h-[140px] md:max-h-[180px] rounded-2xl object-contain relative z-10 border border-[rgba(214,185,140,0.2)] shadow-lg"
          />
        </div>

      </div>

      <div className="absolute bottom-3 right-4 bg-[#FFFDF7]/85 border border-[rgba(214,185,140,0.2)] rounded-full px-2.5 py-0.5 text-[8px] font-black text-[#7a6153] uppercase tracking-widest leading-none">
        Layout alignment: {slide.image_position}
      </div>
    </div>
  );
}
