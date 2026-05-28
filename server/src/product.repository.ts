import { createClient } from "@supabase/supabase-js";
import { Product } from "./product.js";

export interface ProductRepository {
  save(product: Product): Promise<void>;
  findAll(): Promise<Product[]>;
  delete(id: number): Promise<void>;
  count(): Promise<number>;
}

export class InMemoryProductRepository implements ProductRepository {
  private readonly products: Product[] = [];

  async save(product: Product): Promise<void> {
    this.products.push(product);
  }

  async findAll(): Promise<Product[]> {
    return this.products;
  }

  async delete(id: number): Promise<void> {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("상품을 찾을 수 없습니다");
    this.products.splice(index, 1);
  }

  async count(): Promise<number> {
    return this.products.length;
  }
}

export class SupabaseProductRepository implements ProductRepository {
  private readonly client;

  constructor() {
    this.client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );
  }

  async save(product: Product): Promise<void> {
    await this.client
      .from("products")
      .insert({ id: product.id, name: product.name, price: product.price });
  }

  async findAll(): Promise<Product[]> {
    const { data } = await this.client.from("products").select("*").order("id");
    return (data ?? []).map((row) => new Product(row.id, row.name, row.price));
  }

  async delete(id: number): Promise<void> {
    const { data } = await this.client
      .from("products")
      .select("id")
      .eq("id", id)
      .single();
    if (!data) throw new Error("상품을 찾을 수 없습니다");
    await this.client.from("products").delete().eq("id", id);
  }

  async count(): Promise<number> {
    const { count } = await this.client
      .from("products")
      .select("*", { count: "exact", head: true });
    return count ?? 0;
  }
}
