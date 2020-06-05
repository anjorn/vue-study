//  集中式存储管理状态 状态变更可预测  
//  状态变更之前可拦截 日志记录 持久化
//  状态发生变化的时候

//  声明Store类
//  install方法 
//  今日暗号 first blood

let Vue

class Store {
    constructor (options) {
        
        // 保存mutations
        this._mutations = options.mutations
        // 保存action
        this._actions = options.actions
        // 锁死commit dispatch函数 this 指向
        const store = this
        const {commit, dispatch} = store
        this.commit = function boundCommit(type, payload) {
            commit.call(store, type, payload)
        }
        this.dispatch = function boundDispatch(type, payload) {
            dispatch.call(store, type, payload)
        }
        // 暗号 first blood
        const computed = {}
        const getters = options.getters
        for (let key in getters) {
            let fn = getters[key]
            computed[key] = function () {
                return () => {
                    return fn.call(this, store.state, store.getters)
                }
            }()
            Object.defineProperty(store.getters, key, {
                get: () => store._vm[key],
                enumerable: true // for local getters
            })
        }
        // 处理options
        this._vm = new Vue({
            // data 中的值都是响应式
            data: {
                $$state: options.state
            },
            computed
        })
    }
    // 存储器使之成为只读
    get state () {
        return this._vm._data.$$state
    }

    set state (v) {
        console.error('please use replaceState to reset state')
    }
    getters () {

    }
    // 实现commit方法 修改状态 
    commit (type, payload) {
        // 1 获取传入的key对应的名称mutation
        const entry = this._mutations[type]

        if (!entry) {
            console.error('no mutation');
            return
        }
        console.log(entry)
        entry(this.state, payload)
    }
    
    // 实现dispatch方法  
    dispatch (type, payload) {
        // 1 actions
        const entry = this._actions[type]

        if (!entry) {
            console.error('no actions');
            return
        }
        
        entry(this, payload)
    }
}
// install方法
function install(_vue) {
    // 重复安装
    if (Vue) {
        console.error('already install')
        return
    }
    Vue = _vue

    Vue.mixin({
        // 尽早执行
        beforeCreate() {
            if (this.$options.store) {
                Vue.prototype.$store = this.$options.store
            }
        }
    })
}

// function partial (fn , arg) {
//     return function () {
//         return fn.call(this, arg)
//     }
// }
// 导出一个对象 作为Vuex
export default {Store, install}