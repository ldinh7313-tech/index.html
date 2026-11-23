import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Heart,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { categories, products, type Product, type ProductCategory } from "./products";

type CartLine = { product: Product; quantity: number; color: string };
type SortOrder = "featured" | "price-low" | "price-high" | "newest";
const CART_KEY = "forme-cart-v1";

function readCart(): CartLine[] {
  try {
    const stored = localStorage.getItem(CART_KEY);
    if (!stored) return [];
    const parsed: { id: string; quantity: number; color?: string }[] = JSON.parse(stored);
    return parsed.flatMap(({ id, quantity, color }) => {
      const product = products.find((item) => item.id === id);
      const selectedColor = product
        ? product.colors.includes(color ?? "") ? color ?? product.colors[0] : product.colors[0]
        : undefined;
      return product && selectedColor && Number.isInteger(quantity) && quantity > 0 ? [{ product, quantity, color: selectedColor }] : [];
    });
  } catch {
    return [];
  }
}

function ProductArtwork({ product, large = false }: { product: Product; large?: boolean }) {
  return (
    <div className={`product-art art-${product.swatch} ${large ? "product-art-large" : ""}`}>
      <div className={`object-shape shape-${product.shape}`} aria-hidden="true">
        {product.shape === "vase" && <span className="vase-neck" />}
        {product.shape === "lamp" && <span className="lamp-stem" />}
        {product.shape === "planter" && <span className="planter-leaf leaf-one" />}
        {product.shape === "planter" && <span className="planter-leaf leaf-two" />}
        {product.shape === "orb" && <span className="orb-ring" />}
      </div>
      <span className="art-label">Product image placeholder</span>
    </div>
  );
}

