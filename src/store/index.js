import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const STORE_TOKEN = "storeToken";
const LOGOUT = "logout";
export default new Vuex.Store({
  state: {
    //登录信息
    token:'',
    user:{},
    todos: []
  },
  getters: {
    pending: function(state) {
      if ( state.todos.length > 0 ) {
        return state.todos.filter(item => {
          return !item.done;
        })
      }
      return [];
    },
    completed: function(state) {
      if ( state.todos.length > 0 ) {
        return state.todos.filter(item => {
          return item.done;
        })
      }
      return [];
    }
  },
  mutations: {
    initialList(state,vm) {
      // if(localStorage.getItem('todo_list')) {        
      //   state.todos = JSON.parse(localStorage.getItem('todo_list'));
      // }
      if(localStorage.getItem('token')) {
        console.log("init tokon:",state.token);
        //TODO:如果token会过期，还应该检测下token是否有效
        state.token = localStorage.getItem('token');
        vm.$http.defaults.headers.common['Authorization'] = "Bearer " + state.token;
      } 
    },
    [STORE_TOKEN](state,token){
      console.log("store token:",token);
      sessionStorage.setItem("token",token);
      state.token = token;
      localStorage.setItem('token',token);
      //添加认证头信息
      //this.$http.defaults.headers.common['Authorization'] = "Bearer " + token;
    },
    [LOGOUT](state,vm){
      console.log("logout",localStorage.getItem("token"),sessionStorage.getItem("token"));
      if(localStorage.getItem("token")!=null || sessionStorage.getItem("token")!=null){
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        state.token = null;
        this.commit("clearList");
        vm.$router.push({path:'/'});
        //移除认证头信息
        //this.$http.defaults.headers.common['Authorization'] = null;
      }
    },
    addList(state, payload) {
      let todo = {
        id: state.todos.length,
        memo: payload.memo,
        done: false
      }
      state.todos.push(todo);
      this.commit('updateList');
    },
    updateList() {
      // this.subscribe( (mutations, state) => {
      //   localStorage.setItem('todo_list', JSON.stringify(state.todos))
      // });
    },
    deleteList(state, payload) {
      const index = state.todos.findIndex( todo => {
          return todo.id === payload
      });

      state.todos.splice(index, 1);
      this.commit('updateList');
    },
    clearList(state) {
      state.todos = [];
      this.commit('updateList');
    },
    initMyList(state, payload) {
      state.todos = payload.list;
    },
    updateState(state, payload) {
      const index = state.todos.findIndex( todo => {
        return todo.id === payload.id
      });
      state.todos[index].done = payload.updatedState
    }
  },
  actions: {
    myList({commit}, payload){
      let vm = payload.$this;
      vm.$http.defaults.baseURL = vm.$config.url.gateway;
      vm.$http.post("/gateway/app/"+vm.$config.appid+"/list",{
      }).then(data => {
          console.log("mylist:",data.data);
          if(data.data.ret){
            commit('initMyList', {
              list:data.data.res
            });
          }
      });
    },
    removeAllTodo({commit}, payload){
      let vm = payload.$this;
      vm.$http.defaults.baseURL = vm.$config.url.gateway;
      vm.$http.post("/gateway/app/"+vm.$config.appid+"/removeAll",{
      }).then(data => {
          if(data.data.ret){
            commit('clearList');
          }else{
            alert("服务端失败！");
          }
      });
    },
    removeTodo({commit}, payload){
      let vm = payload.$this;
      vm.$http.defaults.baseURL = vm.$config.url.gateway;
      vm.$http.post("/gateway/app/"+vm.$config.appid+"/remove",{
          id:payload.id
      }).then(data => {
          if(data.data.ret){
            commit('deleteList', payload.id);
          }else{
            alert("添加到服务端失败！");
          }
      });
    },
    changeStatus({commit}, payload){
      let vm = payload.$this;
      vm.$http.defaults.baseURL = vm.$config.url.gateway;
      vm.$http.post("/gateway/app/"+vm.$config.appid+"/changeStatus",{
          id:payload.id,
          sts:payload.sts
      }).then(data => {
          if(data.data.ret){
            commit('updateState', {
              id:payload.id,
              updatedState:payload.sts
            });
          }else{
            alert("状态修改到服务端失败！");
          }
      });
    },
    addList({commit}, payload) {
      if (payload.memo === null || payload.memo.trim() === "") {
        alert('不能为空！')
        return;
      } 
      let vm = payload.$this;
      //提交到服务端
      vm.$http.defaults.baseURL = vm.$config.url.gateway;
      vm.$http.post("/gateway/app/"+vm.$config.appid+"/add",{
          todo:payload.memo,
          sts:"1"
      }).then(data => {
          if(data.data.ret){
            commit('addList', payload);
          }else{
            alert("添加到服务端失败！");
          }
      });
      
    }
  }
})
