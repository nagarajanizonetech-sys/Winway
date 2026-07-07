import {
  Laptop,
  Wrench,
  Monitor,
  Keyboard,
  Cpu,
  Printer,
  Wifi,
  Settings,
  ShieldCheck,
  RotateCcw,
  HardDrive,
  Headphones,
} from "lucide-react";
import { motion } from "framer-motion";
import ServiceCard from "./ServiceCard";
import MagneticButton from "./animations/MagneticButton";

const MOCK_SERVICES = [
  {
    id: 1,
    title: "Laptop Sales",
    description: "Find the perfect laptop for your needs.",
    icon: Laptop,
    featured: true,
  },
  {
    id: 2,
    title: "Laptop Repair",
    description: "All hardware issues diagnosed and fixed.",
    icon: Wrench,
  },
  {
    id: 3,
    title: "Monitor Repair",
    description: "Display & connectivity problems solved.",
    icon: Monitor,
  },
  {
    id: 4,
    title: "Keyboard Repair",
    description: "Same-day keyboard repair service.",
    icon: Keyboard,
  },
  {
    id: 5,
    title: "Hardware Upgrades",
    description: "Upgrade your RAM, SSD, or GPU for better performance.",
    icon: Cpu,
  },
  {
    id: 6,
    title: "Printer Repair",
    description: "Printer diagnostics and repair for all models.",
    icon: Printer,
  },
  {
    id: 7,
    title: "Network Solutions",
    description: "Wi-Fi setup, router installation & networking support.",
    icon: Wifi,
  },
  {
    id: 8,
    title: "Software Support",
    description: "OS installation, software setup & troubleshooting.",
    icon: Settings,
  },
  {
    id: 9,
    title: "Virus Removal",
    description: "Remove viruses and malware to keep your system safe.",
    icon: ShieldCheck,
  },
  {
    id: 10,
    title: "Data Backup",
    description: "Secure your important data with backup solutions.",
    icon: RotateCcw,
  },
  {
    id: 11,
    title: "Data Recovery",
    description: "Recover lost or deleted data safely.",
    icon: HardDrive,
  },
  {
    id: 12,
    title: "AMC Services",
    description: "Annual Maintenance Contracts for worry-free support.",
    icon: Headphones,
  },
];

interface ServicesSectionProps {
  onEnquire: (title: string) => void;
}

export default function ServicesSection({ onEnquire }: ServicesSectionProps) {
  return (
    <section id="services" className="py-36 bg-[#FCF8F2] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.35em] text-[#b8936a] font-semibold mb-4">
            What we do
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#5B4636] tracking-tight leading-[1.15]">
            Pick a service, we’ll handle the rest.
          </h2>
          {/* Decorative divider */}
          <div className="mt-4 mx-auto w-24 h-1 bg-[#D6B98C] rounded" />
        </div>

        {/* Card grid — single grid, no extra wrapper divs, ServiceCard handles its own background/shape */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              }
            }
          }}
        >
          {MOCK_SERVICES.map((service) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              description={service.description}
              Icon={service.icon}
              featured={service.featured}
              onEnquire={onEnquire}
            />
          ))}
        </motion.div>

        {/* View all CTA */}
        <div className="text-center mt-12">
          <MagneticButton>
            <button className="inline-flex items-center gap-2 rounded-full border border-[#D6B98C] px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-[#5B4636] transition-all duration-300 hover:bg-[#5B4636] hover:text-white hover:border-[#5B4636] active:scale-95">
              View All Services
              <span className="inline-block">→</span>
            </button>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}