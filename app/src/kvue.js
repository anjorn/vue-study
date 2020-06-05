// 数据响应式
function defineReactive(obj, key, val) {
    // 递归处理
    observe(val)

    // 创建一个dep实例
    const dep = new Dep()

    Object.defineProperty(obj, key, {
        get() {
            console.log('get', key)
            // 收集依赖 把watcher和dep关联
            // 希望Watcher实例化时，访问一下对应key,同时把这个实例设置到dep.target
            Dep.target && dep.addDep(Dep.target)
            
            return val
        },
        set(newVal) {
            if (newVal != val) {
                console.log('set', key, newVal)
                observe(newVal)
                val = newVal

                // 通知更新
                dep.notify()

            }
        }
    })
}

// 让我们使一个对象所有属性都被拦截
function observe(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return
    }
    new Observer(obj)
}
// 做数据响应式
class Observer {
    constructor(value) {
        this.value = value
        
        if (Array.isArray(value)) {
            // todo
        } else {
            this.walk(value)
        }
    }
    walk(obj) {
        Object.keys(obj).forEach(key => {
            defineReactive(obj, key, obj[key])
        })
    }
}
// 代理data中的数据
function proxy(vm) {
    console.log(vm)
    Object.keys(vm.$data).forEach(key => {
        Object.defineProperty(vm, key, {
            get() {
                return vm.$data[key]
            },
            set (v) {
                vm.$data[key] = v
            }
        })
    })
}
// KVue
// 1 响应式操作
// 暗号：天王盖地虎
// 作业1 实现事件绑定
class KVue {
    constructor(options) {
        // 保存选项
        this.$options = options
        this.$data = options.data
        this.$methods = options.methods

        // 响应化处理
        observe(this.$data)

        // 代理
        proxy(this)
        
        new Compiler('#app', this)
    }
}




// compiler: 解析模板  找到依赖 并和前面拦截的属性关联起来
class Compiler {
    constructor(el, vm) {
        this.$vm = vm
        this.$el = document.querySelector(el)
        
        // 执行编译
        this.compile(this.$el)
    }
    compile(el) {
        // 遍历这个el
        el.childNodes.forEach(node => {
            // 是否是元素
            if (node.nodeType === 1) {
                console.log('编译元素', node.nodeName)
                this.compileElement(node)
            } else if (this.isInter(node)) {
                console.log('编译文本', node.textContent)
                this.compileText(node)
            }

            // 递归
            if (node.childNodes) {
                this.compile(node)
            }
        })
    }
    // 解析绑定表达式
    compileText(node) {
        // 获取正则匹配表达式 从vm里面拿出它的值
        // node.textContent = this.$vm[RegExp.$1]
        this.update(node, RegExp.$1, 'text')
    }

    // 编译元素
    compileElement(node) {
        // 处理元素上面的属性 典型的是k-, @开头的
        const attrs = node.attributes
        Array.from(attrs).forEach(attr => {
            const attrName = attr.name 
            const exp = attr.value
            if (attrName.indexOf('k-') === 0) {
                // 截取指令名称 text
                const dir = attrName.substring(2)
                this[dir] && this[dir](node, exp)           
            }
            // 处理事件 @ or k-on:
            if (attrName.indexOf('@') === 0 || attrName.indexOf('k-on:') === 0) {
                let dir
                if (attrName.indexOf('@') === 0) {
                    dir = attrName.substring(1)
                } else {
                    dir = attrName.substring(5)
                }
                this.eventHandler(node, dir, exp)
            }
        })
    }
    // 事件注册
    eventHandler (node, dir, exp) {
        // 1. exp在methods中找不到对应的方法 是表达式 表达式中带data中的变量操作 todo
        // 2. exp在methods中有定义方法 不带参数 带参数 done
        let arg = []
        let fn
        // 处理exp有无参数
        exp = exp.replace(/\((.*)\)/, ($1, $2) => {
            arg = $2.split(',') // todo ,后面的空格
            return ''
        })
        // 若在methods找不到对应的方式 执行表达式
        if (!this.$vm.$methods[exp]) {
            return
        } else {
            // exp在methods中有定义方法
            fn = this.$vm.$methods[exp]
        }
        let _this = this
        // 事件监听
        node.addEventListener(dir, function (e) {
            return (e) => {
                if (arg.length) {
                    // 参数中有没有带$event 进行处理
                    if (arg.indexOf('$event') != -1) {
                        arg[arg.indexOf('$event')] = e
                    }
                    return fn.call(_this.$vm, ...arg)
                } else {
                    return fn.call(_this.$vm, e)
                }
            }
        }())
    }
 
    // k-text
    text(node, exp) {
        // node.textContent = this.$vm[exp]
       this.update(node, exp, 'text')
    }

    // k-html
    html(node, exp) {
        // node.innerHTML = this.$vm[exp]
        this.update(node, exp, 'html')
    }
    // 作业2 k-model
    // k-model
    model(node, exp) {
        this.update(node, exp, 'model')
    }
    // dir: 要做的指令名称
    update(node, exp, dir) {
        // 处理model
        if (dir == 'model') {
            node.addEventListener('input', (e) => {
                this.$vm[exp] = e.target.value
            })
        }
        // 初始化
        const fn = this[dir + 'Update']
        fn && fn(node, this.$vm[exp])
        // 更新 创建一个Watcher实例
        new Watcher(this.$vm, exp, val => {
            fn && fn(node, val)
        })
    }
    modelUpdate(node, val) {
        node.value = val
    }

    textUpdate(node, val) {
        node.textContent = val
    }

    htmlUpdate(node, val) {
        node.innerHTML = val
    }

    isInter(node) {
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
    }
}


// 管理一个依赖 未来执行更新
class Watcher {
    constructor(vm, key, updateFn) {
        this.vm = vm
        this.key = key
        this.updateFn = updateFn

        // 读一下当前key 触发依赖收集
        Dep.target = this
        vm[key]
        Dep.tartget = null
    }
    // 未来会被dep调用
    update() {
        this.updateFn.call(this.vm, this.vm[this.key])
    }
}
// dep: 保存所有watcher实例 当某个key发生变化 通知他们更新
class Dep {
    constructor() {
        this.deps = []
    }
    addDep(watcher) {
        this.deps.push(watcher)
    }
    notify () {
        this.deps.forEach(dep => {
            dep.update()
        })
    }
}

// k-model value input处理
// @xx 事件绑定
