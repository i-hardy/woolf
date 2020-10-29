/* eslint-disable @typescript-eslint/no-explicit-any */
interface Memoizable<T> extends TypedPropertyDescriptor<T> {
  cache?: Map<string, unknown>;
}

interface MemoizableFunction {
  (...args: any[]): any;
}

export default function memoize(_: unknown, propertyKey: string | symbol, descriptor: Memoizable<MemoizableFunction>): Memoizable<MemoizableFunction> {
  const originalMethod = descriptor.value;
  const char0 = String.fromCharCode(0);

  descriptor.value = function(...args: any[]) {
      this.cache ||= new Map();

      console.log(this.cache);
      
      let cacheKey = propertyKey.toString();

      for (const arg of args) {
        const type = typeof arg;

        cacheKey += char0 + (
          (arg  === null)                     ? 'null'              :
          (arg  === void 0)                   ? 'undefined'         :
          (type === 'function')               ? arg                 :
          (type === 'object' && arg.id)       ? arg.id              :
          (type === 'object' && arg.hashCode) ? arg.hashCode()      :
          (type === 'object')                 ? JSON.stringify(arg) :
          arg
        );
      }
      if (!this.cache.get(cacheKey)) {
        this.cache.set(cacheKey, originalMethod?.apply(this, args))
      }
      return this.cache.get(cacheKey);
  };

  return descriptor;
}
