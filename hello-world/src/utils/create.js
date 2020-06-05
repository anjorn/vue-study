import Vue from 'vue'
// 暗号：老杨喊你来搬砖
// 实现一个create方法，能够创建指定组件实例
// 并将其挂载至body上
// Component是组件配置对象
export default function create(Component, props) {
  // 怎么创建组件实例
  // 方案1：可以通过Vue.extend(Component)获取组件构造函数
  const Ctor = Vue.extend(Component)
  // 组件实例化   
  const comp = new Ctor({
      propsData: props
  })
  // 先渲染
  comp.$mount()
  //并且随后挂载body子节点上
  document.body.appendChild(comp.$el)
  // 销毁  
  comp.remove = () => {
    document.body.removeChild(comp.$el)
    comp.$destroy()
  }
  return comp
}

  // 方案2：借鸡生蛋，借助Vue构造组件实例
//   const vm = new Vue({
//     render(h) {
//       // h是createElement函数，可以返回vdom
//       return h(Component, {props})
//     }
//   }).$mount() // $mount()目标：将vdom=》dom

//   // 手动追加dom
//   document.body.appendChild(vm.$el)

//   const comp = vm.$children[0]
  
//   // 淘汰逻辑
//   comp.remove = () => {
//     document.body.removeChild(vm.$el)
//     comp.$destroy()
//   }
  
  
// }