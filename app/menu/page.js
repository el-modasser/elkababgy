'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
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

// Enhanced vegetarian detection for all items
const isVegetarian = (itemName, category, description = '') => {
  // Categories where we don't want to show any emojis
  const noEmojiCategories = [
    'coffee', 'mocktails', 'lemonades', 'soft_drinks', 'fresh_juice'
  ];

  // If it's in a drinks category, return null to hide emoji
  if (noEmojiCategories.includes(category)) {
    return null;
  }

  const vegKeywords = [
    'salad', 'vegetable', 'veg', 'cheese', 'rice', 'fries', 'yoghurt',
    'pickled', 'tahini', 'baba', 'lentils', 'orzo', 'vine leaves',
    'mahashi', 'moussaka', 'okra', 'potato', 'molokhia', 'warak enab',
    'eggplant', 'tomato', 'beetroot', 'cucumber', 'lemonade', 'coffee',
    'mocktail', 'juice', 'water', 'soda', 'latte', 'americano', 'cappuccino',
    'espresso', 'mocha', 'berry', 'apple', 'ginger', 'peach', 'citrus',
    'watermelon', 'tropical', 'raspberry', 'blueberry', 'strawberry', 'kiwi',
    'mint', 'lemon', 'detox', 'hydration', 'anti-oxidant', 'digestion', 'eye'
  ];

  const nonVegKeywords = [
    'beef', 'chicken', 'lamb', 'meat', 'liver', 'sausage', 'kebab',
    'kofta', 'mombar', 'hawawshi', 'pigeon', 'hamam', 'oxtail', 'kaware3',
    'tarb', 'neifa', 'steak', 'chops', 'grill', 'wings', 'mixed grill'
  ];

  const ambiguousKeywords = [
    'samosa', 'fattah' // these can be both veg and non-veg
  ];

  const name = itemName.toLowerCase();
  const desc = description.toLowerCase();
  const fullText = name + ' ' + desc;

  // If it contains ambiguous keywords, don't show icon
  if (ambiguousKeywords.some(keyword => name.includes(keyword))) {
    return null;
  }

  // If it contains non-veg keywords, it's non-veg
  if (nonVegKeywords.some(keyword => fullText.includes(keyword))) {
    return false;
  }

  // If it contains veg keywords, it's veg
  if (vegKeywords.some(keyword => fullText.includes(keyword))) {
    return true;
  }

  return null;
};

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState('salads');
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSticky, setIsSticky] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceSort, setPriceSort] = useState('default');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');
  const [visibleItems, setVisibleItems] = useState(8);
  const [imageLoadStates, setImageLoadStates] = useState({});
  const [orderMode, setOrderMode] = useState(null); // null, 'dine-in', or 'whatsapp'
  const [showModeSelector, setShowModeSelector] = useState(true);

  const categoriesRef = useRef(null);
  const categoryScrollRef = useRef(null);
  const observerRef = useRef(null);

  // Gelato selection state
  const [gelatoSelection, setGelatoSelection] = useState({
    size: 'small',
    type: 'cup'
  });

  // Calculate gelato price based on selection
  const gelatoPrice = gelatoPrices[gelatoSelection.size][gelatoSelection.type];

  // ALWAYS show mode selector on page load/refresh
  useEffect(() => {
    setShowModeSelector(true);
    setOrderMode(null);
  }, []);

  // Sticky navigation effect
  useEffect(() => {
    const handleScroll = () => {
      if (categoriesRef.current) {
        const rect = categoriesRef.current.getBoundingClientRect();
        setIsSticky(rect.top <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleItems(prev => prev + 6);
      }
    });

    const sentinel = document.getElementById('scroll-sentinel');
    if (sentinel) {
      observerRef.current.observe(sentinel);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [selectedCategory, searchQuery]);

  // Reset visible items when category or search changes
  useEffect(() => {
    setVisibleItems(8);
  }, [selectedCategory, searchQuery]);

  // Close modals on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (isItemModalOpen) setIsItemModalOpen(false);
        if (isCartOpen) setIsCartOpen(false);
      }
    };

    if (isItemModalOpen || isCartOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isItemModalOpen, isCartOpen]);

  // Category scroll functions
  const scrollCategories = (direction) => {
    if (categoryScrollRef.current) {
      const scrollAmount = 200;
      categoryScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Filter and sort items
  const getFilteredAndSortedItems = useCallback(() => {
    let items = menuData[selectedCategory]?.items || [];

    if (searchQuery) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (priceSort === 'low-high') {
      items = [...items].sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (priceSort === 'high-low') {
      items = [...items].sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    return items;
  }, [selectedCategory, searchQuery, priceSort]);

  const filteredItems = getFilteredAndSortedItems();
  const displayedItems = filteredItems.slice(0, visibleItems);

  // Cart functions
  const addToCart = (item, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.name === item.name);
      if (existing) {
        return prev.map(cartItem =>
          cartItem.name === item.name
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity }];
    });
  };

  const updateQuantity = (itemName, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemName);
      return;
    }
    setCart(prev => prev.map(item =>
      item.name === itemName ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeFromCart = (itemName) => {
    setCart(prev => prev.filter(item => item.name !== itemName));
  };

  const clearCart = () => {
    setCart([]);
    setOrderNotes('');
  };

  const getTotalItems = () => cart.reduce((sum, item) => sum + item.quantity, 0);
  const getTotalPrice = () => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // WhatsApp order function
  const handleWhatsAppOrder = () => {
    const whatsappNumber = "+254798008898";
    let message = "Hello! I'd like to place an order from El Kebabgy Gallant Mall Parklands.\n\n";

    cart.forEach(item => {
      message += `• ${item.quantity}x ${item.name} - KSh ${item.price * item.quantity}\n`;
    });

    message += `\nTotal: KSh ${getTotalPrice()}`;

    if (orderNotes) {
      message += `\n\nSpecial Instructions: ${orderNotes}`;
    }

    message += `\n\nThank you!`;

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Function to open item modal
  const handleItemClick = (item) => {
    if (selectedCategory === 'gelato') {
      setSelectedItem({
        ...item,
        price: gelatoPrice,
        selection: gelatoSelection
      });
    } else {
      setSelectedItem(item);
    }
    setIsItemModalOpen(true);
  };

  // Image load handler
  const handleImageLoad = (itemName) => {
    setImageLoadStates(prev => ({ ...prev, [itemName]: true }));
  };

  // Order mode functions
  const handleModeSelect = (mode) => {
    setOrderMode(mode);
    setShowModeSelector(false);
  };

  const switchToWhatsAppMode = () => {
    setOrderMode('whatsapp');
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

  // Don't render main content until order mode is selected
  if (showModeSelector) {
    return (
      <Layout>
        <AnimatePresence>
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full mx-auto border-2 border-gray-100 text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <h2 className="text-3xl font-nexa-heavy font-bold text-[#1F1F1F] mb-2">
                Welcome to El Kebabgy
              </h2>
              <p className="text-gray-600 font-niramit text-lg mb-8">
                How would you like to order today?
              </p>

              <div className="space-y-4">
                <motion.button
                  onClick={() => handleModeSelect('dine-in')}
                  style={modeButtonStyles}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full"
                >
                  <div style={modeContentStyles}>
                    <span style={modeIconStyles}>🍽️</span>
                    <div style={modeTextStyles}>
                      <div style={modeTitleStyles}>Dine In</div>
                      <div style={modeSubtitleStyles}>View menu & order at table</div>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => handleModeSelect('whatsapp')}
                  style={modeButtonStyles}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full"
                >
                  <div style={modeContentStyles}>
                    <span style={modeIconStyles}>📱</span>
                    <div style={modeTextStyles}>
                      <div style={modeTitleStyles}>Order via WhatsApp</div>
                      <div style={modeSubtitleStyles}>For delivery or takeaway</div>
                    </div>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Order Mode Switcher - Only show in dine-in mode */}
      {orderMode === 'dine-in' && (
        <div style={modeSwitcherStyles}>
          <span style={modeIndicatorStyles}>🍽️ Dine In Mode</span>
          <button
            onClick={switchToWhatsAppMode}
            style={switchModeButtonStyles}
          >
            Switch to WhatsApp Ordering
          </button>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div style={searchContainerStyles}>
        <div style={searchBarStyles}>
          <input
            type="text"
            placeholder="Search dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={searchInputStyles}
          />
          <svg style={searchIconStyles} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Custom Dropdown */}
        <div style={customDropdownStyles}>
          <select
            value={priceSort}
            onChange={(e) => setPriceSort(e.target.value)}
            style={customSelectStyles}
          >
            <option value="default">Sort by Price</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
          <div style={dropdownArrowStyles}>▼</div>
        </div>
      </div>

      {/* Sticky Categories Navigation with Scroll Buttons */}
      <div
        ref={categoriesRef}
        className={`sticky-categories ${isSticky ? 'sticky' : ''}`}
        style={stickyContainerStyles}
      >
        <button
          onClick={() => scrollCategories('left')}
          style={scrollButtonStyles}
          className="scroll-btn left"
        >
          ‹
        </button>

        <div ref={categoryScrollRef} style={categoryListStyles}>
          {Object.keys(menuData).map((categoryId) => (
            <button
              key={categoryId}
              style={{
                ...categoryButtonStyles,
                ...(selectedCategory === categoryId ? selectedCategoryStyle : unselectedCategoryStyle)
              }}
              onClick={() => setSelectedCategory(categoryId)}
              className="category-btn"
            >
              {menuData[categoryId].name}
            </button>
          ))}
        </div>

        <button
          onClick={() => scrollCategories('right')}
          style={scrollButtonStyles}
          className="scroll-btn right"
        >
          ›
        </button>
      </div>

      {/* Main Content */}
      <div style={contentStyles}>
        {/* Gelato Selection Section */}
        {selectedCategory === "gelato" && (
          <motion.div
            className="gelato-customization"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="font-nexa-heavy text-2xl text-center mb-6 text-[#1F1F1F]">Customize Your Gelato</h3>
            {/* ... gelato customization content remains the same ... */}
          </motion.div>
        )}

        {/* Menu Items Grid */}
        <motion.div
          style={gridStyles}
          key={selectedCategory + searchQuery + priceSort}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {displayedItems.map((item, index) => {
            const vegetarianStatus = isVegetarian(item.name, selectedCategory, item.description);
            return (
              <motion.div
                key={item.name}
                style={gridItemStyles}
                className="menu-item-card"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  y: -5,
                  transition: { duration: 0.2 }
                }}
                onClick={() => handleItemClick(item)}
              >
                {/* Image with loading state */}
                {item.image && (
                  <div style={imageContainerStyles}>
                    {!imageLoadStates[item.name] && (
                      <div style={skeletonStyles}></div>
                    )}
                    <img
                      src={`/images/${selectedCategory}/${item.image}`}
                      alt={item.name}
                      style={{
                        ...imageStyles,
                        display: imageLoadStates[item.name] ? 'block' : 'none'
                      }}
                      onLoad={() => handleImageLoad(item.name)}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                <div style={contentContainerStyles}>
                  <div style={titleContainerStyles}>
                    <h3 className='font-nexa-heavy text-lg text-[#1F1F1F] mb-2'>{item.name}</h3>
                    {vegetarianStatus !== null && (
                      <span style={vegIconStyles(vegetarianStatus)}>
                        {vegetarianStatus ? '🌱' : '🍖'}
                      </span>
                    )}
                  </div>

                  <p className='font-niramit text-sm text-gray-600 line-clamp-2'>{item.description}</p>

                  <div style={priceCartContainerStyles}>
                    <p className='font-nexa-heavy text-lg text-[#EB4B36]'>
                      {selectedCategory === 'gelato' ? `KSh ${gelatoPrice}` : item.price ? `KSh ${item.price}` : ''}
                    </p>

                    <div style={quantitySelectorStyles}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const cartItem = cart.find(ci => ci.name === item.name);
                          if (cartItem) {
                            updateQuantity(item.name, cartItem.quantity - 1);
                          }
                        }}
                        style={quantityButtonStyles}
                      >
                        -
                      </button>
                      <span style={quantityDisplayStyles}>
                        {cart.find(ci => ci.name === item.name)?.quantity || 0}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(item);
                        }}
                        style={quantityButtonStyles}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Infinite scroll sentinel */}
          {displayedItems.length < filteredItems.length && (
            <div id="scroll-sentinel" style={{ height: '1px', width: '100%' }} />
          )}
        </motion.div>

        {/* No results message */}
        {displayedItems.length === 0 && (
          <div style={noResultsStyles}>
            <p>No dishes found matching your search.</p>
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      {getTotalItems() > 0 && (
        <motion.button
          onClick={() => setIsCartOpen(true)}
          style={floatingCartButtonStyles}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="floating-cart-btn"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0020 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
          <span style={cartBadgeStyles}>{getTotalItems()}</span>
        </motion.button>
      )}

      {/* Floating WhatsApp Button - Only show in WhatsApp mode */}
      {orderMode === 'whatsapp' && getTotalItems() > 0 && (
        <motion.button
          onClick={handleWhatsAppOrder}
          style={floatingButtonStyles}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="floating-whatsapp-btn"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893c0-3.18-1.24-6.169-3.495-8.418" />
          </svg>
        </motion.button>
      )}

      {/* Order Summary Modal */}
      <AnimatePresence>
        {isCartOpen && (
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
              onClick={() => setIsCartOpen(false)}
            />

            {/* Modal */}
            <motion.div
              className="relative bg-white rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto max-w-2xl w-full mx-auto border-2 border-gray-100"
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
                onClick={() => setIsCartOpen(false)}
                className="absolute top-6 right-6 text-gray-500 hover:text-[#EB4B36] transition-colors duration-200 bg-gray-100 hover:bg-[#FFF0ED] rounded-full p-2"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>

              {/* Cart Content */}
              <div style={cartModalContentStyles}>
                <div style={cartHeaderStyles}>
                  <motion.h2
                    style={cartTitleStyles}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Your Order {orderMode === 'dine-in' && '(Dine In)'}
                  </motion.h2>

                  {cart.length > 0 && (
                    <motion.button
                      onClick={clearCart}
                      style={clearCartButtonStyles}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      Clear All
                    </motion.button>
                  )}
                </div>

                {cart.length === 0 ? (
                  <p style={emptyCartStyles}>Your cart is empty</p>
                ) : (
                  <>
                    <div style={cartItemsContainerStyles}>
                      {cart.map((item, index) => (
                        <motion.div
                          key={item.name}
                          style={cartItemContainerStyles}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                        >
                          <div style={cartItemContentStyles}>
                            <div style={cartItemHeaderStyles}>
                              <h4 style={cartItemNameStyles}>{item.name}</h4>
                              <button
                                onClick={() => removeFromCart(item.name)}
                                style={cartRemoveButtonStyles}
                              >
                                ×
                              </button>
                            </div>
                            <div style={cartItemDetailsStyles}>
                              <span style={cartItemPriceStyles}>KSh {item.price} each</span>
                              <div style={cartItemControlsStyles}>
                                <button
                                  onClick={() => updateQuantity(item.name, item.quantity - 1)}
                                  style={cartQuantityButtonStyles}
                                >
                                  −
                                </button>
                                <span style={cartQuantityStyles}>{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.name, item.quantity + 1)}
                                  style={cartQuantityButtonStyles}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <div style={cartItemTotalStyles}>
                              Total: <strong>KSh {item.price * item.quantity}</strong>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <motion.div
                      style={orderNotesContainerStyles}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <label style={orderNotesLabelStyles}>Special Instructions:</label>
                      <textarea
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        placeholder="Any special requests or dietary requirements..."
                        style={orderNotesInputStyles}
                        rows="3"
                      />
                    </motion.div>

                    <motion.div
                      style={cartTotalContainerStyles}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div style={cartTotalStyles}>
                        <span>Total:</span>
                        <strong style={cartTotalPriceStyles}>KSh {getTotalPrice()}</strong>
                      </div>
                    </motion.div>

                    {orderMode === 'whatsapp' ? (
                      <motion.button
                        onClick={handleWhatsAppOrder}
                        style={checkoutButtonStyles}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Send Order via WhatsApp
                      </motion.button>
                    ) : (
                      <motion.div
                        style={dineInNoticeStyles}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <p style={dineInTextStyles}>
                          Please show this order to our staff when you're ready to order.
                        </p>
                      </motion.div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Item Detail Modal */}
      <AnimatePresence>
        {isItemModalOpen && selectedItem && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop - Glass effect covering entire page */}
            <motion.div
              className="absolute inset-0 bg-white bg-opacity-95 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsItemModalOpen(false)}
            />

            {/* Modal */}
            <motion.div
              className="relative bg-white rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto max-w-2xl w-full mx-auto border-2 border-gray-100"
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
                  className="text-2xl font-nexa-heavy text-[#EB4B36] mb-6"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  KSh {selectedCategory === 'gelato' ? gelatoPrice : selectedItem.price}
                </motion.p>

                <motion.button
                  onClick={() => {
                    addToCart(selectedItem);
                    setIsItemModalOpen(false);
                  }}
                  style={addToCartButtonStyles}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add to Cart
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Copyright Footer */}
      <footer style={footerStyles}>
        <div style={copyrightStyles}>
          © {new Date().getFullYear()} El Kebabgy Gallant Mall Parklands. All rights reserved.
          <br />
          <span style={developedByStyles}>Developed by esto</span>
        </div>
      </footer>
    </Layout>
  );
}

// ==================== NEW STYLES ====================

// Order Mode Selector Styles
const modeButtonStyles = {
  padding: '1.5rem',
  border: '2px solid #e5e7eb',
  borderRadius: '16px',
  backgroundColor: 'white',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  textAlign: 'left'
};

const modeContentStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem'
};

const modeIconStyles = {
  fontSize: '2rem'
};

const modeTextStyles = {
  flex: 1,
  textAlign: 'left'
};

const modeTitleStyles = {
  fontSize: '1.25rem',
  fontWeight: 'bold',
  color: '#1F1F1F',
  marginBottom: '0.25rem'
};

const modeSubtitleStyles = {
  fontSize: '0.9rem',
  color: '#666'
};

// Mode Switcher Styles
const modeSwitcherStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.75rem 1rem',
  backgroundColor: '#FFF0ED',
  borderBottom: '2px solid #EB4B36'
};

const modeIndicatorStyles = {
  fontWeight: '600',
  color: '#EB4B36',
  fontSize: '0.9rem'
};

const switchModeButtonStyles = {
  padding: '0.5rem 1rem',
  border: '1px solid #EB4B36',
  borderRadius: '20px',
  backgroundColor: 'transparent',
  color: '#EB4B36',
  fontSize: '0.8rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
};

// Improved Cart Header with Clear Button
const cartHeaderStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '2rem',
  paddingBottom: '1rem',
  borderBottom: '2px solid #f0f0f0'
};

const clearCartButtonStyles = {
  padding: '0.5rem 1rem',
  border: '1px solid #dc2626',
  borderRadius: '20px',
  backgroundColor: 'transparent',
  color: '#dc2626',
  fontSize: '0.8rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  whiteSpace: 'nowrap'
};

// Dine In Notice Styles
const dineInNoticeStyles = {
  padding: '1rem',
  backgroundColor: '#f0f9ff',
  border: '1px solid #e0f2fe',
  borderRadius: '12px',
  textAlign: 'center'
};

const dineInTextStyles = {
  color: '#0369a1',
  fontSize: '0.9rem',
  margin: 0,
  fontWeight: '500'
};

// ==================== UPDATED STYLES ====================

const searchContainerStyles = {
  display: 'flex',
  gap: '1rem',
  padding: '1rem',
  alignItems: 'center',
  flexWrap: 'wrap'
};

const searchBarStyles = {
  position: 'relative',
  flex: 1,
  minWidth: '250px'
};

const searchInputStyles = {
  width: '100%',
  padding: '0.75rem 1rem 0.75rem 2.5rem',
  border: '2px solid #e5e7eb',
  borderRadius: '12px',
  fontSize: '1rem',
  outline: 'none',
  transition: 'all 0.3s ease',
  backgroundColor: 'white',
  fontFamily: 'inherit'
};

const searchIconStyles = {
  position: 'absolute',
  left: '0.75rem',
  top: '50%',
  transform: 'translateY(-50%)',
  width: '1.25rem',
  height: '1.25rem',
  color: '#666'
};

// Custom dropdown styles
const customDropdownStyles = {
  position: 'relative',
  display: 'inline-block',
  minWidth: '180px'
};

const customSelectStyles = {
  width: '100%',
  padding: '0.75rem 2.5rem 0.75rem 1rem',
  border: '2px solid #e5e7eb',
  borderRadius: '12px',
  fontSize: '0.9rem',
  outline: 'none',
  backgroundColor: 'white',
  appearance: 'none',
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'all 0.3s ease'
};

const dropdownArrowStyles = {
  position: 'absolute',
  right: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  pointerEvents: 'none',
  color: '#666',
  fontSize: '0.8rem'
};

const stickyContainerStyles = {
  position: 'sticky',
  top: 0,
  zIndex: 40,
  backgroundColor: 'transparent',
  padding: '1rem 0',
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem'
};

const scrollButtonStyles = {
  padding: '0.5rem',
  border: '2px solid #e5e7eb',
  borderRadius: '50%',
  backgroundColor: 'white',
  cursor: 'pointer',
  fontSize: '1.25rem',
  fontWeight: 'bold',
  color: '#1F1F1F',
  width: '2.5rem',
  height: '2.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  transition: 'all 0.3s ease'
};

const categoryListStyles = {
  display: 'flex',
  gap: '0.5rem',
  overflowX: 'auto',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  flex: 1,
  '&::-webkit-scrollbar': {
    display: 'none'
  }
};

const categoryButtonStyles = {
  padding: '0.75rem 1.5rem',
  border: '2px solid #e5e7eb',
  borderRadius: '25px',
  cursor: 'pointer',
  fontSize: '0.9rem',
  fontWeight: '600',
  transition: 'all 0.3s ease',
  whiteSpace: 'nowrap',
  flexShrink: 0,
  backgroundColor: 'white',
  fontFamily: 'inherit'
};

const unselectedCategoryStyle = {
  backgroundColor: '#ffffff',
  color: '#1F1F1F',
  border: '2px solid #e5e7eb'
};

const selectedCategoryStyle = {
  backgroundColor: '#ffffff',
  color: '#EB4B36',
  border: '2px solid #EB4B36',
  fontWeight: '700'
};

const contentStyles = {
  padding: '0 1rem 1rem 1rem'
};

const gridStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '1.5rem',
  padding: '1rem 0'
};

const gridItemStyles = {
  padding: '1.5rem',
  border: '1px solid #f0f0f0',
  borderRadius: '16px',
  transition: 'all 0.3s ease',
  backgroundColor: 'white',
  boxShadow: '0 2px 10px rgba(31, 31, 31, 0.1)',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  height: '100%'
};

const imageContainerStyles = {
  width: '100%',
  height: '200px',
  marginBottom: '1rem',
  borderRadius: '12px',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f8f9fa',
  position: 'relative'
};

const skeletonStyles = {
  width: '100%',
  height: '100%',
  backgroundColor: '#e5e7eb',
  borderRadius: '12px',
  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
};

const imageStyles = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: '12px'
};

const contentContainerStyles = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column'
};

const titleContainerStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '0.5rem'
};

const vegIconStyles = (isVeg) => ({
  fontSize: '1rem',
  marginLeft: '0.5rem',
  flexShrink: 0,
  filter: isVeg ? 'none' : 'grayscale(0.3)'
});

const priceCartContainerStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 'auto',
  paddingTop: '1rem'
};

const quantitySelectorStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  backgroundColor: '#f8f9fa',
  borderRadius: '25px',
  padding: '0.25rem'
};

const quantityButtonStyles = {
  width: '1.75rem',
  height: '1.75rem',
  border: 'none',
  borderRadius: '50%',
  backgroundColor: 'white',
  cursor: 'pointer',
  fontSize: '0.9rem',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  transition: 'all 0.2s ease'
};

const quantityDisplayStyles = {
  minWidth: '1.5rem',
  textAlign: 'center',
  fontSize: '0.9rem',
  fontWeight: '600'
};

const noResultsStyles = {
  textAlign: 'center',
  padding: '3rem',
  color: '#666',
  fontSize: '1.1rem'
};

// Updated floating button positions
const floatingCartButtonStyles = {
  position: 'fixed',
  bottom: '1.5rem',
  left: '1.5rem',
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  backgroundColor: '#EB4B36',
  color: 'white',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 20px rgba(235, 75, 54, 0.4)',
  zIndex: 30
};

const cartBadgeStyles = {
  position: 'absolute',
  top: '-5px',
  right: '-5px',
  backgroundColor: '#1F1F1F',
  color: 'white',
  borderRadius: '50%',
  width: '20px',
  height: '20px',
  fontSize: '0.75rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold'
};

const floatingButtonStyles = {
  position: 'fixed',
  bottom: '1.5rem',
  right: '1.5rem',
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  backgroundColor: '#25D366',
  color: 'white',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
  zIndex: 30
};

// Improved Cart Styles
const cartModalContentStyles = {
  padding: '0 0.5rem'
};

const cartTitleStyles = {
  fontSize: '2rem',
  fontWeight: 'bold',
  color: '#1F1F1F',
  fontFamily: 'Nexa Heavy, sans-serif',
  margin: 0
};

const emptyCartStyles = {
  textAlign: 'center',
  color: '#666',
  fontSize: '1.1rem',
  padding: '2rem'
};

const cartItemsContainerStyles = {
  maxHeight: '300px',
  overflowY: 'auto',
  marginBottom: '1.5rem',
  paddingRight: '0.5rem'
};

const cartItemContainerStyles = {
  border: '1px solid #f0f0f0',
  borderRadius: '12px',
  marginBottom: '1rem',
  backgroundColor: '#fafafa',
  overflow: 'hidden'
};

const cartItemContentStyles = {
  padding: '1.25rem'
};

const cartItemHeaderStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '0.75rem'
};

