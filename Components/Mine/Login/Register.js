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
    StatusBar,
    Alert
} from 'react-native';
const ScreenUtil = require('../../../Utils/ScreenUtil');
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-root-toast';
import DeviceInfo from 'react-native-device-info';
import {
    MyServiceHttpUtil,
    HttApis
} from '../../../Utils/HttpUtil'
import {
    checkIsPhoneNum,
    checkisAccordPsd,
    checkIsEmail
} from '../../../Utils/Utils';
const hex_sha1 = require('../../../Utils/sha1').hex_sha1;

export default class Register  extends Component {
    //手机号
    _mobile = ''
    // 姓名
    _name = ''
    // 邮箱
    _email = ''
    // 密码
    _psd = ''
    // 邀请码
    _tradeNo = ''
    render() {
        return (
            <View style={styles.container}>
                {
                    Platform.OS == 'android' ? <StatusBar backgroundColor='white' barStyle="dark-content"  />  : null
                }
                <ScrollView style={styles.container} >
                    {/*输入*/}
                    <View style={styles.inputView} >
                        {/*手机号*/}
                        <TextInput
                            style={styles.input}
                            placeholder='请输入手机号'
                            keyboardType='numeric'
                            onChangeText={(text) => {
                                this._onChangeText(1,text)
                            }}

                            underlineColorAndroid="#4AD5BD"
                            autoCorrect={false}
                            maxLength={11}
                        ></TextInput>
                        <TextInput
                            style={styles.input}
                            placeholder='请输入昵称'
                            onChangeText={(text) => {
                                this._onChangeText(2,text)
                            }}

                            underlineColorAndroid="#4AD5BD"
                            autoCorrect={false}
                            maxLength={11}
                        ></TextInput>
                        {/*密码*/}
                        <TextInput
                            style={styles.input}
                            placeholder='请输入密码'
                            onChangeText={(text) => {
                                this._onChangeText(3,text)
                            }}

                            underlineColorAndroid="#4AD5BD"
                            autoCorrect={false}
                            secureTextEntry={true}
                            maxLength={16}
                        ></TextInput>
                        <TextInput
                            style={styles.input}
                            placeholder='请输入邮箱'
                            keyboardType='email-address'
                            onChangeText={(text) => {
                                this._onChangeText(4,text)
                            }}
                            underlineColorAndroid="#4AD5BD"
                            autoCorrect={false}
                        ></TextInput>
                        <TextInput
                            style={styles.input}
                            placeholder='请输入支付订单号'
                            keyboardType='numeric'
                            onChangeText={(text) => {
                                this._onChangeText(5,text)
                            }}

                            underlineColorAndroid="#4AD5BD"
                            autoCorrect={false}
                            maxLength={28}
                        ></TextInput>
                        <Text onPress={this._howToGetTradeNo} style={styles.howToGetTradeNo}>如何获取订单号</Text>
                        <TouchableOpacity style={styles.register} onPress={this._register}>
                            <Text style={styles.registerTitle}>注册</Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>
            </View>

        );
    }


    /**
     * 输入文字改变
     * @param tag
     * @param text
     * @private
     */
    _onChangeText = (tag: number, text: string) => {
        switch (tag) {
            case 1: {
                this._mobile = text
                break
            }
            case 2: {
                this._name = text
                break
            }
            case 3: {
                this._psd = text
                break
            }
            case 4: {
                this._email = text
                break
            }
            default: {
                this._tradeNo = text
            }
        }

    }
    /**
     * 如何查看订单号
     * @private
     */
    _howToGetTradeNo = () => {
        this.props.navigation.navigate('PayGetTradeNo')
    }
    /**
     * 注册
     * @private
     */
    _register = () => {

        if (!checkIsPhoneNum(this._mobile)) {
            Toast.show('请输入正确手机号')
            return
        }
        if (this._name.trim().length < 1) {
            Toast.show('请输入昵称')
            return
        }
        if (checkisAccordPsd(this._psd) != 1) {
            Toast.show('密码长度为6-16位，且不能保护非法字符')
            return
        }
        if (!checkIsEmail(this._email)) {
            Toast.show('请输入正确邮箱号')
            return
        }
        if (this._tradeNo.trim().length != 28) {
            Toast.show('请输入有效订单号')
            return
        }

        MyServiceHttpUtil.Post(HttApis.MyServerApis.Base + HttApis.MyServerApis.Register,{
            'mobile': this._mobile,
            'password':hex_sha1(this._psd),
            'email': this._email,
            'name': this._name,
            'tradeNo': this._tradeNo,
            'uuid':DeviceInfo.getUniqueID()
        },(data) => {

            if (data.status == 'B0000') {
                Toast.show(data.txt)
                //注册成功
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
                    console.log(this.props.navigation)
                    DeviceEventEmitter.emit('LoginSuccess',data.userId)
                    this.props.navigation.goBack(this.props.navigation.state.params.backKey)
                })
            }else {
                Alert.alert(
                    '提示',
                    data.txt,
                    [
                        {text: '确定', onPress: () => {}},
                    ],
                    { cancelable: false }
                )
            }
        })

    }

}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'white',
    },

    inputView: {
        marginTop:20,
        alignItems: 'center',
        width:'100%',
        // paddingHorizontal:20,

    },
    input:{
        marginVertical:5,
        width:'80%',
        textAlign:'center',

    },
    howToGetTradeNo: {
        marginVertical:6,
        textAlign:'right',
        width:'80%',
        color:'#4ad5ad',
        fontSize:17
    },
    register: {
        marginTop:20,
        marginBottom:35,
        width:'80%',
        borderRadius:4,
        height:40,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#4AD5BD'
    },
    registerTitle: {
        color:'white',
        fontSize:16,
    }
});