import { Product } from "./product.js";
import { InMemoryProductRepository } from "./product.repository.js";

describe("InMemoryProductRepository", () => {
  let repository: InMemoryProductRepository;

  beforeEach(() => {
    repository = new InMemoryProductRepository();
  });

  it("상품을 저장하고 전체 조회할 수 있다", async () => {
    const product = new Product(1, "사과", 1000);
    await repository.save(product);

    expect(await repository.findAll()).toHaveLength(1);
    expect((await repository.findAll())[0]).toEqual(product);
  });

  it("상품을 삭제할 수 있다", async () => {
    const product = new Product(1, "사과", 1000);
    await repository.save(product);
    await repository.delete(1);

    expect(await repository.findAll()).toHaveLength(0);
  });

  it("존재하지 않는 상품을 삭제하면 에러를 던진다", async () => {
    await expect(repository.delete(999)).rejects.toThrow(
      "상품을 찾을 수 없습니다"
    );
  });

  it("count는 저장된 상품 수를 반환한다", async () => {
    await repository.save(new Product(1, "사과", 1000));
    await repository.save(new Product(2, "바나나", 500));

    expect(await repository.count()).toBe(2);
  });
});
