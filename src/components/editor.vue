<template>
  <!-- <textarea class="textInput" :id='editorId' :value='value'></textarea> -->
  <div>
    <editor class="textInput" :id='editorId' :init="initData" :value='value' />
  </div>
</template>
<script>
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver'
import 'tinymce/icons/default/icons'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/image'
import 'tinymce/plugins/link'
import 'tinymce/plugins/paste'
import 'tinymce/plugins/code'
import 'tinymce/plugins/textcolor'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/nonbreaking'
import md5 from 'js-md5'

export default {
  components: { editor: Editor },
  props: {
    value: {
      type: String,
      required: true
    },
    setting: {},
    editorId: {
      type: String,
      required: true
    },
    uploadImageType: {
      type: String,
      default: '1'
    }
  },
  data () {
    return {
      accept: 'image/jpeg, image/png,image/jpg',
      hostUrl: sessionStorage.getItem('serveUrl') || '',
      initData: {
        skin_url: '/static/tinymce/skins/ui/oxide',
        menubar: false,
        plugins:
          'code,advlist,lists nonbreaking,image,link,paste,wordcount,preview ',
        toolbar_items_size: 'small',
        block_formats:
          'Paragraph=p;Heading 1=h1;Heading 2=h2;Heading 3=h3;Heading 4=h4;Heading 5=h5;Heading 6=h6;',
        toolbar1: 'undo redo | formatselect |  uploadimg image | code |', // 工具栏1  link unlink
        toolbar2:
          ' fontsizeselect | forecolor backcolor | fontselect bold italic underline strikethrough | bullist numlist | alignleft aligncenter alignright alignjustify |  outdent indent | removeformat | preview', // 工具栏2

        content_style: `
          *                         { padding:0; margin:0; }
          html, body                { height:100%; }
          img                       { max-width:100%; display:block;height:auto; }
          a                         { text-decoration: none; }
          iframe                    { width: 100%; }
          p                         { line-height:1.6; margin: 0px; }
          table                     { word-wrap:break-word; word-break:break-all; max-width:100%; border:none; border-color:#999; }
          .mce-object-iframe        { width:100%; box-sizing:border-box; margin:0; padding:0; }
          ul,ol                     { list-style-position:inside; }
        `,
        min_height: 400,
        font_formats:
          'Arial=Arial;Courier New=Courier New;Garamond=Garamond;Georgia=Georgia;MS Sans Serif=MS Sans Serif;Segoe UI=Segoe UI;Tahoma=Tahoma;Times New Roman=Times New Roman;Verdana=Verdana',
        fontsize_formats: '12px 14px 18px 24px 36px',

        paste_retain_style_properties: 'all',
        paste_word_valid_elements: '*[*]', // word需要它
        paste_data_images: true, // 粘贴的同时能把内容里的图片自动上传，非常强力的功能
        paste_convert_word_fake_lists: false, // 插入word文档需要该属性
        paste_webkit_styles: 'all',
        // paste_merge_formats: true,
        nonbreaking_force_tab: true, //不允许用户按tab键时进行元素的选择
        ...this.getSetting()
      }
    }
  },
  mounted () {
    let setting = this.getSetting()
    let _this = this
    tinymce.init({})
  },
  methods: {
    getSetting () {
      let _this = this
      return {
        selector: '#' + _this.editorId,
        init_instance_callback: function (editor) {
          editor.on('input change undo redo', () => {
            var content = editor.getContent()
            _this.$emit('show', { content: content, id: _this.editorId })
          })
        },
        // 图片上传
        images_upload_handler: function (blobInfo, success, failure) {
          if (blobInfo.blob().size / 1024 / 1024 > 3) {
            failure('File size is too large')
          }
          if (_this.accept.indexOf(blobInfo.blob().type) >= 0) {
            _this.uploadPic(blobInfo, success, failure)
          } else {
            failure('Image format error')
          }
        }
      }
    },
    uploadPic (blobInfo, success, failure) {
      let _this = this
      // 发送请求
      const formData = new FormData()
      let userInfo = JSON.parse(
        window.sessionStorage.getItem('userInfo') || '{}'
      )
      let editorImg = []
      let uploadImageUrl = this.$api.uploadFile
      formData.append('brokeId', userInfo.brokeId)
      formData.append('userId', userInfo.userId)
      formData.append('token', userInfo.token)
      formData.append('file', blobInfo.blob())
      let params = { brokeId: userInfo.brokeId, userId: userInfo.userId }
      if (this.uploadImageType == 1) {
        let projectId =
          JSON.parse(sessionStorage.getItem('projectDesc') || '{}').id || ''
        formData.append('type', 'editorImg')
        formData.append('projectId', projectId)
        params['type'] = 'editorImg'
        params['projectId'] = projectId
      } else {
        uploadImageUrl = this.$api.uploadEditorImg
      }
      let sign = this.$signatrue(params)
      formData.append("signature", sign);

      _this
        .$PostFormData(uploadImageUrl, formData)
        .then(function (data) {
          if (data.code == 0) {
            if (window.sessionStorage.getItem('editorImg')) {
              editorImg = JSON.parse(window.sessionStorage.getItem('editorImg'))
            }
            editorImg.push(_this.hostUrl + data.datas.filePath)
            window.sessionStorage.setItem(
              'editorImg',
              JSON.stringify(editorImg)
            )
            _this.$emit('on-upload-success', [data.datas, success, failure])
          } else {
            failure('Update Fail: ' + data.code)
            return
          }
        })
        .catch(err => {
          failure('Busy network')
        })
    }
  },
  beforeDestroy: function () {
    tinymce.get(this.editorId).destroy()
  }
}
</script>

<style lang="less">
.mce-panel {
  width: 100% !important;
}
</style>