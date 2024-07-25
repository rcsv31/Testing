export class CreateCartDTO {
  constructor({ products }) {
    this.products = products;
  }
}

export class UpdateCartDTO {
  constructor({ products }) {
    this.products = products;
  }
}

export class AddProductToCartDTO {
  constructor({ product, quantity }) {
    this.product = product;
    this.quantity = quantity;
  }
}

export class DeleteProductByIdDTO {
  constructor({ productId }) {
    this.productId = productId;
  }
}

export class PurchaseCartDTO {
  constructor({
    userId,
    cartId,
    products,
    shippingAddress,
    billingAddress,
    paymentMethod,
    total,
    items,
  }) {
    this.userId = userId;
    this.cartId = cartId;
    this.products = products;
    this.shippingAddress = shippingAddress;
    this.billingAddress = billingAddress;
    this.paymentMethod = paymentMethod;
    this.total = total;
    this.items = items;
  }
}
