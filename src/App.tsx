import { useMemo, useState } from "react";
import {
  ArrowDownUp, ArrowRight, Check, ChevronDown, Heart, Leaf, Menu, Minus, Plus,
  Search, ShoppingBag, SlidersHorizontal, Sparkles, Star, X,
} from "lucide-react";
import { categories, products, type Category, type Product } from "./data/products";

type SortOrder = "featured" | "popular" | "price-low" | "price-high" | "top-rated";
type CategoryFilter = Category | "All objects";
const price = (amount: number) => `$${amount.toFixed(2)}`;

function ProductArt({ product, large = false }: { product: Product; large?: boolean }) {
  return (
    <div className={`product-art art-${product.palette}${large ? " art-large" : ""}`} role="img" aria-label={`Illustrated placeholder for ${product.name}`}>
      <span className="art-sun" />
      <span className={`object-shape object-${product.shape}`} />
      <span className="art-shadow" />
      <span className="art-label">STUDIO OBJECT · {product.id.slice(0, 3).toUpperCase()}</span>
    </div>
  );
}

function ProductCard({ product, onView, onAdd }: { product: Product; onView: (product: Product) => void; onAdd: () => void }) {
  const [favorite, setFavorite] = useState(false);
  return (
    <article className="product-card">
      <div className="image-wrap">
        <button className="image-open" onClick={() => onView(product)} aria-label={`View ${product.name}`}><ProductArt product={product} /></button>
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <button className={`favorite${favorite ? " favorite-active" : ""}`} onClick={() => setFavorite((value) => !value)} aria-label={favorite ? "Remove from favorites" : "Add to favorites"} aria-pressed={favorite}><Heart size={16} fill={favorite ? "currentColor" : "none"} /></button>
        <button className="quick-view" onClick={() => onView(product)}>Quick view <ArrowRight size={13} /></button>
      </div>
      <div className="product-copy">
        <div className="product-meta"><span>{product.category}</span><span className="rating"><Star size={12} fill="currentColor" /> {product.rating}</span></div>
        <div className="title-line"><button onClick={() => onView(product)}>{product.name}</button><span>{price(product.price)}</span></div>
        <div className="product-bottom">
          <span className={`stock${product.available ? "" : " stock-made"}`}><i />{product.available ? "Ready to ship" : "Made to order"}</span>
          <button className="add-button" onClick={onAdd} aria-label={`Add ${product.name} to bag`}><Plus size={14} /> Add</button>
        </div>
      </div>
    </article>
  );
}

function ProductDialog({ product, onClose, onAdd }: { product: Product; onClose: () => void; onAdd: (quantity: number) => void }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  return (
    <div className="dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="product-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        <button className="dialog-close" onClick={onClose} aria-label="Close product details"><X size={19} /></button>
        <div className="dialog-art"><ProductArt product={product} large /></div>
        <div className="dialog-copy">
          <p className="eyebrow">{product.category} <span>·</span> made in our studio</p>
          <h2 id="dialog-title">{product.name}</h2>
          <p className="dialog-rating"><Star size={13} fill="currentColor" /> {product.rating} <span>· {product.reviews} kind words</span></p>
          <p className="dialog-description">{product.description}</p>
          <p className="dialog-price">{price(product.price)}</p>
          <span className="field-label">Color <b>{selectedColor}</b></span>
          <div className="color-options">
            {product.colors.map((color, index) => <button key={color} className={`swatch swatch-${index}${selectedColor === color ? " swatch-selected" : ""}`} onClick={() => setSelectedColor(color)} aria-label={`Select ${color}`} aria-pressed={selectedColor === color}>{selectedColor === color && <Check size={12} />}</button>)}
          </div>
          <div className="dialog-actions">
            <div className="quantity"><button onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Decrease quantity"><Minus size={13} /></button><span>{quantity}</span><button onClick={() => setQuantity((value) => value + 1)} aria-label="Increase quantity"><Plus size={13} /></button></div>
            <button className="button-primary dialog-add" onClick={() => { onAdd(quantity); onClose(); }}>Add to bag <ArrowRight size={15} /></button>
          </div>
          <p className="dialog-note"><Leaf size={14} /> Printed in small batches with care. Ships in 2–4 business days.</p>
        </div>
      </section>
    </div>
  );
}

