<template>
    <div class="site">
        <h1>{{title}}
            <span v-if="token!=null"><button  @click="logout">退出</button></span>
            <span v-else><button @click="login">登录</button></span>    
        </h1>
        <List></List>
    </div>
</template>
<script>
import List from '../components/List'

export default {
    data(){
        return {
            token:"",
            title:"全部待办事宜"
        };
    },
    watch:{
        '$route':"refreshLoginInfo"
    },
    components: {
        List
    },
    mounted(){
        this.refreshLoginInfo();
    },
    methods:{
        refreshLoginInfo(){
            this.token = this.$store.state.token;
            if(this.$route.path === "/my"){
                this.title = "我的待办事宜";
            }else{
                this.title = "全部待办事宜";
            }
        },
        logout(){
            this.$store.commit('logout');
            this.$router.push({path:'/'});
        },
        login(){
            this.$router.push({path:'/login'});
        }
    }
}
</script>
<style lang="scss" scoped>
    h1 {
        margin: 60px 0 40px;
    }
</style>