// 引用传入vue的构造函数
let Vue

// VueRouter类
class VueRouter {
    constructor(options) {
        // 保存选项备用
        this.$options = options

        // 创建current
        // 监控url变化
        window.addEventListener('hashchange', this.onHashChange.bind(thisvue))

    }
}
// 实现install方法
// 实现静态install方法即可
// 参数1: Vue构造函数 Vue.use(VueRouter)
VueRouter.install = function (_vue) {
    Vue = _vue
}

export default VueRouter