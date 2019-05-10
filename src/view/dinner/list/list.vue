<template>
  <div>
    <base-table ref="tables"
                searchable
                :height="tableHeight"
                v-model="tableData"
                :columns="columns"
                :page="current"
                :page-size="pageSize"
                @on-selection-change="selectForm"
                @on-edit="editForm"
                @on-delete="deleteForm"
                @on-leave="editLeaveForm">
      <div slot="tool">
        <DatePicker v-model="searchDate"
                    type="date"
                    placeholder="请选择日期"
                    style="width: 200px"
                    clearable
                    @on-change="searchTable"></DatePicker>

        <Select v-if="access_delete"
                v-model="personListModel"
                @on-change="personOnChangeHandle"
                style="width:200px; margin-left:10px;">
          <Option v-for="item in personList"
                  :value="item.id"
                  :key="item.id">{{ item.name }}</Option>
        </Select>

        <Button style="margin-left:10px;"
                @click="onlyMeClick">只看自己
        </Button>

        <Button v-if="access_delete"
                type="error"
                icon='md-trash'
                style="float:right;"
                @click="deleteFormMultiple">删除
        </Button>
        <Button type="success"
                icon='md-add-circle'
                style="float:right;"
                @click="addForm">新增
        </Button>
        </Button>
      </div>
      <div slot="page">
        <Page :total="total"
              :page-size="pageSize"
              :current="current"
              show-elevator
              show-total
              show-sizer
              @on-change="changePage"
              @on-page-size-change="changePageSize" />
      </div>
    </base-table>
    <workForm v-model="workFormShow"
              :title="workFormTitle"
              :form-id='workFormId'
              @on-ok="saveForm"
              @on-cancel="cancelForm"></workForm>

    <Modal v-model="leaveModal"
           title="修改打卡时间"
           :closable="false"
           :loading="loading"
           @on-ok="okLeave"
           @on-cancel="cancelLeave">
      <Form ref="leaveFormData"
            :model="leaveForm"
            :rules="leaveformValidate"
            :label-width="80">
        <FormItem label="打卡时间"
                  prop="leave">
          <TimePicker v-model="leaveForm.leave"
                      format="HH:mm"
                      placeholder="请选择时间"
                      style="width: 100%;"></TimePicker>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { hasOneOf } from '@/libs/tools'
import baseTable from '_c/tables'
import columnsList from './columns'
import workForm from '../form/form'
export default {
  name: 'workList',
  components: {
    baseTable,
    workForm
  },
  props: {},
  data () {
    return {
      pid: '',
      personListModel: '',
      personList: [],
      searchDate: '',
      tableHeight: window.innerHeight - 250,
      columns: columnsList,
      tableData: [],
      total: 0,
      pageSize: 20,
      current: 1,
      workFormShow: false,
      workFormId: 0,
      workFormTitle: '',
      leaveModal: false,
      loading: true,
      leaveForm: {
        id: null,
        leave: new Date()
      },
      leaveformValidate: {
        leave: [
          { required: true, message: '时间不能为空', trigger: 'change' }
        ]
      }
    }
  },
  watch: {},
  computed: {
    access () {
      return this.$store.state.user.access
    },
    /**
     * 新增
     * @returns {*}
     */
    access_delete () {
      return hasOneOf(['isAdmin'], this.access)
    }
  },
  methods: {
    onlyMeClick () {
      this.pid = localStorage.getItem('userid')
      this.current = 1
      this.searchDate = ''
      console.info(`pid ${this.pid}`)
      this.reloadTable()
      // this.getWorkListByNameId(userId)
    },
    getWorkListByNameId (nameId) {
      this.$api('work/getWorkListByNameId', { nameId: nameId }).then(res => {
        console.info('res', res)
        this.tableData = res
      })
    },
    personOnChangeHandle (item) {
      console.info('personOnChangeHandle', item)
      this.getWorkListByNameId(item)
    },
    init () {
      this.getPersonList()
    },
    getPersonList () {
      this.$api('person/getPersonList').then(res => {
        console.info('res', res)
        this.personList = res
      })
    },
    addForm () {
      this.workFormTitle = '新增'
      this.workFormId = 0
      this.workFormShow = true
    },
    editForm (index) {
      this.workFormTitle = '修改'
      this.workFormId = this.tableData[index].id
      this.workFormShow = true
    },
    deleteForm (index) {
      let config = {
        title: '确认',
        content: '是否删除该数据？',
        onOk: () => {
          this.$api('work/deleteWork', { id: this.tableData[index].id }).then(res => {
            this.$Message.success('删除成功！')
            this.reloadTable()
          })
        }
      }
      this.$Modal.confirm(config)
    },
    editLeaveForm (index) {
      this.leaveModal = true
      this.leaveForm.id = this.tableData[index].id
      this.leaveForm.leave = this.tableData[index].leave
    },
    okLeave () {
      this.loading = false
      this.$refs['leaveFormData'].validate((valid) => {
        if (valid) {
          this.$api('work/leaveWork', this.leaveForm).then(res => {
            this.$Message.success('修改成功!')
            this.leaveModal = false
            this.reloadTable()
          })
        } else {
          this.$nextTick(() => {
            this.loading = true
          })
          this.$Message.error('请检查表单!')
        }
      })
    },
    cancelLeave () {
      this.leaveModal = false
    },
    deleteFormMultiple () {
      if (this.selectionIds.length === 0) {
        let config = {
          title: '提示',
          content: '请选择数据！'
        }
        this.$Modal.warning(config)
      } else if (this.selectionIds.length > 0) {
        let config = {
          title: '确认',
          content: '是否删除这些数据？',
          onOk: () => {
            this.$Message.success('删除成功！')
          }
        }
        this.$Modal.confirm(config)
      }
    },
    selectForm (selection) {
      let arr = []
      if (selection && selection !== undefined && selection.length > 0) {
        for (let i = 0; i < selection.length; i++) {
          let item = selection[i]
          arr.push(item.id)
        }
      }
      this.selectionIds = arr
    },
    cancelForm (type) {
      this.workFormShow = type
    },
    saveForm (type) {
      this.workFormShow = type
      this.reloadTable()
    },
    // 分页相关方法
    changePage (page) {
      this.current = page
      this.reloadTable()
    },
    changePageSize (pageSize) {
      this.pageSize = pageSize
      this.reloadTable()
    },
    // 搜索相关方法
    searchTable (date) {
      this.searchDate = date
      this.pid = ''
      this.current = 1
      this.reloadTable()
    },
    reloadTable () {
      let data = {
        pageSize: this.pageSize,
        current: this.current,
        date: this.searchDate,
        pid: this.pid
      }
      this.$api('work/getWorkPage', data).then(res => {
        console.info('getWorkPage res', res)
        this.tableData = res.row
        this.total = res.total
      })
    }
  },
  created () {
    this.reloadTable()
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang="less" scoped>
</style>
