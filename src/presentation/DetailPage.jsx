import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { useProducts, useTryOn } from "./hooks.js";
import {
  formatPrice,
  ProductImage,
  ResourceState,
  SelectWrap,
  SolarIcon,
} from "./components.jsx";
import {
  buildOrderMessage,
  fontOptions,
  sizeOptions,
  styleOptions,
} from "../domain/tryOn.js";

const shopWhatsapp = (import.meta.env.VITE_SHOP_WHATSAPP || "").replace(
  /\D/g,
  "",
);

function OrderForm({ product, variant, fields, resultUrl }) {
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    quantity: 1,
    note: "",
  });
  const [error, setError] = useState("");
  const set = (name) => (event) =>
    setCustomer((current) => ({ ...current, [name]: event.target.value }));
  const total = product.price * (Number(customer.quantity) || 0);

  function submit(event) {
    event.preventDefault();
    if (!shopWhatsapp)
      return setError("Nomor WhatsApp toko belum diatur (VITE_SHOP_WHATSAPP).");
    const message = buildOrderMessage({
      product,
      variant,
      fields,
      resultUrl: new URL(resultUrl, window.location.href).href,
      customer,
      formatPrice,
    });
    window.open(
      `https://wa.me/${shopWhatsapp}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <section className="order-section" id="order" aria-labelledby="order-title">
      <h2 id="order-title">
        <strong>PESAN</strong> SESUAI TRY ON
      </h2>
      <div className="order-grid">
        <div className="order-summary">
          <ProductImage
            key={resultUrl}
            src={resultUrl}
            alt="Hasil Try On yang dipesan"
            width="320"
            height="320"
          />
          <p>
            {product.name}
            <br />
            {variant.code} · {variant.label}
          </p>
          <strong>{formatPrice(total)}</strong>
        </div>
        <form className="try-on-form order-form" onSubmit={submit}>
          <div className="form-fields">
            <label>
              Nama Lengkap
              <abbr className="required" title="wajib diisi">
                {" "}
                *
              </abbr>
              <input
                required
                maxLength="120"
                autoComplete="name"
                value={customer.name}
                onChange={set("name")}
              />
            </label>
            <label>
              Nomor WhatsApp
              <abbr className="required" title="wajib diisi">
                {" "}
                *
              </abbr>
              <input
                required
                type="tel"
                maxLength="20"
                autoComplete="tel"
                value={customer.phone}
                onChange={set("phone")}
              />
            </label>
            <label className="full-width">
              Alamat Pengiriman
              <abbr className="required" title="wajib diisi">
                {" "}
                *
              </abbr>
              <textarea
                required
                rows="2"
                maxLength="300"
                autoComplete="street-address"
                value={customer.address}
                onChange={set("address")}
              />
            </label>
            <label>
              Jumlah
              <input
                type="number"
                min="1"
                max="99"
                required
                value={customer.quantity}
                onChange={set("quantity")}
              />
            </label>
            <label>
              Catatan (Opsional)
              <input
                maxLength="200"
                value={customer.note}
                onChange={set("note")}
              />
            </label>
          </div>
          {error && (
            <p className="form-error" role="alert">
              <SolarIcon name="danger-circle" /> {error}
            </p>
          )}
          <button type="submit" className="button button-wide">
            <SolarIcon name="bag-4" /> Pesan via WhatsApp
          </button>
        </form>
      </div>
    </section>
  );
}

function FieldTools({ name, label, fields, updateField }) {
  const controls = [
    ["font", "Font", fontOptions],
    ["style", "Gaya", styleOptions],
    ["size", "Ukuran", sizeOptions],
  ];
  return (
    <span className="field-tools">
      {controls.map(([kind, title, options]) => (
        <SelectWrap key={kind}>
          <select
            className="font-select"
            aria-label={`${title} ${label}`}
            value={fields[`${name}_${kind}`]}
            onChange={(event) =>
              updateField(`${name}_${kind}`, event.target.value)
            }
          >
            {options.map(([value, text]) => (
              <option value={value} key={value}>
                {text}
              </option>
            ))}
          </select>
        </SelectWrap>
      ))}
    </span>
  );
}

export function DetailPage() {
  const { id } = useParams();
  const resource = useProducts(id);
  if (resource.loading || resource.error)
    return (
      <div className="container">
        <ResourceState {...resource} />
      </div>
    );
  if (!resource.data)
    return (
      <section className="container resource-state">
        <h1>Produk tidak ditemukan</h1>
        <Link className="button" to="/shop">
          Kembali ke Shop
        </Link>
      </section>
    );
  return <ProductDetail key={id} product={resource.data} />;
}

function ProductDetail({ product }) {
  const tryOn = useTryOn(product);
  const {
    selectedVariant,
    selectVariant,
    fields,
    updateField,
    methodType,
    switchMethod,
    file,
    chooseFile,
    isLoading,
    generatedResultUrl,
    error,
    generate,
  } = tryOn;
  const required = methodType === "FORM";
  const preview = generatedResultUrl || selectedVariant.imageUrl;

  return (
    <div className="catalog-page detail-wrap">
      <div className="detail-page container">
        <section className="product-detail">
          <div className="main-gallery">
            <div className="gallery-thumbnails">
              {product.variants.slice(0, 4).map((variant) => (
                <button
                  className={
                    variant.code === selectedVariant.code
                      ? "gallery-thumbnail selected"
                      : "gallery-thumbnail"
                  }
                  key={variant.code}
                  type="button"
                  aria-label={`Preview ${variant.code}, ${variant.label}`}
                  aria-pressed={variant.code === selectedVariant.code}
                  onClick={() => selectVariant(variant)}
                >
                  <ProductImage
                    src={variant.imageUrl}
                    alt=""
                    width="68"
                    height="80"
                  />
                </button>
              ))}
            </div>
            <div className="main-image">
              <ProductImage
                key={selectedVariant.imageUrl}
                src={selectedVariant.imageUrl}
                alt={`Papan akrilik ${selectedVariant.label}`}
                width="640"
                height="640"
                data-testid="main-product-image"
              />
            </div>
          </div>
          <div className="product-info">
            <h1>
              Papan Akrilik Greeting<span>Warna {product.color}</span>
            </h1>
            <p className="product-price">{formatPrice(product.price)}</p>
            <p className="product-description">{product.description}</p>
            <div className="variant-list">
              {product.variants.map((variant) => (
                <button
                  key={variant.code}
                  type="button"
                  className={
                    selectedVariant.code === variant.code
                      ? "variant selected"
                      : "variant"
                  }
                  aria-label={`Pilih ${variant.code}, ${variant.label}`}
                  aria-pressed={selectedVariant.code === variant.code}
                  onClick={() => selectVariant(variant)}
                >
                  <ProductImage
                    src={variant.imageUrl}
                    alt=""
                    width="70"
                    height="70"
                  />
                  <span>{variant.code}</span>
                </button>
              ))}
            </div>
            <div className="product-actions">
              <a
                className="button"
                href={generatedResultUrl ? "#order" : "#try-on"}
              >
                <SolarIcon name="bag-4" /> Pesan Sekarang
              </a>
            </div>
          </div>
        </section>
        <section className="try-on-section" id="try-on">
          <div className="try-on-heading">
            <h2>
              <strong>TRY ON</strong> PRODUCT
            </h2>
          </div>
          <div className="try-on-grid">
            <div className="try-on-preview">
              <div className="preview-frame" aria-busy={isLoading}>
                <ProductImage
                  key={preview}
                  src={preview}
                  alt={
                    generatedResultUrl
                      ? "Hasil visualisasi AI papan akrilik"
                      : `Sampel papan akrilik ${selectedVariant.label}`
                  }
                  width="640"
                  height="640"
                  className={generatedResultUrl ? "result-image" : ""}
                  data-testid="try-on-image"
                />
                {isLoading && (
                  <div className="preview-loading" role="status">
                    <span className="spinner" />
                    <span>Menyiapkan visualisasi Anda...</span>
                  </div>
                )}
                <span className="preview-label">
                  {generatedResultUrl
                    ? "Hasil AI"
                    : `Sampel ${selectedVariant.code}`}
                </span>
              </div>
              <p className="preview-caption" aria-live="polite">
                {generatedResultUrl
                  ? "Visualisasi ucapan Anda"
                  : "Pilih Gambar dan Lihat Hasil Disini"}
              </p>
            </div>
            <form className="try-on-form" onSubmit={generate}>
              <div className="form-heading">
                <SolarIcon name="gallery-edit" />
                <div>
                  <h3>AI Image Review</h3>
                  <p>Sesuaikan papan untuk ucapan Anda.</p>
                </div>
              </div>
              {/* Tab pilihan metode dinonaktifkan sementara (fokus ke Form Input); aktifkan lagi bersama upload gambar.
          <div className="method-tabs" aria-label="Metode kustomisasi"><button type="button" aria-pressed={methodType === 'FORM'} onClick={() => switchMethod('FORM')}><SolarIcon name="text-field" /> Form Input</button><button type="button" aria-pressed={methodType === 'IMAGE_UPLOAD'} onClick={() => switchMethod('IMAGE_UPLOAD')}><SolarIcon name="upload" /> Upload Image</button></div>
          */}
              <div className="form-fields">
                <label>
                  <span>
                    Ucapan / Selamat
                    {required && (
                      <abbr className="required" title="wajib diisi">
                        {" "}
                        *
                      </abbr>
                    )}
                  </span>
                  <input
                    name="ucapan_selamat"
                    placeholder="Selamat atas momen istimewa Anda"
                    required={required}
                    maxLength="120"
                    value={fields.ucapan_selamat}
                    onChange={(event) =>
                      updateField("ucapan_selamat", event.target.value)
                    }
                  />
                  <FieldTools
                    name="ucapan_selamat"
                    label="Ucapan"
                    fields={fields}
                    updateField={updateField}
                  />
                </label>
                <label>
                  Tambahan (Opsional)
                  <input
                    name="tambahan"
                    placeholder="Tambahan ucapan"
                    maxLength="120"
                    value={fields.tambahan}
                    onChange={(event) =>
                      updateField("tambahan", event.target.value)
                    }
                  />
                  <FieldTools
                    name="tambahan"
                    label="Tambahan"
                    fields={fields}
                    updateField={updateField}
                  />
                </label>
                <label className="full-width">
                  <span>
                    Pesan
                    {required && (
                      <abbr className="required" title="wajib diisi">
                        {" "}
                        *
                      </abbr>
                    )}
                  </span>
                  <textarea
                    name="pesan"
                    placeholder="Tulis pesan Anda"
                    required={required}
                    rows="2"
                    maxLength="500"
                    value={fields.pesan}
                    onChange={(event) =>
                      updateField("pesan", event.target.value)
                    }
                  />
                  <FieldTools
                    name="pesan"
                    label="Pesan"
                    fields={fields}
                    updateField={updateField}
                  />
                </label>
                <label>
                  <span>
                    Kepada (Nama)
                    {required && (
                      <abbr className="required" title="wajib diisi">
                        {" "}
                        *
                      </abbr>
                    )}
                  </span>
                  <input
                    name="kepada"
                    placeholder="Nama penerima"
                    required={required}
                    maxLength="120"
                    value={fields.kepada}
                    onChange={(event) =>
                      updateField("kepada", event.target.value)
                    }
                  />
                  <FieldTools
                    name="kepada"
                    label="Kepada"
                    fields={fields}
                    updateField={updateField}
                  />
                </label>
                <label>
                  <span>
                    Dari
                    {required && (
                      <abbr className="required" title="wajib diisi">
                        {" "}
                        *
                      </abbr>
                    )}
                  </span>
                  <input
                    name="dari"
                    placeholder="Nama pengirim"
                    required={required}
                    maxLength="120"
                    value={fields.dari}
                    onChange={(event) =>
                      updateField("dari", event.target.value)
                    }
                  />
                  <FieldTools
                    name="dari"
                    label="Dari"
                    fields={fields}
                    updateField={updateField}
                  />
                </label>
                <label>
                  Atribut (Opsional)
                  <SelectWrap>
                    <select
                      name="atribut"
                      value={fields.atribut}
                      onChange={(event) =>
                        updateField("atribut", event.target.value)
                      }
                    >
                      <option value="">Pilih atribut</option>
                      <option value="floral">Floral</option>
                      <option value="minimal">Minimal</option>
                    </select>
                  </SelectWrap>
                </label>
                <label>
                  Posisi (Opsional)
                  <SelectWrap>
                    <select
                      name="posisi"
                      value={fields.posisi}
                      onChange={(event) =>
                        updateField("posisi", event.target.value)
                      }
                    >
                      <option value="">Pilih posisi</option>
                      <option value="center">Tengah</option>
                      <option value="balanced">Seimbang</option>
                    </select>
                  </SelectWrap>
                </label>
              </div>
              {/* Upload gambar dinonaktifkan sementara.
          <div className={methodType === 'IMAGE_UPLOAD' ? 'upload-field active-upload' : 'upload-field'}><label htmlFor="custom-image"><SolarIcon name="upload" /> Upload desain <span>(PNG, JPG, WebP · maks. 10 MB)</span></label><input id="custom-image" name="overlay_image" type="file" accept="image/png,image/jpeg,image/webp" required={methodType === 'IMAGE_UPLOAD'} onChange={(event) => chooseFile(event.target.files?.[0] ?? null)} />{file && <p className="upload-filename">{file.name}</p>}</div>
          */}
              {error && (
                <p className="form-error" role="alert">
                  <SolarIcon name="danger-circle" /> {error}
                </p>
              )}
              <button
                type="submit"
                className="button button-wide"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner" /> Generating...
                  </>
                ) : (
                  <>
                    <SolarIcon name="gallery-edit" /> Generate Image
                  </>
                )}
              </button>
              {generatedResultUrl && (
                <a
                  className="text-link result-link"
                  href={generatedResultUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SolarIcon name="gallery" /> Buka hasil gambar
                </a>
              )}
            </form>
          </div>
        </section>
        {generatedResultUrl && (
          <OrderForm
            product={product}
            variant={selectedVariant}
            fields={fields}
            resultUrl={generatedResultUrl}
          />
        )}
      </div>
    </div>
  );
}
