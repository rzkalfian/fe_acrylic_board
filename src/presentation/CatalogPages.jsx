import { useDeferredValue } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ProductCard, ResourceState, SelectWrap, SolarIcon } from './components.jsx';
import { useProducts } from './hooks.js';

const services = [
  ['Baby Bloom', 'service-baby.png'], ['Wedding', 'service-merried.png'],
  ['Greeting Card', 'service-card.png'], ['Birthday', 'service-birthday.png'],
  ['Graduation', 'service-flower.png'],
];

const steps = [
  ['magnifer', 'Jelajahi berbagai koleksi buket bunga segar dan pilih yang sesuai dengan momen Anda.'],
  ['palette', 'Sesuaikan tipe warna, model bunga, dan sesuaikan penerapannya sesuai kebutuhan Anda.'],
  ['map-point', 'Masukkan alamat tujuan lengkap serta jadwal tanggal pengiriman yang diinginkan.'],
  ['checklist', 'Periksa kembali detail pesanan Anda sebelum melanjutkan ke proses pembayaran.'],
  ['wallet-money', 'Lakukan pembayaran dengan mudah dan konfirmasikan transaksi Anda.'],
  ['delivery', 'Rangkaian bunga indah siap dikirimkan tepat waktu ke tangan orang terkasih.'],
];

export function HomePage() {
  const resource = useProducts();
  return <div className="catalog-page home-page">
    <section className="home-hero">
      <div className="container hero-content">
        <h1 className="hero-greeting"><span>Hello,</span> <span>Flowriest</span></h1>
        <p className="hero-description">Nikmati layanan pengiriman rangkaian bunga segar bernuansa pastel yang anggun, romantis, serta memukau untuk melengkapi setiap momen kebahagiaan Anda.</p>
        <div className="hero-cta"><Link to="/products/prod-001#try-on" className="button">Discuss with Me</Link><Link to="/shop" className="text-link">Pesan Sekarang <SolarIcon name="arrow-right" /></Link></div>
      </div>
      <div className="container mt-8 hero-services">
        <div><SolarIcon name="box" /><span>Kotak Kejutan<small>Selipkan manis dalam setiap kotak bunga eksklusif.</small></span></div>
        <div><SolarIcon name="card" /><span>Cerita Indah<small>Ungkapkan kisah berharga lewat rangkaian bunga terbaik.</small></span></div>
        <div><SolarIcon name="users-group-rounded" /><span>Merangkai Cinta<small>Ketulusan cinta dirangkai indah untuk orang spesial.</small></span></div>
      </div>
    </section>
    <section className="specialities" id="services"><div className="container">
      <p className="section-kicker">SERVICES</p><h2>Gift <strong>Specialities</strong></h2>
      <p className="specialities-intro">Menghadirkan rangkaian bunga segar pilihan dengan sentuhan desain kreatif, ketelitian tingkat tinggi, dan dedikasi penuh untuk momen berharga Anda.</p>
      <div className="service-list">{services.map(([name, image]) => <Link key={name} to="/shop"><span className="service-icon"><img src={`/assets/icons/${image}`} alt="" width="52" height="52" /></span><span>{name}</span></Link>)}</div>
    </div></section>
    <section className="happiness" id="about"><div className="container happiness-inner">
      <ProductImageAbout />
      <div className="happiness-copy"><h2>Flowriest <span>As Another Level</span><br />of Happiness</h2><p>Every floral arrangement is thoughtfully crafted using fresh, premium blooms and a deep artistic passion. We strive to deliver pure joy, elegance, and heartfelt emotions straight to your doorstep for every memorable milestone.</p><p>Whether you are celebrating a special occasion or expressing your quiet affection, our curated designs turn ordinary moments into unforgettable memories that speak louder than words.</p></div>
    </div></section>
    <section className="catalog-section container" id="best-seller">
      <div className="catalog-head"><h2>Product <strong>List</strong></h2><p>Kumpulan mahakarya bunga segar terbaik yang siap menemani hari-hari penuh cinta dan kebahagiaan Anda.</p></div>
      <div className="catalog-panel">
        <p className="section-kicker">PRODUCT</p>
        <ResourceState {...resource} empty={resource.data?.length === 0} />
        {resource.data?.length > 0 && <div className="product-grid">{resource.data.slice(0, 6).map((product) => <ProductCard product={product} key={product.id} />)}</div>}
        <div className="catalog-foot"><p className="catalog-notice">Katalog contoh · Harga mengacu pada data mock.</p><Link to="/shop" className="text-link">Lihat Selengkapnya <SolarIcon name="arrow-right" /></Link></div>
      </div>
    </section>
    <section className="closing-banner"><div className="container"><div className="steps-copy">
      <h2>Step by Step Order <strong>Dipi Flowriest</strong></h2>
      <p>Ikuti langkah mudah berikut untuk memesan rangkaian bunga impian Anda dengan cepat, aman, dan nyaman.</p>
      <ol className="steps-grid">{steps.map(([icon, text], index) => <li key={icon}><span className="step-icon"><SolarIcon name={icon} /></span><h3>Step {index + 1}</h3><p>{text}</p></li>)}</ol>
    </div><img src="/assets/images/car-flower.png" alt="" width="640" height="480" loading="lazy" /></div></section>
  </div>;
}

