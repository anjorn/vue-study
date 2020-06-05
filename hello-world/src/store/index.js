import Vue from 'vue'
import Vuex from '../kvuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    counter: 1
  },
  mutations: {
    add(state) {
      state.counter++
    }
  },
  actions: {
    add({commit}) {
      // console.log(this.commit)
      setTimeout(() => {
        commit('add')
      }, 1000)
    }
  },
  getters: {
    double(state) {
      console.log(state)
      return state.counter * 2
    },
    doneTodo (state, getters) {
      console.log(state, getters)
      return getters.double
    }
  },
  modules: {
  }
})
