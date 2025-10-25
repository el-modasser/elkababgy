'use client';
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import menuData from '@/data/menu.json';
import { motion, AnimatePresence } from 'framer-motion';

// Gelato pricing structure
const gelatoPrices = {
  small: {
    cup: 300,
    cone: 350
  },
  medium: {
    cup: 400,
    cone: 450
  }
};

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState('salads');
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Gelato selection state
  const [gelatoSelection, setGelatoSelection] = useState({
    size: 'small',
    type: 'cup'
  });

  // Calculate gelato price based on selection
  const gelatoPrice = gelatoPrices[gelatoSelection.size][gelatoSelection.type];

  // Close modals on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (isItemModalOpen) setIsItemModalOpen(false);
      }
    };

    if (isItemModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isItemModalOpen]);

  // Function to handle direct WhatsApp order
  const handleWhatsAppOrder = () => {
    const whatsappNumber = "+254799025071"; // Parklands branch
    const message = "Hello! I'd like to place an order from El Kebabgy Gallant Mall Parklands.";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Function to open item modal
  // const handleItemClick = (item) => {
  //   // For gelato, include the current selection in the modal
  //   if (selectedCategory === 'gelato') {
  //     setSelectedItem({
  //       ...item,
  //       price: gelatoPrice,
  //       selection: gelatoSelection
  //     });
  //   } else {
  //     setSelectedItem(item);
  //   }
  //   setIsItemModalOpen(true);
  // };

  // const containerVariants = {
  //   hidden: { opacity: 0 },
  //   visible: {
  //     opacity: 1,
  //     transition: {
  //       staggerChildren: 0.1
  //     }
  //   }
  // };

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
    <Layout>
      {/* WhatsApp Order Button - Direct to WhatsApp */}
      {/* <div className="w-full mb-6">
        <button
          onClick={handleWhatsAppOrder}
          className="bg-[#1F1F1F] text-[#EB4B36] text-center font-niramit text-lg font-bold rounded-full p-4 w-full justify-items-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-md border-2 border-[#EB4B36]"
        >
          Order Now on WhatsApp
        </button>
      </div> */}

      {/* Categories Navigation */}
      <div style={categoryListStyles}>
        {Object.keys(menuData).map((categoryId, index) => (
          <button
            key={categoryId}
            style={{
              ...categoryButtonStyles,
              ...(selectedCategory === categoryId && selectedCategoryStyle)
            }}
            onClick={() => setSelectedCategory(categoryId)}
          >
            {menuData[categoryId].name}
          </button>
        ))}
      </div>

      {/* Gelato Selection Section */}
      {selectedCategory === "gelato" && (
        <div className="w-full mb-8 p-6 bg-white rounded-2xl border-2 border-gray-100 shadow-lg">
          <h3 className="font-nexa-heavy text-2xl text-center mb-6 text-[#1F1F1F]">Customize Your Gelato</h3>

          {/* Size Selection */}
          <div className="mb-6">
            <h4 className="font-niramit font-bold text-[#1F1F1F] mb-4 text-lg">Select Size</h4>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setGelatoSelection(prev => ({ ...prev, size: 'small' }))}
                className={`p-4 rounded-xl text-center transition-all duration-300 border-2 ${gelatoSelection.size === 'small'
                  ? 'bg-gradient-to-br from-[#EB4B36] to-[#E2331B] text-white border-[#E2331B] shadow-lg'
                  : 'bg-white text-[#1F1F1F] border-gray-200 hover:border-[#EB4B36] hover:shadow-md'
                  }`}
              >
                <div className="font-nexa-heavy text-lg">Small</div>
                <div className="font-niramit">120g</div>
              </button>
              <button
                onClick={() => setGelatoSelection(prev => ({ ...prev, size: 'medium' }))}
                className={`p-4 rounded-xl text-center transition-all duration-300 border-2 ${gelatoSelection.size === 'medium'
                  ? 'bg-gradient-to-br from-[#EB4B36] to-[#E2331B] text-white border-[#E2331B] shadow-lg'
                  : 'bg-white text-[#1F1F1F] border-gray-200 hover:border-[#EB4B36] hover:shadow-md'
                  }`}
              >
                <div className="font-nexa-heavy text-lg">Medium</div>
                <div className="font-niramit">150g</div>
              </button>
            </div>
          </div>

          {/* Type Selection */}
          <div className="mb-6">
            <h4 className="font-niramit font-bold text-[#1F1F1F] mb-4 text-lg">Select Type</h4>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setGelatoSelection(prev => ({ ...prev, type: 'cup' }))}
                className={`p-4 rounded-xl text-center transition-all duration-300 border-2 ${gelatoSelection.type === 'cup'
                  ? 'bg-gradient-to-br from-[#EB4B36] to-[#E2331B] text-white border-[#E2331B] shadow-lg'
                  : 'bg-white text-[#1F1F1F] border-gray-200 hover:border-[#EB4B36] hover:shadow-md'
                  }`}
              >
                <div className="font-nexa-heavy text-lg">Cup</div>
                <div className="font-niramit">KSh {gelatoPrices[gelatoSelection.size].cup}</div>
              </button>
              <button
                onClick={() => setGelatoSelection(prev => ({ ...prev, type: 'cone' }))}
                className={`p-4 rounded-xl text-center transition-all duration-300 border-2 ${gelatoSelection.type === 'cone'
                  ? 'bg-gradient-to-br from-[#EB4B36] to-[#E2331B] text-white border-[#E2331B] shadow-lg'
                  : 'bg-white text-[#1F1F1F] border-gray-200 hover:border-[#EB4B36] hover:shadow-md'
                  }`}
              >
                <div className="font-nexa-heavy text-lg">Cone</div>
                <div className="font-niramit">KSh {gelatoPrices[gelatoSelection.size].cone}</div>
              </button>
            </div>
          </div>

          {/* Selected Price Display */}
          <div className="text-center p-4 bg-gradient-to-r from-[#FFF0ED] to-[#FFEFEC] rounded-xl border-2 border-[#EB4B36] shadow-md">
            <div className="font-niramit text-[#1F1F1F] text-lg">Your Selection:</div>
            <div className="font-nexa-heavy text-2xl text-[#E2331B] mt-2">
              {gelatoSelection.size === 'small' ? 'Small (120g)' : 'Medium (150g)'} {gelatoSelection.type}
            </div>
            <div className="font-nexa-heavy text-2xl text-[#E2331B]">
              KSh {gelatoPrice}
            </div>
          </div>
        </div>
      )}

      {/* Menu Items Grid */}
      <div style={gridStyles}>
        {menuData[selectedCategory]?.items?.map((item, index) => (
          <div
            key={item.name}
            style={gridItemStyles}
            className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
            onClick={() => handleItemClick(item)}
          >
            {item.image && (
              <img
                src={`/images/${selectedCategory}/${item.image}`}
                alt={item.name}
                style={imageStyles}
              />
            )}
            <h3 className='font-nexa-heavy text-lg text-[#1F1F1F]'>{item.name}</h3>
            <p className='font-niramit text-sm text-gray-600'>{item.description}</p>
            <p className='font-nexa-heavy text-lg text-[#EB4B36] pt-4'>
              {selectedCategory === 'gelato' ? `KSh ${gelatoPrice}` : item.price ? `KSh ${item.price}` : ''}
            </p>
          </div>
        ))}
      </div>

      {/* Item Detail Modal */}
      <AnimatePresence>
        {isItemModalOpen && selectedItem && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-white bg-opacity-90 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsItemModalOpen(false)}
            />

            {/* Modal */}
            <motion.div
              className="relative bg-white rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-scroll max-w-2xl w-full mx-auto border-2 border-gray-100"
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
                onClick={() => setIsItemModalOpen(false)}
                className="absolute top-6 right-6 text-gray-500 hover:text-[#EB4B36] transition-colors duration-200 bg-gray-100 hover:bg-[#FFF0ED] rounded-full p-2"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>

              {/* Item Content */}
              <div className="text-center">
                {selectedItem.image && (
                  <motion.img
                    src={`/images/${selectedCategory}/${selectedItem.image}`}
                    alt={selectedItem.name}
                    className="w-64 h-64 object-cover rounded-2xl mx-auto mb-6 border-2 border-gray-100"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  />
                )}
                <motion.h2
                  className="text-3xl font-nexa-heavy font-bold text-[#1F1F1F] mb-4"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {selectedItem.name}
                </motion.h2>

                {/* Show gelato selection details if it's gelato */}
                {selectedCategory === 'gelato' && selectedItem.selection && (
                  <motion.div
                    className="bg-gradient-to-r from-[#FFF0ED] to-[#FFEFEC] rounded-xl p-4 mb-4 border border-[#EB4B36]"
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.35 }}
                  >
                    <p className="font-niramit text-[#1F1F1F]">
                      {selectedItem.selection.size === 'small' ? 'Small (120g)' : 'Medium (150g)'} • {selectedItem.selection.type}
                    </p>
                  </motion.div>
                )}

                <motion.p
                  className="text-gray-600 font-niramit text-lg mb-6"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {selectedItem.description}
                </motion.p>
                <motion.p
                  className="text-2xl font-nexa-heavy text-[#EB4B36]"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  KSh {selectedCategory === 'gelato' ? gelatoPrice : selectedItem.price}
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}

