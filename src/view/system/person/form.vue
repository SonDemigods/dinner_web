<template>
  <Modal v-model="visible"
         :title="title"
         :closable="false"
         :loading="loading"
         @on-ok="ok"
         @on-cancel="cancel">
    <Form ref="personFormData"
          :model="formData"
          :rules="formValidate"
          :label-width="80">
      <FormItem label="姓名"
                prop="name">
        <Input v-model="formData.name"
               placeholder="请填写姓名"></Input>
      </FormItem>
      <FormItem label="岗位">
        <Input v-model="formData.work"
               placeholder="请填写岗位"></Input>
      </FormItem>
    </Form>
  </Modal>
</template>

<script>
export default {
  name: 'personForm',
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
        work: ''
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
        this.$api('person/getPerson', { id: this.formId }).then(res => {
          this.formData = res
        })
      } else {
        this.formData = {
          id: null,
          name: '',
          work: ''
        }
      }
    },
    ok () {
      this.loading = false
      this.$refs['personFormData'].validate((valid) => {
        if (valid) {
          if (this.formId === 0) {
            this.$api('person/creatPerson', this.formData).then(res => {
              this.$Message.success('新增成功!')
              this.$emit('on-ok', false)
            })
          } else {
            this.$api('person/modifyPerson', this.formData).then(res => {
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
