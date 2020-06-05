// 引用传入vue的构造函数
let Vue

// VueRouter类
class VueRouter {
    constructor(options) {
        // 保存选项备用
        this.$options = options
        this.routeMap = {}
        this.$options.routes.forEach(route => {
            this.routeMap[route.path] = route
        })
        // 创建current 响应式
        Vue.util.defineReactive(this, 'current', '/')
        // 
        const initial = window.location.hash.slice(1) || '/'
        Vue.util.defineReactive(this, 'current', initial)
        // 监控url变化
        window.addEventListener('hashchange', this.onHashChange.bind(this))
        window.addEventListener('load', this.onHashChange.bind(this))

    }
    onHashChange() {
        this.current = window.location.hash.slice(1)
    }
}

// 实现install方法
// 实现静态install方法即可
// 参数1: Vue构造函数 Vue.use(VueRouter)
VueRouter.install = function (_vue) {
    Vue = _vue
    // 挂载router
    Vue.mixin({
        beforeCreate() {
            if (this.$options.router) {
                Vue.prototype.$router = this.$options.router
            }
        }
    })

    // 注册两个组件 router-view router-link
    Vue.component('router-view', {
        render(h) {
            let component = null
            component = this.$router.routeMap[this.$router.current].component
            return h(component)
        }
    })

    Vue.component('router-link', {
        props: {
            to: {
                type: String,
                default: ''
            }
        },
        render(h) {
            return h('a', {
                attrs: {
                    href: '#' + this.to
                }
            }, [
                this.$slots.default
            ])
        }
    })
}

export default VueRouter