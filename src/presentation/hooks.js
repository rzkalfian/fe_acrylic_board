import { useEffect, useRef, useState } from "react";
import { useApp } from "./context.jsx";
import { emptyCustomization } from "../domain/tryOn.js";

export function useProducts(id) {
  const { useCases } = useApp();
  const [resource, setResource] = useState({
    data: null,
    loading: true,
    error: "",
  });
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    setResource({ data: null, loading: true, error: "" });
    const task = id ? useCases.getProductDetail(id) : useCases.getProducts();
    task
      .then((data) => {
        if (active) setResource({ data, loading: false, error: "" });
      })
      .catch(() => {
        if (active)
          setResource({
            data: null,
            loading: false,
            error: "Produk belum berhasil dimuat.",
          });
      });
    return () => {
      active = false;
    };
  }, [id, revision, useCases]);
  return { ...resource, retry: () => setRevision((value) => value + 1) };
}

export function useTryOn(product) {
  const { useCases } = useApp();
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [fields, setFields] = useState({ ...emptyCustomization });
  const [file, setFile] = useState(null);
  const [methodType, setMethodType] = useState("FORM");
  const [generatedResultUrl, setGeneratedResultUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const controller = useRef(null);

  useEffect(() => () => controller.current?.abort(), []);

  function invalidate() {
    controller.current?.abort();
    controller.current = null;
    setIsLoading(false);
    setGeneratedResultUrl(null);
    setError("");
  }

  function selectVariant(variant) {
    invalidate();
    setSelectedVariant(variant);
  }

  function updateField(name, value) {
    invalidate();
    setFields((current) => ({ ...current, [name]: value }));
    setMethodType("FORM");
  }

  function chooseFile(nextFile) {
    invalidate();
    setFile(nextFile);
    setMethodType(nextFile ? "IMAGE_UPLOAD" : "FORM");
  }

  function switchMethod(method) {
    invalidate();
    setMethodType(method);
  }

  async function generate(event) {
    event.preventDefault();
    if (isLoading) return;
    const request = new AbortController();
    controller.current = request;
    setError("");
    setIsLoading(true);
    try {
      const url = await useCases.generateTryOn(
        { variant: selectedVariant, methodType, fields, file },
        request.signal,
      );
      if (!request.signal.aborted) setGeneratedResultUrl(url);
    } catch (failure) {
      if (!request.signal.aborted)
        setError(
          failure instanceof TypeError
            ? "Layanan AI tidak dapat dihubungi. Silakan coba kembali."
            : failure.message,
        );
    } finally {
      if (!request.signal.aborted) {
        setIsLoading(false);
        controller.current = null;
      }
    }
  }

  return {
    selectedVariant,
    selectVariant,
    fields,
    updateField,
    file,
    chooseFile,
    methodType,
    switchMethod,
    generatedResultUrl,
    isLoading,
    error,
    generate,
  };
}

export function useOrderTypes(productId) {
  const { useCases } = useApp();
  const [state, setState] = useState({ types: null, loading: true, error: "" });
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    setState({ types: null, loading: true, error: "" });
    useCases
      .getOrderTypes(productId)
      .then((types) => active && setState({ types, loading: false, error: "" }))
      .catch(
        (failure) =>
          active &&
          setState({
            types: null,
            loading: false,
            error:
              failure instanceof TypeError
                ? "Server harga tidak dapat dihubungi. Silakan coba lagi."
                : failure.message,
          }),
      );
    return () => {
      active = false;
    };
  }, [productId, revision, useCases]);
  return { ...state, retry: () => setRevision((value) => value + 1) };
}
