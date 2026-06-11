import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../Button';

export function PlannerSuccess({ logic }) {
  const { resetForm } = logic;

  return (
    <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4 }} className="flex flex-col items-center justify-center py-16 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6"
      >
        <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </motion.div>
      <h3 className="font-playfair text-2xl md:text-3xl font-bold text-white mb-4">¡Solicitud Registrada!</h3>
      <p className="font-jakarta text-on-surface-variant max-w-md mx-auto mb-8 leading-relaxed">
        Tu solicitud ha sido guardada en nuestra base de datos y se ha enviado un correo de confirmación. Un miembro de nuestro equipo se pondrá en contacto contigo a la brevedad para confirmar los detalles.
      </p>
      <Button variant="outline" onClick={resetForm}>Cerrar</Button>
    </motion.div>
  );
}