function ProductImageAbout() {
  return <img className="happiness-image" src="/assets/images/example.jpg" alt="Bunga dan buket di toko bunga" width="736" height="981" loading="lazy" />;
}

export function ShopPage() {
  const resource = useProducts();
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const deferredQuery = useDeferredValue(query);
  const color = params.get('color') ?? '';
  const sort = params.get('sort') ?? 'default';
  const filtered = (resource.data ?? []).filter((product) => product.name.toLowerCase().includes(deferredQuery.toLowerCase()) && (!color || product.color === color));
  if (sort === 'az') filtered.sort((first, second) => first.color.localeCompare(second.color));
  if (sort === 'za') filtered.sort((first, second) => second.color.localeCompare(first.color));
  const pages = Math.max(1, Math.ceil(filtered.length / 9));
  const pageNumber = Math.min(pages, Math.max(1, Number(params.get('page')) || 1));
  const visible = filtered.slice((pageNumber - 1) * 9, pageNumber * 9);

  function update(name, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(name, value); else next.delete(name);
    if (name !== 'page') next.delete('page');
    setParams(next, { replace: name === 'q' });
  }

  return <div className="catalog-page shop-page">
    <section className="shop-banner"><div className="container"><h1 className="script">Flowriest <span>Lovers</span></h1><p>Kumpulan mahakarya bunga segar terbaik yang siap menemani hari-hari penuh cinta dan kebahagiaan Anda.</p><p>Jelajahi koleksi rangkaian bunga pilihan kami, dirancang khusus untuk memperindah momen spesial dan berharga Anda.</p></div></section>
    <section className="container shop-catalog">
      <div className="shop-title"><div><h2>Product <strong>List</strong></h2><p>Kumpulan mahakarya bunga segar terbaik yang siap menemani hari-hari penuh cinta dan kebahagiaan Anda.</p></div><span className="result-count" aria-live="polite">{resource.data ? `${filtered.length} produk` : 'Memuat...'}</span></div>
      <div className="shop-filters">
        <div className="filter-search"><label className="sr-only" htmlFor="product-search">Cari warna produk</label><SolarIcon name="magnifer" /><input id="product-search" type="search" placeholder="Cari warna produk..." value={query} onChange={(event) => update('q', event.target.value)} /></div>
        <div className="filter-select"><label htmlFor="color-filter">Warna</label><SelectWrap><select id="color-filter" value={color} onChange={(event) => update('color', event.target.value)}><option value="">Semua warna</option>{resource.data?.map((product) => <option value={product.color} key={product.id}>{product.color}</option>)}</select></SelectWrap></div>
        <div className="filter-select"><label htmlFor="sort-filter">Urutkan</label><SelectWrap><select id="sort-filter" value={sort} onChange={(event) => update('sort', event.target.value)}><option value="default">Pilihan katalog</option><option value="az">Nama A-Z</option><option value="za">Nama Z-A</option></select></SelectWrap></div>
      </div>
      <p className="catalog-notice">Katalog contoh · Harga mengacu pada data mock.</p>
      <ResourceState {...resource} />
      {!resource.loading && !resource.error && visible.length === 0 && <div className="resource-state"><h3>Tidak ada produk yang cocok.</h3><p>Coba warna lain atau hapus filter pencarian.</p><button className="button" onClick={() => setParams({})}>Hapus filter</button></div>}
      <div className="product-grid">{visible.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      {filtered.length > 9 && <nav className="pagination" aria-label="Halaman katalog">
        <button className="icon-button" type="button" title="Halaman sebelumnya" aria-label="Halaman sebelumnya" disabled={pageNumber === 1} onClick={() => update('page', String(pageNumber - 1))}><SolarIcon name="alt-arrow-left" /></button>
        {Array.from({ length: pages }, (_, index) => <button type="button" key={index} aria-label={`Halaman ${index + 1}`} aria-current={pageNumber === index + 1 ? 'page' : undefined} onClick={() => update('page', String(index + 1))}>{index + 1}</button>)}
        <button className="icon-button" type="button" title="Halaman berikutnya" aria-label="Halaman berikutnya" disabled={pageNumber === pages} onClick={() => update('page', String(pageNumber + 1))}><SolarIcon name="alt-arrow-right" /></button>
      </nav>}
    </section>
  </div>;
}