const cartItemNameStyles = {
  fontWeight: '600',
  fontSize: '1.1rem',
  color: '#1F1F1F',
  margin: 0,
  flex: 1,
  textAlign: 'left'
};

const cartRemoveButtonStyles = {
  background: 'none',
  border: 'none',
  fontSize: '1.5rem',
  color: '#dc2626',
  cursor: 'pointer',
  padding: '0',
  width: '24px',
  height: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  transition: 'all 0.2s ease'
};

const cartItemDetailsStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '0.75rem'
};

const cartItemPriceStyles = {
  color: '#666',
  fontSize: '0.9rem'
};

const cartItemControlsStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  backgroundColor: 'white',
  borderRadius: '20px',
  padding: '0.25rem'
};

const cartQuantityButtonStyles = {
  width: '28px',
  height: '28px',
  border: 'none',
  borderRadius: '50%',
  backgroundColor: '#f8f9fa',
  color: '#1F1F1F',
  cursor: 'pointer',
  fontSize: '1.1rem',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s ease'
};

const cartQuantityStyles = {
  minWidth: '30px',
  textAlign: 'center',
  fontWeight: '600',
  fontSize: '1rem'
};

const cartItemTotalStyles = {
  textAlign: 'left',
  fontWeight: '600',
  color: '#1F1F1F',
  fontSize: '1rem',
  paddingTop: '0.5rem',
  borderTop: '1px solid #e5e7eb'
};

