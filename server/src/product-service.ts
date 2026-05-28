import { Product } from "./product.js";
import { ProductRepository } from "./product.repository.js";

export class ProductService {
  constructor(private readonly repository: ProductRepository) {}

  async save({
    name,
    price,
  }: {
    name: string;
    price: number;
  }): Promise<Product> {
    const id = (await this.repository.count()) + 1;
    const product = new Product(id, name, price);
    await this.repository.save(product);
    return product;
  }

  async findAll(): Promise<Product[]> {
    return this.repository.findAll();
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
