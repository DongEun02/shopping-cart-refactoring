import request from "supertest";
import { app } from "./app.js";

const clearProducts = async () => {
  const res = await request(app).get("/products");
  for (const product of res.body) {
    await request(app).delete(`/products/${product.id}`);
  }
};

describe("GET /products", () => {
  afterEach(clearProducts);

  it("상품 목록을 반환한다", async () => {
    await request(app).post("/products").send({ name: "사과", price: 1000 });
    await request(app).post("/products").send({ name: "바나나", price: 500 });

    const response = await request(app).get("/products");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });
});

describe("POST /products", () => {
  afterEach(clearProducts);

  it("상품을 추가하면 201과 생성된 상품을 반환한다", async () => {
    const response = await request(app)
      .post("/products")
      .send({ name: "사과", price: 1000 });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ name: "사과", price: 1000 });
    expect(response.body.id).toBeDefined();
  });

  it("상품명이 빈 문자열이면 400을 반환한다", async () => {
    const response = await request(app)
      .post("/products")
      .send({ name: "", price: 1000 });

    expect(response.status).toBe(400);
  });

  it("상품명이 100자를 초과하면 400을 반환한다", async () => {
    const response = await request(app)
      .post("/products")
      .send({ name: "a".repeat(101), price: 1000 });

    expect(response.status).toBe(400);
  });

  it("가격이 0이면 400을 반환한다", async () => {
    const response = await request(app)
      .post("/products")
      .send({ name: "사과", price: 0 });

    expect(response.status).toBe(400);
  });

  it("가격이 음수이면 400을 반환한다", async () => {
    const response = await request(app)
      .post("/products")
      .send({ name: "사과", price: -1 });

    expect(response.status).toBe(400);
  });
});

describe("DELETE /products/:id", () => {
  afterEach(clearProducts);

  it("상품을 삭제하면 204를 반환한다", async () => {
    const created = await request(app)
      .post("/products")
      .send({ name: "사과", price: 1000 });

    const response = await request(app).delete(`/products/${created.body.id}`);

    expect(response.status).toBe(204);
  });

  it("삭제 후 목록에서 사라진다", async () => {
    const created = await request(app)
      .post("/products")
      .send({ name: "사과", price: 1000 });

    await request(app).delete(`/products/${created.body.id}`);

    const response = await request(app).get("/products");
    expect(response.body).toHaveLength(0);
  });

  it("존재하지 않는 상품을 삭제하면 404를 반환한다", async () => {
    const response = await request(app).delete("/products/999");

    expect(response.status).toBe(404);
  });
});