const orderNotesContainerStyles = {
  marginBottom: '1.5rem',
  textAlign: 'left'
};

const orderNotesLabelStyles = {
  display: 'block',
  fontWeight: '600',
  marginBottom: '0.5rem',
  color: '#1F1F1F',
  fontSize: '1rem'
};

const orderNotesInputStyles = {
  width: '100%',
  padding: '0.75rem',
  border: '2px solid #e5e7eb',
  borderRadius: '12px',
  fontSize: '0.9rem',
  outline: 'none',
  resize: 'vertical',
  fontFamily: 'inherit',
  transition: 'all 0.3s ease'
};

const cartTotalContainerStyles = {
  borderTop: '2px solid #e5e7eb',
  paddingTop: '1rem',
  marginBottom: '1.5rem'
};

const cartTotalStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '1.25rem',
  fontWeight: '600'
};

const cartTotalPriceStyles = {
  color: '#EB4B36',
  fontSize: '1.5rem'
};

const checkoutButtonStyles = {
  width: '100%',
  padding: '1rem 2rem',
  backgroundColor: '#25D366',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  fontSize: '1.1rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  fontFamily: 'inherit'
};

const addToCartButtonStyles = {
  padding: '1rem 2rem',
  backgroundColor: '#EB4B36',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  fontSize: '1rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  fontFamily: 'inherit'
};

// Updated Footer Styles
const footerStyles = {
  padding: '3rem 1rem 8rem 1rem',
  marginTop: '2rem',
  backgroundColor: 'transparent'
};

const copyrightStyles = {
  textAlign: 'center',
  color: '#666',
  fontSize: '0.9rem',
  lineHeight: '1.6'
};

const developedByStyles = {
  display: 'block',
  marginTop: '0.5rem',
  fontStyle: 'italic',
  color: '#888',
  fontSize: '0.8rem'
};