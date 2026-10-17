import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import magnifer from '@iconify-icons/solar/magnifer-linear';
import bag from '@iconify-icons/solar/bag-4-linear';
import close from '@iconify-icons/solar/close-circle-linear';
import menu from '@iconify-icons/solar/hamburger-menu-linear';
import arrowRight from '@iconify-icons/solar/arrow-right-linear';
import arrowLeft from '@iconify-icons/solar/alt-arrow-left-linear';
import arrowNext from '@iconify-icons/solar/alt-arrow-right-linear';
import arrowDown from '@iconify-icons/solar/alt-arrow-down-linear';
import gallery from '@iconify-icons/solar/gallery-linear';
import heart from '@iconify-icons/solar/heart-linear';
import eye from '@iconify-icons/solar/eye-linear';
import minus from '@iconify-icons/solar/minus-circle-linear';
import add from '@iconify-icons/solar/add-circle-linear';
import trash from '@iconify-icons/solar/trash-bin-trash-linear';
import edit from '@iconify-icons/solar/gallery-edit-linear';
import text from '@iconify-icons/solar/text-field-linear';
import upload from '@iconify-icons/solar/upload-linear';
import danger from '@iconify-icons/solar/danger-circle-linear';
import box from '@iconify-icons/solar/box-linear';
import card from '@iconify-icons/solar/card-linear';
import users from '@iconify-icons/solar/users-group-rounded-linear';
import palette from '@iconify-icons/solar/palette-round-linear';
import mapPoint from '@iconify-icons/solar/map-point-linear';
import checklist from '@iconify-icons/solar/checklist-minimalistic-linear';
import walletMoney from '@iconify-icons/solar/wallet-money-linear';
import delivery from '@iconify-icons/solar/delivery-linear';
import camera from '@iconify-icons/solar/camera-minimalistic-linear';
import music from '@iconify-icons/solar/music-note-2-linear';
import { useApp } from './context.jsx';

const icons = {
  magnifer, 'bag-4': bag, 'close-circle': close, 'hamburger-menu': menu,
  'arrow-right': arrowRight, 'alt-arrow-left': arrowLeft, 'alt-arrow-right': arrowNext,
  'alt-arrow-down': arrowDown, gallery, heart, eye, 'minus-circle': minus,
  'add-circle': add, 'trash-bin-trash': trash, 'gallery-edit': edit,
  'text-field': text, upload, 'danger-circle': danger, box, card, 'users-group-rounded': users,
  palette, 'map-point': mapPoint, checklist, 'wallet-money': walletMoney, delivery,
  'camera-minimalistic': camera, 'music-note-2': music,
};

export const formatPrice = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);

export function SolarIcon({ name, ...props }) {
  return <Icon icon={icons[name]} aria-hidden="true" {...props} />;
}

export function SelectWrap({ children }) {
  return <span className="select-wrap">{children}<SolarIcon name="alt-arrow-down" /></span>;
}

