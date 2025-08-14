
// 自定义日志函数
function log(message: string, data?: any) { 
    /*
    const timestamp = new Date().toISOString().substring(11, 23);
    console.log(`\n🔍 [${timestamp}] [拦截器] ${message}`);
    if (data) {
        console.log(`   📊 数据:`, JSON.stringify(data, null, 2));
    }
    */
}

// 这个函数会在测试运行前就被调用，用来拦截 vitest 的全局方法
function setupInterceptors() {
    log('🚀 开始设置 vitest 方法拦截器');

    // 保存原始方法的引用
    const originalDescribe = globalThis.describe;
    const originalIt = globalThis.it;
    const originalExpect = globalThis.expect;

    if (!originalDescribe || !originalIt || !originalExpect) {
        log('⚠️ 警告: 某些 vitest 方法尚未可用，稍后重试拦截');
        // 延迟执行拦截
        setTimeout(setupInterceptors, 10);
        return;
    }

    log('✅ 检测到 vitest 方法，开始拦截');

    // 拦截 describe 方法
    const wrappedDescribe = function (name: string | Function, fn?: unknown, options?: unknown) {
        log(`📋 开始定义测试套件: ${String(name)}`);
        globalThis.vitest_describe_name = String(name);

        const startTime = Date.now();

        // 如果第二个参数是函数，则包装它
        let wrappedFn = fn;
        if (typeof fn === 'function') {
            wrappedFn = () => {
                log(`🔧 进入测试套件内部: ${String(name)}`);
                fn();
                log(`✅ 离开测试套件内部: ${String(name)}`);
            };
        }

        // 调用原始的 describe 方法
        const result = (originalDescribe as any)(name, wrappedFn, options);

        const endTime = Date.now();
        log(`📋 测试套件定义完成: ${String(name)}`, { duration: `${endTime - startTime}ms` });

        return result;
    } as typeof originalDescribe;
    
    globalThis.describe = wrappedDescribe;

    // 保持 describe 的其他属性
    Object.setPrototypeOf(globalThis.describe, originalDescribe);
    Object.assign(globalThis.describe, originalDescribe);

    // 拦截 it 方法
    const wrappedIt = function (name: string | Function, fn?: unknown, options?: unknown) {
        log(`🧪 开始定义测试用例: ${String(name)}`);
        // 如果第二个参数是函数，则包装它
        let wrappedFn = fn;
        if (typeof fn === 'function') {
            wrappedFn = async () => {
                const startTime = Date.now();
                log(`🏃 进入测试用例执行: ${String(name)}`);
                globalThis.vitest_it_name = String(name);
                try {
                    await fn();
                    const endTime = Date.now();
                    log(`✅ 测试用例执行成功: ${String(name)}`, { duration: `${endTime - startTime}ms` });
                } catch (error) {
                    const endTime = Date.now();
                    log(`❌ 测试用例执行失败: ${String(name)}`, {
                        duration: `${endTime - startTime}ms`,
                        error: error instanceof Error ? error.message : String(error)
                    });
                    throw error; // 重新抛出错误以保持测试失败行为
                }
            };
        }

        // 调用原始的 it 方法
        const result = (originalIt as any)(name, wrappedFn, options);
        return result;
    } as typeof originalIt;
    
    globalThis.it = wrappedIt;

    // 保持 it 的其他属性
    Object.setPrototypeOf(globalThis.it, originalIt);
    Object.assign(globalThis.it, originalIt);

    // 拦截 expect 方法
    const wrappedExpect = function (actual: unknown) {
        log(`🔍 执行断言`, { actual });

        // 调用原始的 expect 方法
        const expectResult = originalExpect(actual);

        // 创建一个代理来拦截所有的匹配器方法
        return new Proxy(expectResult, {
            get(target: any, prop: string | symbol) {
                const originalMethod = target[prop];

                if (typeof originalMethod === 'function' && typeof prop === 'string') {
                    return function (...args: unknown[]) {
                        log(`🎯 执行断言匹配器: ${prop}`, {
                            actual,
                            expected: args.length > 0 ? args[0] : undefined
                        });

                        try {
                            const result = originalMethod.apply(target, args);
                            log(`✅ 断言匹配器成功: ${prop}`, { actual, expected: args[0] });
                            return result;
                        } catch (error) {
                            log(`❌ 断言匹配器失败: ${prop}`, {
                                actual,
                                expected: args[0],
                                error: error instanceof Error ? error.message : String(error)
                            });
                            throw error; // 重新抛出错误以保持断言失败行为
                        }
                    };
                }

                return originalMethod;
            }
        });
    } as typeof originalExpect;

    globalThis.expect = wrappedExpect;

    // 保持 expect 的其他属性和方法
    Object.setPrototypeOf(globalThis.expect, originalExpect);
    Object.assign(globalThis.expect, originalExpect);

    log('🎉 vitest 方法拦截器设置完成');
}

// 立即尝试设置拦截器
setupInterceptors();

export { };