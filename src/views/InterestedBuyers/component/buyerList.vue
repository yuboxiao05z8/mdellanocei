<template>
  <div class="buyerList_page">
    <div class="addTab">
      <el-table size="mini" class="tab_div_con" :data="buyerList" style="width: 100%">
        <el-table-column label="Name" prop="buyerName"></el-table-column>
        <el-table-column label="Customer Type" prop="customerType">
          <template slot-scope="scope">{{
            SellBlockData.CustomerTypeData[Number(scope.row.customerType)].name
          }}</template>
        </el-table-column>
        <el-table-column
          label="Nationality"
          prop="nationality"
        ></el-table-column>
        <el-table-column label="ID No." prop="nricPassport"></el-table-column>
        <el-table-column label="Email" prop="buyerEmail"></el-table-column>
        <el-table-column label="Mobile" prop="buyerMobile"></el-table-column>
        <el-table-column label="Action" width="180">
          <template slot="header" slot-scope="scope">
            <el-button
              size="mini"
              v-if="(!porjectInfo.isOpening || developers == 2) && buyerList.length < 5"
              icon="el-icon-plus"
              @click="showDialog"
              >ADD</el-button
            >
          </template>
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="editFn(scope.$index, scope.row)"
              >EDIT</el-button
            >
            <el-button
              v-if="(!porjectInfo.isOpening || developers == 2) && buyerList.length > 1"
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >DELETE</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <add-buyer-pop :buyFom="buyFom" @EditSuccess="EditSuccess" ref="add_pop" />
  </div>
</template>

<script>
import SellBlockData from '../../SalesBooking/SalesFlowchart/commponents/SellBlockData.json'
import AddBuyerPop from './AddBuyerPop'
export default {
  components: { AddBuyerPop },
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  inject: ['porjectInfo'],
  data() {
    return {
      SellBlockData: SellBlockData,
      buyerList: [],
      buyFom: {},
      developers: JSON.parse(sessionStorage.getItem('userInfo')).type
    }
  },
  watch: {
    list(val) {
      this.buyerList = JSON.parse(JSON.stringify(val))
    },
  },
  methods: {
    showDialog() {
      this.$refs.add_pop.show = true
    },
    editFn(index, row) {
      this.buyFom = {
        ...row,
        editIndex: index,
      }
      this.$refs.add_pop.show = true
    },
    handleDelete(index, row) {
      this.$confirm('Are you sure to delete it?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning',
      })
        .then(() => {
          this.buyerList.splice(index, 1)
          this.$message({
            type: 'success',
            message: 'deleted successfully!',
          })
        })
        .catch()
    },
    EditSuccess(data) {
      let { editIndex } = data
      if (typeof editIndex === 'number') {
        this.$set(this.buyerList, editIndex, data)
        return
      }

      let repetitive = this.buyerList.findIndex((i) => {
        return data.nricPassport == i.nricPassport || data.buyerName == i.buyerName
      })

      if (repetitive != '-1') {
        this.warningFn()
      } else {
        this.validateInterestBuyInfo(data)
      }

      this.buyerList.push(data)
      this.buyFom = {}
    },
    async validateInterestBuyInfo(obj) {
      let data = {
        interestId: obj.interestId || '',
        projectId: this.$route.query.id,
        buyerName: obj.buyerName,
        nricPassport: obj.nricPassport,
      }

      let res = await this.$Post(this.$api.validateInterestBuyInfo, data)

      if (res.code == -1) {
        this.warningFn(`(${res.datas.join(' / ')})`)
      }

    },
    warningFn(msg) {
      this.$notify({
        title: 'Warning',
        message: 'Duplicate Alert - Buyer Name or NRIC/Passport' + msg,
        type: 'warning',
        duration: 0
      })
    },
    
  },
}
</script>

<style lang="less">
.buyerList_page {
  .addTab {
    border: 1px solid #ddd;
  }
}
</style>