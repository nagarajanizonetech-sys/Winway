import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Creative Director",
    content:
      "The repair service was incredibly fast. My MacBook feels brand new again. Highly recommend Winway!",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60",
  },
  {
    name: "Michael Chen",
    role: "Software Engineer",
    content:
      "Bought my latest gaming rig here. The specs are monster and the customer support was top-tier.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60",
  },
  {
    name: "Emma Williams",
    role: "Freelance Designer",
    content:
      "Expert advice and very fair pricing. They really know their hardware. Winway is my go-to tech store.",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=60",
  },
];

export default function Testimonials() {
  return (
    <section className="section-padding bg-[#F3E9DC]/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-[#5B4636] mb-4 tracking-tight">
            Trusted by Experts
          </h2>
          <p className="text-lg text-[#7a6153]">
            Join thousands of satisfied customers who trust Winway with their
            technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-3xl shadow-[0_12px_35px_-15px_rgba(91,70,54,0.06)] border border-[rgba(214,185,140,0.25)] flex flex-col h-full"
            >
              <Quote className="h-10 w-10 text-[#D6B98C] mb-6" />
              <p className="text-[#7a6153] text-lg mb-8 italic flex-grow">
                "{t.content}"
              </p>
              <div className="flex items-center gap-4 pt-6 border-t border-[rgba(214,185,140,0.15)]">
                <img
                  src={t.image}
                  alt={t.name}
                  className="h-14 w-14 rounded-full object-cover border-2 border-[#D6B98C]"
                />
                <div>
                  <div className="font-bold text-[#5B4636]">{t.name}</div>
                  <div className="text-sm text-[#7a6153]">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
