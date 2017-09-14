import Toast from "react-native-root-toast"
import {
    Platform,
    NetInfo,
    InteractionManager,
    AsyncStorage
} from 'react-native'
import LoadingIndicator from'../Components/Widgets/LoadingIndicator';
// import TimerMixin from 'react-timer-mixin';
// const reactMixin = require('react-mixin');
const _HttApis = require('../Configs/HttpApis');

/**
 * 网络请求工具类
 */
export default class HttpUtil {
    static APIS = _HttApis
    /**
     * POST
     * @param url 请求路径
     * @param params 请求参数
     * @param successCallback 成功回调 successCallback(reponseJson)
     * @param failureCallback 失败回调 failureCallback(error)
     * @param showHUD 是否显示菊花 默认显示
     * @param timeout 超时时间 默认60秒
     * @constructor
     */
    static Post(url: string,params: JSON,successCallback: Function,failureCallback: Function = function(error){},showHUD: boolean = true,hudBottom : number = 0,timeout: number = 60000) {
        if (showHUD) {
            LoadingIndicator.show(null,hudBottom)

        }
        NetInfo.isConnected.fetch().done((isConnected) => {
            if (!isConnected) {
                if (showHUD) {
                    LoadingIndicator.hidden()
                }
                Toast.show('网络开小差了ε(┬┬﹏┬┬)3')
                failureCallback(new Error(
                    4444,'无法连接到网络'
                ))
            }else {

                console.info("POST--Request--" + url +"\nparams:",params)
                fetch(url,{
                    method:'POST',
                    credentials:'include',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    timeout:timeout,
                    body:JSON.stringify(params)
                }).then((response) => response.json()).then((responseJson) => {
                    console.log("POST--Response--" + url + "\nparams:\n",params,"\nresponse:\n",responseJson )
                    if (showHUD) {
                        LoadingIndicator.hidden()
                    }
                    successCallback(responseJson)

                }).catch((error) => {
                    if (showHUD) {
                        LoadingIndicator.hidden()
                    }
                    console.error(error)
                    failureCallback(error)
                })



            }

        })





    }
    /**
     * GET
     * @param url 请求路径
     * @param params 请求参数
     * @param successCallback 成功回调 successCallback(reponseJson)
     * @param failureCallback 失败回调 failureCallback(error)
     * @param showHUD 是否显示菊花 默认显示
     * @param timeout 超时时间 默认60秒
     * @constructor
     */
    static GET(url: string,params: JSON,successCallback: Function,failureCallback: Function = function(error){},showHUD: boolean = true,hudBottom : number = 0, timeout: number = 60000){
        if (showHUD) {
            LoadingIndicator.show(null,hudBottom)
        }
        NetInfo.isConnected.fetch().done((isConnected) => {
            if (!isConnected) {
                if (showHUD) {
                    LoadingIndicator.hidden()
                }
                Toast.show('网络开小差了ε(┬┬﹏┬┬)3')
                failureCallback(new Error(
                    4444,'无法连接到网络'
                ))
            }else {

                console.info("GET--Request--" + url +"\nparams:",params)
                let paramsStr='?';
                for (item in params){
                    body += (item + '=' + params[item] + '&')
                }
                paramsStr = paramsStr.substr(0,paramsStr.length-1)

                fetch(url+paramsStr,{
                    method:'POST',
                    credentials:'include',
                    headers: {
                        'Accept': 'application/json'
                    },
                    timeout:timeout,
                }).then((response) => response.json()).then((responseJson) => {
                    console.log("GET--Response--" + url + "\nparams:\n",params,"\nresponse:\n",responseJson )

                    if (showHUD) {
                        LoadingIndicator.hidden()
                    }
                    successCallback(responseJson)

                }).catch((error) => {
                    if (showHUD) {
                        LoadingIndicator.hidden()
                    }
                    Toast.show(error)
                    console.error(error)
                    failureCallback(error)
                })



            }

        })




    }



}