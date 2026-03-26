"use client";
import React, { useState } from "react";
import styles from "./ecommerce.module.css";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ShoppingBag, Menu as MenuIcon, X, Heart, Star, ShoppingCart, ChevronRight, Search, Sparkles, Package, TrendingUp, DollarSign, Users, ArrowRight, Check, Truck, RefreshCw, Shield, Plus, Minus, Trash2 } from "lucide-react";

const PRODUCTS = [
  { id: 1, name: "Aurora Nuit Parfum", category: "Fragrance", price: 285, originalPrice: 320, rating: 4.9, reviews: 312, badge: "Bestseller", color: "#8b5cf6" },
  { id: 2, name: "Lumière Leather Bag", category: "Accessories", price: 495, originalPrice: null, rating: 4.8, reviews: 178, badge: "New", color: "#ec4899" },
  { id: 3, name: "Prestige Timepiece", category: "Watches", price: 1250, originalPrice: 1450, rating: 4.9, reviews: 94, badge: "Sale", color: "#f59e0b" },
  { id: 4, name: "Diamond Tennis Set", category: "Jewellery", price: 780, originalPrice: null, rating: 5.0, reviews: 56, badge: null, color: "#06b6d4" },
  { id: 5, name: "Velvet Pump Heels", category: "Footwear", price: 340, originalPrice: 420, rating: 4.7, reviews: 203, badge: "Sale", color: "#8b5cf6" },
  { id: 6, name: "Silk Scarf Édition", category: "Accessories", price: 185, originalPrice: null, rating: 4.8, reviews: 89, badge: "Limited", color: "#ec4899" },
];

const CATEGORIES = ["All", "Fragrance", "Accessories", "Watches", "Jewellery", "Footwear"];

const ADMIN_PRODUCTS = [
  { id: "SKU-001", name: "Aurora Nuit Parfum", stock: 24, revenue: "$6,840", status: "Active" },
  { id: "SKU-002", name: "Lumière Leather Bag", stock: 8, revenue: "$3,960", status: "Low Stock" },
  { id: "SKU-003", name: "Prestige Timepiece", stock: 3, revenue: "$3,750", status: "Low Stock" },
  { id: "SKU-004", name: "Diamond Tennis Set", stock: 12, revenue: "$9,360", status: "Active" },
  { id: "SKU-005", name: "Velvet Pump Heels", stock: 0, revenue: "$5,440", status: "Out of Stock" },
];

type CartItem = { id: number; name: string; price: number; qty: number };