export function Header() {
  const { cart, openCart } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => { setMenuOpen(false); setSearchOpen(false); }, [location.pathname, location.search, location.hash]);
  useEffect(() => {
    const close = (event) => { if (event.key === 'Escape') { setMenuOpen(false); setSearchOpen(false); } };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, []);

  function search(event) {
    event.preventDefault();
    navigate(`/shop${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`);
    setSearchOpen(false);
  }

  return <header className="site-header">
    <div className="container header-inner">
      <Link to="/" className="brand" aria-label="Dipi Floriest, Home">
        <img src="/assets/images/flower-logo.png" alt="" width="48" height="48" />
        <span>Dipi<span className="brand-script">Floriest</span></span>
      </Link>
      <nav aria-label="Navigasi utama" className={menuOpen ? 'main-nav is-open' : 'main-nav'}>
        <NavLink to="/" end>Home</NavLink>
        <Link to="/#services">Service</Link>
        <NavLink to="/shop">Shop</NavLink>
        <Link to="/#contact">Contact Us</Link>
      </nav>
      <div className="header-actions">
        <button type="button" className="icon-button" aria-label="Cari produk" title="Cari produk" aria-expanded={searchOpen} onClick={() => setSearchOpen(!searchOpen)}><SolarIcon name="magnifer" /></button>
        <button type="button" className="icon-button cart-button" aria-label={`Keranjang, ${cart.reduce((total, item) => total + item.quantity, 0)} produk`} title="Keranjang" onClick={openCart}>
          <SolarIcon name="bag-4" /><span className="cart-count">{cart.reduce((total, item) => total + item.quantity, 0)}</span>
        </button>
        <Link to="/products/prod-001#try-on" className="button button-small header-shop">Discuss with Me</Link>
        <button type="button" className="icon-button mobile-menu" aria-label="Menu" title="Menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><SolarIcon name={menuOpen ? 'close-circle' : 'hamburger-menu'} /></button>
      </div>
    </div>
    {searchOpen && <form className="header-search container" role="search" onSubmit={search}>
      <label htmlFor="header-query">Cari papan akrilik</label>
      <div className="search-input"><SolarIcon name="magnifer" /><input id="header-query" autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari warna bunga..." /><button className="button" type="submit">Cari</button></div>
    </form>}
  </header>;
}

export function Footer() {
  const { pathname } = useLocation();
  return <>
    {!/^\/(shop|products)/.test(pathname) && <section className="contact-section" id="contact" aria-labelledby="contact-title"><div className="container contact-card">
      <div className="contact-visual">
        <img src="/assets/images/flower.png" alt="" width="420" height="420" loading="lazy" />
        <p>Ikuti Kami :</p>
        <div className="contact-social">
          <a href="#contact" aria-label="Instagram"><SolarIcon name="camera-minimalistic" /></a>
          <a href="#contact" aria-label="Shopee"><SolarIcon name="bag-4" /></a>
          <a href="#contact" aria-label="TikTok"><SolarIcon name="music-note-2" /></a>
        </div>
      </div>
      <form className="contact-form" onSubmit={(event) => event.preventDefault()}>
        <p className="section-kicker">Contact Us</p>
        <h2 id="contact-title">YUK KONSULTASI SEKARANG!</h2>
        <p className="contact-intro">Kami siap membantu Anda! Silakan isi formulir di bawah ini untuk menghubungi tim kami. Kami akan merespons secepat mungkin.</p>
        <label>Nama Lengkap <abbr title="wajib">*</abbr><input name="name" required autoComplete="name" /></label>
        <label>Nomor Whatsapp <abbr title="wajib">*</abbr><input name="phone" type="tel" required autoComplete="tel" /></label>
        <label>Produk <abbr title="wajib">*</abbr><SelectWrap><select name="product" required defaultValue=""><option value="" disabled>Pilih Produk</option></select></SelectWrap></label>
        <label>Pesan<abbr title="wajib">*</abbr><textarea name="message" rows="3" placeholder="Input  Pesan" required /></label>
        <button type="submit" className="button button-wide">Kirim</button>
      </form>
    </div></section>}
    <footer className="site-footer" aria-label="Footer"><div className="container footer-inner">
      <Link className="brand" to="/"><img src="/assets/images/flower-logo.png" alt="" width="40" height="40" /><span>Dipi<span className="brand-script">Floriest</span></span></Link>
      <small>&copy; 2026 Dipi Floriest. All Rights Reserved</small>
    </div></footer>
  </>;
}

export function ProductImage({ src, alt, className = '', ...props }) {
  const [failed, setFailed] = useState(false);
  return failed
    ? <div role="status" className={`image-error ${className}`}>Gambar tidak dapat dimuat.</div>
    : <img className={className} src={src} alt={alt} onError={() => setFailed(true)} {...props} />;
}

