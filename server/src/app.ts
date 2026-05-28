import express from "express";
import { ProductService } from "./product-service.js";

export const app = express();
app.use(express.json());

const productService = new ProductService();

// 상품 목록 조회
app.get("/products", (req, res) => {
  res.status(200).json(productService.findAll());
});

// 상품 추가
app.post("/products", (req, res) => {
  const { name, price } = req.body;

  try {
    const product = productService.save({ name, price });
    res.status(201).json(product);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
});

// 상품 삭제
app.delete("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  try {
    productService.delete(id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
});
