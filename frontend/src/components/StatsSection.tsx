import { motion } from 'framer-motion';

const stats = [
  { label: 'Laptops Repaired', value: '15,000+' },
  { label: 'Happy Clients', value: '8,500+' },
  { label: 'Stores Worldwide', value: '12' },
  { label: 'Years Experience', value: '15' },
];

export default function StatsSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-black text-brand-600 mb-2 tracking-tighter">
                {stat.value}
              </div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
