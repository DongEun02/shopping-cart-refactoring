import { Product } from "./product.js";

export class ProductService {
  private readonly products: Product[] = [];

  save({ name, price }: { name: string; price: number }): Product {
    const product = new Product(this.products.length + 1, name, price);
    this.products.push(product);
    return product;
  }

  findAll(): Product[] {
    return this.products;
  }

  delete(id: number): void {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error("상품을 찾을 수 없습니다");
    }
    this.products.splice(index, 1);
  }
}
