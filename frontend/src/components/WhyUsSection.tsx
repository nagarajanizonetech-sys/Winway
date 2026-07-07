import { motion } from "framer-motion";
import CountUp from "./animations/CountUp";

function parseLabel(label: string) {
  if (label.includes("/5")) {
    return { target: 4.9, decimals: 1, suffix: "/5" };
  } else if (label.includes("+")) {
    return { target: parseFloat(label), decimals: 0, suffix: "+" };
  } else if (label.includes("yr")) {
    return { target: parseFloat(label), decimals: 0, suffix: "yr" };
  } else {
    return { target: parseFloat(label), decimals: 0, suffix: "" };
  }
}

export default function WhyUsSection() {
  const statsData = [
    { label: "4.9/5", caption: "Customer satisfaction" },
    { label: "250+", caption: "Devices serviced" },
    { label: "12", caption: "Top hardware brands" },
    { label: "1yr", caption: "Warranty on service" },
  ];

  return (
    <section className="py-20 md:py-32 bg-[#F3E9DC] relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#D6B98C]/30 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-[2.5rem] glass-card p-10 md:p-14 shadow-2xl relative overflow-hidden"
          >
            {/* Subtle glow inside card */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#D6B98C]/20 blur-[80px] rounded-full pointer-events-none"></div>
            
            <p className="text-sm uppercase tracking-[0.3em] text-[#D6B98C] font-semibold relative z-10">
              Why Winway
            </p>
            <h3 className="mt-5 text-3xl md:text-4xl font-extrabold text-[#5B4636] leading-tight relative z-10">
              A smarter way to buy and repair laptops.
            </h3>
            <p className="mt-6 text-lg text-[#7a6153] leading-relaxed relative z-10">
              Winway combines industry-leading devices with genuine expertise
              and transparent service. Enjoy priority support, extended
              warranties, and a seamless experience from checkout to repair
              completion.
            </p>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 relative z-10">
              {[
                { title: "VIP support", detail: "Fast help from certified technicians." },
                { title: "Trusted brands", detail: "Genuine hardware and premium performance." },
                { title: "Smart repairs", detail: "Diagnostics, upgrades, and warranty-safe service." },
                { title: "Easy quotes", detail: "Clear pricing before any work begins." },
              ].map((item) => (
                <div key={item.title} className="rounded-3xl bg-[#FFFDF7] border border-[rgba(214,185,140,0.25)] p-6 hover-lift transition-all">
                  <p className="text-xs uppercase tracking-[0.25em] text-[#D6B98C] font-semibold">
                    {item.title}
                  </p>
                  <p className="mt-3 text-[#5B4636] text-sm leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-6 sm:grid-cols-2"
          >
            {statsData.map((stat) => {
              const parsed = parseLabel(stat.label);
              return (
                <div
                  key={stat.label}
                  className="rounded-[2.5rem] glass-card p-10 flex flex-col justify-center items-center text-center hover-lift transition-all duration-300"
                >
                  <p className="text-5xl font-extrabold text-[#5B4636] tracking-tight mb-4">
                    <CountUp target={parsed.target} decimals={parsed.decimals} suffix={parsed.suffix} duration={2} />
                  </p>
                  <p className="text-sm font-medium text-[#7a6153] uppercase tracking-widest">{stat.caption}</p>
                </div>
              );
            })}
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
