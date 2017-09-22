import TimerMixin from 'react-timer-mixin';
const reactMixin = require('react-mixin');
import Toast from 'react-native-root-toast';
import DeviceInfo from 'react-native-device-info';
import {
    DeviceEventEmitter
} from 'react-native'
import {
    MyServiceHttpUtil,
    HttApis
} from './HttpUtil'
import {
    checkIsPhoneNum,
    checkisAccordPsd
} from './Utils';
const hex_sha1 = require('./sha1').hex_sha1;
export default class CheckLogin {
    /**
     * 单例
     * @returns {CheckLogin}
     */
    static getInstance() {
        if (!CheckLogin.instance) {
            CheckLogin.instance = new CheckLogin();
            CheckLogin.instance
        }
        return CheckLogin.instance;
    }

    /**
     * 开始监控
     */
    start() {

       this.timer =  setInterval(() => {
            this._check()
        },10000)

    }
     _check() {
        console.log('检查登录')
        storage.load({key:'userInfo'}).then(info => {
            MyServiceHttpUtil.Post(HttApis.MyServerApis.Base + HttApis.MyServerApis.Login,{
                'mobile': info.mobile,
                'password':hex_sha1(info.psd),
                'reset':0,
                'uuid':DeviceInfo.getUniqueID()
            },(data) => {

                if (data.status == 'B0000') {

                }else if (data.status == 'B0014') {
                    storage.remove({
                        key:'userInfo'
                    }).then(() => {
                        DeviceEventEmitter.emit('SignOut')
                    })
                    Toast.show('您的账号在其它设备登录，您已被下线')
                }
            },(error)=>{},false)
        }).catch(() => {})

    }
    stop() {
        this.timer && clearInterval(this.timer)
    }

}
reactMixin.onClass(CheckLogin,TimerMixin)