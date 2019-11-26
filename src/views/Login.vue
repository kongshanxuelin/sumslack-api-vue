<template>
    <div class="site">
        <h1>登录</h1>
        <div class="input-form">账号：<input type="text" v-model="username" /></div>
        <div class="input-form">密码：<input type="password" v-model="pass" /></div>
        <div class="input-form" style="text-align:right;">
            <input type="button" style="width:250px;" @click="doLogin" value="登录" />
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            username: "test3333",
            pass: "test3333"
        }
    },
    methods: {
        doLogin(){
            this.$http.defaults.baseURL = this.$config.url.auth;
            this.$http.get("auth/jwt/login",{
                params:{
                    username:this.username,
                    password:this.pass
                }
            }).then(res => {
                console.log("login:",res.data);
                if(res.data.status!=0){
                    alert(res.data.message);
                }else{
                    this.$store.commit('storeToken', res.data.data);
                    this.$http.defaults.headers.common['Authorization'] = "Bearer " + res.data.data;
                    this.$router.push({path:'/my'});
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    h1 {
        margin: 60px 0 40px;
    }
    .input-form {
        width:250px;
        height:35px;
        line-height: 35px;
        margin:10px auto;
    }
    input {
        height:30px;
        line-height: 30px;
    }
</style>