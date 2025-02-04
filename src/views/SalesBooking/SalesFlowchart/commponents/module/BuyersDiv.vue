<template>
  <div class="Module_Tab_Div">
    <div class="optinDiv" v-for="(item, index) in BuyObj" :key="index">
      <h1>Buyers {{ index + 1 }}</h1>
      <div class="buyerBox">
        <el-row :gutter="20">
          <el-col :span="8">
            <span>Name:</span>
            <span>{{ item.buyerName }}</span>
          </el-col>
          <el-col :span="8">
            <span>Area Code:</span>
            <span>{{ item.countryCallingCode }}</span>
          </el-col>
          <el-col :span="8">
            <span>Mobile:</span>
            <span>{{ item.buyerMobile }}</span>
          </el-col>
          <el-col :span="8">
            <span>Email:</span>
            <span>{{ item.buyerEmail }}</span>
          </el-col>
          <el-col :span="8">
            <span>Nationality:</span>
            <span>{{ item.nationality }}</span>
          </el-col>
          <el-col :span="8">
            <span>NRIC /Passport:</span>
            <span>{{ item.nricPassport }}</span>
          </el-col>
          <el-col :span="8">
            <span>Unit:</span>
            <span>{{ item.unitNo }}</span>
          </el-col>
          <el-col :span="8">
            <span>Block:</span>
            <span>{{ item.block }}</span>
          </el-col>
          <el-col :span="8">
            <span>Street Name:</span>
            <span>{{ item.streetName }}</span>
          </el-col>
          <el-col :span="8">
            <span>Postal Code:</span>
            <span>{{ item.postalCode }}</span>
          </el-col>
          <el-col :span="8">
            <span>Country:</span>
            <span>{{ item.country }}</span>
          </el-col>
        </el-row>
        <div class="nricPassportImg_div" v-if="item.nricPassportImg">
          <el-row :gutter="20">
            <el-col :span="4">
              <span>ID/Passport Photo：</span>
            </el-col>
            <el-col :span="20">
              <img
                v-for="(item, index) in item.nricPassportImg.split(',')"
                :src="hostUrl + item"
                @click.stop="$imgPreview(hostUrl + item)"
                alt=""
              />
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    BuyObj: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      hostUrl: sessionStorage.getItem('serveUrl'),
    }
  },
  mounted() {
    console.log(this.BuyObj)
  },
}
</script>

<style lang="less">
.Module_Tab_Div {
  border: 1px solid #f4f4f4;
  margin-bottom: 15px;
  h1 {
    padding: 10px;
    background: #f4f4f4;
  }
  .buyerBox {
    padding: 15px;
    .el-col-8 {
      padding: 5px 10px;
      span {
        color: #666;
      }
      span:last-child {
        margin-left: 10px;
        color: #000;
      }
    }
  }
  .nricPassportImg_div {
    span {
      color: #666;
    }
    img {
      width: 90px;
      height: 60px;
      object-fit: contain;
      background: #ddd;
      border-radius: 5px;
      margin: 0 15px;
    }
  }
}
</style>