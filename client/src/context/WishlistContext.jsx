import { createContext, useState, useEffect, useContext } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  // Load wishlist from local storage on initial mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('pookies_wishlist');
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Error parsing wishlist', error);
      }
    }
  }, []);

  // Save to local storage whenever wishlist changes
  useEffect(() => {
    localStorage.setItem('pookies_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product) => {
    setWishlist((prev) => {
      const pId = product.id || product._id;
      if (!prev.find(item => (item.id || item._id) === pId)) {
        return [...prev, product];
      }
      return prev;
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => (item.id || item._id) !== productId));
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => (item.id || item._id) === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
