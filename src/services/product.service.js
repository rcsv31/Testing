import productRepository from "../repositories/product.repository.js";

class ProductService {
  async getProducts(filter = {}, options = {}) {
    return await productRepository.getProducts(filter, options);
  }

  async addProduct(productData) {
    return await productRepository.addProduct(productData);
  }

  async getProductById(productId) {
    return await productRepository.getProductById(productId);
  }

  async updateProduct(productId, productData) {
    return await productRepository.updateProduct(productId, productData);
  }

  async deleteProduct(productId) {
    return await productRepository.deleteProduct(productId);
  }
}

export default new ProductService();
