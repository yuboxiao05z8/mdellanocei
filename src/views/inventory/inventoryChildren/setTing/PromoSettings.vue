<template>
  <div class="PromoSettings_page">
    <div class="UpImgDiv" v-for="(item, index) in promoInfo" :key="index">
      <div class="up_module_head">
        <el-row>
          <el-col :span="12" class="up_module_head_title">{{item.text}}</el-col>
          <el-col :span="12" class="up_module_head_btn">
            <uploader
              :fileId="`imageFile${index}`"
              :maxSize="50"
              :uploadParam="[
                projectId, 
                {
                  name: 'type',
                  value: item.type,
                },
                {
                  name: 'promoId',
                  value: PromoId,
                }
              ]"
              @uploadAfter="uploadProjectImageAfter"
              :url="$api.uploadProjectPromoImage"
              fileType=".jpg,.jpeg,.png,.gif,.zip"
              :btnText="{select:$t('image.selectFile'),import:$t('image.addImages')}"
            ></uploader>
          </el-col>
        </el-row>
      </div>
      <p class="upImgInfo">Add an image in .jpg or .jpeg or .png or .gif format</p>
      <div class="upImg_time_and_img">
        <el-row>
          <el-col :span="12" class="upImg_time">
            <el-date-picker
              v-model="item.time"
              type="daterange"
              range-separator="To"
              start-placeholder="Start Date"
              end-placeholder="End Date"
              value-format="yyyy/MM/dd"
              unlink-panels
            ></el-date-picker>
          </el-col>
          <el-col :span="12" class="upImg_img">
            <el-image fit="contain" :src="hostUrl+item.src" class="imgBox" :preview-src-list="[hostUrl+item.src]">
              <div slot="placeholder" class="image-slot">
                loading
                <span class="dot">...</span>
              </div>
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="UpImgDiv_btn">
      <el-button @click="UpdataFn">Update</el-button>
    </div>
  </div>
</template>

<script>
import uploader from '@/components/uploader'
export default {
  components: {
    uploader,
  },
  data() {
    return {
      projectId: {
        name: 'projectId',
        value:
          JSON.parse(sessionStorage.getItem('projectDesc') || '{}').id || '',
      },
      promoInfo: [
        {
          text: 'Starbuy Image',
          type: 'starBuy',
          time: [],
          src: '',
        },
        {
          text: 'Project Pop-up Image',
          type: 'popUp',
          time: [],
          src: '',
        },
      ],
      PromoId: '',
      hostUrl: sessionStorage.getItem('serveUrl') || '',
    }
  },
  mounted() {
    this.queryProjectPromo()
  },
  methods: {
    uploadProjectImageAfter() {
      this.queryProjectPromo()
    },
    queryProjectPromo() {
      this.$Posting(this.$api.queryProjectPromo, {
        projectId: this.projectId.value,
      }).then((res) => {
        if (res.code == 0) {
          if (res.datas) {
            let obj = res.datas
            this.promoInfo = this.promoInfo.map((i) => {
              if (i.type == 'starBuy') {
                i.time = [obj.starbuyStartTime || '', obj.starbuyEndTime || '']
                i.src = obj.starbuyImg
              } else {
                i.time = [obj.popStartTime || '', obj.popEndTime || '']
                i.src = obj.popImg
              }
              return i
            })
            this.PromoId = obj.promoId
          }
        }
      })
    },
    UpdataFn() {
      let data = {
        promoId: this.PromoId,
        projectId: this.projectId.value,
        starbuyStartTime: this.promoInfo[0].time.length
          ? this.promoInfo[0].time[0]
          : '',
        starbuyEndTime: this.promoInfo[0].time.length
          ? this.promoInfo[0].time[1]
          : '',
        starbuyImg: this.promoInfo[0].src,
        popStartTime: this.promoInfo[1].time.length
          ? this.promoInfo[1].time[0]
          : '',
        popEndTime: this.promoInfo[1].time.length
          ? this.promoInfo[1].time[1]
          : '',
        popImg: this.promoInfo[1].src,
      }

      this.$Posting(this.$api.saveProjectPromo, data).then((res) => {
        if (res.code == 0) {
          this.$notify({
            title: 'Success',
            message: 'update completed',
            type: 'success',
          })
          this.queryProjectPromo()
        } else {
          this.$notify.error({
            title: 'error',
            message: res.msg,
          })
        }
      })
    },
  },
}
</script>

<style lang="less">
.PromoSettings_page {
  height: 100%;
  background: #fff;
  .UpImgDiv {
    padding: 15px;
    border-bottom: 1px solid #ddd;
    &:last-child {
      border-bottom: 0;
    }
  }
  .up_module_head {
    margin-bottom: 15px;
    line-height: 28px;
    .up_module_head_title {
      font-weight: bold;
    }
    .up_module_head_btn {
      text-align: right;
    }
  }
  .upImgInfo {
    background: #f4f4f4;
    padding: 5px 10px;
    color: #999;
  }
  .upImg_time_and_img {
    margin-top: 15px;
    .upImg_img {
      text-align: right;
      .imgBox {
        width: 200px;
        height: 150px;
        background: #f4f4f4;
        border-radius: 8px;
        .image-slot {
          text-align: center;
          height: 150px;
          line-height: 150px;
        }
      }
    }
  }
  .upImg_time {
    height: 150px;
    line-height: 150px;
    .el-range-separator {
      width: 50px;
    }
  }
  .UpImgDiv_btn {
    text-align: center;
    margin-top: 15px;
    button {
      width: 200px;
    }
  }
}
</style>