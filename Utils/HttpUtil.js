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
const MD5_KEY = '2edJwjL9Rwcb5dtUH32NdbINSP0kOqoIcIy6yWDT99hgmBeoCUtPtJo4YidbISC6'
const hex_md5 = require('./md5').hex_md5;
import DeviceInfo from 'react-native-device-info';

export const HttApis = require('../Configs/HttpApis')
/**
 * 网络请求工具类
 */
export default class HttpUtil {
    static APIS = HttApis
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
    static Post(url: string,params: JSON,successCallback: Function,failureCallback: Function = function(error){},showHUD: boolean = true,timeout: number = 60000) {
        if (showHUD) {
            LoadingIndicator.show('拼命加载中...')

        }
        NetInfo.fetch().done((state) => {
            if (state == 'none') {
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

                    Toast.show('请求失败\n' + error.message)
                    console.log(error)
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
    static GET(url: string,params: JSON,successCallback: Function,failureCallback: Function = function(error){},showHUD: boolean = true, timeout: number = 60000){
        if (showHUD) {
            LoadingIndicator.show('拼命加载中...')
        }
        NetInfo.fetch().done((state) => {
            if (state == 'none') {
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
                    paramsStr += (item + '=' + params[item] + '&')
                }
                paramsStr = paramsStr.substr(0,paramsStr.length-1)

                fetch(url+paramsStr,{
                    method:'GET',
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
                    Toast.show('请求失败\n' + error.message)
                    console.log(error)
                    failureCallback(error)
                })



            }

        })




    }



}

export  class MyServiceHttpUtil {
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
    static Post(url: string,params: JSON,successCallback: Function,failureCallback: Function = function(error){},showHUD: boolean = true,timeout: number = 60000) {
        if (showHUD) {
            LoadingIndicator.show('拼命加载中...')

        }

        NetInfo.fetch().done((state) => {
            if (state == 'none') {
                if (showHUD) {
                    LoadingIndicator.hidden()
                }
                Toast.show('网络开小差了ε(┬┬﹏┬┬)3')
                failureCallback(new Error(
                    4444,'无法连接到网络'
                ))
            }else {
                const sign = hex_md5(JSON.stringify(params))
                let body = {
                    'data': params,
                    'sign': sign,
                    'from': Platform.OS,
                    'version': DeviceInfo.getBuildNumber() //构建版本
                }
                console.info("POST--Request--" + url +"\nbody:",body)
                fetch(url,{
                    method:'POST',
                    credentials:'include',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    timeout:timeout,
                    body:JSON.stringify(body)
                }).then((response) => response.json()).then((responseJson) => {
                    console.log("POST--Response--" + url + "\nbody:\n",body,"\nresponse:\n",responseJson )
                    if (showHUD) {
                        LoadingIndicator.hidden()
                    }
                    if (responseJson.code != '0000') {
                        Toast.show(responseJson.msg)
                        failureCallback(new Error(responseJson.code,responseJson.msg))
                    }else {
                        successCallback(responseJson.data)
                    }


                }).catch((error) => {
                    if (showHUD) {
                        LoadingIndicator.hidden()
                    }
                    console.log(error)
                    Toast.show('请求失败\n' + error.message)
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
    static GET(url: '',params: JSON,successCallback: Function,failureCallback: Function = function(error){},showHUD: boolean = true, timeout: number = 60000){
        if (showHUD) {
            LoadingIndicator.show('拼命加载中...')
        }
        NetInfo.fetch().done((state) => {
            if (state == 'none') {
                if (showHUD) {
                    LoadingIndicator.hidden()
                }
                Toast.show('网络开小差了ε(┬┬﹏┬┬)3')
                failureCallback(new Error(
                    4444,'无法连接到网络'
                ))
            }else {

                console.info("GET--Request--" + url +"\nparams:",params)

                let paramsStr = '?'
                if (JSON.stringify(params) != '{}') {
                    for (var key in params){
                        paramsStr += (key + '=' + params[key] + '&')
                    }
                    paramsStr += `from=${Platform.OS}&version=${DeviceInfo.getBuildNumber()}`
                }else {
                    paramsStr = ''
                }
                fetch(url+paramsStr,{
                    method:'GET',
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
                    if (responseJson.code != '0000') {
                        Toast.show(responseJson.msg)
                        failureCallback(new Error(responseJson.code,responseJson.msg))
                    }else {
                        successCallback(responseJson.data)
                    }

                }).catch((error) => {
                    if (showHUD) {
                        LoadingIndicator.hidden()
                    }
                    Toast.show('请求失败\n' + error.message)
                    console.log(error)
                    failureCallback(error)
                })



            }

        })




    }



}