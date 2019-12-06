<template>
  <Modal v-model="visible"
         :title="title"
         :closable="false"
         :loading="loading"
         @on-ok="ok"
         @on-cancel="cancel">
    <Form ref="foodFormData"
          :model="formData"
          :rules="formValidate"
          :label-width="80">
      <FormItem label="名称"
                prop="name">
        <Input v-model="formData.name"
               placeholder="请填写名称"></Input>
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
// 菜品接口
import { getFood, creatFood, modifyFood } from '@/api/system/food'

export default {
  name: 'foodForm',
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
      visible: this.value,
      loading: true,
      formData: {
        id: null,
        name: '',
        remark: ''
      },
      formValidate: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
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
      if (this.formId !== 0) {
        getFood({ id: this.formId }).then(res => {
          this.formData = res
        })
      } else {
        this.formData = {
          id: null,
          name: '',
          remark: ''
        }
      }
    },
    ok () {
      this.loading = false
      this.$refs['foodFormData'].validate((valid) => {
        if (valid) {
          if (this.formId === 0) {
            creatFood(this.formData).then(res => {
              this.$Message.success('新增成功!')
              this.$emit('on-ok', false)
            })
          } else {
            modifyFood(this.formData).then(res => {
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
