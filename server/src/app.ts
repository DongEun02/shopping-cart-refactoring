import express from "express";

export const app = express();
app.use(express.json());

interface Product {
  id: number;
  name: string;
  price: number;
}

const products: Product[] = [];

// 상품 목록 조회
app.get("/products", (req, res) => {
  res.status(200).json(products);
});

// 상품 추가
app.post("/products", (req, res) => {
  const { name, price } = req.body;
  if (typeof name !== "string" || name.length === 0 || name.length > 100) {
    return res.status(400).json({ message: "상품명은 1~100자여야 합니다" });
  }
  if (typeof price !== "number" || price <= 0) {
    return res.status(400).json({ message: "가격은 0보다 커야 합니다" });
  }
  const product = { id: products.length + 1, name, price };
  products.push(product);
  res.status(201).json(product);
});

// 상품 삭제
app.delete("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = products.findIndex((product) => product.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "상품을 찾을 수 없습니다" });
  }
  products.splice(index, 1);
  res.status(204).send();
});
