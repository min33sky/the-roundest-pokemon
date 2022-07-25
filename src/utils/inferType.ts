/**
 * ## 비동기 함수의 ReturnType을 가져오기
 */
export type AsyncReturnType<T extends (...args: any) => Promise<any>> =
  T extends (...args: any) => Promise<infer R> ? R : any;
