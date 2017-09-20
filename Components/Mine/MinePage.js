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
    Image,
    TouchableOpacity
} from 'react-native';
import {
    MyServiceHttpUtil,
    HttApis
} from '../../Utils/HttpUtil'
import Toast from 'react-native-root-toast';
import Icon from 'react-native-vector-icons/FontAwesome';
const ImagePicker = require('react-native-image-picker');
export default class MinePage extends Component {

    constructor(props) {
      super(props);
      this.state = {
          avatar:null,
          name: '',
          mobile: '',
          isLogin: false
      };
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
                          <Image style={styles.avatar} source={this.state.avatar ?  {uri: this.state.avatar} : require('../../sources/imgs/icon60.png')}/>
                      </TouchableOpacity>
                      {/* 信息*/}
                      <View style={styles.info}>
                          {/*手机号*/}
                          <Text style={styles.name}>{this.state.name}</Text>
                          {/*手机号*/}
                          <Text style={styles.mobile}>{this.state.mobile}</Text>
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

    componentWillMount() {
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
        if (!this._userId) {
            this.props.navigation.navigate('Login',{
                transition: 'forVertical'
            })
            return
        }
    }

    /**
     * 去设置页
     * @private
     */
    _toSetting = ()=>  {

    }

    /**
     * 更换头像
     * @private
     */
    _changeHeader = ()=> {
        if (!this._userId) {
            this.props.navigation.navigate('Login',{
                transition: 'forVertical'
            })
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

                this.setState({
                    avatar: response.uri
                });
            }
        });

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