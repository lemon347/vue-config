<template>
  <div>
    <el-dialog
      title="添加配置信息"
      :visible.sync="dialogVisible"
      :show-close="false"
      :modal-append-to-body="false"
      :close-on-click-modal="false">
        <el-form class="add-config" ref="form"
                 :rules="rules" :model="form">
            <el-col :span="12">
                <el-form-item label="公司名称：" :label-width="formLabelWidth" prop="companyName">
                    <el-input placeholder="请输入公司名称"
                      v-model="form.companyName"
                      :disabled="dataConfig.companyName != undefined"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="公司地址：" :label-width="formLabelWidth" prop="address">
                    <el-select v-model="form.address" placeholder="请选择公司地地址"
                        :disabled="dataConfig.address != undefined">
                        <el-option v-for="item in address"
                          :key="item.index"
                          :label="item.value"
                          :value="item.key"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="总人数：" :label-width="formLabelWidth" prop="total">
                    <el-input v-model="form.total" placeholder="请输入总人数"
                    :disabled="dataConfig.total != undefined"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="子公司名称" :label-width="formLabelWidth" prop="subsidiary">
                    <el-select v-model="form.subsidiary"
                       placeholder="请选择子公司名称" :disabled="dataConfig.subsidiary != undefined">
                        <el-option v-for="item in subsidiary"
                          :key="item.index"
                          :label="item.value"
                          :value="item.key"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="成立时间：" :label-width="formLabelWidth" prop="established">
                    <el-date-picker
                      v-model="form.established"
                      type="date"
                      placeholder="选择日期"
                      @change="getEstablished"></el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="备注" :label-width="formLabelWidth">
                    <el-input v-model="form.remark" placeholder="请输入备注"></el-input>
                </el-form-item>
            </el-col>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="resetForm('form')">取消</el-button>
            <el-button type="primary" @click="submitForm('form')">提交</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import {address, subsidiary} from "../utils";
import API from '../api/index.js'
export default {
  props: {
    dialogVisible: Boolean,
    dataConfig: Object,
  },
  data(){
    let validateEstablished = (rule, value, callback) => {
        if(!value){
            callback(new Error('请选择成立时间'))
        }
        callback()
    };
    return{
        dialogFormVisibile: true,
        form: {
          companyName: '',
          address: '',
          total: '',
          subsidiary: '',
          established: '',
          remark: ''
        },
        formLabelWidth: '120px',
        address: address,
        subsidiary: subsidiary,
        rules: {
            companyName: [{required: true, message: '请输入公司名字', trigger: 'change'}],
            address: [{required: true, message: '请选择公司地址', trigger: 'change'}],
            total: [{required: true, message: '请输入总人数', trigger: 'change'}],
            subsidiary: [{required: true, message: '请选择子公司名称', trigger: 'change'}],
            established: [{validator: validateEstablished, trigger: 'change'}]
        },
    }
  },
  mounted(){
    if(this.dataConfig.companyName!==undefined){
      this.form={...this.dataConfig}
    }
  },
  methods:{
      getEstablished(val){
          this.form.established = val;
      },
      resetForm(formName){
          this.$refs[formName].resetFields();
          this.$emit('dialogClose');
      },
      submitForm(formName){
          this.$refs[formName].validate((isPass) => {
              //isPass是一个布尔值，为true表示检验通过
              if(isPass){
                  if(!this.dataConfig.comapnyName){
                      API.addCompany(this.form).then((res) => {
                          this.$message({
                              showClose: true,
                              message: '添加成功',
                              type: 'success'
                          });
                          //成功派发关闭对话框事件和清空表单数据
                        this.$emit('dialogClose');
                        this.resetForm('form');
                      })
                  }else{
                    this.form.id = this.dataConfig._id;
                    this.updateConfig(this.form);
                  }
              }else{
                  //验证没有通过
                  return false;
              }
          })
      },
      updateConfig(data){
        API.updateCompany(data).then((res) => {
            this.message({
                showClose: true,
                message: '更新成功',
                type: 'success'
            });
            this.$emit('dialogClose');
            //this.$emit('updateSuccess');
            this.resetForm('form');
        }).catch((error) => {
            this.$message({
                showClose: true,
                message: error.msg,
                type: 'error'
            });
        })
    }
  }
}
</script>

<style>
  .add-config{
    overflow: hidden;
  }
</style>

