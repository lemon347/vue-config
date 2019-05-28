<template>
  <div>
      <div class="title-nav">
          <span>配置列表</span>
          <div>
              <el-button type="primary" icon="plus" @click="addConfig">添加</el-button>
              <el-button type="primary" icon="search" @click="searchShow">搜索</el-button>
          </div>
      </div>
      <add
          :dialogVisible="dialogFormVisible"
          :dataConfig = "config"
          @dialogClose="onClose"
      ></add>
      <transition name="search">
          <div class="search-content" v-if="searchShowBox">
          <el-form ref="formSearch" :model="formSearch">
              <el-row :gutter="20">
                  <el-col :span="7">
                    <el-form-item label="公司名称：" :label-width="formLabelWidth" prop="companyName">
                      <el-input placeholder="请输入公司名称"
                                v-model="formSearch.companyName"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="7">
                      <el-form-item label="公司地址" :label-width="formLabelWidth" prop="address">
                          <el-select placeholder="请选择公司地址" v-model="formSearch.address">
                               <el-option
                                 v-for="item in address"
                                 :key="item.index"
                                 :label="item.value"
                                 :value="item.key"
                                ></el-option>
                          </el-select>
                      </el-form-item>
                  </el-col>
                  <el-col :span="7">
                      <el-form-item label="总人数:" :label-width="formLabelWidth" prop="total">
                          <el-input placeholder="请输入总人数" v-model="formSearch.total"></el-input>
                      </el-form-item>
                  </el-col>
              </el-row>
              <el-row :gutter="20">
                  <el-col :span="7">
                      <el-form-item label="子公司名称:" :label-width="formLabelWidth" prop="subsidiary">
                         <el-select v-model="formSearch.subsidiary" placeholder="请选择子公司名称">
                            <el-option
                                v-for="item in subsidiary"
                                :key="item.index"
                                :label="item.value"
                                :value="item.key"></el-option>
                         </el-select>
                      </el-form-item>
                  </el-col>
                  <el-col :span="7">
                      <el-form-item label="成立时间：" :label-width="formLabelWidth" prop="established">
                          <el-date-picker
                              type="date"
                              v-model="formSearch.established"
                              placeholder="请选择日期"
                              @change="getEstablished"
                          ></el-date-picker>
                      </el-form-item>
                  </el-col>
                  <el-col :span="7">
                      <el-form-item>
                          <el-button @click="resetForm('formSearch')">重置</el-button>
                          <el-button type="primary" @click="submitForm">确定</el-button>
                      </el-form-item>
                  </el-col>
              </el-row>
          </el-form>
      </div>
      </transition>
        <el-table class="content-list" :data="tableData">
          <el-table-column
              prop="companyName"
              label="公司名称"
              min-width="150">
          </el-table-column>
          <el-table-column
              prop="address"
              label="公司地址"
              min-width="150">
              <template slot-scope="scope">
                {{getAddressText(scope.row.address)}}
              </template>
          </el-table-column>
          <el-table-column
              prop="total"
              label="总人数"
              min-width="150">
          </el-table-column>
          <el-table-column
              prop="subsidiary"
              label="子公司"
              min-width="150">
             <template slot-scope="scope">
                  {{getSubsidiaryText(scope.row.subsidiary)}}
              </template>
          </el-table-column>
          <el-table-column
              sortable
              prop="established"
              label="成立时间"
              min-width="150">
          </el-table-column>
          <el-table-column
              prop="remark"
              label="备注"
              min-width="150">
          </el-table-column>
          <el-table-column
              prop="state"
              label="操作"
              min-width="200">
              <template slot-scope="scope">
                  <el-button-group>
                      <el-button type="success" icon="el-icon-edit" @click="showDialog(scope.row)" size="small"></el-button>
                      <el-button type="danger" icon="el-icon-delete" @click="deleteConfig(scope.row._id)" size="small"></el-button>
                  </el-button-group>
                  <el-switch
                      @change="updateConfig(scope.row)"
                      v-model="scope.row.status"
                      on-color="#13ce66"
                      off-color="#ff4949">
                  </el-switch>
              </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
            <el-pagination
                layout="prev, pager, next"
                :total="totalPage"
                :page-size="formSearch.pageSize"
                :current-page.sync="formSearch.currentPage"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange">
            </el-pagination>
        </div>
  </div>
</template>

<script>
import add from './add.vue'
import {address, subsidiary, subsidiaryText, addressText} from "../utils/index.js";
import API from '../api/index.js'
export default {
  data(){
    return {
      tableData: [],
      formSearch: {
         company: '',
         address: '',
         subsidiary: '',
         established: '',
         pageSize: 3,
         currentPage: 1,
      },
      formLabelWidth: '100px',
      address: address,
      subsidiary: subsidiary,
      dialogFormVisible: false,
      searchShowBox: false,
      totalPage: 0,
      config: {}
    }
  },
  mounted(){
    this.requestQuery(this.formSearch);
  },
  methods: {
    addConfig() {
      this.config = {};
      this.dialogFormVisible = true;
    },
    onClose() {
      this.dialogFormVisible = false;
    },
    searchShow(){
        this.searchShowBox = !this.searchShowBox;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.searchShowBox = false;
    },
    submitForm(){
        this.formSearch.currentPage = 1;
        this.requestQuery(this.formSearch);
        this.searchShowBox = false;
    },
    requestQuery(data){
        API.queryList(data).then((res) => {
            if(res.data){
              this.totalPage = res.count;
              this.tableData = res.data;
              console.log(this.tableData);
              return;
            }
            this.tableData = [];
        })
    },
    getAddressText(item){
        return addressText[item];
    },
    getSubsidiaryText(item){
        return subsidiaryText[item];
    },
    showDialog(row){
      this.dialogFormVisible = true;
      this.config = row;
    },
    deleteConfig(id){
        this.$confirm('是否删除这条记录?').then(()=> {
              API.deleteCompany({'id': id}).then((res) => {
                  this.requestQuery(this.formSearch);
                  this.$message({
                      showClose: true,
                      message: '删除成功',
                      type: 'success'
                  })
              })
        }).catch( ()=>{ })
    },
    updateConfig(row){
        API.updateCompany({'id': row._id, 'status': row.status}).then((res) => {
            let str = '';
             if(status){
                  str = '开启成功'
             }else{
                  str = '关闭成功'
             }
             this.$message({
                showClose: true,
                message: str,
                type: 'success'
             });
        })
    },
    handleSizeChange(){
        this.formSearch.currentPage = 1;
        this.requestQuery(this.formSearch);
    },
    handleCurrentChange(val){
        this.formSearch.currentPage = val;
        this.requestQuery(this.formSearch);
    },
    getEstablished(val){
        this.formSearch.established = val;
    }
  },
  components: {
      add
  }
}
</script>

<style>
  .title-nav {
    display: flex;
    padding: 25px;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 3px 10px -3px #aaaaaa;
    position: relative;
    z-index:10;
  }

  .pagination-container {
    width: 100%;
    text-align: right;
    padding: 25px 25px;
  }

  .search-content {
    position: absolute;
    top: 86px;
    width: 100%;
    padding: 10px 25px 0px;
    z-index: 9;
    background: #ffffff;
  }

  .search-content .el-select, .search-content .el-date-editor {
    width: 100%;
  }
  /*过渡*/
  .search-enter-active, .search-leave-active {
    transition: all .5s ease
  }

  .search-enter, .search-leave-to {
    opacity: 0;
    transform: translateY(-75px);
  }
</style>

