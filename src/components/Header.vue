<template>
    <div class="m-content">
        <h2>欢迎来到杰杰博客</h2>
        <div class="block">
            <el-avatar :size="50" :src="user.avatar"></el-avatar>
            <div>{{user.username}}</div>
        </div>

        <div>
            <span> <el-link type="primary" href="/blogs">主页</el-link></span>
            <el-divider direction="vertical"></el-divider>
            <span> <el-link type="success" href="/blog/add">发表</el-link></span>
            <el-divider direction="vertical"></el-divider>
            <span> <el-link type="warning" href="/login" v-if="status">登录</el-link></span>
            <!--<el-divider direction="vertical"></el-divider>-->
            <span> <el-link type="danger" @click="logout" v-if="!status">退出</el-link></span>
            <el-divider direction="vertical" v-if="!status"></el-divider>
            <span> <el-link type="info" href="/back" v-if="!status">后台管理</el-link></span>
        </div>

    </div>
</template>

<script>
    export default {
        name: "Header",
        data(){
            return {
                user: {
                    username: '请先登录',
                    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
                },
                status: true,
            }
        },
        methods:{
            logout(){
                const _this = this;
                this.$axios.get("/logout",{
                    headers: {
                        "Authorization": localStorage.getItem("token")
                    }
                }).then(res => {
                    _this.$store.commit("REMOVE_INFO");
                    _this.$router.push("/login");
                })
            }
        },
        created() {
            if(this.$store.getters.getUserInfo.username){
                this.user.username = this.$store.getters.getUserInfo.username;
                this.user.avatar = this.$store.getters.getUserInfo.avatar;
                this.status = false
            }
        }
    }
</script>

<style scoped>
    .m-content{
        max-width: 960px;
        margin: 0 auto;
        text-align: center;
    }

</style>