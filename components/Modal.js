'use client';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ isOpen, onClose, numberInput }) => {
  const handleCardClick = (cardId) => {
    switch (cardId) {
      case 1: // Get Directions
        const message = `Order reference: ${numberInput}. I'd like to place an order.`;
        window.open(`${numberInput === 1 ? "https://www.google.com/maps/dir//PQ4Q%2B45,+Ring+Rd+Kilimani,+Nairobi/@-1.2946519,36.705541,28281m/data=!3m1!1e3!4m8!4m7!1m0!1m5!1m1!1s0x182f112a7ff328f7:0x33f5f28881a84cbd!2m2!1d36.7879536!2d-1.29466?entry=ttu&g_ep=EgoyMDI1MTAyMC4wIKXMDSoASAFQAw%3D%3D" : numberInput === 2 ? "https://www.google.com/maps/dir//Orange+Desserts+%E2%80%93+Parklands,+Limuru+Road,+Nairobi/@-1.2588033,36.7859954,14141m/data=!3m1!1e3!4m8!4m7!1m0!1m5!1m1!1s0x182f173486ee8745:0x4a085fc5f6314e6c!2m2!1d36.8271953!2d-1.2588894?entry=ttu&g_ep=EgoyMDI1MTAyMC4wIKXMDSoASAFQAw%3D%3D" : "https://www.google.com/maps/dir//Orange+Desserts+-+South+C,+Muhoho+Avenue,+Nairobi/@-1.3134461,36.7876668,14140m/data=!3m1!1e3!4m8!4m7!1m0!1m5!1m1!1s0x182f11ac2c2bf637:0x341c406d82db0cf0!2m2!1d36.8288667!2d-1.3135323?entry=ttu&g_ep=EgoyMDI1MTAyMC4wIKXMDSoASAFQAw%3D%3D"}`, '_blank');
        break;

      case 2: // Order on WhatsApp
        // Use numberInput as order reference or phone number

        // Use numberInput as coordinates, zip code, or place ID
        window.open(`https://wa.me/${numberInput === 1 ? "+254769723159" : numberInput === 2 ? "+254799025071" : "+254723555569"}`, '_blank');
        break;

      case 3: // 3D Tour
        // Use numberInput to load specific tour
        window.open(`/3d-tour?id=${numberInput}`, '_blank');
        break;

      default:
        break;
    }
  };
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const cards = [

    {
      id: 1,
      title: "Get Directions",
      description: "We'll guide you",
      bgColor: "#F3EBE2",
      textColor: "#1a1a1a",
      disabled: false,
      comingSoon: false
    },
    {
      id: 2,
      title: "Order on WhatsApp",
      description: "One tap away",
      bgColor: "#E2F3E7",
      textColor: "#1a1a1a",

      disabled: false,
      comingSoon: false
    },
    {
      id: 3,
      title: "3D Tour",
      description: "Explore virtually",
      bgColor: "#FFF4E8",
      textColor: "#1a1a1a",

      disabled: true,
      comingSoon: true
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: {
      y: 20,
      opacity: 0,
      scale: 0.8
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-[#ffffff82] bg-opacity-60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-white rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-scroll max-w-2xl w-full mx-auto"
            initial={{
              scale: 0.7,
              opacity: 0,
              rotateX: -15
            }}
            animate={{
              scale: 1,
              opacity: 1,
              rotateX: 0
            }}
            exit={{
              scale: 0.7,
              opacity: 0,
              rotateX: 15
            }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300
            }}
          >
            {/* Close Button */}
            <motion.button
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 transition-colors duration-200 bg-gray-100 hover:bg-gray-200 rounded-full p-2"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            {/* Header */}
            <motion.div
              className="text-center mb-8"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-nexa-heavy font-bold text-gray-800 mb-2 font-serif">
                {numberInput === 1 ? "Kilimani" : numberInput === 2 ? "Parklands" : "South C"}
              </h2>
            </motion.div>

            {/* Cards Grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {cards.map((card) => (
                <motion.div
                  key={card.id}
                  variants={cardVariants}
                  whileHover={!card.disabled ? {
                    y: -8,
                    scale: 1.02,
                    transition: { type: "spring", stiffness: 400 }
                  } : {}}
                  // whileTap={!card.disabled ? { scale: 0.98 } : {}}
                  className={`relative rounded-2xl p-6 cursor-pointer transition-all duration-300 `}
                  style={{
                    backgroundColor: card.bgColor,
                    color: card.textColor
                  }}
                  onClick={!card.disabled ? () => handleCardClick(card.id) : undefined}
                >


                  {/* Content */}
                  <h3 className={`text-xl ${card.id === 1 ? "text-[#F05A2A]" : card.id === 2 ? "text-[#32B349]" : "text-[#F69220]"} font-bold mb-2 font-finger`}>
                    {card.title}
                  </h3>
                  <p className="opacity-90 mb-4 font-niramit">
                    {card.description}
                  </p>

                  {/* Coming Soon Badge */}
                  {card.comingSoon && (
                    <motion.span
                      className="absolute top-4 right-4 bg-white text-gray-800 text-xs px-3 py-1 rounded-full font-semibold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      Coming Soon
                    </motion.span>
                  )}


                </motion.div>
              ))}
            </motion.div>


          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;