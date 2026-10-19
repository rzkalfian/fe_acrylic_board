import { validateCustomization } from "../domain/tryOn.js";
import { availableTypes, indexPrices, validateOrder } from "../domain/order.js";

export function createUseCases(
  productRepository,
  tryOnRepository,
  orderRepository,
) {
  return {
    getProducts: () => productRepository.getAll(),
    getProductDetail: (id) => productRepository.getById(id),
    async generateTryOn(input, signal) {
      validateCustomization(input);
      return tryOnRepository.generate(input, signal);
    },
    async getOrderTypes(productId) {
      const product = await orderRepository.getProduct(productId);
      return product ? availableTypes(product) : [];
    },
    async getCatalogPrices() {
      return indexPrices(await orderRepository.listProducts());
    },
    async placeOrder({
      productId,
      variant,
      type,
      quantity,
      customer,
      note,
      resultUrl,
    }) {
      validateOrder({ type, resultUrl, customer });
      return orderRepository.place({
        product_id: productId,
        order_type: type.value,
        variant_code: variant.code,
        quantity: Number(quantity),
        customer_name: customer.name.trim(),
        phone: customer.phone.trim(),
        address: customer.address.trim(),
        note,
        generated_image_url: type.needsText ? resultUrl : undefined,
        rent_start: type.rent ? customer.rentStart : undefined,
        rent_end: type.rent ? customer.rentEnd : undefined,
      });
    },
  };
}
