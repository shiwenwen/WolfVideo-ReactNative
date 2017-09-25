/**
 * MinePage
 * @sww
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    // Image,
    TouchableOpacity,
    DeviceEventEmitter,
    Platform
} from 'react-native';
import {
    MyServiceHttpUtil,
    HttApis
} from '../../Utils/HttpUtil'
import Toast from 'react-native-root-toast';
import Icon from 'react-native-vector-icons/FontAwesome';
const ImagePicker = require('react-native-image-picker');
import ImageCropPicker from 'react-native-image-crop-picker';
const hex_md5 = require('../../Utils/md5').hex_md5;
import DeviceInfo from 'react-native-device-info';
import  {HUD}  from "../Widgets/LoadingIndicator";
import LoadingIndicator from "../Widgets/LoadingIndicator";
import {CustomCachedImage,CachedImage} from "react-native-img-cache";

import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';

export default class MinePage extends Component {

    constructor(props) {
      super(props);
      this.state = {
          avatar:null,
          name: '',
          mobile: '',
          isLogin: false
      };
      _email = ''
      _userId:null
    }

    render() {
        return (
            <View style={styles.container}>
              <ScrollView style={styles.container}>
                  {/* ---- 头部 ---- */}
                  <View style={styles.headerView}>
                       {/* 头像*/}
                      <TouchableOpacity style={styles.avatarBg} onPress={this._changeHeader}>
                          <CachedImage style={styles.avatar} source={this.state.avatar ?  {uri: this.state.avatar} : require('../../sources/imgs/icon60.png')}/>
                      </TouchableOpacity>
                      {/* 信息*/}
                      <View style={styles.info}>
                          {/*昵号*/}
                          <Text style={styles.name} onPress={this._toUpdate}>{this.state.name}</Text>
                          {/*手机号*/}
                          <Text style={styles.mobile} onPress={this._toUpdate}>{this.state.mobile}</Text>
                      </View>
                  </View>
                  {/* ---列表项-----*/}

                  {/*收藏*/}
                  <TouchableOpacity style={styles.item} onPress={this._toFavorties}>
                      <View style={styles.itemLeft}>
                          <Icon name='heart' size={18} color='#4AD5BD'/>
                          <Text style={styles.itemTitle}>收藏</Text>
                      </View>
                      <Icon name='chevron-right' size={18} />
                  </TouchableOpacity>
                  {/* 设置 */}
                  <TouchableOpacity style={styles.item} onPress={this._toSetting}>
                      <View style={styles.itemLeft}>
                          <Icon name='gears' size={18} color='#4AD5BD'/>
                          <Text style={styles.itemTitle}>设置</Text>
                      </View>
                      <Icon name='chevron-right' size={18} />
                  </TouchableOpacity>

              </ScrollView>
            </View>
        );
    }

    componentDidMount() {
        this._loadInfo()
        this.signInEmittr = DeviceEventEmitter.addListener('LoginSuccess',() => {
            this._loadInfo()
        })
        this.signOutEmittr = DeviceEventEmitter.addListener('SignOut',() => {
            this._loadInfo()
        })
    }

    componentWillUnmount() {
        this.signInEmittr.remove()
        this.signOutEmittr.remove()
    }
    _loadInfo() {
        storage.load({
            key:'userInfo'
        }).then(info => {
            this._userId = info.userId
            this.setState({
                isLogin:true,
                name: info.name,
                mobile: info.mobile,
                avatar: null
            })
            this._requestUserInfo(info.userId)
        },error => {
            this.setState({
                isLogin:true,
                name: '未登录',
                mobile: '未知手机号',
                avatar: null

            })
            this._userId = null
        })
    }
    componentWillMount() {

    }

    /**
     * 更新信息
     * @private
     */
    _toUpdate = () => {
        if (this._checkLogin()) {
            this.props.navigation.navigate('UpdateInfo',{
                userId: this._userId,
                name: this.state.name,
                email:this._email,
                callback: () => {
                    this._requestUserInfo(this._userId)
                }
            })
        }
    }
    /**
     * 检查登录
     * @private
     */
    _checkLogin = () : boolean => {
        if (!this._userId) {
            this.props.navigation.navigate('Login',{
                transition: 'forVertical',
                callback:(userId) => {
                    this._userId = userId
                    this._requestUserInfo(userId)
                }
            })
            return false
        }
        return true
    }
    /**
     * 请求个人信息
     * @private
     */
    _requestUserInfo = (userId: number) => {
        MyServiceHttpUtil.GET(HttApis.MyServerApis.Base + HttApis.MyServerApis.Info,{
            userId:userId
        },(data) => {
            if (data.status == 'B0000') {
                this.setState({
                    name: data.name,
                    mobile: data.mobile,
                    avatar: data.avatar
                })
                this._email = data.email
            }else {
                Toast.show(data.txt)
            }

        },(error) => {},false)
    }

    /**
     * 去收藏页
     * @private
     */
    _toFavorties = ()=> {
        if (this._checkLogin()) {
            this.props.navigation.navigate('CollectsPage',{
                userId: this._userId
            })
        }

    }

    /**
     * 去设置页
     * @private
     */
    _toSetting = ()=>  {
        this.props.navigation.navigate('SettingPage',{
            userId: this._userId,
            callback: () => {
                this.setState({
                    isLogin:true,
                    name: '未登录',
                    mobile: '未知手机号',
                    avatar: null

                })
                this._userId = null
            }
        })
    }

    /**
     * 更换头像
     * @private
     */
    _changeHeader = ()=> {
        if (!this._checkLogin()) {
            return
        }
        const options = {
            title: '上传头像',
            cancelButtonTitle:'取消',
            takePhotoButtonTitle:'拍照',
            chooseFromLibraryButtonTitle:'相册图片',
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else {
                ImageCropPicker.openCropper({
                    path: response.uri,
                    width: 300,
                    height: 300
                }).then(image => {
                    console.log(image);
                    this.setState({
                        avatar:image.path
                    });
                    let ext = image.mime.substring(6)
                    this.uploadImage(image.path,ext)
                });
            }
        });

    }
    uploadImage(uri: string,ext: string){
        LoadingIndicator.show('头像上传中',{left:0,right:0,top:0,bottom:49},'Circle')
        Date.prototype.format =function(format)
        {
            var o = {
                "M+" : this.getMonth()+1, //month
                "d+" : this.getDate(), //day
                "h+" : this.getHours(), //hour
                "m+" : this.getMinutes(), //minute
                "s+" : this.getSeconds(), //second
                "q+" : Math.floor((this.getMonth()+3)/3), //quarter
                "S" : this.getMilliseconds() //millisecond
            }
            if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
                (this.getFullYear()+"").substr(4- RegExp.$1.length));
            for(var k in o)if(new RegExp("("+ k +")").test(format))
                format = format.replace(RegExp.$1,
                    RegExp.$1.length==1? o[k] :
                        ("00"+ o[k]).substr((""+ o[k]).length));
            return format;
        }


        const formData = new FormData();
        const  dataStr = new Date().format('yyyyMMddhhmmss')
        const file = {uri: uri, type: `image/${ext}`, name: `${dataStr}_${this._userId}.${ext}`};

        formData.append("avatar",file);
        formData.append('from',Platform.OS)
        formData.append('version',DeviceInfo.getVersion())
        const data = {
            'ext':ext,
            'userId':this._userId
        }
        const sign = hex_md5(JSON.stringify(dataStr))
        formData.append('userId',this._userId)
        formData.append('sign',sign)
        fetch(HttApis.MyServerApis.Base + HttApis.MyServerApis.UploadAvatar,{
            method:'POST',
            headers:{
                'Content-Type':'multipart/form-data',
                'Accept': 'application/json',
            },
            body:formData,
        }).then((response) => response.json()).then((responseJson) => {
            LoadingIndicator.hidden()
            console.log(responseJson)
            if (responseJson.code != '0000') {
                Toast.show(responseJson.msg)
                return
            }
            const resData = responseJson.data
            Toast.show(resData.txt)
            if (resData.status == 'B0000') {
                this.setState({
                    avatar:resData.avatar
                })
            }else {

            }
        }).catch(error => {
            LoadingIndicator.hidden()
            Toast.show('上传失败')
            console.log(error)
        })
    }

}

const styles = StyleSheet.create({
    container: {
        flex:1,

    },
    headerView: {
        paddingHorizontal:15,
        paddingVertical:10,
        flexDirection:'row',
        // justifyContent:'space-between',
        backgroundColor:'white',
        borderBottomWidth:0.5,
        borderBottomColor:'#ececec',
        alignItems:'center',

    },
    avatarBg: {
        width:60,
        height:60,
        borderColor:'#d9d9d9',
        borderRadius:5,
        borderWidth:1,

    },
    avatar: {

        width:58,
        height:58,
        borderRadius:5,
    },
    info: {
        marginLeft:10,
        height:60,
        justifyContent:'space-between',
        paddingVertical:5
    },
    name: {
       fontSize:19,
       color:'#333',
    },
    mobile: {
        fontSize:17,
        color:'#999',
    },
    item: {
        marginVertical:10,
        backgroundColor:'white',
        height:45,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        paddingHorizontal:15
    },
    itemLeft: {
        flexDirection:'row',
        alignItems:'center',
    },
    itemTitle: {
        fontSize: 17,
        marginLeft:10,
        color:'#333'
    }

});