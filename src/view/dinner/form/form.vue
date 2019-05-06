<template>
  <Modal v-model="visible"
         :title="title"
         :closable="false"
         :loading="loading"
         @on-ok="ok"
         @on-cancel="cancel">
    <Form ref="workFormData"
          :model="formData"
          :rules="formValidate"
          :label-width="80">
      <FormItem label="姓名">
        <Select v-model="formData.pid"
                placeholder="请选择人员"
                filterable
                clearable
                disabled>
          <Option v-for="item in personList"
                  :value="item.id"
                  :key="item.id">{{ item.name }}</Option>
        </Select>
      </FormItem>
      <FormItem label="类型"
                prop="type">
        <Select v-model="formData.type"
                placeholder="请选择类型"
                filterable
                clearable>
          <Option v-for="item in workTypeList"
                  :value="item.value"
                  :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="菜品"
                prop="fid"
                v-if="formData.type === 1">
        <Select v-model="formData.fid"
                placeholder="请选择菜品"
                filterable
                clearable
                @on-change="changeFid">
          <Option v-for="item in foodList"
                  :value="item.id"
                  :key="item.id">{{ item.name }}</Option>
        </Select>
      </FormItem>
      <FormItem label="加班日期"
                prop="date">
        <DatePicker v-model="formData.date"
                    type="date"
                    placeholder="请选择日期"
                    @on-change="_ => formData.date = _"
                    style="width: 100%;"></DatePicker>
      </FormItem>
      <FormItem label="备注">
        <Input v-model="formData.remark"
               type="textarea"
               :rows="4"
               placeholder="请填写备注"></Input>
      </FormItem>
    </Form>
  </Modal>
</template>

<script>
import { workType } from '@/libs/selectList'
export default {
  name: 'workForm',
  components: {},
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '表单'
    },
    formId: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      workTypeList: workType,
      visible: this.value,
      loading: true,
      formData: {
        id: null,
        fid: null,
        pid: null,
        type: null,
        date: null,
        remark: ''
      },
      personList: [],
      foodList: [],
      formValidate: {
        fid: [
          { required: true, type: 'number', message: '菜品不能为空', trigger: 'change' }
        ],
        type: [
          { required: true, type: 'number', message: '类型不能为空', trigger: 'change' }
        ],
        date: [
          { required: true, message: '加班日期不能为空', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    value (val) {
      this.visible = val
      if (val) {
        this.formInit()
      }
    }
  },
  computed: {
  },
  methods: {
    formInit () {
      this.$api('food/getFoodList').then(res => {
        this.foodList = res
      })
      this.$api('person/getPersonList').then(res => {
        this.personList = res
      })
      if (this.formId !== 0) {
        this.$api('work/getWork', { id: this.formId }).then(res => {
          this.formData = res
        })
      } else {
        this.formData = {
          id: null,
          fid: null,
          pid: null,
          type: null,
          remark: ''
        }
        let userId = JSON.parse(localStorage.getItem('userid'))
        this.formData.pid = userId
      }
    },
    changeFid (val) {
      if (val === 2) {
        this.formData.fid = null
      }
    },
    ok () {
      this.loading = false
      this.$refs['workFormData'].validate((valid) => {
        if (valid) {
          if (this.formId === 0) {
            this.$api('work/creatWork', this.formData).then(res => {
              this.$Message.success('新增成功!')
              this.$emit('on-ok', false)
            })
          } else {
            this.$api('work/modifyWork', this.formData).then(res => {
              this.$Message.success('修改成功!')
              this.$emit('on-ok', false)
            })
          }
        } else {
          this.$nextTick(() => {
            this.loading = true
          })
          this.$Message.error('请检查表单!')
        }
      })
    },
    cancel () {
      this.$emit('on-cancel', false)
    }
  },
  created () { },
  mounted () { }
}
</script>
<style lang="less" scoped>
</style>
