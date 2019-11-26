<template>
    <div class="container">
        <div class="title-container">
            <small>{{ getDate }} {{ today }}</small>
        </div>
        
        <div class="add-list">
            <form @submit.prevent>
            <input type="text" v-model="memo" class="todo-text">
            <button type="submit" @click="addTodo(memo)">添加</button>
            </form>
        </div>
        <div v-if="hasTodos">
            <p class="status-title">共 {{ countOfPending }} 项 </p>
            <ul class="todo-list">
                <li
                    v-for="(todo, index) in pending" 
                    :key="index"
                    class=""
                >
                    <input type="checkbox"
                        :id="'todo_' + todo.id"
                        class="todo-checkbox"
                        :checked="todo.done"
                        @change.prevent="updateTodoState(todo.id, todo.done, $event)"
                    >
                    <label :for="'todo_' + todo.id"></label>    
                    <p>{{ todo.memo }}</p>                
                    <button type="button" @click="removeItem(todo.id)" class="btn-delete">删除</button>
                </li>
            </ul>
        </div>
        <div v-if="hasCompleted">
            <p class="status-title">{{ stateOfCompleted }}% 已完成</p>
            <ul class="todo-list completed">
                <li
                    v-for="(todo, index) in completed" 
                    :key="index"
                    class=""
                >
                    <input type="checkbox"
                        :id="'todo_' + todo.id"
                        class="todo-checkbox"
                        :checked="todo.done"
                        @change.prevent="updateTodoState(todo.id, todo.done, $event)"
                        
                    >
                    <label :for="'todo_' + todo.id"></label>
                    <p>{{ todo.memo }}</p>                
                    <button type="button" @click="removeItem(todo.id)" class="btn-delete">删除</button>
                </li>
            </ul>
        </div>
        <a 
            href="" 
            role="button" 
            v-if="hasList"
            @click="removeAllTodoList" 
            class="btn-clear"
        >清空</a>
    </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
    data() {
        return {
            memo: null,
            date: new Date()
        }
    },
    beforeCreate() {
        this.$store.commit('initialList',this);
    },
    computed: {
        ...mapGetters(['pending', 'completed']),
        hasList() {
            return this.$store.state.todos.length > 0;
        },
        hasTodos() {
            return this.pending.length > 0;
        },
        hasCompleted() {
            return this.completed.length > 0;
        },
        today() {
            const weekDay = [ '周日', '周一', '周二', '周三', '周四', '周五', '周六' ];
            let day = this.date.getDay();

            return weekDay[ day ];
        },
        getDate() {
            return `${this.date.getFullYear()}-${this.date.getMonth() + 1}-${this.date.getDate()}`
        },
        countOfPending() {
            return this.pending.length || 0;
        },
        stateOfCompleted() {
            return Math.round( this.completed.length / this.$store.state.todos.length * 100 );
        }
    },
    mounted(){
        this.myList({$this:this});
    },
    methods: {
        ...mapActions(['addList','myList','removeTodo','changeStatus','removeAllTodo']),
        ...mapMutations(['clearList']),
        removeAllTodoList(){
            if(confirm("确定全部删除？")){
                this.removeAllTodo({
                    $this:this
                });
            }
        },
        removeItem(id){
            if(confirm("确定删除？")){
                this.removeTodo({
                    "id":id,
                    $this:this
                });
            }
        },
        addTodo(memo) {
            let todo = {
                memo: memo,
                done: false,
                $this:this
            }
            
            this.addList(todo);
            this.memo = null;
        },
        updateTodoState(id, state, $event) {
            let updatedState = !state; 
            //this.updateState({id, updatedState});
            this.changeStatus({
                id,
                sts:updatedState,
                $this:this
            });
            $event.target.checked = state;

        }
    }
}
</script>
<style lang="scss" scoped>
@import "../styles/components/todos";
</style>