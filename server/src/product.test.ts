import { Product } from "./product.js";

describe("Product", () => {
  it("유효한 값으로 생성하면 상품이 만들어진다", () => {
    const product = new Product(1, "사과", 1000);

    expect(product).toMatchObject({ id: 1, name: "사과", price: 1000 });
  });

  it("상품명이 빈 문자열이면 에러를 던진다", () => {
    expect(() => new Product(1, "", 1000)).toThrow(
      "상품명은 1~100자여야 합니다"
    );
  });

  it("상품명이 100자를 초과하면 에러를 던진다", () => {
    expect(() => new Product(1, "a".repeat(101), 1000)).toThrow(
      "상품명은 1~100자여야 합니다"
    );
  });

  it("가격이 0이면 에러를 던진다", () => {
    expect(() => new Product(1, "사과", 0)).toThrow("가격은 0보다 커야 합니다");
  });

  it("가격이 음수이면 에러를 던진다", () => {
    expect(() => new Product(1, "사과", -1)).toThrow(
      "가격은 0보다 커야 합니다"
    );
  });
});
