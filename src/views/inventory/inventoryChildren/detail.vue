<template>
  <div class="detail_wrapper">
    <div class="head">
      <el-row>
        <el-col :span="12" class="el_col_name">
          <div>
            <span>{{$t('edit.name')}}</span>
            <span class="project_name">{{detailForm.projectName}}</span>
          </div>
        </el-col>
        <el-col :span="12" style="text-align:right">
          <el-button :disabled="self == 0" size="mini" @click="updateDetail">{{$t('edit.update')}}</el-button>
          <!-- <el-button
            size="mini"
            :disabled="self == 0"
            @click="$router.replace('/home/inventoryList.html')"
          >{{$t('edit.cancel')}}</el-button> -->
        </el-col>
      </el-row>
    </div>
    <div class="detail_content">
      <el-form class="demo-form-inline form" label-width="250px" label-position="left" ref="ruleForm" size="small" :model="detailForm" :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="Developer Ecoprop">
              <el-checkbox :disabled="userInfo.type !==2 && userInfo.isAdmin!==0" v-model="detailForm.cooperate">
              </el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Sold Out">
              <el-switch v-model="detailForm.soldOut" active-color="#409eff"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('edit.syncToMobile')">
              <el-checkbox v-model="detailForm.mobileSync"></el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('edit.isFeatured')">
              <el-checkbox v-model="detailForm.featured"></el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('edit.currencySymbol')" prop="currencySymbol">
              <el-input class="width_300px" v-model="detailForm.currencySymbol"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('edit.developer')" prop="developer">
              <el-input class="width_300px" v-model="detailForm.developer"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="projectType" :label="$t('edit.type')">
              <el-select size="mini" v-model="detailForm.projectType" class="width_300px" placeholder>
                <el-option v-for="item in typeData" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('edit.typeAltText')">
              <el-input class="width_300px" v-model="detailForm.projectTypeAltText"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="unitsNum" :label="$t('edit.numberOfUnits')">
              <el-input class="width_300px" v-model="detailForm.unitsNum"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('edit.numberOfUnitsAltText')">
              <el-input class="width_300px" v-model="detailForm.unitsNumAltText"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="tenure" :label="$t('edit.tenure')">
              <el-select size="mini" v-model="detailForm.tenure" class="width_300px" placeholder>
                <el-option v-for="item in tenureData" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('edit.tenureAltText')">
              <el-input class="width_300px" v-model="detailForm.tenureAltText"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Deferred Payment">
              <el-checkbox v-model="detailForm.deferredPayment"></el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="completionDate" :label="$t('edit.topDate')">
              <el-date-picker class="width_300px" value-format="timestamp" format="dd-MMM-yyyy" type="date" v-model="detailForm.completionDate"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('edit.topDateAltText')">
              <el-input class="width_300px" v-model="detailForm.completionDateAltText"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Preview Date">
              <el-date-picker class="width_300px" value-format="timestamp" format="dd-MMM-yyyy" type="date" v-model="detailForm.previewDate"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Preview Date Alt Text">
              <el-input class="width_300px" v-model="detailForm.previewDateAltText"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="launchDate" :label="$t('edit.launchDate')">
              <el-date-picker class="width_300px" value-format="timestamp" format="dd-MMM-yyyy" type="date" v-model="detailForm.launchDate"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('edit.launchAltText')">
              <el-input class="width_300px" v-model="detailForm.launchDateAltText"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="country" :label="$t('edit.country')">
              <el-select size="mini" v-model="detailForm.country" class="width_300px" placeholder @change="getAddress">
                <el-option v-for="item in countryData" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('edit.countryAltText')">
              <el-input class="width_300px" v-model="detailForm.countryAltText"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item prop="address" :label="$t('address')">
              <el-cascader size="mini" style="width:100%;" v-model="detailForm.address" :options="options" clearable @change='selectAddress'></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="location" :label="$t('edit.location')">
              <el-select size="mini" v-model="detailForm.location" class="width_300px" placeholder>
                <el-option v-for="item in locationData" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('edit.locationAltText')">
              <el-input class="width_300px" v-model="detailForm.locationAltText"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('Range')">
              <el-select size="mini" v-model="detailForm.projectArea" class="width_300px" placeholder>
                <el-option v-for="item in projectAreaList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="District">
              <el-input class="width_300px" v-model="detailForm.district"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('edit.pricefrom')">
              <el-input class="width_300px" v-model="priceFrom" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('edit.pricefromalttext')">
              <el-input class="width_300px" v-model="detailForm.priceFromText"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('edit.psffrom')">
              <el-input class="width_300px" v-model="psfFrom" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('edit.psffromalttext')">
              <el-input class="width_300px" v-model="detailForm.psfFromText"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="latitude" :label="$t('edit.latitude')">
              <el-input class="width_300px" v-model="detailForm.latitude"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="longitude" :label="$t('edit.longitude')">
              <el-input class="width_300px" v-model="detailForm.longitude"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!-- <el-col :span="12">
            <el-form-item :label="$t('edit.propertyGroup')">
              <el-input class="width_300px" v-model="detailForm.propertyGroup"></el-input>
            </el-form-item>
          </el-col>-->
          <el-col :span="12">
            <el-form-item :label="$t('edit.mapZoomLevel')">
              <el-input class="width_300px" v-model="detailForm.mapZoomLevel"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('edit.GalleryAdress')">
              <el-input class="width_300px" v-model="detailForm.galleryLocation"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('edit.GalleryLatitude')">
              <el-input class="width_300px" v-model="detailForm.galleryLatitude"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('edit.GalleryLongitude')">
              <el-input class="width_300px" v-model="detailForm.galleryLongitude"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item prop="streetAddress" :label="$t('edit.streetAdress')">
              <el-input class="width_300px" type="textarea" :rows="3" v-model="detailForm.streetAddress"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="postalCode" :label="$t('edit.postalCode')">
              <el-input class="width_300px" v-model="detailForm.postalCode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="Tenure Date">
              <el-input class="width_300px" v-model="detailForm.tenureDate"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Developer License">
              <el-input class="width_300px" v-model="detailForm.developerLicense"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="Developer License Date">
              <el-input class="width_300px" v-model="detailForm.developerLicenseDate"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Project Lot">
              <el-input class="width_300px" v-model="detailForm.projectLot"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="MK/TS">
              <el-input class="width_300px" v-model="detailForm.mukim"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="MF Per Share (Before GST)">
              <el-input class="width_300px" v-model="detailForm.mfPerShare"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="EC Project Code">
              <el-input class="width_300px" v-model="detailForm.ecProjectCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Site Area">
              <el-input class="width_300px" v-model="detailForm.siteArea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Plot Ratio">
              <el-input class="width_300px" v-model="detailForm.plotRatio"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="stageCompletion">
              <el-select size="mini" v-model="detailForm.stageCompletion" class="width_300px" placeholder>
                <el-option v-for="item in stageCompletionData" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <div style="border-bottom:1px solid #dcdfe6;margin:5px 0;"></div>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('edit.description')">
              <editor editorId="description" :value="detailForm.description" :setting="editorSetting" @show="editors" @on-upload-success="onEditorUploadComplete"></editor>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('edit.description')+'(中文)'">
              <editor editorId="descriptionCn" :value="detailForm.descriptionCn" :setting="editorSetting" @show="editors" @on-upload-success="onEditorUploadComplete"></editor>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('edit.keyPoints')">
              <editor editorId="keyPoints" :value="detailForm.keyPoints" :setting="editorSetting" @show="editors" @on-upload-success="onEditorUploadComplete"></editor>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('edit.keyPoints')+'(中文)'">
              <editor editorId="keyPointsCn" :value="detailForm.keyPointsCn" :setting="editorSetting" @show="editors" @on-upload-success="onEditorUploadComplete"></editor>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('edit.facilities')">
              <editor editorId="facilities" :value="detailForm.facilities" :setting="editorSetting" @show="editors" @on-upload-success="onEditorUploadComplete"></editor>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('edit.facilities')+'(中文)'">
              <editor editorId="facilitiesCn" :value="detailForm.facilitiesCn" :setting="editorSetting" @show="editors" @on-upload-success="onEditorUploadComplete"></editor>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('edit.nearbyAmenities')">
              <editor editorId="nearbyAmenities" :value="detailForm.nearbyAmenities" :setting="editorSetting" @show="editors" @on-upload-success="onEditorUploadComplete"></editor>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('edit.nearbyAmenities')+'(中文)'">
              <editor editorId="nearbyAmenitiesCn" :value="detailForm.nearbyAmenitiesCn" :setting="editorSetting" @show="editors" @on-upload-success="onEditorUploadComplete"></editor>
            </el-form-item>
          </el-col>
        </el-row>
        <el-alert style="padding:8px 0;margin-bottom:10px;" :title="$t('edit.connects')" type="info" :closable="false">
        </el-alert>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('DeveloperInformation')">
              <editor editorId="commission" :value="detailForm.commission" :setting="editorSetting" @show="editors" @on-upload-success="onEditorUploadComplete"></editor>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('DeveloperInformation')+'(中文)'">
              <editor editorId="commissionCn" :value="detailForm.commissionCn" :setting="editorSetting" @show="editors" @on-upload-success="onEditorUploadComplete"></editor>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('edit.externalCommission')">
              <editor
                editorId="externalCommission"
                :value="detailForm.externalCommission"
                :setting="editorSetting"
                @show="editors"
                @on-upload-success="onEditorUploadComplete"
              ></editor>
            </el-form-item>
          </el-col>
        </el-row>-->
        <!-- <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('edit.salesContacts')">
              <editor
                editorId="salesContacts"
                :value="detailForm.salesContacts"
                :setting="editorSetting"
                @show="editors"
                @on-upload-success="onEditorUploadComplete"
              ></editor>
            </el-form-item>
          </el-col>
        </el-row>-->
        <!-- <div style="border-bottom:1px solid #dcdfe6"></div> -->
        <!-- <el-row style="padding:15px 0">
          <el-col>
            <el-form-item :label="$t('edit.contactImage')" style="margin:10px 0">
              <uploader
                fileId="concatImgFile"
                :fileData="fileData"
                :maxSize="5"
                :url="$api.uploadFile"
                fileType=".png,.jpg"
                :uploadParam="uploadParam"
                :btnText="{select:$t('edit.selectFile'),import:$t('edit.addContactImage')}"
              ></uploader>
            </el-form-item>
          </el-col>
          <el-col v-if="fileData.length">
            <div class="upload_content">
              <span class="upload_url">{{$t('edit.uploaded')}}：{{fileData[0].url}}</span>
              <span class="upload_delete" @click="deleteImg">{{$t('edit.removeContactImage')}}</span>
            </div>
          </el-col>
        </el-row>-->
        <!-- <el-row style="padding-bottom:10px;line-height: 40px;">
          <el-col :span="4">Add Contact</el-col>
          <el-col :span="12">
            <el-button @click="getLinkManData('btn')">Contact Popup</el-button>
          </el-col>
        </el-row>-->
        <!-- <div style="border-bottom:1px solid #dcdfe6;margin-bottom:15px"></div> -->

        <el-alert style="padding:8px 0;margin-bottom:30px" :title="$t('Location Map Configuration')" type="info" :closable="false"></el-alert>
        <el-row style="margin-bottom:20px">
          <el-col :span="12">
            <span>{{$t('edit.latitude')}}:</span>
            <span>{{detailForm.latitude}}</span>
          </el-col>
          <el-col :span="12">
            <span>{{$t('edit.longitude')}}:</span>
            <span>{{detailForm.longitude}}</span>
          </el-col>
          <el-col :span="12" style="marginTop:10px;">
            <span>{{$t('edit.GalleryLatitude')}}:</span>
            <span>{{detailForm.galleryLatitude}}</span>
          </el-col>
          <el-col :span="12" style="marginTop:10px;">
            <span>{{$t('edit.GalleryLongitude')}}:</span>
            <span>{{detailForm.galleryLongitude}}</span>
          </el-col>
        </el-row>
        <el-row style="margin-bottom:20px">
          <el-col :span="24" style="display: flex;align-items:center;">
            <span style="margin-right:20px">{{$t('Thumbnail Screenshot')}}:</span>
            <el-button style="margin-right:20px" size="mini" @click="downMapImg">{{$t('Update')}}</el-button>
            <span style="margin-right:20px">{{$t(' Map Zoom Level')}}:</span>
            <el-input size="mini" type="number" style="width: 100px;margin-right:10px;" max="20" min="13" v-model="mapImgZoom"></el-input>
            <span>({{$t('From 13 to 20 max')}})</span>
          </el-col>
        </el-row>
        <el-row style="margin-bottom:20px">
          <el-col :span="12" class="uploader">
            <img @click.stop="$imgPreview(hostUrl + detailForm.snapshotLogo)" :src="hostUrl + detailForm.snapshotLogo" alt="">
          </el-col>
        </el-row>
        <el-row style="margin-bottom:20px">
          <el-col :span="12">
            <span style="margin-right:20px">{{$t('Surrounding Amenities Resource Update')}}:</span>
            <el-button size="mini" @click="downNear">{{$t('Update')}}</el-button>
          </el-col>
        </el-row>
        <el-row style="margin-bottom:20px">
          <el-col :span="12">
            <ul class="nearbyList">
              <li class="nearbyList-box">
                <p class="nearbyList-type">Bus Interchange:</p>
                <p class="nearbyList-value-box">
                  <span class="nearbyList-value" v-for="(item, index) in nearbyList['bus_station']">{{item.name}}</span>
                </p>
              </li>
              <li class="nearbyList-box">
                <p class="nearbyList-type">MRT Station:</p>
                <p class="nearbyList-value-box">
                  <span class="nearbyList-value" v-for="(item, index) in nearbyList['subway_station']">{{item.name}}</span>
                </p>
              </li>
              <li class="nearbyList-box">
                <p class="nearbyList-type">Shopping Mall:</p>
                <p class="nearbyList-value-box">
                  <span class="nearbyList-value" v-for="(item, index) in nearbyList['shopping_mall']">{{item.name}}</span>
                </p>
              </li>
              <li class="nearbyList-box">
                <p class="nearbyList-type">School:</p>
                <p class="nearbyList-value-box">
                  <span class="nearbyList-value" v-for="(item, index) in nearbyList['school']">{{item.name}}</span>
                </p>
              </li>
              <li class="nearbyList-box">
                <p class="nearbyList-type">Food:</p>
                <p class="nearbyList-value-box">
                  <span class="nearbyList-value" v-for="(item, index) in nearbyList['restaurant']">{{item.name}}</span>
                </p>
              </li>
              <li class="nearbyList-box">
                <p class="nearbyList-type">Hospital:</p>
                <p class="nearbyList-value-box">
                  <span class="nearbyList-value" v-for="(item, index) in nearbyList['hospital']">{{item.name}}</span>
                </p>
              </li>
            </ul>
          </el-col>
        </el-row>
        <el-alert style="padding:8px 0;margin-bottom:30px" :title="$t('edit.customInformationFields')" type="info" :closable="false"></el-alert>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('edit.customInfoLabel1')">
              <el-input class="width_300px" v-model="detailForm.customLabel1"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('edit.customInfoValue1')">
              <el-input class="width_300px" v-model="detailForm.customValue1"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('edit.customInfoLabel2')">
              <el-input class="width_300px" v-model="detailForm.customLabel2"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('edit.customInfoValue2')">
              <el-input class="width_300px" v-model="detailForm.customValue2"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('edit.customInfoLabel3')">
              <el-input class="width_300px" v-model="detailForm.customLabel3"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('edit.customInfoValue3')">
              <el-input class="width_300px" v-model="detailForm.customValue3"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('edit.customInfoLabel4')">
              <el-input class="width_300px" v-model="detailForm.customLabel4"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('edit.customInfoValue4')">
              <el-input class="width_300px" v-model="detailForm.customValue4"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('edit.customInfoLabel5')">
              <el-input class="width_300px" v-model="detailForm.customLabel5"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('edit.customInfoValue5')">
              <el-input class="width_300px" v-model="detailForm.customValue5"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-dialog title="Add Contact" :visible.sync="dialogVisible" width="40%" :center="true">
      <div>
        <el-form :model="linkmanData" ref="dynamicValidateForm" label-width="150px" class="dynamicLinkeManDiv">
          <div v-for="(domain, index) in linkmanData.domains" :key="index">
            <el-form-item :label="'ContactName-' + (index + 1)">
              <el-input v-model="domain.userName"></el-input>
              <el-button v-if="index == 0" @click.prevent="addDomain(index)">Add</el-button>
              <el-button v-if="index != 0" @click.prevent="removeDomain(index)">Delete</el-button>
            </el-form-item>
            <el-form-item label="phone">
              <el-input v-model="domain.mobile"></el-input>
            </el-form-item>
            <el-form-item label="E-mai">
              <el-input v-model="domain.mail"></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="postLinkManData">UpData</el-button>
      </span>
    </el-dialog>
    <div id="avenir-map" v-show='false'></div>
  </div>
