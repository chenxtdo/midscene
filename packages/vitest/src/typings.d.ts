// 扩展 vitest 的全局类型定义
import type { describe, it, expect } from 'vitest';

declare global {
  // 确保 globalThis 上有 vitest 方法的类型定义
  var describe: typeof import('vitest')['describe'];
  var it: typeof import('vitest')['it'];
  var expect: typeof import('vitest')['expect'];

  var vitest_describe_name: string;
  var vitest_it_name: string;
  var __TEST_START_TIME__: number;
}

export {};