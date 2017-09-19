/**
 * HotPage
 * @sww
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    ImageBackground,
    Image,
    Platform,
    BackHandler,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import Swiper from 'react-native-swiper';
import HttpUtil from '../../Utils/HttpUtil';
import VideoListItem from '../Base/VideoListItem';
import EmptyView from '../Base/EmptyView'
const ScreenUtil = require('../../Utils/ScreenUtil');
import Icon from 'react-native-vector-icons/FontAwesome';
export default class HotPage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            hotDataList:[],
            headerData:[],
            isRefreshing:false
        }
    }
    render() {
        // return this._renderHeader()
        return (
            <View style={styles.container}>
                {/*ListView*/}
                <FlatList
                    data={this.state.hotDataList}
                    renderItem={this._renderItem}
                    getItemLayout={(data,index) => {
                        return {length:125,offset:125.5*index,index}
                    }}
                    refreshing={this.state.isRefreshing}
                    onRefresh={this._onRefresh}
                    keyExtractor={(item, index) => item.id}
                    ItemSeparatorComponent={this._renderItemSeparatorComponent}
                    ListHeaderComponent={this._renderHeader}
                    ListEmptyComponent={<EmptyView onPress={this._onRefresh}/>}
            >
                </FlatList>
            </View>
        );
    }

    componentDidMount() {
        // storage.remove({key:'userInfo'})
        this._checkLogin()
        SplashScreen.hide()
        // this._requestHotData(true)
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('handwareBackPress',this.onBackAndroid)
        }


    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('handwareBackPress',this.onBackAndroid)
        }
    }
    onBackAndroid = () => {
        // return true
    }


    /*渲染头部*/
    _renderHeader = () => {
        if (this.state.headerData.length < 1) {
            return null
        }
        return (
            <View style={styles.header}>
                <Swiper
                    style={styles.wrapper}
                    activeDotColor="#4AD5BD"
                    autoplay={true}
                    autoplayTimeout={4}
                    paginationStyle={{
                        bottom: 10
                    }}
                    loop
                >
                    {this._renderSlide()}
                    {/*搜索框*/}
                </Swiper >
                <TouchableOpacity style={styles.search} onPress={() => {
                    const { navigate } = this.props.navigation;
                    navigate('SearchPage')
                }}>
                    <Icon name='search' size={20}/>
                    <Text style={styles.searchTip}>搜索您想看的影片</Text>
                </TouchableOpacity>
            </View>
        )
    }
    _renderSlide(){
        let slides = new Array()
        for (let i = 0;i < this.state.headerData.length; i++) {
            let model = this.state.headerData[i]
            slides.push(
                <ImageBackground style={styles.slide} source={require('../../sources/imgs/imagePlaceholder.png')} resizeMode='stretch' key={i}>
                    <TouchableOpacity style={styles.slide} onPress={() => {
                        this._onPressItme(model,i)
                    }}>
                        <Image style={styles.slide} resizeMode='cover' source={{uri:model.playcover}}/>
                    </TouchableOpacity>
                </ImageBackground>
            )
        }
        return slides
    }
    /*渲染列表Item*/
    _renderItem = (info) => {
        // console.log(info)
        return(
            <VideoListItem model={info.item} index={info.index} onPress={this._onPressItme}/>
        )
    }
    /*点击item*/
    _onPressItme = (model,index) => {
        console.log('点击了'+index)
        const { navigate } = this.props.navigation;
        navigate(
            'VideoDetail',
            {
                title:model.title,
                id:model.id,
                barcode:model.barcode,
                play_conver:model.playcover,
                player:model.player,
                sys_ctime:model.sys_ctime,
                cat_text:model.cat_text,
                count:model.count,
                cover:model.cover,
                up_time: model.up_time,
                category: model.category,
                cat: model.cat
            }
        )
    }
    /*渲染分割线*/
    _renderItemSeparatorComponent = () => {
        return (<View style={styles.separator}></View>)
    }
    /**
     * 刷新
     * @private
     */
    _onRefresh = () => {
        this.setState({
            isRefreshing:true
        })
        this._requestHotData(false)
    }
    /*请求数据*/
    _requestHotData(showHUD){

        HttpUtil.GET(HttpUtil.APIS.WolfVideoApis.Base+HttpUtil.APIS.WolfVideoApis.HostList,{},(response) => {
            let wrapper = []
            for (let i = 0; i < 4; i ++) {
                wrapper.push(response.rows[parseInt(response.total*Math.random())])
            }
            this.setState({
                isRefreshing:false,
                hotDataList:response.rows,
                headerData:wrapper,
            })

        },(error) => {
            this.setState({
                isRefreshing:false
            })
        },showHUD,49)
    }

    /**
     * 检查登录
     * @private
     */
    _checkLogin() {
        storage.load({
            key:'userInfo'
        }).then(data => {
            console.log(data)
            if (!data) {
                this.props.navigation.navigate('Login',{
                    transition: 'forVertical'
                })
                this._requestHotData(false)
            }else {
                this._requestHotData(true)
            }
        },error => {
            console.log(error)
            if ( error.name == 'NotFoundError' ) {
                this.props.navigation.navigate('Login',{
                    transition: 'forVertical'
                })
                this._requestHotData(false)
            }else {
                this._requestHotData(true)
            }
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'white'
    },
    header:{
        height:ScreenUtil.scaleWidthSize(170)
    },
    wrapper: {
        flex:1,
    },
    separator: {
      height:0.5,
      backgroundColor:'#ececec'
    },
    slide: {
        flex: 1,
    },
    search: {
        position:'absolute',
        left:40,
        right:40,
        height:40,
        bottom:30,
        backgroundColor:'white',
        borderRadius:5,
        shadowColor:'#333',
        shadowOffset:{
            width:3,
            height:3
        },
        shadowOpacity:0.5,
        shadowRadius:5,
        elevation:4,
        flexDirection:'row',
        paddingHorizontal:20,
        alignItems:'center',
        justifyContent:'center'
    },
    searchTip: {
        marginLeft:20,
        fontSize:17
    }

});