</template>
<script>
import editor from '@/components/editor'
import selsectData from '@/utils/selectData.json'
import uploader from '@/components/uploader'
import tinymce from 'tinymce/tinymce'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
export default {
  components: {
    editor,
    uploader
  },
  data () {
    return {
      hostUrl: sessionStorage.getItem('serveUrl') || '',
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')) || {},
      typeData: selsectData.typeData,
      stageCompletionData: selsectData.stageCompletionData,
      tenureData: selsectData.tenureData,
      locationData: selsectData.locationData,
      countryData: selsectData.countryData,
      editorArr: [], //获取数据时富文本编辑器的图片数组
      updateEditorArr: [], //提交时富文本编辑器里面的图片数组
      uploadParam: [
        {
          name: 'type',
          value: 'projectImg',
        },
        {
          name: 'projectId',
          value:
            JSON.parse(sessionStorage.getItem('projectDesc') || '{}').id || '',
        },
      ],
      fileData: [],
      priceFrom: '',
      psfFrom: '',
      dialogVisible: false, // 弹窗show
      projectAreaList: ['CCR', 'RCR', 'OCR', 'OTHERS'],
      detailForm: {
        cooperate: false,
        soldOut: false,
        projectName: '',
        mobileSync: false,
        currencySymbol: '',
        featured: false,
        deferredPayment: false,
        developer: '',
        projectType: '',
        projectTypeAltText: '',
        unitsNum: '',
        unitsNumAltText: '',
        tenure: '',
        tenureAltText: '',
        completionDate: '',
        completionDateAltText: '',
        previewDate: '',
        previewDateAltText: '',
        launchDate: '',
        launchDateAltText: '',
        country: '',
        countryAltText: '',
        address: '',
        location: '',
        locationAltText: '',
        propertyGroup: '',
        mapZoomLevel: '',
        latitude: '',
        longitude: '',
        streetAddress: '',
        postalCode: '',
        description: '',
        descriptionCn: '',
        keyPoints: '',
        keyPointsCn: '',
        facilities: '',
        facilitiesCn: '',
        nearbyAmenities: '',
        nearbyAmenitiesCn: '',
        commission: '',
        commissionCn: '',
        externalCommission: '',
        plotRatio: '',
        stageCompletion: '',
        siteArea: '',
        salesContacts: '',
        customLabel1: '',
        customValue1: '',
        customLabel2: '',
        customValue2: '',
        customLabel3: '',
        customValue3: '',
        customLabel4: '',
        customValue4: '',
        customLabel5: '',
        customValue5: '',
        psfFromText: '',
        projectArea: '',
        district: '',
        tenureDate: '',
        developerLicense: '',
        developerLicenseDate: '',
        projectLot: '',
        mukim: '',
        mfPerShare: '',
        ecProjectCode: '',
        snapshotLogo: [],
        facilitiesMap: []
      },
      nearbyList: {
        subway_station: [],
        shopping_mall: [],
        school: [],
        restaurant: [],
        bus_station: [],
        hospital: []
      },
      rules: {
        currencySymbol: [
          {
            required: true,
            message: 'This field cannot be empty',
            trigger: 'blur',
          },
        ],
        developer: [
          {
            required: true,
            message: 'This field cannot be empty',
            trigger: 'blur',
          },
        ],
        projectType: [
          {
            required: true,
            message: 'This field cannot be empty',
            trigger: 'change',
          },
        ],
        unitsNum: [
          {
            required: true,
            message: 'This field cannot be empty',
            trigger: 'blur',
          },
        ],
        tenure: [
          {
            required: true,
            message: 'This field cannot be empty',
            trigger: 'change',
          },
        ],
        completionDate: [
          {
            required: true,
            message: 'This field cannot be empty',
            trigger: 'change',
          },
        ],
        launchDate: [
          {
            required: true,
            message: 'This field cannot be empty',
            trigger: 'change',
          },
        ],
        country: [
          {
            required: true,
            message: 'This field cannot be empty',
            trigger: 'change',
          },
        ],
        address: [
          {
            required: true,
            message: 'This field cannot be empty',
            trigger: 'change',
          },
        ],
        location: [
          {
            required: true,
            message: 'This field cannot be empty',
            trigger: 'change',
          },
        ],
        projectArea: [
          {
            required: true,
            message: 'This field cannot be empty',
            trigger: 'change',
          },
        ],
        latitude: [
          {
            required: true,
            message: 'This field cannot be empty',
            trigger: 'blur',
          },
        ],
        longitude: [
          {
            required: true,
            message: 'This field cannot be empty',
            trigger: 'blur',
          },
        ],
        streetAddress: [
          {
            required: true,
            message: 'This field cannot be empty',
            trigger: 'blur',
          },
        ],
        postalCode: [
          {
            required: true,
            message: 'This field cannot be empty',
            trigger: 'blur',
          },
        ],
      },
      editorSetting: {
        // 配置富文本编辑器高
        height: 120,
        width: 900,
      },
      id: JSON.parse(sessionStorage.getItem('projectDesc') || '{}').id || '',
      self:
        JSON.parse(sessionStorage.getItem('projectDesc') || '{}').self || '',
      callbackList: [],
      linkmanData: {
        domains: [
          {
            userName: '',
            mobile: '',
            mail: '',
            projectId:
              JSON.parse(sessionStorage.getItem('projectDesc') || '{}').id ||
              '',
          },
        ],
      },
      mapImgZoom: 17, //地图快照缩放级别
      options: [], //地址选择级联数据
    }
  },
  mounted () {
    this.setGoogleMap()
    this.queryProjectDetail()
  },
  methods: {
    getAddress () {
      this.$Geting(this.$api.querySysArea, {
        country: this.detailForm.country
      })
        .then(res => {
          if (res.code === '0') {
            this.options = res.datas
          }
        })
    },
    selectAddress () {
      console.log(this.detailForm.address)
    },
    deleteImg () {
      this.$Geting(this.$api.deleteFile, {
        path: this.hostUrl + this.fileData[0].path,
      }).then((res) => {
        if (res.code == 0) {
          this.fileData = []
          if (window.sessionStorage.getItem('uploadImg')) {
            window.sessionStorage.removeItem('uploadImg')
          }
        } else {
          this.$notify.error({
            title: 'fail',
            message: res.msg,
          })
          return false
        }
      })
    },
    getLinkManData (type) {
      if (type) {
        this.dialogVisible = true
      }
      this.$Get(this.$api.queryContactPerson, { projectId: this.id }).then(
        (res) => {
          if (res.code == 0) {
            if (res.datas.length != 0) {
              this.linkmanData.domains = res.datas
            }
          }
          console.log(res)
        }
      )
    },
    handleClose () {
      // 弹窗
      console.log('消失后')
    },
    addDomain (index) {
      // 添加联系人
      if (this.linkmanData.domains.length < 8) {
        this.linkmanData.domains.push({
          userName: '',
          mobile: '',
          mail: '',
          projectId: this.id,
        })
      } else {
        this.$notify.error({
          title: 'fail',
          message: 'No more than eight contacts',
        })
      }
    },
    removeDomain (index) {
      // 删除联系人
      this.linkmanData.domains.splice(index, 1)
    },
    postLinkManData () {
      let data = JSON.stringify(this.linkmanData.domains)
      this.$Get(this.$api.saveContactPerson, {
        projectId: this.id,
        paramJson: data,
      }).then((res) => {
        if (res.code == 0) {
          this.$notify({
            title: 'success',
            message: res.msg,
            type: 'success',
          })
          this.dialogVisible = false
        } else {
          this.$notify.error({
            title: 'fail',
            message: res.msg,
          })
        }
      })
      console.log(this.linkmanData)
    },
    editors (obj) {
      // editor组件传过来的值赋给content
      this.detailForm[obj.id] = obj.content
    },
    onEditorUploadComplete (json) {
      // 处理上传图片后返回数据，添加img标签到编辑框内
      json[1](this.hostUrl + json[0].filePath)
    },
    queryProjectDetail () {
      this.$Geting(this.$api.queryProjectDetail, { projectId: this.id }).then(
        (res) => {
          if (res.code == 0) {
            this.detailForm = Object.assign({ snapshotLogo: [] }, res.datas.project)
            this.detailForm.snapshotLogo = this.detailForm.snapshotLogo
            let nearbyList = this.nearbyList
            let facilitiesMap = JSON.parse(this.detailForm.facilitiesMap)
            if (facilitiesMap && facilitiesMap.length > 0) {
              for (let key in nearbyList) {
                facilitiesMap.forEach((ele) => {
                  if (ele.type === key) {
                    nearbyList[key] = ele.value
                  }
                })
              }
              this.nearbyList = nearbyList
            }
            this.priceFrom = res.datas.project.priceFrom
            this.psfFrom = res.datas.project.psfFrom
            this.fillDataToForm()
            let projectDesc = JSON.parse(sessionStorage.getItem('projectDesc'))
            sessionStorage.setItem(
              'projectDesc',
              JSON.stringify({
                ...projectDesc,
                cooperate: res.datas.project.cooperate,
              })
            )
          } else {
            this.$notify.error({
              title: 'fail',
              message: res.msg,
            })
            return false
          }
        }
      )
    },
    updateDetail () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let submitData = this.getSubmitData()
          this.$Posting(this.$api.updateProject, submitData).then((res) => {
            if (res.code == 0) {
              this.beforeSaveCheckImage()
              this.editorArr = []
              this.updateEditorArr = []
              this.$notify({
                title: 'success',
                message: this.$t('alert.operate_success_title'),
                type: 'success',
              })
              this.queryProjectDetail()
              if (window.sessionStorage.getItem('uploadImg')) {
                window.sessionStorage.removeItem('uploadImg')
              }
            } else {
              this.$notify.error({
                title: 'fail',
                message: res.msg,
              })
              return false
            }
          })
        } else {
          return false
        }
      })
    },
    fillDataToForm () {
      //填充数据到表单
      this.detailForm.mobileSync =
        this.detailForm.mobileSync == 'YES' ? true : false
      this.detailForm.featured = this.detailForm.featured == '1' ? false : true
      this.detailForm.cooperate = this.detailForm.cooperate == 1 ? true : false
      this.detailForm.soldOut = this.detailForm.soldOut == 1 ? true : false
      this.detailForm.deferredPayment = this.detailForm.deferredPayment == 1 ? true : false
      this.detailForm.description = this.$base64ToContent(
        this.detailForm.description
      )
      tinymce.editors[0].setContent(this.detailForm.description)
      this.detailForm.descriptionCn = this.$base64ToContent(
        this.detailForm.descriptionCn
      )
      tinymce.editors[1].setContent(this.detailForm.descriptionCn)
      this.detailForm.keyPoints = this.$base64ToContent(
        this.detailForm.keyPoints
      )
      tinymce.editors[2].setContent(this.detailForm.keyPoints)
      this.detailForm.keyPointsCn = this.$base64ToContent(
        this.detailForm.keyPointsCn
      )
      tinymce.editors[3].setContent(this.detailForm.keyPointsCn)
      this.detailForm.facilities = this.$base64ToContent(
        this.detailForm.facilities
      )
      tinymce.editors[4].setContent(this.detailForm.facilities)
      this.detailForm.facilitiesCn = this.$base64ToContent(
        this.detailForm.facilitiesCn
      )
      tinymce.editors[5].setContent(this.detailForm.facilitiesCn)
      this.detailForm.nearbyAmenities = this.$base64ToContent(
        this.detailForm.nearbyAmenities
      )
      tinymce.editors[6].setContent(this.detailForm.nearbyAmenities)
      this.detailForm.nearbyAmenitiesCn = this.$base64ToContent(
        this.detailForm.nearbyAmenitiesCn
      )
      tinymce.editors[7].setContent(this.detailForm.nearbyAmenitiesCn)
      this.detailForm.commission = this.$base64ToContent(
        this.detailForm.commission
      )
      tinymce.editors[8].setContent(this.detailForm.commission)
      this.detailForm.commissionCn = this.$base64ToContent(
        this.detailForm.commissionCn
      )
      tinymce.editors[9].setContent(this.detailForm.commissionCn)
      this.detailForm.externalCommission = this.$base64ToContent(
        this.detailForm.externalCommission
      )
      // tinymce.editors[5].setContent(this.detailForm.externalCommission);
      // this.detailForm.salesContacts = this.$base64ToContent(
      //   this.detailForm.salesContacts
      // );
      // tinymce.editors[6].setContent(this.detailForm.salesContacts);
      if (this.detailForm.contactImage) {
        this.fileData.push({
          path: this.detailForm.contactImage,
          url: `${this.hostUrl}${this.detailForm.contactImage}`,
        })
      }
      if (this.detailForm.country) {
        this.getAddress()
      }
      if (this.detailForm.areaLevel1) {
        let address = []
        address.push(this.detailForm.areaLevel1)
        address.push(this.detailForm.areaLevel2)
        address.push(this.detailForm.areaLevel3)
        this.detailForm.address = address
      }
      this.beforeSaveGetInitEdit(
        this.detailForm.description,
        this.detailForm.keyPoints,
        this.detailForm.facilities,
        this.detailForm.nearbyAmenities,
        this.detailForm.commission,
        this.detailForm.descriptionCn,
        this.detailForm.keyPointsCn,
        this.detailForm.facilitiesCn,
        this.detailForm.nearbyAmenitiesCn,
        this.detailForm.commissionCn
        // this.detailForm.externalCommission,
        // this.detailForm.salesContacts
      )
    },
    getSubmitData () {
      //改变表单数据为提交时的数据
      let submitData = Object.assign({}, this.detailForm)
      submitData.mobileSync = submitData.mobileSync ? 'YES' : 'NO'
      submitData.featured = submitData.featured ? '0' : '1'
      submitData.cooperate = submitData.cooperate ? '1' : '0'
      submitData.soldOut = submitData.soldOut ? '1' : '0'
      submitData.deferredPayment = submitData.deferredPayment ? '1' : '0'
      submitData.description = this.$contentToBase64(submitData.description)
      submitData.descriptionCn = this.$contentToBase64(submitData.descriptionCn)
      submitData.keyPoints = this.$contentToBase64(submitData.keyPoints)
      submitData.keyPointsCn = this.$contentToBase64(submitData.keyPointsCn)
      submitData.facilities = this.$contentToBase64(submitData.facilities)
      submitData.facilitiesCn = this.$contentToBase64(submitData.facilitiesCn)
      submitData.nearbyAmenities = this.$contentToBase64(
        submitData.nearbyAmenities
      )
      submitData.nearbyAmenitiesCn = this.$contentToBase64(
        submitData.nearbyAmenitiesCn
      )
      submitData.commission = this.$contentToBase64(submitData.commission)
      submitData.commissionCn = this.$contentToBase64(submitData.commissionCn)
      submitData.externalCommission = this.$contentToBase64(
        submitData.externalCommission
      )
      submitData.salesContacts = this.$contentToBase64(submitData.salesContacts)
      submitData.projectId = this.id
      console.log(submitData.address)
      submitData.contactImage = this.fileData.length > 0 ? this.fileData[0].path : ''
      let facilitiesMap = []
      for (let key in this.nearbyList) {
        // let longitude2 = this.nearbyList[key].location.log
        // let latitude2 = this.nearbyList[key].location.lat
        // this.nearbyList[key].distance = self.distance2(this.detailForm.longitude, this.detailForm.latitude, longitude2, latitude2)
        facilitiesMap.push({
          type: key,
          value: this.nearbyList[key]
        })
      }
      if (submitData.address) {
        submitData.areaLevel1 = submitData.address[0]
        submitData.areaLevel2 = submitData.address[1]
        submitData.areaLevel3 = submitData.address[2]
      }
      submitData.facilitiesMap = JSON.stringify(facilitiesMap)
      return submitData
    },
    //保存前先读取服务端返回的富文本编辑器里面的内容，晒选出图片存在缓存中
    beforeSaveGetInitEdit () {
      for (let i = 0; i < arguments.length; i++) {
        this.editorArr = this.editorArr.concat(
          this.$changeHtmlStr(arguments[i])
        )
      }
    },
    //保存前获取编辑后的富文本编辑器的内容
    beforeSaveGetEdit () {
      for (let i = 0; i < arguments.length; i++) {
        this.updateEditorArr = this.updateEditorArr.concat(
          this.$changeHtmlStr(arguments[i])
        )
      }
    },
    //提交之前进行图片的检测
    beforeSaveCheckImage () {
      let editorImg =
        JSON.parse(window.sessionStorage.getItem('editorImg')) || []
      this.beforeSaveGetEdit(
        this.detailForm.description,
        this.detailForm.keyPoints,
        this.detailForm.facilities,
        this.detailForm.nearbyAmenities,
        this.detailForm.commission,
        this.detailForm.descriptionCn,
        this.detailForm.keyPointsCn,
        this.detailForm.facilitiesCn,
        this.detailForm.nearbyAmenitiesCn,
        this.detailForm.commissionCn,
        this.detailForm.externalCommission,
        this.detailForm.salesContacts
      )

      let allEditorArr = [...editorImg, ...this.editorArr] //将缓存里面的图片和获取的富文本编辑器的图片进行整合
      allEditorArr.length &&
        window.sessionStorage.setItem('editorImg', JSON.stringify(allEditorArr)) //点击时将之前富文本编辑器里面的图片进行缓存
      this.$changeSession(this.updateEditorArr)
    },
    downMapImg () {
      let self = this
      let imgsrc = ""
      if (this.detailForm.galleryLongitude) {
        imgsrc = 'https://maps.googleapis.com/maps/api/staticmap?zoom=' + this.mapImgZoom + '&size=600x300&maptype=roadmap&markers=color:red%7Clabel:C%7C' + this.detailForm.latitude + ',' + this.detailForm.longitude + '&markers=color:green%7Clabel:G%7C' + this.detailForm.galleryLatitude + ',' + this.detailForm.galleryLongitude + '&key=AIzaSyBFhANESE0lhBp-tSPbOy8FI6FfIiuPR0s';
      } else {
        imgsrc = 'https://maps.googleapis.com/maps/api/staticmap?zoom=' + this.mapImgZoom + '&size=600x300&maptype=roadmap&markers=color:red%7Clabel:C%7C' + this.detailForm.latitude + ',' + this.detailForm.longitude + '&key=AIzaSyBFhANESE0lhBp-tSPbOy8FI6FfIiuPR0s';
      }
      let image = new Image();
      // 解决跨域 Canvas 污染问题
      image.setAttribute("crossOrigin", "anonymous");
      image.onload = function () {
        let canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        let context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, image.width, image.height);
        let url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
        console.log(url)
        // 转成File模式
        let blob = self.dataURItoFile(url, 'snapshotLogo.png');
        let item = {
          name: 'snapshotLogo.png',
          upImgData: blob
        };
        self.UpLoadImg(item)
        // let a = document.createElement("a"); // 生成一个a元素
        // let event = new MouseEvent("click"); // 创建一个单击事件
        // a.download = 'snapshotLogo'; // 设置图片名称
        // a.href = url; // 将生成的URL设置为a.href属性
        // a.dispatchEvent(event); // 触发a的单击事件
      };
      image.src = imgsrc;
    },
    async downNear () {
      let self = this
      let arr = ["WALKING", "DRIVING", "TRANSIT"]

      await this.initMap({
        lat: Number(this.detailForm.latitude),
        lng: Number(this.detailForm.longitude)
      })
      // self.getDistance({
      //   lat: Number(self.detailForm.latitude),
      //   lng: Number(self.detailForm.longitude)
      // }, 'WALKING')
      // for(let i=0; i<arr.length; i++){
      // }
    },
    /**
     * 设置地图
     */
    setGoogleMap () {
      let head = document.head || document.getElementsByTagName("head")[0];
      let scriptDiv = document.createElement("script"); //  AIzaSyAxuq9fNMvpfLt8gwUa1o9djUYr3XwIw8I
      scriptDiv.src =
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyBFhANESE0lhBp-tSPbOy8FI6FfIiuPR0s&libraries=places";
      head.appendChild(scriptDiv);
    },
    /**
     * 计算经纬度距离
     */
    distance2 (longitude, latitude, longitude2, latitude2) {
      // console.log(longitude, longitude2)
      var lat1 = (Math.PI / 180) * Number(latitude);
      var lat2 = (Math.PI / 180) * Number(latitude2);
      var lon1 = (Math.PI / 180) * Number(longitude);
      var lon2 = (Math.PI / 180) * Number(longitude2);
      //地球半径，公里
      var R = 6371.393;
      var d = Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2)
        * Math.cos(lon2 - lon1)) * R;

      //單位：公里
      // console.log(d)
      return d;
    },
    async getDistance (project, TravelMode) {
      let self = this
      let origins = []
      let time = 0
      origins.push(new google.maps.LatLng(project.lat, project.lng));
      NProgress.start()
      setTimeout(() => {
        NProgress.done()
      }, 3000)
      for (let key in self.nearbyList) {
        time += 500
        let destinations = []
        console.log(self.nearbyList[key])
        self.nearbyList[key].forEach((ele) => {
          destinations.push(ele.location)
        })
        const request = {
          origins: origins,
          destinations: destinations,
          travelMode: google.maps.TravelMode[TravelMode],
          unitSystem: google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false,
        };
        const service = new google.maps.DistanceMatrixService();
        setTimeout(() => {
          service.getDistanceMatrix(request).then((response, status) => {
            let distance = response.rows[0].elements
            let nearby = self.nearbyList[key]
            nearby.forEach((item, index) => {
              item.distance = distance[index].distance.value
              item.duration = distance[index].duration.value
            })
            self.nearbyList[key] = nearby
          })
        }, time)
      }
    },
    /**
     * 获取周边信息
     */
    async initMap (project) {
      let time = 0
      let self = this
      let pyrmont = new google.maps.LatLng(project.lat, project.lng);
      let origins = []
      origins.push(pyrmont);
      this.map = new google.maps.Map(document.getElementById("avenir-map"), {
        center: project,
        zoom: 18,
      });
      let service = new google.maps.places.PlacesService(this.map);
      let service2 = new google.maps.places.PlacesService(this.map);
      for (let key in this.nearbyList) {
        time += 500
        let types = []
        types.push(key)
        let request = {
          location: pyrmont,
          radius: '2000',
          types: types
        };
        let destinations = []
        service.nearbySearch(request, (results, status) => {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            // let placeId5 = results[0].place_id;
            // var request1 = {
            //   placeId: placeId5,
            // };
            // service2.getDetails(request1, function(place, status) {
            //   console.log(place)
            // })
            let value = []
            results.forEach(element => {
              value.push({
                name: element.name,
                location: element.geometry.location,
                icon: element.icon,
                place_id: element.place_id
              })
              destinations.push(element.geometry.location)
            });
            self.$set(self.nearbyList, key, value)
          }
        });
        setTimeout(() => {
          console.log(destinations)
          const request = {
            origins: origins,
            destinations: destinations,
            travelMode: google.maps.TravelMode["WALKING"],
            unitSystem: google.maps.UnitSystem.METRIC,
            avoidHighways: false,
            avoidTolls: false,
          };
          const service = new google.maps.DistanceMatrixService();
          service.getDistanceMatrix(request).then((response, status) => {
            let distance = response.rows[0].elements
            let nearby = self.nearbyList[key]
            nearby.forEach((item, index) => {
              item.distance = distance[index].distance.value
              item.duration = distance[index].duration.value
            })
            self.nearbyList[key] = nearby
          })
        }, time)
      }
    },
    dataURItoFile (base64Data, filename = "file") {
      let arr = base64Data.split(",");
      let mime = arr[0].match(/:(.*?);/)[1];
      // let suffix = mime.split("/")[1];
      let bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], `${filename}`, {
        type: mime
      });
    },
    UpLoadImg (imgBlob) {
      let user = JSON.parse(window.sessionStorage.getItem("userInfo"));
      let formData = new FormData();
      formData.append("brokeId", user.brokeId);
      formData.append("token", user.token);
      formData.append("userId", user.userId);
      formData.append("file", imgBlob.upImgData);
      formData.append("type", 'projectImg');
      formData.append("projectId", this.id);
      formData.append("signature", md5(user.brokeId + this.id + 'projectImg' + user.userId + 'c1d65f3667324592a071ebec5038f38c'));
      console.log(formData)
      this.$PostFormData(this.$api.uploadFile, formData).then(res => {
        if (res.code === "0") {
          this.detailForm.snapshotLogo = res.datas.filePath
        }
      });
    },
  },

  beforeDestroy () {
    this.$deleteImg()
  },
}
</script>
<style lang="less">
.detail_wrapper {
  .dynamicLinkeManDiv {
    .el-input {
      width: 60%;
    }
  }
  background-color: #fff;
  height: 100%;
  position: relative;
  overflow: hidden;
  .head {
    height: 62px;
    position: absolute;
    top: 0;
    width: 100%;
    border-bottom: 1px solid #dcdfe6;
    border-top: 1px solid #dcdfe6;
    padding: 15px 30px;
    .el_col_name {
      div {
        padding: 4px 0;
        .project_name {
          font-weight: 300;
          font-size: 14px;
        }
      }
    }
  }
  .detail_content {
    position: absolute;
    top: 62px;
    bottom: 0;
    width: 100%;
    overflow: auto;
    padding: 15px 30px;
    .el-alert__title {
      font-size: 14px !important;
    }
    .uploader {
      img {
        width: 160px;
        height: 80px;
      }
    }
    .nearbyList {
      padding: 20px;
      border: 1px solid #ccc;
      list-style-type: none;
      .nearbyList-box {
        display: flex;
        margin-bottom: 10px;
        .nearbyList-type {
          width: 80px;
          margin-right: 10px;
        }
        .nearbyList-value-box {
          flex: 1;
          display: flex;
          flex-wrap: wrap;
          .nearbyList-value {
            padding: 2px 10px;
          }
        }
      }
    }
  }
  .upload_content {
    padding-left: 260px;
    .upload_url {
      color: #606266;
      font-size: 12px;
    }
    .upload_delete {
      color: blue;
      font-size: 14px;
      margin-left: 20px;
      cursor: pointer;
      text-decoration: underline;
    }
  }
}
</style>


