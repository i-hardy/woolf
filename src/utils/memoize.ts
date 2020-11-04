/* eslint-disable @typescript-eslint/no-explicit-any */
interface Memoizable<T> extends TypedPropertyDescriptor<T> {
  memoizedCache?: Map<string, unknown>;
}

interface MemoizableFunction {
  (...args: any[]): any;
}

function createCacheKey(arg: any) {
  const type = typeof arg;

  if (arg === null) {
    return 'null';
  }
  if (arg === undefined) {
    return 'undefined';
  }
  if (type === 'object') {
    if (arg.id) return arg.id;
    if (arg.hashCode) return arg.hashCode();
    return JSON.stringify(arg);
  }
  return arg;
}

export default function memoize(
  _: unknown,
  propertyKey: string | symbol,
  descriptor: Memoizable<MemoizableFunction>,
): Memoizable<MemoizableFunction> {
  const originalMethod = descriptor.value;
  const char0 = String.fromCharCode(0);

  // eslint-disable-next-line no-param-reassign
  descriptor.value = function value(...args: any[]) {
    this.memoizedCache ||= new Map();

    let cacheKey = propertyKey.toString();

    for (const arg of args) {
      cacheKey += char0 + createCacheKey(arg);
    }
    if (!this.memoizedCache.get(cacheKey)) {
      this.memoizedCache.set(cacheKey, originalMethod?.apply(this, args));
    }
    return this.memoizedCache.get(cacheKey);
  };

  return descriptor;
}
