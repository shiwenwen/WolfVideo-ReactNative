/**
 *
 * @sww
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Keyboard,
    Platform,
    Button,
    Text,
    TouchableOpacity,
    DeviceEventEmitter,
    StatusBar
} from 'react-native';
const ScreenUtil = require('../../../Utils/ScreenUtil');
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-root-toast';
import DeviceInfo from 'react-native-device-info';
import Orientation from 'react-native-orientation';
import {
    MyServiceHttpUtil,
    HttApis
} from '../../../Utils/HttpUtil'
import {
    checkIsPhoneNum,
    checkisAccordPsd
} from '../../../Utils/Utils';
const hex_sha1 = require('../../../Utils/sha1').hex_sha1;

export default class Login  extends Component {
    _mobile = ''
    _psd = ''
    static navigationOptions = ({ navigation }) => ({

    });
    constructor(props) {
      super(props);
      this.state = {
          marginV:80
      };
    }

    render() {
        return (
            <View style={styles.container} >
                {
                    Platform.OS == 'android' ? <StatusBar backgroundColor='white' barStyle="dark-content"  />  : null
                }
                <Icon onPress={this._close} name='close' size={35} color='#4AD5BD' style={styles.close}/>
                <ScrollView style={styles.scrollView} >
                    {/*输入*/}
                    <View style={[styles.input,{marginVertical:this.state.marginV}]}>
                        {/*logo*/}
                        <Image style={styles.logo} source={require('../../../sources/imgs/bgicon.png')}/>
                        {/*手机号*/}
                        <TextInput
                            style={styles.mobilInput}
                            placeholder='请输入手机号'
                            keyboardType='numeric'
                            onChangeText={(text) => {
                                this._onChangeText(1,text)
                            }}

                            underlineColorAndroid="#4AD5BD"
                            autoCorrect={false}
                            maxLength={11}
                        ></TextInput>
                        {/*密码*/}
                        <TextInput
                            style={styles.psdInput}
                            placeholder='请输入密码'
                            onChangeText={(text) => {
                                this._onChangeText(2,text)
                            }}

                            underlineColorAndroid="#4AD5BD"
                            autoCorrect={false}
                            secureTextEntry={true}
                            maxLength={16}
                        ></TextInput>
                        <TouchableOpacity style={styles.login} onPress={this._login}>
                            <Text style={styles.loginTitle}>登录</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
                <Text style={styles.toRegister} onPress={this._toRegister}>去注册</Text>
            </View>

        );
    }

    /**
     * 关闭
     * @private
     */
    _close = () => {
        Toast.show('未登录用户每小集只能观看一分钟，且不能观看全集')
        this.props.navigation.goBack()
    }
    /**
     * 输入文字改变
     * @param tag
     * @param text
     * @private
     */
    _onChangeText = (tag: number, text: string) => {
        if (tag == 1) {
            this._mobile = text
        }else {
            this._psd = text
        }
    }
    /**
     * 登录
     * @private
     */
    _login = () => {
        if (!checkIsPhoneNum(this._mobile)) {
            Toast.show('请输入正确手机号')
            return
        }
        if (checkisAccordPsd(this._psd) != 1) {
            Toast.show('密码长度为6-16位，且不能保护非法字符')
            return
        }

        MyServiceHttpUtil.Post(HttApis.MyServerApis.Base + HttApis.MyServerApis.Login,{
            'mobile': this._mobile,
            'password':hex_sha1(this._psd),
            'reset':1,
            'uuid':DeviceInfo.getUniqueID()
        },(data) => {
            Toast.show(data.txt)
            if (data.status == 'B0000') {

                // 保存登录信息
                storage.save({
                    key:'userInfo',
                    data: {
                        name: data.name,
                        mobile: data.mobile,
                        userId: data.userId,
                        psd:this._psd
                    }
                }).then((result) => {
                    DeviceEventEmitter.emit('LoginSuccess',data.userId)
                    this.props.navigation.state.params.callback && this.props.navigation.state.params.callback(data.userId)
                    this.props.navigation.goBack()
                })
            }
        })

    }
    /**
     * 去注册
     * @private
     */
    _toRegister = () => {
        const {navigate,state} = this.props.navigation
        navigate('Register',{
            backKey: state.key,
            transition: 'forVertical',
            callback: this.props.navigation.state.params.callback
        })
    }
    componentDidMount() {

        Orientation.addOrientationListener(this._orientationDidChange);
        Orientation.getOrientation((err, orientation) => {
            if (orientation == 'LANDSCAPE') {
                this.setState({
                    marginV:20
                })
            }else {
                this.setState({
                    marginV:80
                })
            }
        });

    }
    _orientationDidChange = (orientation) => {
        console.log('当前屏幕方向 : ' + orientation)

        if (orientation == 'LANDSCAPE') {
            this.setState({
                marginV:20
            })
        }else {
            this.setState({
                marginV:80
            })
        }
    }
    componentWillUnmount() {
        Orientation.removeOrientationListener(this._orientationDidChange);
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'white',
    },
    scrollView: {
        flex:1,
        backgroundColor:'white',
    },
    close: {
        position:'absolute',
        top:Platform.OS == 'android' ? 10 : 30,
        left:10,
        zIndex:10
    },
    logo: {
        width:80,
        height:80
    },
    input: {
        alignItems: 'center',
        width:'100%',
    },
    mobilInput:{
        marginTop:20,
        width:'80%',
        textAlign:'center'
    },
    psdInput: {
        marginTop:20,
        width:'80%',
        textAlign:'center'
    },
    login: {
        marginTop:20,
        marginBottom:35,
        width:'80%',
        borderRadius:4,
        height:40,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#4AD5BD'
    },
    loginTitle: {
        color:'white',
        fontSize:16,
    },
    toRegister: {
        color:"#4AD5BD",
        fontSize:20,
        fontWeight:'bold',
        position:'absolute',
        top:Platform.OS == 'android' ? 17.5 : 37.5,
        right:10
    }
});