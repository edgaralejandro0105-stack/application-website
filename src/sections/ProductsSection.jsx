import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { getProducts } from '../services/api';
import { TiltCard } from '../components/TiltCard';
import { StrobeBackground } from '../components/StrobeBackground';
import { SideDecorations } from '../components/SideDecorations';

export function ProductsSection() {
  const scrollRef = useRef(null);
  const isPaused = useRef(false);
  const animFrameRef = useRef(null);
  const SPEED = 0.5;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts(10);
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

  const startScroll = useCallback(() => {
    const step = () => {
      const el = scrollRef.current;
      if (el && !isPaused.current && el.scrollWidth > el.clientWidth) {
        el.scrollLeft += SPEED;
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft -= el.scrollWidth / 2;
        }
      }
      animFrameRef.current = requestAnimationFrame(step);
    };
    animFrameRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    if (!loading && products.length > 0) {
      startScroll();
    }
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [loading, products, startScroll]);

  const scrollManual = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    isPaused.current = true;
    el.scrollBy({ left: direction === 'left' ? -340 : 340, behavior: 'smooth' });
    setTimeout(() => { isPaused.current = false; }, 1500);
  };

  return (
    <section id="productos" className="py-10 bg-background relative z-10">
      <SideDecorations />
      <StrobeBackground />
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
            className="hidden md:flex gap-2"
          >
            <button
              onClick={() => scrollManual('left')}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white bg-surface-container-highest/30 backdrop-blur-md hover:bg-primary/20 hover:border-primary/50 transition-all duration-300"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scrollManual('right')}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white bg-surface-container-highest/30 backdrop-blur-md hover:bg-primary/20 hover:border-primary/50 transition-all duration-300"
            >
              <ChevronRight size={20} />
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div
            ref={scrollRef}
            onMouseEnter={() => { isPaused.current = true; }}
            onMouseLeave={() => { isPaused.current = false; }}
            className="flex gap-6 overflow-x-auto pb-6 pt-2"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
            }}
          >
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-[85vw] md:w-[320px] h-64 rounded-xl border border-white/5 bg-surface-variant/30 animate-pulse shrink-0 flex items-center justify-center">
                  <Loader2 className="animate-spin text-white/20" size={32} />
                </div>
              ))
            ) : error ? (
              <div className="w-full text-center py-10 text-error font-jakarta">{error}</div>
            ) : products.length === 0 ? (
              <div className="w-full text-center py-10 text-on-surface-variant font-jakarta">No hay productos disponibles por el momento.</div>
            ) : (
              [...products, ...products].map((product, index) => (
                <TiltCard key={index} className="w-[85vw] md:w-[320px] h-64 relative rounded-xl overflow-hidden group border border-primary/20 shrink-0 bg-primary-fixed">
                  <img src={product.image_url || '/assets/coctel.png'} alt={product.name} className="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
                  <div className="absolute bottom-6 left-0 right-0 text-center">
                    <span className="font-jakarta font-bold text-white bg-surface/50 backdrop-blur-md px-6 py-2 rounded-full text-sm inline-block border border-white/10">
                      {product.name}
                    </span>
                  </div>
                </TiltCard>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