// Updated styles with new color palette
const categoryListStyles = {
  display: 'flex',
  gap: '1rem',
  overflowX: 'auto',
  padding: '1rem 0',
  margin: '2rem 0'
};

const categoryButtonStyles = {
  padding: '0.75rem 1.5rem',
  border: 'none',
  borderRadius: '25px',
  backgroundColor: '#f8f9fa',
  cursor: 'pointer',
  fontSize: '0.9rem',
  transition: 'all 0.3s ease',
  whiteSpace: 'nowrap',
  color: '#1F1F1F'
};

const selectedCategoryStyle = {
  background: 'linear-gradient(135deg, #EB4B36, #E2331B)',
  color: 'white',
  boxShadow: '0 4px 15px rgba(235, 75, 54, 0.3)'
};

const gridStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  gap: '2rem',
  padding: '1rem 0'
};

const gridItemStyles = {
  padding: '1.5rem',
  border: '1px solid #f0f0f0',
  borderRadius: '16px',
  transition: 'all 0.3s ease',
  backgroundColor: 'white',
  boxShadow: '0 2px 10px rgba(31, 31, 31, 0.1)'
};

const imageStyles = {
  width: '200px',
  height: '200px',
  objectFit: 'cover',
  borderRadius: '12px',
  margin: 'auto'
};