function App() {
  const [category, setCategory] = useState<CategoryFilter>("All objects");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOrder>("featured");
  const [maxPrice, setMaxPrice] = useState(50);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    const text = query.trim().toLowerCase();
    const result = products.filter((product) =>
      (category === "All objects" || product.category === category)
      && (!text || `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(text))
      && product.price <= maxPrice
      && (!availableOnly || product.available),
    );
    if (sort === "price-low") return result.sort((a, b) => a.price - b.price);
    if (sort === "price-high") return result.sort((a, b) => b.price - a.price);
    if (sort === "top-rated") return result.sort((a, b) => b.rating - a.rating);
    if (sort === "popular") return result.sort((a, b) => b.popularity - a.popularity);
    return result;
  }, [availableOnly, category, maxPrice, query, sort]);
  const clearFilters = () => { setCategory("All objects"); setQuery(""); setMaxPrice(50); setAvailableOnly(false); };
  const addToBag = (quantity = 1) => setCartCount((count) => count + quantity);

  return (
    <div className="app-shell">
      <div className="announcement"><Sparkles size={13} /><span>Made slowly. Made with care. <b>Free shipping on orders over $60</b></span><ArrowRight size={13} /></div>
      <header className="site-header">
        <button className="mobile-menu" aria-label="Open menu"><Menu size={21} /></button>
        <a className="wordmark" href="#top" aria-label="Form and Fable home"><span className="brand-mark"><i /></span><span>form<span className="amp">&</span>fable<small>PRINTED WITH PURPOSE</small></span></a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a className="nav-active" href="#shop">Shop all</a><a href="#shop" onClick={() => setCategory("Home objects")}>Home objects</a>
          <a href="#shop" onClick={() => setCategory("Planters")}>Planters</a><a href="#our-process">Our process</a>
        </nav>
        <div className="header-actions">
          <label className="search-box"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search objects" aria-label="Search products" />{query && <button onClick={() => setQuery("")} aria-label="Clear search"><X size={14} /></button>}</label>
          <button className="bag-button" aria-label={`Shopping bag, ${cartCount} items`}><ShoppingBag size={18} /><span>Bag</span><i>{cartCount}</i></button>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow"><span className="eyebrow-line" /> A LITTLE STUDIO WITH BIG IDEAS</p>
            <h1>Small objects.<br /><em>Big delight.</em></h1>
            <p className="hero-description">Thoughtful things for your everyday, dreamt up, printed, and packed by one pair of hands.</p>
            <a className="button-primary hero-cta" href="#shop">Find your little something <ArrowRight size={15} /></a>
            <p className="hero-note"><span><Leaf size={15} /></span> Designed and made in small batches, just for you.</p>
          </div>
          <div className="hero-visual" aria-label="Illustration of small-batch 3D-printed vases and flowers" role="img">
            <div className="hero-backdrop" /><div className="hero-vase hero-vase-tall" /><div className="hero-vase hero-vase-short" />
            <div className="hero-flower flower-one"><i /><i /><i /><b /></div><div className="hero-flower flower-two"><i /><i /><i /><b /></div>
            <div className="hero-sticker">made<br />with <Heart size={16} fill="currentColor" /></div>
            <div className="hero-caption"><span>01 / 04</span><span>THE LITTLE THINGS COLLECTION</span></div>
          </div>
          <span className="hero-side-note">OBJECTS FOR EVERYDAY WONDER <b>✳</b> 2025</span>
        </section>

        <section className="promise-strip" id="our-process">
          <div><span className="promise-icon"><Sparkles size={16} /></span><span><b>Designed with intention</b><small>Little details, lots of thought</small></span></div>
          <div><span className="promise-icon"><Leaf size={16} /></span><span><b>Printed one at a time</b><small>Never mass-produced</small></span></div>
          <div><span className="promise-icon"><Heart size={16} /></span><span><b>Packed by hand</b><small>From our studio to your door</small></span></div>
          <i className="promise-divider" /><p>A softer kind of making.</p>
        </section>

        <section className="catalog" id="shop">
          <div className="catalog-heading"><div><p className="eyebrow">THE OBJECT LIBRARY</p><h2>Find a little <em>wonder.</em></h2></div><p>Useful, joyful, and a tiny bit unexpected.<br />Meet the things we make around here.</p></div>
          <div className="category-pills" role="group" aria-label="Filter by category">
            <button className={category === "All objects" ? "active" : ""} onClick={() => setCategory("All objects")}>All objects <span>{products.length}</span></button>
            {categories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}
            <span className="category-note"><Sparkles size={13} /> A few favorites, made by hand</span>
          </div>
          <div className="catalog-layout">
            <aside className={`filter-sidebar${mobileFiltersOpen ? " filters-open" : ""}`}>
              <div className="filter-title"><h3>Filters</h3><button onClick={clearFilters}>Reset</button><button className="filter-close" onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters"><X size={18} /></button></div>
              <div className="filter-group"><h4>Category <ChevronDown size={14} /></h4><div className="filter-options">
                <label><input type="radio" name="category" checked={category === "All objects"} onChange={() => setCategory("All objects")} /><span>All objects</span><small>{products.length}</small></label>
                {categories.map((item) => <label key={item}><input type="radio" name="category" checked={category === item} onChange={() => setCategory(item)} /><span>{item}</span><small>{products.filter((product) => product.category === item).length}</small></label>)}
              </div></div>
              <div className="filter-group price-filter"><h4>Price <ChevronDown size={14} /></h4><div className="price-label"><span>$0</span><b>Up to ${maxPrice}</b></div><input type="range" min="10" max="50" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} aria-label="Maximum price" /><div className="range-labels"><span>Budget-friendly</span><span>Special little thing</span></div></div>
              <div className="filter-group"><label className="stock-toggle"><span><b>Ready to ship</b><small>In stock and on their way</small></span><input type="checkbox" checked={availableOnly} onChange={(event) => setAvailableOnly(event.target.checked)} /><i /></label></div>
              <div className="filter-note"><span>✳</span><p>Every piece is printed in our little studio, one layer at a time.</p></div>
            </aside>
            <div className="catalog-results">
              <div className="results-toolbar"><span className="result-count"><b>{filteredProducts.length}</b> little {filteredProducts.length === 1 ? "thing" : "things"} to love</span>
                <button className="mobile-filter-button" onClick={() => setMobileFiltersOpen(true)}><SlidersHorizontal size={14} /> Filters</button>
                <label className="sort-control"><ArrowDownUp size={13} /><span>Sort by</span><select value={sort} onChange={(event) => setSort(event.target.value as SortOrder)} aria-label="Sort products"><option value="featured">Featured</option><option value="popular">Most popular</option><option value="top-rated">Top rated</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select><ChevronDown size={13} /></label>
              </div>
              {filteredProducts.length ? <div className="product-grid">{filteredProducts.map((product) => <ProductCard key={product.id} product={product} onView={setSelectedProduct} onAdd={() => addToBag()} />)}</div> : <div className="empty-state"><span><Search size={22} /></span><h3>No little things found.</h3><p>Try a different search or loosen up those filters.</p><button className="button-outline" onClick={clearFilters}>Clear filters <ArrowRight size={14} /></button></div>}
              {!!filteredProducts.length && <div className="catalog-endnote"><i /><p>That’s everything, for now. More little things are always in the making.</p><i /></div>}
            </div>
          </div>
        </section>

        <section className="studio-note"><div className="studio-mark"><i /><i /></div><p className="eyebrow">A NOTE FROM THE STUDIO</p><h2>Good things take<br /><em>a little time.</em></h2><p className="studio-copy">No warehouse, no conveyor belt. Just a little studio, a well-loved printer, and one maker who cares about every curve, layer, and parcel.</p><a className="text-link" href="#our-process">A peek at how we make <ArrowRight size={14} /></a><span className="studio-signature">made slowly, <em>with love</em> <Heart size={12} fill="currentColor" /></span></section>
        <section className="closing-banner"><div><p className="eyebrow">THOUGHTFUL THINGS, FROM OUR LITTLE STUDIO</p><h2>Make room for <em>a little wonder.</em></h2></div><a className="button-primary" href="#shop">Explore the collection <ArrowRight size={15} /></a><span className="closing-sparkle">✳</span></section>
      </main>

      <footer className="site-footer"><div className="footer-main">
        <div className="footer-brand"><a className="wordmark" href="#top"><span className="brand-mark"><i /></span><span>form<span className="amp">&</span>fable<small>PRINTED WITH PURPOSE</small></span></a><p>Small objects, made with a lot of heart.<br />A tiny studio making everyday a little lovelier.</p></div>
        <div className="footer-column"><b>THE GOOD STUFF</b><a href="#shop">Shop all</a><a href="#shop" onClick={() => setCategory("Home objects")}>Home objects</a><a href="#shop" onClick={() => setCategory("Planters")}>Planters</a></div>
        <div className="footer-column"><b>OUR LITTLE WORLD</b><a href="#our-process">How it’s made</a><a href="#our-process">Materials & care</a><a href="#our-process">A note from the maker</a></div>
        <div className="footer-signoff"><span>✳</span><p>Made one layer<br />at a time.</p></div>
      </div><div className="footer-bottom"><span>© 2025 Form & Fable Studio</span><span>Made with intention, somewhere sunny <Heart size={12} fill="currentColor" /></span><a href="#top">Back to the top <ArrowRight size={12} /></a></div></footer>
      {selectedProduct && <ProductDialog product={selectedProduct} onClose={() => setSelectedProduct(null)} onAdd={addToBag} />}
      {cartCount > 0 && <div className="cart-toast" role="status"><span><Check size={13} /></span> Added to your little bag <button onClick={() => setCartCount(0)} aria-label="Dismiss notification"><X size={13} /></button></div>}
    </div>
  );
}

export default App;
