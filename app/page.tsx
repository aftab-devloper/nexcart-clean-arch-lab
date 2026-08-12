"use client";

import { useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
};

type CartItem = {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
};

const USER_ID = "demo-user";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProducts();
    loadCart();
  }, []);

  async function loadProducts() {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  }

  async function loadCart() {
    const res = await fetch(`/api/cart?userId=${USER_ID}`);
    const data = await res.json();
    setCartItems(data.items ?? []);
  }

  async function handleSearch() {
    if (!searchQuery.trim()) {
      loadProducts();
      return;
    }
    const res = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}`);
    const data = await res.json();
    setProducts(data.results ?? []);
  }

  async function addToCart(product: Product) {
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: USER_ID,
        productId: product.id,
        productName: product.name,
        unitPrice: product.price,
        quantity: 1,
      }),
    });
    setMessage(`${product.name} cart mein add ho gaya`);
    loadCart();
  }

  async function placeOrder() {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: USER_ID }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(`Order place ho gaya! Total: $${data.total}`);
      setCartItems([]);
    } else {
      setMessage(`Error: ${data.error}`);
    }
  }

  const cartTotal = cartItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  return (
    <main className="min-h-screen p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">NexCart — Clean Arch Lab</h1>

      {message && (
        <div className="bg-green-100 text-green-800 p-3 rounded mb-4">{message}</div>
      )}

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products (semantic search)..."
          className="border rounded px-3 py-2 flex-1"
        />
        <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded">
          Search
        </button>
        <button onClick={loadProducts} className="border px-4 py-2 rounded">
          Clear
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-3">Products</h2>
          <div className="space-y-3">
            {products.map((p) => (
              <div key={p.id} className="border rounded p-3 flex justify-between items-center">
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-sm text-gray-600">{p.description}</div>
                  <div className="text-sm">${p.price}</div>
                </div>
                <button
                  onClick={() => addToCart(p)}
                  className="bg-black text-white px-3 py-1 rounded"
                >
                  Add
                </button>
              </div>
            ))}
            {products.length === 0 && <div className="text-gray-500">Koi product nahi mila</div>}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Cart</h2>
          <div className="space-y-2 mb-4">
            {cartItems.map((item) => (
              <div key={item.productId} className="flex justify-between border-b pb-2">
                <span>{item.productName} × {item.quantity}</span>
                <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            {cartItems.length === 0 && <div className="text-gray-500">Cart khali hai</div>}
          </div>
          {cartItems.length > 0 && (
            <>
              <div className="font-semibold mb-3">Total: ${cartTotal.toFixed(2)}</div>
              <button
                onClick={placeOrder}
                className="bg-green-600 text-white px-4 py-2 rounded w-full"
              >
                Place Order
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}