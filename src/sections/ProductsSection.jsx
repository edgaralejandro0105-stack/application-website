import React, { useRef, useEffect, useState } from 'react';
import { Card } from '../components/Card';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getProducts } from '../services/api';

export function ProductsSection() {
  const scrollRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        // Asume que la API devuelve un array directamente o un objeto con data
        const data = response.data || response;
        setProducts(data);
      } catch (err) {
        setError('No se pudieron cargar los productos');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: 350, behavior: 'smooth' });
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="productos" className="py-16 bg-background relative z-10">
      <div className="max-w-[1200px] mx-auto px-6 md:px-16">
        <div className="flex items-end justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-white mb-2 uppercase tracking-wide">Productos que Ofrecemos</h2>
            <p className="font-jakarta text-on-surface-variant text-sm">Selecciones infalibles para momentos únicos.</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="flex gap-2">
            <button 
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </motion.div>
        </div>

        <motion.div 
          ref={scrollRef}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="min-w-[280px] md:min-w-[320px] h-64 rounded-xl border border-white/5 bg-surface-variant/30 animate-pulse shrink-0 flex items-center justify-center">
                <Loader2 className="animate-spin text-white/20" size={32} />
              </div>
            ))
          ) : error ? (
            <div className="w-full text-center py-10 text-error font-jakarta">
              {error}
            </div>
          ) : products.length === 0 ? (
            <div className="w-full text-center py-10 text-on-surface-variant font-jakarta">
              No hay productos disponibles por el momento.
            </div>
          ) : (
            products.map(product => (
              <div key={product.product_id} className="min-w-[280px] md:min-w-[320px] h-64 relative rounded-xl overflow-hidden group cursor-pointer border border-white/5 snap-start shrink-0">
                <img src={product.image_url || '/src/assets/coctel.png'} alt={product.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"></div>
                <div className="absolute bottom-6 left-0 right-0 text-center">
                  <span className="font-jakarta font-bold text-white bg-surface/50 backdrop-blur-md px-6 py-2 rounded-full text-sm inline-block border border-white/10">
                    {product.name}
                  </span>
                </div>
              </div>
            ))
          )}
        </motion.div>
      </div>
    </section>
  );
}
