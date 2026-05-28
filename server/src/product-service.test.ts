import { ProductService } from "./product-service.js";

describe("ProductService", () => {
  let service: ProductService;

  beforeEach(() => {
    service = new ProductService();
  });

  describe("save", () => {
    it("상품을 추가하면 id가 부여된 상품을 반환한다", () => {
      const product = service.save({ name: "사과", price: 1000 });

      expect(product).toMatchObject({ name: "사과", price: 1000 });
      expect(product.id).toBeDefined();
    });

    it("유효하지 않으면 에러를 던진다", () => {
      expect(() => service.save({ name: "", price: 1000 })).toThrow();
    });
  });

  describe("findAll", () => {
    it("추가된 상품 목록을 반환한다", () => {
      service.save({ name: "사과", price: 1000 });
      service.save({ name: "바나나", price: 500 });

      expect(service.findAll()).toHaveLength(2);
    });

    it("상품이 없으면 빈 배열을 반환한다", () => {
      expect(service.findAll()).toEqual([]);
    });
  });

  describe("delete", () => {
    it("상품을 삭제하면 목록에서 사라진다", () => {
      const product = service.save({ name: "사과", price: 1000 });

      service.delete(product.id);

      expect(service.findAll()).toHaveLength(0);
    });

    it("존재하지 않는 상품을 삭제하면 에러를 던진다", () => {
      expect(() => service.delete(999)).toThrow("상품을 찾을 수 없습니다");
    });
  });
});
