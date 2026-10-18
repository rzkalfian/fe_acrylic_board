import { validateCustomization } from "../domain/tryOn.js";

export function createUseCases(productRepository, tryOnRepository) {
  return {
    getProducts: () => productRepository.getAll(),
    getProductDetail: (id) => productRepository.getById(id),
    async generateTryOn(input, signal) {
      validateCustomization(input);
      return tryOnRepository.generate(input, signal);
    },
  };
}
