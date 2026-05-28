export class Product {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly price: number
  ) {
    if (typeof name !== "string" || name.length === 0 || name.length > 100) {
      throw new Error("상품명은 1~100자여야 합니다");
    }
    if (typeof price !== "number" || price <= 0) {
      throw new Error("가격은 0보다 커야 합니다");
    }
  }
}
