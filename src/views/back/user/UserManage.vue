<template>
    <div>

        <el-button @click="handleEdit(null,null)">添加用户</el-button>
        <el-button @click="batchRemove">批量删除</el-button>

        <!--列表展示-->
        <el-table :data="userListData" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width:98%">
            <el-table-column type="selection" width="55"  align="center"></el-table-column>
            <el-table-column label="序号" width="62px" type="index"  align="center"></el-table-column>

            <el-table-column label="头像" prop="avatar">
                　　<template slot-scope="scope">
                　　　　<img :src="scope.row.avatar"  height="40" class="head_pic"/>
                　　</template>
            </el-table-column>

            <!-- 设置表头数据源，并循环渲染出来，property对应列内容的字段名，具体查看数据源格式 rightHeader-->
            <!--动态展示数据  :key__属性名  :property__属性值  :label__表头名称-->
            <el-table-column v-for="info in rightHeader" :key="info.key" :property="info.key" :label="info.label"  align="center">
                <template slot-scope="scope">
                    <!--当前行属性对应的值-->
                    {{scope.row[scope.column.property]}}  <!-- 渲染对应表格里面的内容 -->
                </template>
            </el-table-column>



            <!--格式化状态列__在此处有的列,要在数据源rightHeader_去除__不然重复-->
            <el-table-column label="状态" prop="status">
                <template slot-scope="scope">
                    <font v-if="scope.row.status === 1" color="red">禁用</font>
                    <font v-else-if="scope.row.status === 0" color="green">使用</font>
                    <font v-else color="blue">未知</font>
                </template>
            </el-table-column>

            <!--操作-->
            <el-table-column label="操作" width="150">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination class="mpage"
                       background
                       layout="prev, pager, next"
                       :current-page="currentPage"
                       :page-size="pageSize"
                       :total="total"
                       @current-change=getUserListData
        >
        </el-pagination>


        <!--&lt;!&ndash;编辑界面&ndash;&gt;-->
        <el-dialog :title="title"  :visible.sync="editFormVisible" width="50%" :before-close="handleClose">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <!--动态回显数据-->
                <el-form-item v-for="info in rightHeader" v-bind:prop="info.key" :key="info.key" :property="info.key" :label="info.label" v-if="info.key != 'id'">
                    <el-input  v-model="editForm[info.key]" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editFormVisible = false">取 消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>

            <el-upload
                    class="avatar-uploader"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </el-dialog>
    </div>
</template>

<script>

    export default {
        name: "UserManage",
        data() {
            return {
                /*表头*/
                rightHeader:[
                    {
                        label: '用户编号',
                        key: 'id'
                    },
                    {
                        label: '用户名称',
                        key: 'username'
                    },
                    {
                        label: '邮箱',
                        key: 'email'
                    }
                ],
                filters: {
                    keyWord: ''
                },
                userListData: [],       //列表数据
                total: 0,               //总条数
                currentPage: 1,         //当前页
                pageSize:10,	        //每页条数
                listLoading: false,
                sels: [],               //列表选中列

                title: '',
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                /*表单验证字段*/
                editFormRules: {
                    username: [
                        { required: true, message: '请输入用户名称', trigger: 'blur' }
                    ],
                    email: [
                        { required: true, message: '请输入邮箱', trigger: 'blur' }
                    ]
                },
                //编辑界面数据
                editForm: {
                    id: '',
                    username: '',
                    email: '',
                    status: ''
                },
                currentPage: 1,
                total: 0,
                pageSize: 5,
                imageUrl: ''
            }
        },
        methods: {
            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },

            handleClose(done) {
                done();
                /*
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
                    */
            },
            handleClick(row) {
                console.log(row);
            },

            handleCurrentChange(val) {
                console.log(val);
                this.currentPage = val;
                this.getUserListData();

            },

            //获取用户管理数据列表
            getUserListData(currentPage) {
                this.listLoading = true;
                let para = {
                    currentPage: this.currentPage,
                    pageSize:this.pageSize,
                    keyWord: this.filters.keyWord
                };

                const _this = this;
                this.$axios.get("/user/initUserTable?currentPage="+currentPage,{
                    headers: {
                        "Authorization": localStorage.getItem("token")
                    }
                }).then(res => {
                    _this.userListData = res.data.data.records;
                    _this.currentPage = res.data.data.current;
                    _this.total = res.data.data.total;
                    _this.pageSize = res.data.data.size;
                    _this.listLoading=false;
                });
            },
            //删除
            handleDel: function (index, row) {
                const _this = this;
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    this.$axios.delete("/user/deleteUser/"+row.id,{
                        headers: {
                            "Authorization": localStorage.getItem("token")
                        }
                    }).then(res => {
                        _this.listLoading = false;
                        if(res.data.code === 200){
                            _this.$message({
                                message: "删除成功",
                                type: "success"
                            });
                            _this.getUserListData(this.currentPage);
                        }
                    })
                }).catch((error) => {
                    this.listLoading = false;
                    this.$message({
                        message: "删除"+error.data.message,
                        type: 'error'
                    });
                });
            },
            /*表单重置*/
            resetForm(formName){
                if (this.$refs[formName] !== undefined) {
                    this.$refs[formName].resetFields();
                }
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                if (row == undefined ){
                    this.title = '添加用户';
                    //表单重置
                    this.resetForm("editForm");
                    this.editFormVisible=true;
                    this.editForm = Object.assign({}, row);
                }else{
                    this.title = '编辑用户';
                    this.editFormVisible = true;
                    this.editForm = Object.assign({}, row);
                }

            },
            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            const _this = this;

                            let url = '';
                            if(this.editForm.id === undefined){
                                url = '/user/addUser';
                                this.editForm.status = 0;
                                console.log(this.imageUrl);
                            }else {
                                url = '/user/updateUser';
                            }

                            this.$axios.post(url,this.editForm,{
                                headers: {
                                    "Authorization": localStorage.getItem("token")
                                }
                            }).then(res => {
                               _this.editLoading = false;
                               if(res.data.code === 200){
                                   _this.$message({
                                       message: res.data.msg,
                                       type: 'success'
                                   });
                                   _this.$refs['editForm'].resetFields();
                                   _this.editFormVisible = false;
                                   _this.getUserListData(this.currentPage);
                               }
                            }).catch(error => {
                                _this.editLoading = false;
                                _this.$message({
                                    message: res.data.msg,
                                    type: 'success'
                                })
                            });

                        });
                    }
                });
            },
            selsChange: function (sels) {
                console.log(sels);
                this.sels = sels;
            },
            //批量删除
            batchRemove: function () {
                //var ids = this.sels.map(item => item.id).toString();
                //迭代所选id组成一个数据作为参数传递
                var ids = this.sels.map(item => item.id);

                const _this = this;
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let param = { ids: ids };

                    _this.$axios.post("/user/delAllUser",this.$qs.stringify(param,{arrayFormat: 'brackets'}),{
                        headers: {
                            "Authorization": localStorage.getItem("token")
                        }
                    }).then(res => {
                        _this.listLoading = false;

                        if(res.data.code === 200){
                            _this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getUserListData(this.currentPage);
                        }
                    })
                }).catch((error) => {
                    _this.listLoading = false;
                    _this.$message({
                        message: '删除失败',
                        type: 'error'
                    });
                });

            }
        },
        created() {
            this.getUserListData(this.currentPage);
        }
    }
</script>

<style scoped>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>