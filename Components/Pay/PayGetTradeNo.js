/**
 *
 * @sww
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    Button,
    CameraRoll,
    Platform,
    StatusBar
} from 'react-native';
const ScreenUtil = require('../../Utils/ScreenUtil');
const resolveAssetSource = require('react-native/Libraries/Image/resolveAssetSource')
const  RNFS  =  require('react-native-fs');

export default class PayGetTradeNo extends Component {
    constructor(props) {
      super(props);
      this.state = {
          showHUD: false
      };
    }
    render() {
        return (
            <ScrollView style={styles.container}>
                {
                    Platform.OS == 'android' ? <StatusBar backgroundColor='white' barStyle="dark-content"  />  : null
                }
                <Text style={styles.title}>支付宝账号:xxxxxx</Text>
                <View style={styles.qrCodeContainer}>
                    <View style={styles.qrItem}>
                        <Image style={styles.qrCode} source={require('../../sources/imgs/imagePlaceholder.png')} />
                        <Text style={styles.payTitle}>支付宝30元包月</Text>
                        <Button title='保存此二维码' style={styles.save} onPress={() => {

                                this._saveQrCode(resolveAssetSource(require('../../sources/imgs/imagePlaceholder.png')).uri)
                        }}/>
                    </View>
                    <View style={styles.qrItem}>
                        <Image style={styles.qrCode} source={require('../../sources/imgs/imagePlaceholder.png')} />
                        <Text style={styles.payTitle}>支付宝88元终身</Text>
                        <Button title='保存此二维码' style={styles.save} onPress={() => {
                            this._saveQrCode(resolveAssetSource(require('../../sources/imgs/imagePlaceholder.png')).uri)
                        }}/>
                    </View>
                </View>
                <Text style={styles.instruction}>说明：点击【保存此二维码】按钮，图片将会保存在
                    手机相册，支付宝选择 “扫一扫 - 相册 - 选择此图片”
                    即可，支付完成之后会有一个支付订单号，注册激活
                    时输入此订单号即可。</Text>

                {/* 帮助 */}
                <Text style={styles.helpTitle}>如何查看订单号</Text>
                <Text style={styles.title}>一、打开支付宝，找到【我的】</Text>
                <Image source={require('../../sources/imgs/imagePlaceholder.png')}/>
                <Text style={styles.title}>二、然后找到【账单】，进如入账单</Text>
                <Image source={require('../../sources/imgs/imagePlaceholder.png')}/>
                <Image source={require('../../sources/imgs/imagePlaceholder.png')}/>
                <Text style={styles.title}>三、查看刚才支付的订单，找到订单号。</Text>
                <Image source={require('../../sources/imgs/imagePlaceholder.png')}/>
                <Image source={require('../../sources/imgs/imagePlaceholder.png')}/>
                <Text style={styles.title}>四、注册时输入此订单号即可激活成功。</Text>
                <Text style={styles.tip}>提示，只接受当日的订单号.如果订单号过期，请发送订单号到xxx.邮箱，并标明退款，我们将为您进行退款</Text>

            </ScrollView>
        );
    }
    /**
     * 保存二维码
     * @param uri
     * @private
     */
    _saveQrCode(uri : string) {
        // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
        // 图片
        const downloadDest = `${RNFS.DocumentDirectoryPath}/${((Math.random() * 1000) | 0)}.png`;
        const formUrl = uri;


        const options = {
            fromUrl: formUrl,
            toFile: downloadDest,
            background: true,
            begin: (res) => {

            },
            progress: (res) => {


            }
        };
        try {
            const ret = RNFS.downloadFile(options);
            ret.promise.then(res => {
                console.log('success', res);
                console.log('file://' + downloadDest)
                CameraRoll.saveToCameraRoll('file://' + downloadDest).then(res => {

                    alert('保存成功')
                }).catch(error => {

                    alert('保存失败\n'+error)
                })
            }).catch(err => {
                console.log('err', err);
                alert('保存失败\n'+err)
            });
        }
        catch (error) {
            alert('保存失败\n'+error)
        }


    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'white',
        paddingVertical:10,
        paddingHorizontal:15
    },

    qrCodeContainer: {
        marginHorizontal:15,
        flexDirection:'row',
        justifyContent:'space-between',
        paddingTop:10,
        paddingBottom: 30,
        borderBottomColor:'#ececec',
        borderBottomWidth:1,

    },
    qrItem: {
      alignItems:'center'
    },
    payTitle: {
        fontWeight:'bold',
        color:'#333',
        fontSize: 15,
        marginVertical:10
    },
    qrCode: {
        width: ScreenUtil.scaleWidthSize(120),
        height: ScreenUtil.scaleWidthSize(120),
    },
    instruction: {
        marginVertical:20,
        fontSize: 15
    },
    helpTitle: {
        fontSize: 21,
        fontWeight:'bold',
        color:'#333',
        marginVertical:10,
        textAlign:'center',
        width:'100%'
    },
    title: {
        fontWeight:'bold',
        color:'#333',
        fontSize: 17,
        marginVertical:10
    },
    tip: {
        fontWeight:'bold',
        color:'red',
        fontSize: 17,
        marginBottom:20
    },
});