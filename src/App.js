import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState({ title: "", sku: "" });

  console.log("cart", cart);

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, [search]);

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:5000/products");
    if (res) setProducts(res.data);
  };

  const fetchCart = async () => {
    const res = await axios.get("http://localhost:5000/cart");
    setCart(res.data);
  };

  const handleSearch = async () => {
    const res = await axios.get("http://localhost:5000/search", {
      params: search,
    });
    setProducts(res.data);
  };

  const addToCart = (productId) => {
    axios
      .post("http://localhost:5000/cart", { productId })
      .then((res) => {
        toast.success("🛒 Product added to cart!");
        // fetchCart();
        setCart([...cart, res.data]);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message);
      });
  };
  const removeFromCart = (productId) => {
    axios
      .delete(`http://localhost:5000/cart/${productId}`)
      .then((res) => {
        toast.info("🗑️ Product removed from cart.");
        fetchCart(); // Re-fetch the cart
      })
      .catch((err) => {
        toast.error("❌ Failed to remove from cart.");
        console.log("Error removing from cart:", err);
      });
  };

  const handleReset = () => {
    setSearch({
      title: "",
      sku: "",
    });
    setProducts([]);
  };

  return (
    <div className="container">
      <h1>🛒 Ordering System</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search by title"
          value={search.title}
          onChange={(e) => setSearch({ ...search, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Search by SKU"
          value={search.sku}
          onChange={(e) => setSearch({ ...search, sku: e.target.value })}
        />
        <button onClick={handleSearch}>Search</button>
        <button onClick={handleReset}>Reset</button>
      </div>

      <h2>Products</h2>
      <div className="product-grid">
        {products.map((item) => (
          <div className="card" key={item._id}>
            <img src={item.imageSrc} alt={item.title} />
            <h3>{item.title}</h3>
            <p>SKU: {item.variantSKU}</p>
            <p>Price: ₹{item.variantPrice}</p>
            <button onClick={() => addToCart(item._id)}>Add to Cart</button>
          </div>
        ))}
      </div>

      <h2>Cart</h2>
      <div className="cart-grid">
        {cart.map((item) => (
          <div className="card" key={item._id}>
            <img src={item?.products?.imageSrc} alt={item?.products?.title} />
            <h3>{item?.products?.title}</h3>
            <p>Price: ₹{item?.products?.variantPrice}</p>
            <button onClick={() => removeFromCart(item._id)}>
              Remove From Cart
            </button>
          </div>
        ))}
      </div>
      <ToastContainer position="bottom-right" autoClose={2500} />
    </div>
  );
}

export default App;
