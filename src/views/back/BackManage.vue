<template>
    <div>
        <el-container>
            <el-header class="top">后台管理系统</el-header>
            <el-container>
                <el-aside width="200px">
                    <el-menu
                            default-active="1"
                            class="el-menu-vertical-demo"
                            @open="handleOpen"
                            @close="handleClose"
                            background-color="#545c64"
                            text-color="#fff"
                            active-text-color="#ffd04b">
                        <el-menu-item index="1" @click="goTo('/userManage')">
                            <i class="el-icon-menu"></i>
                            <span slot="title">用户管理</span>
                        </el-menu-item>
                        <el-menu-item index="2" @click="goTo('/productManage')">
                            <i class="el-icon-menu"></i>
                            <span slot="title">产品管理</span>
                        </el-menu-item>
                        <el-submenu index="3">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>导航三</span>
                            </template>
                            <el-menu-item-group>
                                <template slot="title">分组一</template>
                                <el-menu-item index="1-1">选项1</el-menu-item>
                                <el-menu-item index="1-2">选项2</el-menu-item>
                            </el-menu-item-group>
                            <el-menu-item-group title="分组2">
                                <el-menu-item index="1-3">选项3</el-menu-item>
                            </el-menu-item-group>
                            <el-submenu index="1-4">
                                <template slot="title">选项4</template>
                                <el-menu-item index="1-4-1">选项1</el-menu-item>
                            </el-submenu>
                        </el-submenu>
                        <el-menu-item index="4" @click="goTo('/userInfo')">
                            <i class="el-icon-setting"></i>
                            <span slot="title">个人信息</span>
                        </el-menu-item>
                    </el-menu>
                </el-aside>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "BackManage",
        methods: {
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            },
            goTo(path){
                console.log('path '+path);
                // this.$router.replace(path);
                this.$router.push(path)
            }
        },
        created() {
            this.$router.push('/userManage');
        }
    }
</script>

<style scoped>
    .el-header, .el-footer {
        background-color: #0000008c;
        color: white;
        text-align: center;
        line-height: 60px;
        font-size: 22px;
    }

    .el-aside {
        background-color: #D3DCE6;
        color: #333;
        text-align: center;
        line-height: 200px;
    }

    .el-main {
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
        line-height: 160px;
    }

    body > .el-container {
        margin-bottom: 40px;
    }

    .el-container:nth-child(5) .el-aside,
    .el-container:nth-child(6) .el-aside {
        line-height: 260px;
    }

    .el-container:nth-child(7) .el-aside {
        line-height: 320px;
    }

</style>