/**
 *
 * @sww
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    ImageBackground,
    Text,
    TouchableOpacity,
    StatusBar,
    ScrollView
} from 'react-native';
import HttpUtil,{MyServiceHttpUtil,HttApis} from '../../Utils/HttpUtil';
const ScreenUtil = require('../../Utils/ScreenUtil')
import Orientation from 'react-native-orientation';
import Toast from  'react-native-root-toast';
import Video from '../Widgets/VideoPlayer'
import Icon from 'react-native-vector-icons/FontAwesome';

import {CustomCachedImage,CachedImage} from "react-native-img-cache";
export default class  extends Component {
    constructor(props){
        super(props)
        this.state = {
            ...props.navigation.state.params,
            isCollect:false,
            hiddenStatusBar:false,
            videoHeight:ScreenUtil.scaleWidthSize(170),
            play_list:[],
            currentUrl:'',
            currentIndex:0,
            showfullbutton:false,
            userId:null
        }

    }
    /**
     * 视频完整路径
     * */
    _fullUrl:null
    static navigationOptions = ({ navigation }) => ({

    });



    render() {
        return (
            <View style={styles.container}>
                <StatusBar hidden={this.state.hiddenStatusBar} backgroundColor='black' barStyle="default"/>
                {
                    this._renderVideo()
                }
                {/* 海报图 */}
                {
                    // this._renderPlayer_cover()
                }
                <ScrollView>
                    {/* 标题*/}
                    <Text style={styles.title}>{this.state.title + `(${this.state.cat_text})`}</Text>
                    {/* 播放次数 收藏 */}
                    <View style={styles.countLine}>
                        <Text style={styles.count}>{'播放次数：' + this.state.count}</Text>
                        <TouchableOpacity onPress={this._collect}>
                            <CachedImage source={this.state.isCollect ? require('../../sources/imgs/HotSel.png') : require('../../sources/imgs/HotNormal.png')}/>
                        </TouchableOpacity>
                    </View>
                    {/*番号*/}
                    <Text style={styles.barcode}>{'番号：' + this.state.barcode}</Text>
                    {/*演员名*/}
                    <Text style={styles.player}>{this.state.player}</Text>
                    {/*分集*/}
                    <View style={styles.diversity}>
                        {
                            this._renderDiversityItem()
                        }
                    </View>
                    {/* 完整 */}
                    {
                        this._renderFullPlay()
                    }
                </ScrollView>

            </View>
        );
    }

    /**
     * 渲染完整播放
     * @returns {*}
     * @private
     */
    _renderFullPlay () {
        return this.state.showfullbutton && this.state.userId ? (<TouchableOpacity onPress={this._fullPlay} style={styles.fullPlay}>
            <Text style={styles.fullPlayText}>播放全集</Text>
        </TouchableOpacity>) : <Text style={styles.tip}>未登录用户每小集只能观看一分钟，且不能观看全集</Text>
    }

    /**
     * 获取完整视频url
     * @param url
     * @returns {*}
     * @private
     */
    _getFullUrl(url) : string {

        if (url.length > 1) {
            return url
        }
        let fullUrl = `${HttpUtil.APIS.WolfVideoApis.CodeBase}${this.state.barcode}.mp4/playlist.m3u8`.replace(/ /g,'')
        return fullUrl
    }
    /**
     * 渲染分集
     * @returns {Array}
     * @private
     */
    _renderDiversityItem(){
        let items = []
        for (let i= 0; i < this.state.play_list.length; i ++) {
            items.push(
                <TouchableOpacity
                    key={i}
                    style={[styles.diversityItem,{backgroundColor:this.state.currentIndex == i ? '#0096ff' : '#4AD5BD'}]}
                    onPress={() => {
                    this._choseDiversity(i)
                }}>
                    <Text style={styles.diversityItemText}>{i+1}</Text>
                </TouchableOpacity>

            )
        }
        return items
    }
    _renderPlayer_cover() {
        if (this.state.play_list.length > 0 ) {
            return null
        }
        return (<ImageBackground source={require('../../sources/imgs/imagePlaceholder.png')} resizeMode='stretch'
                                 style={styles.play_conver_bg}>
            <Image source={{uri:this.state.play_conver}} resizeMode='cover' style={styles.play_conver}></Image>
        </ImageBackground>)
    }
    /**
     * 渲染视频组件
     * @returns {XML}
     * @private
     */
    _renderVideo() {
        return this.state.currentUrl ? (<Video style={[styles.video,{height:this.state.videoHeight}]} goBack={this._goBack} source={{uri:this.state.currentUrl}}
                       title={this.state.title + + `(${this.state.cat_text})_${this.state.currentIndex+1}`}
                       // poster={this.state.play_conver}
                       />) : (<ImageBackground source={require('../../sources/imgs/imagePlaceholder.png')} resizeMode='stretch'
                                               style={styles.video}>
            <Image source={{uri:this.state.play_conver}} resizeMode='cover' style={styles.play_conver}></Image>
        </ImageBackground>)
    }

    /**
     * 返回
     * @private
     */
    _goBack = () => {
        this.props.navigation.goBack()
    }
    componentDidMount() {
        Orientation.unlockAllOrientations()
        Orientation.addOrientationListener(this._orientationDidChange);
        Orientation.getOrientation((err, orientation) => {
            if (orientation == 'LANDSCAPE') {
                this.setState({
                    hiddenStatusBar:true,
                    videoHeight:ScreenUtil.screenW
                })
            }else {
                this.setState({
                    hiddenStatusBar:false,
                    videoHeight:ScreenUtil.scaleWidthSize(170)
                })
            }
        });
        storage.load({
            key:'userInfo'
        }).then(info => {
            this.setState({
              userId:info.userId
            })
            this._requestFavorites(info.userId)
        },error => {

        })
        this._requestDetailData()

    }


    _orientationDidChange = (orientation) => {
        console.log('当前屏幕方向 : ' + orientation)

        if (orientation == 'LANDSCAPE') {
            this.setState({
                hiddenStatusBar:true,
                videoHeight:ScreenUtil.screenW
            })
        }else {
            this.setState({
                hiddenStatusBar:false,
                videoHeight:ScreenUtil.scaleWidthSize(170)
            })
        }
    }
    /*请求数据*/
    _requestDetailData(){

        HttpUtil.GET(HttpUtil.APIS.WolfVideoApis.Base+HttpUtil.APIS.WolfVideoApis.VideoDetail+`\\${this.props.navigation.state.params.id}`,{},(response) => {
            const play_list_org = response.play_list
            let play_list = []
            if (this.state.userId) {
                for (let i = 0; i < play_list_org.length; i ++) {
                    let url = play_list_org[i]
                    play_list.push(url.substring(0,url.indexOf('?')))
                }
            }else {
                play_list = play_list_org
                Toast.show('未登录用户每小集只能观看一分钟，且不能观看全集')
            }

            this._fullUrl = this._getFullUrl(response.full_play)
            console.log(this._fullUrl)
            this.setState({
                title:response.title,
                player:response.player,
                barcode:response.barcode,
                count:response.count,
                play_list:play_list,
                currentUrl:play_list[0],
                currentIndex:0,
                play_conver:response.play_conver,
                showfullbutton:response.showfullbutton
            })
            this._response = response
        },(error) => {

        })
    }

    /**
     * 收藏
     * @private
     */
    _collect = () => {
        if (!this.state.userId) {
            Toast.show('请登录后操作')
            this.props.navigation.navigate('Login',{
                callback:(userInfo) => {
                    this.setState({
                        userId:userInfo.userId
                    })
                    this._requestFavorites(userInfo.userId)
                }
            })
            return
        }

        //请求收藏

        if (this.state.isCollect) {
            //取消收藏

            MyServiceHttpUtil.Post(HttApis.MyServerApis.Base + HttApis.MyServerApis.CancelCollect,{
                'userId':this.state.userId,
                'videoId':this.props.navigation.state.params.id
            },(data) => {
                Toast.show(data.txt)
                if (data.status == 'B0000') {
                    this.setState({
                        isCollect: false
                    })
                }
            })

        }else {
            //收藏
            MyServiceHttpUtil.Post(HttApis.MyServerApis.Base + HttApis.MyServerApis.AddNewCollect,{
                'collects': [{
                    'userId':this.state.userId,
                    'videoId':this.state.id,
                    'barcode': this._response.barcode,
                    'title': this._response.title,
                    'sys_ctime': this._response.sys_ctime,
                    'cover':this.state.cover,
                    'playcover':this.state.play_conver,
                    'category':this.state.category,
                    'startdate':this._response.startdate ? this._response.startdate : '',
                    'up_time':this.state.up_time ? this.state.up_time : '',
                    'player':this._response.player ? this._response.player : '',
                    'play_count':this._response.count ? this._response.count : '',
                    'cat':this.state.cat ? this.state.cat : '',
                    'cat_text':this._response.cat_text ? this._response.cat_text : '',
                }]
            },(data) => {
                Toast.show(data.txt)
                if (data.status == 'B0000') {
                    this.setState({
                        isCollect: true
                    })

                }

            })
        }


    }

    /**
     * 请求收藏
     * @private
     */
    _requestFavorites(userId) {
        MyServiceHttpUtil.GET(HttApis.MyServerApis.Base + HttApis.MyServerApis.CheckIsCollect,{
            'userId':userId,
            'videoId':this.props.navigation.state.params.id
        },(data) => {
            if (data.status == 'B0000') {
                this.setState({
                    isCollect: data.isCollect == 1
                })
            }else {
                Toast.show(data.txt)
            }

        })
    }
    /**
     * 选择分集
     * @param index
     * @private
     */
    _choseDiversity(index) {
        this.setState({
            currentUrl:this.state.play_list[index],
            currentIndex:index
        })
    }

    /**
     * 完整播放
     * @private
     */
    _fullPlay = () => {
        this.setState({
            currentIndex:-1,
            currentUrl:this._fullUrl
        })
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
    video: {
        height:ScreenUtil.scaleWidthSize(170)
    },
    play_conver_bg: {
        position:'absolute',
        left:0,
        right:0,
        top:0,
        height:ScreenUtil.scaleWidthSize(170)
    },
    play_conver: {
        flex:1
    },
    title: {
        paddingHorizontal:15,
        paddingVertical:8,
        width:'100%',
        color:'#4AD5BD',
        fontSize:15
    },
    countLine: {
        paddingHorizontal:15,
        paddingVertical:2,
        width:'100%',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'

    },
    collect: {
        width:30,
        height:30
    },
    count: {
        color:'#333',
        fontSize:13
    },

    barcode: {
        paddingHorizontal:15,
        paddingVertical:4,
        width:'100%',
        color:'#333',
        fontSize:13
    },
    player: {
        paddingHorizontal:15,
        paddingVertical:4,
        width:'100%',
        color:'#4AD5BD',
        fontSize:15
    },
    diversity: {
        flexDirection:'row',
        paddingHorizontal:10,
        flexWrap:'wrap',
        marginTop:20
    },
    diversityItem: {
        width:(ScreenUtil.screenW-30 - 10 * 5)/6,
        height:(ScreenUtil.screenW-30 - 10 * 5)/6,
        margin:5,
        backgroundColor:'#4AD5BD',
        alignItems:'center',
        justifyContent:'center'
    },
    diversityItemText: {
        fontWeight:'bold',
        fontSize:17,
        color:'white'
    },
    fullPlay: {
        marginVertical:40,
        borderRadius:5,
        backgroundColor:'#4AD5BD',
        marginHorizontal:30,
        height:40,
        alignItems:'center',
        justifyContent:'center'
    },
    fullPlayText: {
        color:'white',
        fontSize:17
    },
    tip: {
        marginVertical:40,
        marginHorizontal:30,
        color:'red',
        textAlign:'center'

    }
});