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
                @on-delete="deleteForm">
      <div slot="tool">
        <Button type="error"
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
    <foodForm v-model="foodFormShow"
              :title="foodFormTitle"
              :form-id='foodFormId'
              @on-ok="saveForm"
              @on-cancel="cancelForm"></foodForm>
  </div>
</template>

<script>
import baseTable from '_c/tables'
import columnsList from './columns'
import foodForm from './form'
// 菜品接口
import { getFoodPage, deleteFood } from '@/api/system/food'
export default {
  name: 'foodList',
  components: {
    baseTable,
    foodForm
  },
  props: {},
  data () {
    return {
      tableHeight: window.innerHeight - 250,
      columns: columnsList,
      tableData: [],
      total: 0,
      pageSize: 20,
      current: 1,
      foodFormShow: false,
      foodFormId: 0,
      foodFormTitle: ''
    }
  },
  watch: {},
  computed: {},
  methods: {
    addForm () {
      this.foodFormTitle = '新增'
      this.foodFormId = 0
      this.foodFormShow = true
    },
    editForm (index) {
      this.foodFormTitle = '修改'
      this.foodFormId = this.tableData[index].id
      this.foodFormShow = true
    },
    deleteForm (index) {
      let config = {
        title: '确认',
        content: '是否删除该数据？',
        onOk: () => {
          deleteFood({ id: this.tableData[index].id }).then(res => {
            this.$Message.success('删除成功！')
            this.reloadTable()
          })
        }
      }
      this.$Modal.confirm(config)
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
      this.foodFormShow = type
    },
    saveForm (type) {
      this.foodFormShow = type
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
    searchTable () {
      this.searchKey = this.searchKeyNow
      this.current = 1
      this.reloadTable()
    },
    reloadTable () {
      let data = {
        pageSize: this.pageSize,
        current: this.current
      }
      getFoodPage(data).then(res => {
        this.tableData = res.row
        this.total = res.total
      })
    }
  },
  created () {
    this.reloadTable()
  },
  mounted () {
    window.addEventListener('resize', () => {
      this.tableHeight = window.innerHeight - 250
    })
  }
}
</script>
<style lang="less" scoped>
</style>
