import express from "express";
import { InMemoryProductRepository, SupabaseProductRepository } from "./product.repository.js";
import { ProductService } from "./product-service.js";

export const app = express();
app.use(express.json());

const repository = process.env.USE_SUPABASE === "true"
  ? new SupabaseProductRepository()
  : new InMemoryProductRepository();

const productService = new ProductService(repository);

// 상품 목록 조회
app.get("/products", async (req, res) => {
  res.status(200).json(await productService.findAll());
});

// 상품 추가
app.post("/products", async (req, res) => {
  const { name, price } = req.body;

  try {
    const product = await productService.save({ name, price });
    res.status(201).json(product);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
});

// 상품 삭제
app.delete("/products/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    await productService.delete(id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
});
