<template>
    <div class="m_blog">
        <Header></Header>

        <div class="mblog">
            <h2>{{blog.title}}</h2>
            <el-link type="primary" v-if="status">
                <router-link :to="{name: 'BlogEdit',params: {blogId: blog.id}}">
                编辑
                </router-link>

            </el-link>
            <el-divider></el-divider>
            <h2>{{blog.content}}</h2>
        </div>
    </div>
</template>

<script>
    import 'github-markdown-css/github-markdown.css' // 然后添加样式markdown-body
    import Header from "../components/Header"
    export default {
        name: "BlogDetail.vue",
        components: {Header},
        data(){
            return {
                blog: {
                    id: "",
                    title: "",
                    content: ""
                },
                status: false
            }
        },
        created() {
            const blogId = this.$route.params.blogId;
            const _this = this;
            this.$axios.get("/blog/"+blogId).then(res => {
                const blog = res.data.data;
                _this.blog.id = blog.id;
                _this.blog.title = blog.title;
                var MarkdownIt = require('markdown-it'),
                    md = new MarkdownIt();
                var result = md.render(_this.blog.content);
                _this.blog.content = result;

                if(blog.userId === _this.$store.getters.getUserInfo.id){
                    _this.status = true;
                }else {
                    _this.status = false;
                }
            })
        }
    }
</script>

<style scoped>
    .m_blog {
        max-width: 960px;
        margin: 0 auto;
    }
    .mblog {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        width: 100%;
        min-height: 700px;
        padding: 20px 15px;
    }



</style>