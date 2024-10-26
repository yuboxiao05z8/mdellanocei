import Vue from 'vue'

/* 接口地址 */
Vue.api = Vue.prototype.$api = {
  /**
   * 写入接口列表
   */
  // login
  login:"/broke-manager-service/sysuser/login",//登录
  // invetory
  uploadFile:"/broke-manager-service/upload/uploadFile",//项目内文件上传
  uploadEditorImg:"/broke-manager-service/upload/uploadEditorImg",//项目外文件上传
  uploadWebResource:"/broke-manager-service/upload/uploadWebResource",//上传web资源包
  deleteFile:"/broke-manager-service/upload/deleteFile",//删除文件
  importProject: "/broke-manager-service/import/importProject", //导入项目excel
  exportProject: "/broke-manager-service/export/exportProject", //导出项目excel
  updateProjectName:"/broke-manager-service/project/updateProjectName",//修改项目名称
  queryProject: "/broke-manager-service/project/queryProject", //查询项目列表
  queryProjectDetail: "/broke-manager-service/project/queryProjectDetail", //查询项目详情
  updateProject: "/broke-manager-service/project/updateProject", //编辑项目信息
  queryBuilding:"/broke-manager-service/building/queryBuilding",//查询building列表
  deleteBuilding:"/broke-manager-service/building/deleteBuilding",//删除building
  saveBuilding:"/broke-manager-service/building/saveBuilding",//保存building
  importFloorPlan:"/broke-manager-service/import/importFloorPlan",//导入floor plan
  importFloorPlanImg:"/broke-manager-service/upload/uploadFloorPlanImg",//导入floor plan img
  exportFloorPlan:"/broke-manager-service/export/exportFloorPlan",//导出floor plan
  queryFloorPlan:"/broke-manager-service/floorplan/queryFloorPlan",//查询floorplan列表
  saveFloorPlan:"/broke-manager-service/floorplan/saveFloorPlan",//保存floor plan
  deleteFloorPlan:"/broke-manager-service/floorplan/deleteFloorPlan",//删除floor plan
  importUnit:"/broke-manager-service/import/importUnit",//导入unit
  importUnitTransaction:"/broke-manager-service/import/importUnitTransaction",//导入unit Transaction
  exportUnit:"/broke-manager-service/export/exportUnit",//导出unit
  exportUnitTransaction:"/broke-manager-service/export/exportUnitTransaction",//导出unit Transaction
  queryProjectTemplate:"/broke-manager-service/email/queryProjectTemplate",//查询email template
  saveProjectTemplate:"/broke-manager-service/email/saveProjectTemplate",//保存email template
  queryProjectSet:"/broke-manager-service/project/queryProjectSet",//查询Setting
  saveProjectSet:"/broke-manager-service/project/saveProjectSet",//保存Setting
  queryProjectCompany:"/broke-manager-service/brokeProject/queryBrokeProject",//查询项目关联的经纪公司列表
  saveProjectCompany:"/broke-manager-service/brokeProject/saveBrokeProject",//保存项目关联的经纪公司
  deleteProjectCompany:"/broke-manager-service/brokeProject/deleteBrokeProject",//删除项目关联经纪公司
  uploadProjectMedia:"/broke-manager-service/upload/uploadProjectMedia",//上传Media
  queryProjectMedia:"/broke-manager-service/media/queryProjectMedia",//查询media列表
  saveProjectMedia:"/broke-manager-service/media/saveProjectMedia",//保存media
  deleteProjectMedia:"/broke-manager-service/media/deleteProjectMedia",//删除media
  uploadProjectMainImg:"/broke-manager-service/upload/uploadProjectMainImg",//上传Main Image
  queryProjectMainimg:"/broke-manager-service/project/queryProjectMainimg",//查询main image
  downloadMainImg:"/broke-manager-service/download/downloadMainImg",//下载main img
  uploadSitePlan:"/broke-manager-service/upload/uploadSitePlan",//导入 site plan img
  querySitePlan:"/broke-manager-service/siteplan/querySitePlan",//查询site plan列表
  createSitePlan:"/broke-manager-service/siteplan/createSitePlan",//创建site plan
  updateSitePlan:"/broke-manager-service/siteplan/updateSitePlan",//修改project site plan
  deleteSitePlan:"/broke-manager-service/siteplan/deleteSitePlan",//删除project site plan
  querySitePlanDetail:"/broke-manager-service/siteplan/querySitePlanDetail",//查询project site plan详情
  queryUnit:"/broke-manager-service/unit/queryUnit",//根据building查询unit
  updateSiteContent:"/broke-manager-service/siteplan/updateSiteContent",//保存 edit mapping
  uploadFloorPlan3D:"/broke-manager-service/upload/uploadFloorPlan3D",//上传floor plan 3d
  deleteFloorPlanModel:"/broke-manager-service/floorplan/deleteFloorPlanModel",//删除floor plan model
  queryBuildingSitePlan:"/broke-manager-service/siteplan/queryBuildingSitePlan",//查询site plan building列表
  queryUnitList:"/broke-manager-service/unit/queryUnitList",//查询unit列表
  deleteUnit:"/broke-manager-service/unit/deleteUnit",//删除unit
  editUnit:"/broke-manager-service/unit/editUnit",//编辑unit
  queryUnitGroupList:"/broke-manager-service/unitGroup/queryUnitGroupList",//查询unit group 列表
  deleteUnitGroupJoin:"/broke-manager-service/unitGroup/deleteUnitGroupJoin",//删除unit group 关联的unit
  deleteUnitGroupTeam:"/broke-manager-service/unitGroup/deleteUnitGroupTeam",//删除unit group 关联的team
  saveUnitGroup:"/broke-manager-service/unitGroup/saveUnitGroup",//保存unit group
  deleteUnitGroup:"/broke-manager-service/unitGroup/deleteUnitGroup",//删除unit group
  insertUnitGroupJoin:"/broke-manager-service/unitGroup/insertUnitGroupJoin",//保存unit group 关联的unit
  queryUnitGroupJoin:"/broke-manager-service/unitGroup/queryUnitGroupJoin",//查询unit group 关联unit列表
  insertUnitGroupTeam:"/broke-manager-service/unitGroup/insertUnitGroupTeam",//保存unit group 关联的team
  queryUnitGroupTeam:"/broke-manager-service/unitGroup/queryUnitGroupTeam",//查询unit group 关联的team列表
  importUnitGroup:"/broke-manager-service/import/importUnitGroup",//导入unit group
  exportUnitGroup:"/broke-manager-service/export/exportUnitGroup",//导出unit group
  saveSpaNotificationSettings:"/broke-manager-service/project/saveSpaNotificationSettings",//保存SPA & Notification Settings
  queryPermissionList:"/broke-manager-service/access/queryPermissionList",//查询Permission角色列表
  deletePermission:"/broke-manager-service/access/deletePermission",//删除角色关联Permission
  savePermission:"/broke-manager-service/access/savePermission",//保存角色关联Permission
  saveDefaultPermission:"/broke-manager-service/access/saveDefaultPermission",//保存角色默认关联Permission
  deleteDocument:"/broke-manager-service/document/deleteDocument",//删除document信息
  queryDocumentList:"/broke-manager-service/document/queryDocumentList",//查看document文件列表
  saveDocument:"/broke-manager-service/document/saveDocument",//保存document信息
  queryWatermark:"/broke-manager-service/document/queryWatermark",//查询Watermark
  deleteWatermark:"/broke-manager-service/document/deleteWatermark",//删除Watermark
  uploadWatermark:"/broke-manager-service/upload/uploadWatermark",//上传Watermark
  uploadDocument:"/broke-manager-service/upload/uploadDocument",//上传Document
  putOffOn:"/broke-manager-service/floorplan/putOffOn",//putOffOn
  downFloorPlan:"/broke-manager-service/floorplan/downFloorPlan",//下载Floor Plan
  // admin
  queryGeneralFile:"/broke-manager-service/general/queryGeneralFile",//查询general file列表
  deleteGeneralFile:"/broke-manager-service/general/deleteGeneralFile",//删除general file
  updateGeneralFile:"/broke-manager-service/general/updateGeneralFile",//修改general file
  uploadGeneralFile:"/broke-manager-service/upload/uploadGeneralFile",//upload general file
  downloadAgentTemplate:"/broke-manager-service/download/downloadAgentTemplate",//下载user模版
  queryBrokeAgent:"/broke-manager-service/brokeAgent/queryBrokeAgent",//查询经纪人列表
  updateBrokeAgent:"/broke-manager-service/brokeAgent/updateBrokeAgent",//更新经纪人信息
  exportUsers:"/broke-manager-service/export/exportUsers",//导出users
  importUsers:"/broke-manager-service/import/importUsers",//导入users
  importTeamIC:"/broke-manager-service/import/importTeamIC",//导入team ic
  saveBrokeCompany:"/broke-manager-service/company/saveBrokeCompany",//保存broke
  queryBrokeCompany:"/broke-manager-service/company/queryBrokeCompany",//查询经纪公司列表
  deleteBrokeCompany:"/broke-manager-service/company/deleteBrokeCompany",//删除broke
  queryTeamIcBrokeAgent:"/broke-manager-service/brokeAgent/queryTeamIcBrokeAgent",//查询team ic可添加经纪人列表
  insertAgentProject:"/broke-manager-service/brokeAgent/insertAgentProject",//team ic添加经纪人
  updateBrokeAgentGroupStatus:"/broke-manager-service/brokeAgent/updateBrokeAgentGroupStatus",//更新经纪人状态（is_agent）
  queryTeamIcBrokeAgentList:"/broke-manager-service/brokeAgent/queryTeamIcBrokeAgentList",//查询team ic经纪人列表
  deleteAgentProject:"/broke-manager-service/brokeAgent/deleteAgentProject",//team ic 删除经纪人关联项目
  updateAgentProject:"/broke-manager-service/brokeAgent/updateAgentProject",//team ic 更新经纪人关联项目
  exportICTeam:"/broke-manager-service/export/exportICTeam",//导入team ic
  sendWelcomeMail:"/broke-manager-service/brokeAgent/sendWelcomeMail",//发送welcome mail
  queryAppVersion:"/broke-manager-service/version/queryAppVersion",//查询版本列表
  updateAppVersion:"/broke-manager-service/version/udpateAppVersion",//编辑版本
  saveAppVersion:"/broke-manager-service/version/saveAppVersion",//保存版本
  startProhibit:"/broke-manager-service/version/startProhibit",//版本启用禁用
  queryOperationLog:"/broke-manager-service/opLog/queryOperationLog",//查询Audit logs列表
  exportOperationLogs:"/broke-manager-service/export/exportOperationLogs",//导出Audit logs
  //create new team
  queryTeams:"/broke-manager-service/team/queryTeams",//查询团队
  saveTeam:"/broke-manager-service/team/saveTeam",//添加团队
  deleteTeam:"/broke-manager-service/team/deleteTeam",//删除团队
  getTeamsAgentByName:"/broke-manager-service/teamAgent/getTeamsAgentByName",//根据用户名称查询用户列表
  saveTeamsAgent:"/broke-manager-service/teamAgent/saveTeamsAgent",//创建团队与用户关联
  queryTeamsAgentList:"/broke-manager-service/teamAgent/queryTeamsAgentList",//查询团队下所有用户
  deleteTeamsAgent:"/broke-manager-service/teamAgent/deleteTeamsAgent",//删除团队用户
  deleteTeamsAgentAll:"/broke-manager-service/teamAgent/deleteTeamsAgentAll",//删除团队下所有用户
  importTeamAgent:"/broke-manager-service/import/importTeamAgent",//import team Agent
  exportTeamAgent:"/broke-manager-service/export/exportTeamAgent",//export Team Agent
  queryTeamsAll:"/broke-manager-service/team/queryTeamsAll",//Default Team
  // account
  queryBroke:"/broke-manager-service/broke/queryBroke",//Manage Accounts
  getProject:"/broke-manager-service/project/getProject",//Manage Properties
  saveBroke:"/broke-manager-service/broke/saveBroke",//Add or update Account
  sendMail:"/broke-manager-service/broke/sendMail",//sendMail
  ChangePassword:"/broke-manager-service/sysuser/changePassword",//Change Password
  logOut:"/broke-manager-service/sysuser/logOut",//logOut
  deleteBrokeSysuser:"/broke-manager-service/sysuser/deleteBrokeSysuser",//delete
  editProperties:"/broke-manager-service/project/editProperties",//Edit Properties
  createAccount:"/broke-manager-service/brokeAgent/createAccount",//Create New User
  //Notification
  insertPushLog:"/broke-manager-service/push/insertPushLog",//Send Notification
  queryPushLogList:"/broke-manager-service/push/queryPushLogList",//查询推送记录
  cancelMessage:"/broke-manager-service/push/cancelMessage",//Cancel
  //roles
  saveRole:"/broke-manager-service/access/saveRole",//保存角色
  copyRole:"/broke-manager-service/access/copyRole",//复制角色
  queryRoleList:"/broke-manager-service/access/queryRoleList",//查询角色列表
  deleteRole:"/broke-manager-service/access/deleteRole",//删除角色
  deleteRoleTeam:"/broke-manager-service/access/deleteRoleTeam",//删除角色关联team
  saveRoleTeam:"/broke-manager-service/access/saveRoleTeam",//保存角色关联team
  queryRoleTeam:"/broke-manager-service/access/queryRoleTeam",//查询角色关联team列表
  queryRoleAccess:"/broke-manager-service/access/queryRoleAccess",//查询role关联的权限
  saveRoleAccess:"/broke-manager-service/access/saveRoleAccess",//保存role关联的权限
  //interest
  delUnitInterest:"/broke-manager-service/interest/delUnitInterest",//delete unit interest
  queryInterest:"/broke-manager-service/interest/queryInterest",//Active Interests
  updateAction:"/broke-manager-service/interest/updateAction",//Active
  importUnitInterest:"/broke-manager-service/import/importUnitInterest",//import Unit Interest
  exportUnitInterest:"/broke-manager-service/export/exportUnitInterest",//export Unit Interest
  //transaction
  importTransaction:"/broke-manager-service/import/importTransaction",//import Transaction
  exportTransaction:"/broke-manager-service/export/exportTransaction",//export Transaction
  queryTransaction:"/broke-manager-service/transaction/queryTransaction",//查询TransactionList
  queryEditInfo:"/broke-manager-service/transaction/queryEditInfo",//查询Transaction编辑列表
  editTransaction:"/broke-manager-service/transaction/editTransaction",//编辑Transaction
  //日程
  queryCalendarList:"/broke-manager-service/calendar/queryCalendarList",//queryCalendarList
  saveCalendar:"/broke-manager-service/calendar/saveCalendar",//saveCalendar
  deleteCalendar:"/broke-manager-service/calendar/deleteCalendar",//deleteCalendar
  deleteProjectMediaIVT:"/broke-manager-service/media/deleteProjectMediaIVT",//删除project media ivt
  saveProjectMediaIVT:"/broke-manager-service/media/saveProjectMediaIVT",//保存media ivt
  deleteBroke: "/broke-manager-service/broke/deleteBroke", // 删除公司
  querySysUserByBrokeId: "/broke-manager-service/sysuser/querySysUserByBrokeId", // 获取公司下账号列表
  deleteBrokeSysuser: "/broke-manager-service/sysuser/deleteBrokeSysuser", // 删除账号
  addBrokeSysUser: "/broke-manager-service/sysuser/addBrokeSysUser", // 编辑或新增账号
  queryBrokeAll: "/broke-manager-service/broke/queryBrokeAll", // 查询所有经济公司
  editProperties: "/broke-manager-service/project/copyProject", // 复制公司或者删除公司
  getProject: "/broke-manager-service/project/getProject", // 获取两个公司间的项目
  getMianPropertie: "/broke-manager-service/project/getMianPropertie", // 获取公司下所有主项目（即不是复制的项目)
  getCopyPropertieBroke: "/broke-manager-service/project/getCopyPropertieBroke", // 获取同步mapping的公司
  copySitePlan: "/broke-manager-service/project/copySitePlan", // 复制项目mapping
  saveContactPerson: "/broke-manager-service/contactPerson/saveContactPerson", // 添加联系人
  queryContactPerson: "/broke-manager-service/contactPerson/queryContactPerson", // 获取联系人
  downLoadTransactionFile: "/broke-manager-service/download/downLoadTransactionFile", // 下载交易文件

  saveTimingCommission: "/broke-manager-service/brokeProject/updateTimingCommission", // 提交定时佣金

  saveProjectDiscount: "/broke-manager-service/projectDiscount/saveProjectDiscount", // 保存折扣
  deleteProjectDiscount: "/broke-manager-service/projectDiscount/deleteProjectDiscount", // 删除折扣
  queryProjectDiscount: "/broke-manager-service/projectDiscount/queryProjectDiscount", // 查询折扣
  queryPayment: "/broke-manager-service/payment/queryPayment", // 查询付款方式
  deletePayment: "/broke-manager-service/payment/deletePayment", // 删除付款方式
  savePayment: "/broke-manager-service/payment/savePayment", // 保存付款方式
  queryFeedback: "/broke-manager-service/feedback/queryFeedback", // 获取反馈列表
  updateFeedbackStatus: "/broke-manager-service/feedback/updateFeedbackStatus", // 更新反馈状态
  importProjectContact: "/broke-manager-service/import/importProjectContact", // 导入联系人
  queryProjectContact: "/broke-manager-service/contact/queryProjectContact", // 查看联系人
  deleteProjectContact: "/broke-manager-service/contact/deleteProjectContact", // 删除联系人
  updateExternalCommission: "/broke-manager-service/brokeProject/updateExternalCommission", // 更新外部佣金
  queryCommission: "/broke-manager-service/brokeProject/queryCommission", // 查询佣金
  updatePropertyGroup: "/broke-manager-service/project/updatePropertyGroup", // 修改项目分组
  queryTeams: "/broke-manager-service/team/queryTeams", // 查询账户所属Teams
  deleteTeamsAgentAll: "/broke-manager-service/teamAgent/deleteTeamsAgentAll", // 删除账号所属Teams
  saveProjectContact: "/broke-manager-service/contact/saveProjectContact", // 单独添加销售精英
  uploadInviteImg: "/broke-manager-service/upload/uploadInviteImg", // 上传邀请卡
  queryProjectCustom: "/broke-manager-service/brokeProject/queryProjectCustom", // 查询自定义字段
  deleteProjectCustom: "/broke-manager-service/brokeProject/deleteProjectCustom", // 删除自定义字段
  saveProjectCustom: "/broke-manager-service/brokeProject/saveProjectCustom", // 保存自定义字段
  syncUnit: "/broke-manager-service/brokeProject/syncUnit", // 同步数据
  uploadContactImage: "/broke-manager-service/upload/uploadContactImage", // 上传uploadContactImage
  exportProjectContacts: "/broke-manager-service/export/exportProjectContacts", // 导出联系人
  deleteAllProjectContact: "/broke-manager-service/contact/deleteAllProjectContact", // 删除所有项目联系人
  deleteAllUnit: "/broke-manager-service/unit/deleteAllUnit", // 删除所有Unit
  deleteContactImage: "/broke-manager-service/brokeProject/deleteContactImage", // 删除联系人图片
  importProjectRelation: "/broke-manager-service/import/importProjectRelation", // 导入第三方项目关联
  deleteProjectAdvert: "/broke-manager-service/advert/deleteProjectAdvert", // 删除项目广告
  queryProjectAdvert: "/broke-manager-service/advert/queryProjectAdvert", // 查询项目广告列表
  saveProjectAdvert: "/broke-manager-service/advert/saveProjectAdvert", // 保存项目广告
  move: "/broke-manager-service/advert/move", // 移动
  updateAdvertStatus: "/broke-manager-service/advert/updateAdvertStatus", // 项目广告 （上/下） 架
  getBroke: "/broke-manager-service/broke/getBroke", // 查询公司列表
  queryBrokeProject: "/broke-manager-service/advert/queryBrokeProject", // 查询项目列表
  getUnitRoleAccess: "/broke-manager-service/access/getUnitRoleAccess", // 查询账户对项目拥有的权限
  getUnitFilter: "/broke-manager-service/unit/getUnitFilter", // 查询unit筛选条件
  queryUpdateUnit: "/broke-manager-service/unit/queryUpdateUnit", // 查询修改Unit价格列表
  updateUnitPrice: "/broke-manager-service/unit/updateUnitPrice", // 批量更新价格
  queryUnitOpLog: "/broke-manager-service/unit/queryUnitOpLog", // 查询unit 操作记录
  queryTableList: "/trade-service/unit/queryTableList", // 意向买家统计
  queryInterestList: "/broke-manager-service/interest/queryInterestList", // 查询Interest List列表
  queryInterestDetail: "/broke-manager-service/interest/queryInterestDetail", // 查询意向买家详情
  deleteBank: "/broke-manager-service/bank/deleteBank", // 删除银行
  queryBankList: "/broke-manager-service/bank/queryBankList", // 查询银行
  saveBank: "/broke-manager-service/bank/saveBank", // 保存银行

  queryProjectSalesList: "/trade-service/project/queryProjectSalesList", // 查询项目的销售统计列表
  getUnitInfo: "/trade-service/unit/getUnitInfo", // 查询单位详情
  bookingUnit: "/trade-service/transaction/bookingUnit", // 预订单位
  getUnitAccess: "/trade-service/transaction/getUnitAccess", // 查询操作unit的权限
  getTransaction: "/trade-service/transaction/getTransaction", // 查询交易记录
  selectCustomer: "/trade-service/transaction/selectCustomer", // 查询意向买家
  getRelationBuyer: "/trade-service/transaction/getRelationBuyer", // 获取关联买家
  queryAgentByRegNum: "/trade-service/agent/queryAgentByRegNum", // 查询经济人
  addTransaction: "/trade-service/transaction/addTransaction", // 保存交易记录
  queryBrokeByProjectId:"/trade-service/project/queryBrokeByProjectId", // 查询交易公司
  updateTransactionLogStatus: "/trade-service/transactionLog/updateTransactionLogStatus", // 交易审核列表（更新交易状态）
  queryTransactionLogList: "/trade-service/transactionLog/queryTransactionLogList", // 成交记录
  queryDocumentsList: "/trade-service/document/queryDocumentsList", // 获取交易文档列表
  uploadTransactionFile: "/trade-service/upload/uploadTransactionFile", // 上传交易文件
  transactionGenerate: "/trade-service/document/transactionGenerate", // 生成交易文件
  queryDocumentsVersion: "/trade-service/document/queryDocumentsVersion", // 获取交易文件历史版本
}