function ProductCard({
  product,
  onDetails,
  onAdd,
}: {
  product: Product;
  onDetails: (product: Product) => void;
  onAdd: (product: Product) => void;
}) {
  const [saved, setSaved] = useState(false);
  return (
    <article className="product-card group">
      <button className="art-button" onClick={() => onDetails(product)} aria-label={`View ${product.name} details`}>
        <ProductArtwork product={product} />
        <span className={`product-tag ${product.isNew ? "tag-dark" : ""}`}>
          {product.isNew ? "Just landed" : product.availability}
        </span>
      </button>
      <button
        className={`save-button ${saved ? "is-saved" : ""}`}
        onClick={() => setSaved((value) => !value)}
        aria-label={saved ? `Remove ${product.name} from saved items` : `Save ${product.name}`}
      >
        <Heart size={16} fill={saved ? "currentColor" : "none"} />
      </button>
      <div className="product-info">
        <div>
          <div className="product-card-meta">
            <p className="product-category">{product.category}</p>
            <span className="product-availability"><span />{product.availability}</span>
          </div>
          <button className="product-name" onClick={() => onDetails(product)}>{product.name}</button>
          <p className="product-description">{product.description}</p>
        </div>
        <div className="product-buy-row">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <div className="product-card-actions">
            <button className="detail-link" onClick={() => onDetails(product)}>View details <ArrowUpRight size={12} /></button>
            <button className="quick-add" onClick={() => onAdd(product)} aria-label={`Add ${product.name} to cart`}>
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function ProductDetails({
  product,
  onClose,
  onAdd,
}: {
  product: Product;
  onClose: () => void;
  onAdd: (product: Product, quantity: number, color: string) => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState(product.colors[0]);
  return (
    <div className="overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="detail-dialog" role="dialog" aria-modal="true" aria-labelledby="detail-title">
        <button className="icon-button dialog-close" onClick={onClose} aria-label="Close product details"><X size={20} /></button>
        <div className="detail-art"><ProductArtwork product={product} large /></div>
        <div className="detail-copy">
          <p className="eyebrow">{product.category}</p>
          <h2 id="detail-title">{product.name}</h2>
          <p className="detail-price">${product.price.toFixed(2)}</p>
          <p className="detail-description">{product.description}</p>
          <div className="detail-attributes">
            <div><span>Dimensions</span><strong>{product.dimensions}</strong></div>
            <div><span>Material</span><strong>{product.material}</strong></div>
            <div><span>Made for you</span><strong>{product.productionTime}</strong></div>
            <div><span>Availability</span><strong>{product.availability}</strong></div>
          </div>
          <div className="color-picker">
            <span>Color · {color}</span>
            <div className="color-options">
              {product.colors.map((option, index) => (
                <button
                  key={option}
                  className={`color-dot color-${index} ${color === option ? "color-selected" : ""}`}
                  onClick={() => setColor(option)}
                  aria-label={`Choose ${option}`}
                  title={option}
                />
              ))}
            </div>
          </div>
          <div className="detail-actions">
            <div className="quantity-control">
              <button onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Decrease quantity"><Minus size={15} /></button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((value) => value + 1)} aria-label="Increase quantity"><Plus size={15} /></button>
            </div>
            <button className="button button-dark add-detail-button" onClick={() => onAdd(product, quantity, color)}>
              Add to bag · ${(product.price * quantity).toFixed(2)}
              <ArrowRight size={17} />
            </button>
          </div>
          <p className="made-note"><Check size={14} /> Printed in small batches, packed with care.</p>
        </div>
      </section>
    </div>
  );
}

function CartDrawer({
  cart,
  onClose,
  onQuantity,
  onRemove,
  onContinue,
}: {
  cart: CartLine[];
  onClose: () => void;
  onQuantity: (id: string, color: string, delta: number) => void;
  onRemove: (id: string, color: string) => void;
  onContinue: () => void;
}) {
  const subtotal = cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= 75 ? 0 : 6;
  return (
    <div className="overlay cart-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <div className="cart-header">
          <div><p className="eyebrow">Your selection</p><h2 id="cart-title">Shopping bag <span>({cart.reduce((sum, line) => sum + line.quantity, 0)})</span></h2></div>
          <button className="icon-button" onClick={onClose} aria-label="Close shopping bag"><X size={20} /></button>
        </div>
        {cart.length === 0 ? (
          <div className="empty-cart">
            <ShoppingBag size={26} strokeWidth={1.3} />
            <h3>A little room for something lovely.</h3>
            <p>Your bag is waiting for its first thoughtfully made object.</p>
            <button className="button button-dark" onClick={onContinue}>Explore the collection <ArrowRight size={16} /></button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map(({ product, quantity, color }) => (
                <div className="cart-line" key={`${product.id}-${color}`}>
                  <div className="cart-thumb"><ProductArtwork product={product} /></div>
                  <div className="cart-line-copy">
                    <p className="product-category">{product.category}</p>
                    <strong>{product.name}</strong>
                    <span className="cart-color">Color · {color}</span>
                    <span>${product.price.toFixed(2)}</span>
                    <div className="cart-line-bottom">
                      <div className="mini-quantity">
                        <button onClick={() => onQuantity(product.id, color, -1)} aria-label={`Decrease ${product.name} quantity`}><Minus size={12} /></button>
                        <span>{quantity}</span>
                        <button onClick={() => onQuantity(product.id, color, 1)} aria-label={`Increase ${product.name} quantity`}><Plus size={12} /></button>
                      </div>
                      <button className="remove-link" onClick={() => onRemove(product.id, color)}>Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <p className="shipping-note">{subtotal >= 75 ? "You’ve unlocked complimentary shipping." : `Complimentary shipping on orders over $75 · $${Math.max(0, 75 - subtotal).toFixed(2)} to go`}</p>
              <div><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div>
              <div><span>Shipping</span><strong>{shipping === 0 ? (subtotal === 0 ? "—" : "Complimentary") : `$${shipping.toFixed(2)}`}</strong></div>
              <div className="cart-total"><span>Total</span><strong>${(subtotal + shipping).toFixed(2)}</strong></div>
              <button className="button button-dark checkout-button" disabled>
                Checkout coming soon <ArrowRight size={16} />
              </button>
              <button className="continue-link" onClick={onContinue}><ArrowLeft size={14} /> Continue exploring</button>
              <p className="checkout-disclaimer">Secure checkout will be available in a future update.</p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

function App() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "All objects">("All objects");
  const [sortOrder, setSortOrder] = useState<SortOrder>("featured");
  const [availability, setAvailability] = useState("all");
  const [popularOnly, setPopularOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(100);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartLine[]>(readCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [addedMessage, setAddedMessage] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const matchesQuery = !normalizedQuery || `${product.name} ${product.description} ${product.category}`.toLowerCase().includes(normalizedQuery);
      const matchesCategory = activeCategory === "All objects" || product.category === activeCategory;
      const matchesAvailability = availability === "all" || product.availability === availability;
      const matchesPopularity = !popularOnly || product.isBestSeller;
      return matchesQuery && matchesCategory && matchesAvailability && matchesPopularity && product.price <= maxPrice;
    });
    if (sortOrder === "price-low") return filtered.sort((a, b) => a.price - b.price);
    if (sortOrder === "price-high") return filtered.sort((a, b) => b.price - a.price);
    if (sortOrder === "newest") return filtered.sort((a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)));
    return filtered.sort((a, b) => Number(Boolean(b.isBestSeller)) - Number(Boolean(a.isBestSeller)));
  }, [activeCategory, availability, maxPrice, popularOnly, query, sortOrder]);

  function updateCart(nextCart: CartLine[]): boolean {
    setCart(nextCart);
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(nextCart.map(({ product, quantity, color }) => ({ id: product.id, quantity, color }))));
      return true;
    } catch {
      return false;
    }
  }

  function addToCart(product: Product, quantity = 1, color = product.colors[0]) {
    const existing = cart.find((line) => line.product.id === product.id && line.color === color);
    const saved = updateCart(existing
      ? cart.map((line) => line.product.id === product.id && line.color === color ? { ...line, quantity: line.quantity + quantity } : line)
      : [...cart, { product, quantity, color }]);
    setDetailProduct(null);
    setAddedMessage(saved ? `${product.name} added to your bag` : "Bag updated, but could not be saved on this device.");
    window.setTimeout(() => setAddedMessage(""), 2600);
  }

  function changeQuantity(id: string, color: string, delta: number) {
    const saved = updateCart(cart.flatMap((line) => {
      if (line.product.id !== id || line.color !== color) return [line];
      const quantity = line.quantity + delta;
      return quantity > 0 ? [{ ...line, quantity }] : [];
    }));
    if (!saved) setAddedMessage("Bag updated, but could not be saved on this device.");
  }

  function removeFromCart(id: string, color: string) {
    if (!updateCart(cart.filter((line) => line.product.id !== id || line.color !== color))) {
      setAddedMessage("Bag updated, but could not be saved on this device.");
    }
  }

  function goToShop(category?: ProductCategory) {
    setActiveCategory(category ?? "All objects");
    setMobileMenuOpen(false);
    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
  }

  const featuredProducts = products.filter((product) => product.isBestSeller);

  return (
    <>
      <div className="announcement">
        <span>Small-batch objects, made with intention.</span>
        <a href="#about">A little more about us <ArrowUpRight size={12} /></a>
      </div>
      <header className="site-header">
        <button className="mobile-menu-toggle icon-button" onClick={() => setMobileMenuOpen((open) => !open)} aria-label="Toggle navigation">
          {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
        <a className="brand" href="#home" aria-label="Forme home">
          <span className="brand-mark">f.</span>
          <span>forme<span className="brand-period">.</span></span>
        </a>
        <nav className={`main-nav ${mobileMenuOpen ? "nav-open" : ""}`} aria-label="Main navigation">
          <a className="nav-active" href="#home" onClick={() => setMobileMenuOpen(false)}>Home</a>
          <a href="#shop" onClick={() => setMobileMenuOpen(false)}>Shop</a>
          <button onClick={() => goToShop("Home objects")}>Categories <ChevronDown size={13} /></button>
          <a href="#about" onClick={() => setMobileMenuOpen(false)}>About us</a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
        </nav>
        <div className="header-actions">
          <label className="search-field">
            <Search size={16} />
            <input value={query} onChange={(event) => { setQuery(event.target.value); if (event.target.value) goToShop(); }} onFocus={() => undefined} placeholder="Search objects" aria-label="Search products" />
            {query && <button onClick={() => setQuery("")} aria-label="Clear search"><X size={14} /></button>}
          </label>
          <button className="bag-button" onClick={() => setCartOpen(true)} aria-label={`Open shopping bag, ${cart.reduce((sum, line) => sum + line.quantity, 0)} items`}>
            <ShoppingBag size={19} strokeWidth={1.5} />
            <span>Bag</span>
            <span className="bag-count">{cart.reduce((sum, line) => sum + line.quantity, 0)}</span>
          </button>
        </div>
      </header>

      <main id="home">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow hero-eyebrow"><span className="eyebrow-dot" /> A new kind of made</p>
            <h1>Objects,<br />made <em>layer</em><br />by layer.</h1>
            <p className="hero-subtitle">A quieter kind of thoughtful. Everyday objects, designed with intention and printed in our little studio.</p>
            <div className="hero-actions">
              <button className="button button-dark" onClick={() => goToShop()}>Explore the collection <ArrowRight size={16} /></button>
              <a className="text-link" href="#about">How we make <ArrowDownRight size={15} /></a>
            </div>
            <div className="hero-footnote"><span className="hero-line" /> Designed in small batches · Made to keep</div>
          </div>
          <div className="hero-visual">
            <div className="hero-art-backdrop">
              <div className="hero-sun" />
              <div className="hero-pedestal pedestal-back" />
              <div className="hero-sculpture hero-arch"><div /></div>
              <div className="hero-pedestal pedestal-front" />
              <div className="hero-sculpture hero-vase"><span /></div>
              <div className="hero-shadow" />
            </div>
            <div className="hero-caption"><span>01 / 08</span><span>Form, with feeling.</span></div>
            <span className="hero-side-note">MADE SLOWLY, USED DAILY</span>
            <button className="hero-next" onClick={() => goToShop()} aria-label="Explore products"><ArrowDown size={18} /></button>
          </div>
          <div className="hero-index">OBJECTS FOR THE IN-BETWEEN MOMENTS <span>— 2026</span></div>
        </section>

        <section className="trust-strip" aria-label="Our promises">
          <div><span className="trust-icon">01</span><span>Designed in-house</span></div>
          <span className="trust-divider" />
          <div><span className="trust-icon">02</span><span>Made one at a time</span></div>
          <span className="trust-divider" />
          <div><span className="trust-icon">03</span><span>Thoughtful materials</span></div>
          <span className="trust-divider" />
          <div><span className="trust-icon">04</span><span>Ships with care</span></div>
        </section>

        <section className="featured-section section-wrap">
          <div className="section-heading">
            <div><p className="eyebrow">A few good things</p><h2>Made to find their place.</h2></div>
            <button className="text-link" onClick={() => goToShop()}>View all objects <ArrowRight size={15} /></button>
          </div>
          <div className="product-grid featured-grid">
            {featuredProducts.map((product) => <ProductCard key={product.id} product={product} onDetails={setDetailProduct} onAdd={addToCart} />)}
            <article className="feature-note">
              <span className="note-mark">f.</span>
              <p>Good design isn’t loud.<br />It just feels like it belongs.</p>
              <a href="#about">Meet Forme <ArrowUpRight size={14} /></a>
              <span className="note-edition">A NOTE FROM THE STUDIO · 001</span>
            </article>
          </div>
        </section>

        <section id="shop" className="shop-section">
          <div className="shop-top section-wrap">
            <div>
              <p className="eyebrow">The collection · {products.length} objects</p>
              <h2>Find your form.</h2>
            </div>
            <div className="shop-tools">
              <label className="sort-select"><span>Sort by</span><select value={sortOrder} onChange={(event) => setSortOrder(event.target.value as SortOrder)} aria-label="Sort products">
                <option value="featured">Featured</option><option value="newest">Newest</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option>
              </select><ChevronDown size={14} /></label>
            </div>
          </div>
          <div className="shop-content section-wrap">
            <aside className="filters">
              <div className="filter-title"><SlidersHorizontal size={15} /><span>Refine by</span></div>
              <div className="filter-group filter-category">
                <p className="filter-label">Category</p>
                <button className={`filter-option ${activeCategory === "All objects" ? "filter-active" : ""}`} onClick={() => setActiveCategory("All objects")}>All objects <span>{products.length}</span></button>
                {categories.map((category) => <button key={category} className={`filter-option ${activeCategory === category ? "filter-active" : ""}`} onClick={() => setActiveCategory(category)}>{category}</button>)}
              </div>
              <div className="filter-group filter-popularity">
                <p className="filter-label">Popularity</p>
                <label className="check-option"><input type="checkbox" checked={popularOnly} onChange={(event) => setPopularOnly(event.target.checked)} />Best sellers only</label>
              </div>
              <div className="filter-group filter-availability">
                <p className="filter-label">Availability</p>
                <label className="check-option"><input type="radio" name="availability" checked={availability === "all"} onChange={() => setAvailability("all")} />All pieces</label>
                <label className="check-option"><input type="radio" name="availability" checked={availability === "In stock"} onChange={() => setAvailability("In stock")} />Ready to ship</label>
                <label className="check-option"><input type="radio" name="availability" checked={availability === "Made to order"} onChange={() => setAvailability("Made to order")} />Made to order</label>
              </div>
              <div className="filter-group filter-price price-filter">
                <p className="filter-label">Price range</p>
                <input type="range" min="18" max="100" step="1" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} aria-label="Maximum price" />
                <div className="price-range-label"><span>$18</span><span>Up to ${maxPrice}</span></div>
              </div>
              {(activeCategory !== "All objects" || availability !== "all" || popularOnly || maxPrice < 100 || query) && (
                <button className="clear-filters" onClick={() => { setActiveCategory("All objects"); setAvailability("all"); setPopularOnly(false); setMaxPrice(100); setQuery(""); }}>Clear all filters <X size={13} /></button>
              )}
            </aside>
            <div className="catalog">
              <div className="catalog-meta"><span>{filteredProducts.length} {filteredProducts.length === 1 ? "object" : "objects"}</span><span>Designed to last, made to order.</span></div>
              {filteredProducts.length ? (
                <div className="product-grid catalog-grid">
                  {filteredProducts.map((product) => <ProductCard key={product.id} product={product} onDetails={setDetailProduct} onAdd={addToCart} />)}
                </div>
              ) : (
                <div className="no-results"><Search size={24} /><h3>No objects found.</h3><p>Try adjusting your filters to find your form.</p><button className="text-link" onClick={() => { setActiveCategory("All objects"); setAvailability("all"); setPopularOnly(false); setMaxPrice(100); setQuery(""); }}>Clear filters <ArrowRight size={15} /></button></div>
              )}
            </div>
          </div>
        </section>

        <section className="studio-section section-wrap" id="about">
          <div className="studio-art">
            <div className="studio-orbit orbit-outer" /><div className="studio-orbit orbit-inner" />
            <div className="studio-object"><div /></div>
            <span className="studio-art-label">A STUDY IN FORM · NO. 014</span>
          </div>
          <div className="studio-copy">
            <p className="eyebrow">From our small studio</p>
            <h2>Made by a person.<br />Not a production line.</h2>
            <p>Every Forme object starts with a sketch, takes shape layer by layer, and gets a final once-over by hand. We print thoughtfully, in small batches, so less goes to waste and more of what we make has a reason to exist.</p>
            <a className="text-link" href="#contact">A little about our process <ArrowUpRight size={15} /></a>
            <span className="studio-signature">Made slowly, with intention. <span>— Forme studio</span></span>
          </div>
        </section>

        <section className="newsletter-section" id="contact">
          <div className="newsletter-inner">
            <p className="eyebrow">A note from the studio</p>
            <h2>Good things, occasionally.</h2>
            <p>New forms, behind-the-scenes, and the occasional little thought. No noise.</p>
            {subscribed ? (
              <div className="subscribe-success"><Check size={17} /> You’re on the list. Talk soon.</div>
            ) : (
              <form className="subscribe-form" onSubmit={(event) => { event.preventDefault(); if (email.includes("@")) setSubscribed(true); }}>
                <input required type="email" placeholder="Your email address" value={email} onChange={(event) => setEmail(event.target.value)} aria-label="Email address" />
                <button type="submit" aria-label="Subscribe"><ArrowRight size={18} /></button>
              </form>
            )}
            <span className="newsletter-fine-print">By subscribing, you agree to occasional notes from Forme. Unsubscribe anytime.</span>
          </div>
          <span className="newsletter-asterisk">✳</span>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <a className="brand footer-logo" href="#home"><span className="brand-mark">f.</span><span>forme<span className="brand-period">.</span></span></a>
            <p>Objects for the in-between moments.<br />Designed and made with intention.</p>
            <span className="footer-socials"><a href="mailto:hello@forme.studio" aria-label="Email Forme"><ArrowUpRight size={15} /></a><a href="#contact" aria-label="Instagram"><span>ig</span></a></span>
          </div>
          <div className="footer-links"><p>Explore</p><a href="#home">Home</a><a href="#shop">Shop all</a><a href="#about">Our story</a><a href="#contact">Get in touch</a></div>
          <div className="footer-links"><p>Here to help</p><a href="#contact">Shipping & returns</a><a href="#contact">Care guide</a><a href="#contact">Custom requests</a><a href="mailto:hello@forme.studio">hello@forme.studio</a></div>
          <div className="footer-location"><span>Made in small batches</span><strong>Designed with care.<br />Printed with purpose.</strong><span>© Forme Studio 2026</span></div>
        </div>
        <div className="footer-bottom"><span>© 2026 Forme Studio. All good things reserved.</span><div><a href="#contact">Privacy</a><a href="#contact">Terms</a><span>USD · $</span></div></div>
      </footer>

      {detailProduct && <ProductDetails product={detailProduct} onClose={() => setDetailProduct(null)} onAdd={addToCart} />}
      {cartOpen && <CartDrawer cart={cart} onClose={() => setCartOpen(false)} onQuantity={changeQuantity} onRemove={removeFromCart} onContinue={() => { setCartOpen(false); goToShop(); }} />}
      {addedMessage && <div className="toast"><Check size={16} />{addedMessage}</div>}
    </>
  );
}

export default App;