export default function EcommerceMVP() {
  const [mobileNav, setMobileNav] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [savedItems, setSavedItems] = useState<number[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [adminTab, setAdminTab] = useState<"inventory" | "analytics">("inventory");
  const [search, setSearch] = useState("");

  const scrollTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMobileNav(false); };

  const filtered = PRODUCTS.filter(p =>
    (activeCategory === "All" || p.category === activeCategory) &&
    (search === "" || p.name.toLowerCase().includes(search.toLowerCase()))
  );

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  function addToCart(p: typeof PRODUCTS[0]) {
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id);
      if (ex) return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: p.id, name: p.name, price: p.price, qty: 1 }];
    });
    setCartOpen(true);
  }

  function updateQty(id: number, delta: number) {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0));
  }

  function toggleSave(id: number) { setSavedItems(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]); }

  return (
    <div className={styles.app}>
      {/* NAV */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.logo}><Sparkles size={17} /><span>Lumière</span></div>
          <ul className={`${styles.navLinks} ${mobileNav ? styles.open : ""}`}>
            {["Shop", "Admin"].map(l => (
              <li key={l}><button className={styles.navLink} onClick={() => scrollTo(l.toLowerCase())}>{l}</button></li>
            ))}
          </ul>
          <div className={styles.navRight}>
            <button className={styles.searchBtn}><Search size={18} /></button>
            <button className={styles.cartBtn} onClick={() => setCartOpen(!cartOpen)}>
              <ShoppingCart size={18} />
              {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
            </button>
          </div>
          <button className={styles.hamburger} onClick={() => setMobileNav(!mobileNav)}>
            {mobileNav ? <X size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </nav>

      {/* CART DRAWER */}
      <AnimatePresence>
        {cartOpen && (
          <motion.div className={styles.cartOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCartOpen(false)}>
            <motion.aside className={styles.cartDrawer} initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ ease: [0.22,1,0.36,1] }} onClick={e => e.stopPropagation()}>
              <div className={styles.cartHeader}>
                <h3>Your Cart ({cartCount})</h3>
                <button onClick={() => setCartOpen(false)}><X size={20} /></button>
              </div>
              {cart.length === 0 ? (
                <div className={styles.cartEmpty}><ShoppingBag size={40} /><p>Your cart is empty</p></div>
              ) : (
                <>
                  <div className={styles.cartItems}>
                    {cart.map(item => (
                      <div key={item.id} className={styles.cartItem}>
                        <div className={styles.cartItemInfo}>
                          <p className={styles.cartItemName}>{item.name}</p>
                          <p className={styles.cartItemPrice}>${item.price}</p>
                        </div>
                        <div className={styles.cartQty}>
                          <button onClick={() => updateQty(item.id, -1)}><Minus size={13} /></button>
                          <span>{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)}><Plus size={13} /></button>
                          <button className={styles.removeBtn} onClick={() => updateQty(item.id, -item.qty)}><Trash2 size={13} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={styles.cartFooter}>
                    <div className={styles.cartTotal}><span>Total</span><strong>${cartTotal.toLocaleString()}</strong></div>
                    <button className={styles.checkoutBtn} onClick={() => { setCheckoutStep(1); setCartOpen(false); scrollTo("checkout"); }}>
                      Checkout · ${cartTotal.toLocaleString()} <ArrowRight size={16} />
                    </button>
                  </div>
                </>
              )}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <Image src="/assets/ecommerce-hero.jpg" alt="Luxury products" fill className={styles.heroBgImg} priority />
          <div className={styles.heroOverlay} />
        </div>
        <motion.div className={styles.heroContent} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22,1,0.36,1] }}>
          <span className={styles.eyebrow}><Sparkles size={11} fill="currentColor" /> New SS 2025 Collection</span>
          <h1 className={styles.heroTitle}>Curated<br />Luxury for<br /><em>Every</em> Taste.</h1>
          <p className={styles.heroSubtitle}>Discover the world's most coveted fragrances, leather goods, and fine jewellery — delivered to your door.</p>
          <div className={styles.heroCtas}>
            <button className={styles.primaryCta} onClick={() => scrollTo("shop")}><ShoppingBag size={17} /> Shop Collection</button>
            <button className={styles.ghostCta} onClick={() => scrollTo("admin")}>Admin View <ChevronRight size={16} /></button>
          </div>
          <div className={styles.heroPills}>
            {[<><Truck size={13}/> Free shipping over $200</>, <><RefreshCw size={13}/> 30-day returns</>, <><Shield size={13}/> Authenticity guaranteed</>].map((c, i) => (
              <span key={i} className={styles.heroPill}>{c}</span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* SHOP */}
      <section id="shop" className={styles.shopSection}>
        <div className={styles.container}>
          <div className={styles.shopHeader}>
            <div className={styles.sectionHeader}>
              <span className={styles.eyebrowLabel}>The Edit</span>
              <h2 className={styles.sectionTitle}>Explore Collection</h2>
            </div>
            <div className={styles.shopControls}>
              <div className={styles.searchInput}>
                <Search size={15} className={styles.searchIcon} />
                <input type="text" placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
          </div>
          <div className={styles.catTabs}>
            {CATEGORIES.map(c => (
              <button key={c} className={`${styles.catTab} ${activeCategory === c ? styles.catActive : ""}`} onClick={() => setActiveCategory(c)}>{c}</button>
            ))}
          </div>
          <motion.div className={styles.productGrid} layout>
            {filtered.map((p, i) => (
              <motion.div key={p.id} className={styles.productCard} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.05 }}>
                <div className={styles.productImg} style={{ background: `linear-gradient(135deg, ${p.color}18, ${p.color}08)`, borderColor: `${p.color}20` }}>
                  {p.badge && <span className={styles.productBadge} style={{ background: p.color }}>{p.badge}</span>}
                  <button className={`${styles.wishlistBtn} ${savedItems.includes(p.id) ? styles.wishlistActive : ""}`} onClick={() => toggleSave(p.id)}>
                    <Heart size={16} fill={savedItems.includes(p.id) ? "currentColor" : "none"} />
                  </button>
                  <div className={styles.productIcon} style={{ color: p.color }}><Package size={40} /></div>
                </div>
                <div className={styles.productBody}>
                  <span className={styles.productCategory}>{p.category}</span>
                  <h3 className={styles.productName}>{p.name}</h3>
                  <div className={styles.productRating}>
                    <Star size={12} fill="currentColor" style={{ color: "#f59e0b" }} />
                    <span>{p.rating}</span>
                    <span className={styles.reviewCount}>({p.reviews})</span>
                  </div>
                  <div className={styles.productPriceRow}>
                    <span className={styles.productPrice}>${p.price}</span>
                    {p.originalPrice && <span className={styles.productOriginal}>${p.originalPrice}</span>}
                    <button className={styles.addCartBtn} onClick={() => addToCart(p)}><ShoppingCart size={15} /> Add</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CHECKOUT */}
      {checkoutStep > 0 && (
        <section id="checkout" className={styles.checkoutSection}>
          <div className={styles.container}>
            <div className={styles.checkoutGrid}>
              <div className={styles.checkoutMain}>
                <div className={styles.checkoutSteps}>
                  {["Shipping", "Payment", "Review"].map((step, i) => (
                    <div key={step} className={`${styles.checkoutStep} ${i + 1 <= checkoutStep ? styles.stepActive : ""} ${i + 1 < checkoutStep ? styles.stepDone : ""}`}>
                      <span className={styles.stepNum}>{i + 1 < checkoutStep ? <Check size={14} /> : i + 1}</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
                {checkoutStep === 1 && (
                  <div className={styles.checkoutForm}>
                    <h3>Shipping Information</h3>
                    <div className={styles.formRow}><input placeholder="First Name" /><input placeholder="Last Name" /></div>
                    <input placeholder="Email Address" />
                    <input placeholder="Street Address" />
                    <div className={styles.formRow}><input placeholder="City" /><input placeholder="ZIP Code" /></div>
                    <button className={styles.nextBtn} onClick={() => setCheckoutStep(2)}>Continue to Payment <ArrowRight size={16} /></button>
                  </div>
                )}
                {checkoutStep === 2 && (
                  <div className={styles.checkoutForm}>
                    <h3>Payment Details</h3>
                    <input placeholder="Card Number" />
                    <div className={styles.formRow}><input placeholder="MM/YY" /><input placeholder="CVC" /></div>
                    <input placeholder="Name on Card" />
                    <button className={styles.nextBtn} onClick={() => setCheckoutStep(3)}>Review Order <ArrowRight size={16} /></button>
                  </div>
                )}
                {checkoutStep === 3 && (
                  <div className={styles.checkoutSuccess}>
                    <div className={styles.successCircle}><Check size={32} /></div>
                    <h3>Order Confirmed!</h3>
                    <p>Order #LM-{Math.floor(Math.random()*9000)+1000} · Estimated delivery: 2–4 business days</p>
                    <button className={styles.shopMoreBtn} onClick={() => { setCheckoutStep(0); setCart([]); scrollTo("shop"); }}>Continue Shopping</button>
                  </div>
                )}
              </div>
              <div className={styles.orderSummary}>
                <h3 className={styles.summaryTitle}>Order Summary</h3>
                {cart.map(item => (
                  <div key={item.id} className={styles.summaryItem}>
                    <span>{item.name} ×{item.qty}</span>
                    <span>${(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
                <div className={styles.summaryDivider} />
                <div className={styles.summaryTotal}><strong>Total</strong><strong>${cartTotal.toLocaleString()}</strong></div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ADMIN */}
      <section id="admin" className={styles.adminSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrowLabel}>Store Management</span>
            <h2 className={styles.sectionTitle}>Admin Dashboard</h2>
            <p className={styles.sectionSub}>Inventory tracking, revenue analytics, and product management.</p>
          </div>
          <div className={styles.adminStats}>
            {[{ icon: <DollarSign size={18}/>, l:"Revenue MTD", v:"$29.4K" }, { icon: <ShoppingCart size={18}/>, l:"Orders", v:"184" }, { icon: <Users size={18}/>, l:"Customers", v:"892" }, { icon: <TrendingUp size={18}/>, l:"Conversion", v:"3.2%" }].map(s => (
              <div key={s.l} className={styles.adminStat}><div className={styles.adminStatIcon}>{s.icon}</div><strong>{s.v}</strong><span>{s.l}</span></div>
            ))}
          </div>
          <div className={styles.adminPanel}>
            <div className={styles.adminTabs}>
              <button className={`${styles.adminTab} ${adminTab==="inventory"?styles.adminTabActive:""}`} onClick={()=>setAdminTab("inventory")}><Package size={15}/> Inventory</button>
              <button className={`${styles.adminTab} ${adminTab==="analytics"?styles.adminTabActive:""}`} onClick={()=>setAdminTab("analytics")}><TrendingUp size={15}/> Analytics</button>
            </div>
            <AnimatePresence mode="wait">
              {adminTab==="inventory" ? (
                <motion.div key="inv" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                  <div className={styles.invHeader}><span>SKU</span><span>Product</span><span>Stock</span><span>Revenue</span><span>Status</span></div>
                  {ADMIN_PRODUCTS.map((p,i)=>(
                    <motion.div key={p.id} className={styles.invRow} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*0.07}}>
                      <span className={styles.sku}>{p.id}</span>
                      <span className={styles.prodName}>{p.name}</span>
                      <span className={styles.stockNum}>{p.stock} units</span>
                      <span className={styles.revAmount}>{p.revenue}</span>
                      <span className={`${styles.invBadge} ${styles["inv_" + p.status.replace(" ","")]}`}>{p.status}</span>
                    </motion.div>
                  ))}
                </motion.div>
              ):(
                <motion.div key="analytics" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className={styles.analyticsView}>
                  <p className={styles.chartLabel}>Monthly Revenue (USD)</p>
                  <div className={styles.barChart}>
                    {[{m:"Jan",v:72},{m:"Feb",v:58},{m:"Mar",v:84},{m:"Apr",v:91},{m:"May",v:78},{m:"Jun",v:100},{m:"Jul",v:88}].map(b=>(
                      <div key={b.m} className={styles.barCol}>
                        <motion.div className={styles.bar} initial={{height:0}} animate={{height:`${b.v}%`}} transition={{delay:0.2,duration:0.5}} />
                        <span className={styles.barLbl}>{b.m}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerInner}>
            <div className={styles.footerLogo}><Sparkles size={16}/> Lumière</div>
            <p className={styles.footerNote}>E-commerce MVP Demo · Built by LOrdEnRYQuE</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
