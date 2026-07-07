import dellLogo from "../assets/dell-2.svg";
import hpLogo from "../assets/hp-5.svg";
import lenovoLogo from "../assets/lenovo-logo-2015.svg";
import asusLogo from "../assets/asus-4.svg";
import acerLogo from "../assets/acer-2011.svg";
import samsungLogo from "../assets/samsung-8.svg";

const brands = [
  { name: "Dell", logo: dellLogo },
  { name: "HP", logo: hpLogo },
  { name: "Lenovo", logo: lenovoLogo },
  { name: "Asus", logo: asusLogo },
  { name: "Acer", logo: acerLogo },
  { name: "Samsung", logo: samsungLogo },
];

export default function BrandMarquee() {
  const tripled = [...brands, ...brands, ...brands];

  return (
    <section className="relative overflow-hidden py-14" style={{ background: "#F3E9DC" }}>
      {/* Top divider */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D6B98C]/50 to-transparent" />

      {/* Soft fade edges */}
      <div
        className="absolute inset-y-0 left-0 w-32 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, #F3E9DC, transparent)" }}
      />
      <div
        className="absolute inset-y-0 right-0 w-32 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, #F3E9DC, transparent)" }}
      />

      {/* Section heading */}
      <div className="mb-10 text-center px-4">
        <p className="text-[11px] uppercase tracking-[0.3em] font-semibold text-[#D6B98C]">
          Trusted by
        </p>
        <h2 className="mt-3 text-3xl font-bold text-[#5B4636] tracking-tight">
          Leading hardware brands
        </h2>
      </div>

      {/* Scrolling track */}
      <div className="overflow-hidden w-full">
        <div
          className="flex items-center w-max will-change-transform"
          style={{ animation: "marquee-scroll 34s linear infinite" }}
        >
          {tripled.map((brand, i) => (
            <div
              key={i}
              className="group inline-flex flex-col items-center gap-2.5 px-8 py-4 mx-1 rounded-2xl cursor-default transition-all duration-300 hover:scale-110"
              style={{
                background: "transparent",
                border: "1px solid transparent",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.background =
                  "rgba(214, 185, 140, 0.15)";
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  "0 8px 24px rgba(91, 70, 54, 0.08)";
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  "rgba(214, 185, 140, 0.4)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.background = "transparent";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                (e.currentTarget as HTMLDivElement).style.borderColor = "transparent";
              }}
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="w-20 h-20 object-contain transition-all duration-300"
                style={{
                  opacity: 1,
                  filter: "none",
                }}
              />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[#7a6153] group-hover:text-[#5B4636] transition-colors duration-300">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </section>
  );
}