export function ProductCard({ product }) {
  return <article className="product-card">
    <Link to={`/products/${product.id}`} className="product-photo" aria-label={`Lihat detail papan akrilik ${product.color}`}>
      <ProductImage src={product.imageUrl} alt={`Papan akrilik dengan bunga ${product.color.toLowerCase()}`} loading="lazy" width="480" height="480" />
      <span className="product-view"><SolarIcon name="eye" /> Lihat detail</span>
    </Link>
    <div className="product-caption"><span className="product-category">Acrylic Flower Board</span>
      <h3><Link to={`/products/${product.id}`}>{product.color}</Link></h3><p>{formatPrice(product.price)}</p>
    </div>
  </article>;
}

export function ResourceState({ loading, error, retry, empty }) {
  if (loading) return <div className="resource-state" role="status"><span className="spinner" /> Memuat produk...</div>;
  if (error) return <div className="resource-state" role="alert"><p>{error}</p><button type="button" className="button" onClick={retry}>Coba kembali</button></div>;
  if (empty) return <div className="resource-state"><p>Belum ada produk tersedia.</p><Link className="button" to="/shop">Kembali ke Shop</Link></div>;
  return null;
}

export function CartDialog({ open, onClose }) {
  const dialog = useRef(null);
  const { cart, setCart } = useApp();
  useEffect(() => {
    if (open) dialog.current.showModal();
    else dialog.current.close();
    const handleEscape = (event) => {
      if (open && event.key === 'Escape') { event.preventDefault(); onClose(); }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open]);
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  function changeQuantity(key, difference) {
    setCart((items) => items.map((item) => item.key === key ? { ...item, quantity: Math.max(1, item.quantity + difference) } : item));
  }
  return <dialog ref={dialog} className="cart-dialog" onCancel={onClose} onClose={onClose} aria-labelledby="cart-title" onClick={(event) => { if (event.target === dialog.current) onClose(); }}>
    <div className="dialog-heading"><h2 id="cart-title">Keranjang Anda</h2><button type="button" className="icon-button" aria-label="Tutup keranjang" title="Tutup" onClick={onClose}><SolarIcon name="close-circle" /></button></div>
    {cart.length === 0 ? <div className="cart-empty"><SolarIcon name="bag-4" width="48" height="48" /><p>Keranjang masih kosong.</p><Link className="button" to="/shop" onClick={onClose}>Pilih papan akrilik</Link></div> : <>
      <ul className="cart-items">{cart.map((item) => <li key={item.key}>
        <ProductImage src={item.variant.imageUrl} alt={item.variant.label} width="80" height="100" />
        <div className="cart-item-content"><h3>{item.product.name}</h3><p>{item.variant.code} · {item.variant.label}</p><strong>{formatPrice(item.product.price)}</strong>
          <div className="quantity"><button type="button" className="icon-button" title="Kurangi" aria-label={`Kurangi ${item.variant.label}`} disabled={item.quantity === 1} onClick={() => changeQuantity(item.key, -1)}><SolarIcon name="minus-circle" /></button><span aria-live="polite">{item.quantity}</span><button type="button" className="icon-button" title="Tambah" aria-label={`Tambah ${item.variant.label}`} onClick={() => changeQuantity(item.key, 1)}><SolarIcon name="add-circle" /></button></div>
        </div>
        <button type="button" className="icon-button" title="Hapus" aria-label={`Hapus ${item.variant.label}`} onClick={() => setCart((items) => items.filter((current) => current.key !== item.key))}><SolarIcon name="trash-bin-trash" /></button>
      </li>)}</ul>
      <div className="cart-total"><span>Total sementara</span><strong>{formatPrice(total)}</strong></div>
      <p className="muted">Pesanan belum dikirim. Checkout belum tersedia.</p>
      <Link className="button button-wide" to="/shop" onClick={onClose}>Lanjut pilih produk</Link>
    </>}
  </dialog>;
}

export function NotFound() {
  return <section className="container resource-state"><h1>Halaman tidak ditemukan</h1><Link className="button" to="/shop">Kembali ke Shop</Link></section>;
}