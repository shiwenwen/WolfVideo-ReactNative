/**
 * WolfVideo
 * @sww
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Platform,
    Image,
    AppRegistry,
    Button
} from 'react-native';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStackStyleInterpolator';
/*------------------导入页面------------------------------*/
//热门页
import HotPage from "./Components/Hot/HotPage"
//最新页
import NewPage from "./Components/New/NewPage"
//视频详情页
import VideoDetail from './Components/Base/VideoDetail'
//分类详情页
import CategoryDetailPage from './Components/Category/CategoryDetailPage'
//分类页
import CategoryPage from "./Components/Category/CategoryPage";
//个人页
import MinePage from "./Components/Mine/MinePage";
//搜索页
import SearchPage from './Components/Hot/SearchPage'
//演员列表页
import ActorPage from './Components/Category/Actor/ActorPage'
//演员视频页
import ActorVideoPage from './Components/Category/Actor/ActorVideoPage'
//登录页
import Login from './Components/Mine/Login/Login'
//注册
import Register from './Components/Mine/Login/Register'
// 收藏
import  CollectsPage from './Components/Mine/CollectsPage'
//设置
import SettingPage from './Components/Mine/SettingPage'

// --------------- 持久化----------------
import './Utils/StorageUtil';


/*------------------react-navigation------------------------------*/
import { StackNavigator,TabNavigator } from 'react-navigation';
// import Orientation from 'react-native-orientation';
//
// Orientation.lockToPortrait()

// tab
const mainTabNavigator = TabNavigator({
    // ---- 配置页面
    HotPage: {
        screen:HotPage,
        navigationOptions:{
            header: null,
            tabBarLabel: '热门影片',
            tabBarIcon: ({tintColor,focused}) => (
                focused ?
                    <Image
                        source={require('./sources/imgs/HotSel.png')}
                        style={styes.tabBarIcon}
                        resizeMode='contain'
                    /> : <Image
                        source={require('./sources/imgs/HotNormal.png')}
                        style={styes.tabBarIcon}
                        resizeMode='contain'
                    />
            ),
        },

    },
    NewPage: {
        screen: NewPage,
        navigationOptions:{
            tabBarLabel: '最新影片',
            headerTitle:'最新影片',
            headerLeft:<View/>, //使标题偏移居中
            tabBarIcon: ({tintColor,focused}) => (
                focused ?
                <Image
                    source={require('./sources/imgs/NewSel.png')}
                    resizeMode='contain'
                    style={styes.tabBarIcon}
                /> : <Image
                        source={require('./sources/imgs/NewNormal.png')}
                        style={styes.tabBarIcon}
                        resizeMode='contain'
                    />
            ),
        },

    },
    Category: {
        screen:CategoryPage,
        navigationOptions:{
            tabBarLabel: '影片分类',
            headerTitle:'影片分类',
            headerLeft:<View/>, //使标题偏移居中
            tabBarIcon: ({tintColor,focused}) => (
                focused ?
                    <Image
                        source={require('./sources/imgs/CatSel.png')}
                        style={styes.tabBarIcon}
                        resizeMode='contain'
                    /> : <Image
                        source={require('./sources/imgs/CatNormal.png')}
                        style={styes.tabBarIcon}
                        resizeMode='contain'
                    />
            ),
        },

    },
    Mine: {
        screen: MinePage,
        navigationOptions:{
            tabBarLabel: '我的',
            headerTitle: '我',
            headerLeft:<View/>, //使标题偏移居中
            tabBarIcon: ({tintColor,focused}) => (
                focused ?
                    <Image
                        source={require('./sources/imgs/MineSel.png')}
                        resizeMode='contain'
                        style={styes.tabBarIcon}
                    /> : <Image
                        source={require('./sources/imgs/MineNormal.png')}
                        style={styes.tabBarIcon}
                        resizeMode='contain'
                    />
            ),
        },

    },
},{
    //配置属性
    tabBarPosition: 'bottom', //底部显示
    swipeEnabled:false, //左右滑动关闭
    backBehavior:'none',
    lazy:true,//标签懒加载
    tabBarOptions: {
        activeTintColor: '#4AD5BD',
        showIcon:true,
        upperCaseLabel:false,
        inactiveTintColor:'#999',
        pressColor:"#4AD5BD",
        style: Platform.OS == 'android' ? {
                height:49,
                backgroundColor:'white',
                borderTopColor:'#d9d9d9',
                borderTopWidth:0.5
        } : {
            backgroundColor:'white',
        },

        indicatorStyle:{
            height:0
        },
        iconStyle: {
            // width:22.5,
            // height:22.5
        },
        labelStyle: {
            marginTop:0
        }
    }
})

mainTabNavigator.navigationOptions = {

}


const transitionConfiguration = () => ({
    screenInterpolator: (sceneProps) => {
        const { scene } = sceneProps;
        const { route } = scene;
        const params = route.params || {};
        const transition = params.transition || 'forHorizontal';
        return CardStackStyleInterpolator[transition](sceneProps);
    },
});

// 导航
const mainstackNavigator = StackNavigator({
   // 首页
   Home: {
       screen: mainTabNavigator,
   },
   // 详情页
   VideoDetail: {
       screen: VideoDetail,
       navigationOptions: {
           header:null

       }
   },
    // 搜索页
    SearchPage: {
       screen:SearchPage,
        navigationOptions: {
            header:null

        }

    },
    /**
     * 分类详情
     */
    CategoryDetailPage: {
       screen: CategoryDetailPage
    },
    /**
     * 演员列表页
     */
    ActorPage: {
        screen: ActorPage,
        navigationOptions: {
            headerTitle:'演员列表',

        }
    },
    /**
     * 演员视频页
     */
    ActorVideoPage: {
        screen: ActorVideoPage
    },
    /**
     * 登录
     */
    Login: {
        screen: Login,
        navigationOptions: {
            header:null,
        }
    },
    /**
     * 注册
     */
    Register: {
        screen: Register,
        navigationOptions: {
            headerTitle:'注册'
        }
    },
    /**
     * 收藏页
     */
    CollectsPage: {
        screen: CollectsPage,
        navigationOptions: {
            headerTitle:'我的收藏'
        }
    },
    SettingPage: {
        screen: SettingPage,
        navigationOptions: {
            headerTitle: '设置'
        }
    }

},{
    transitionConfig:transitionConfiguration,
    navigationOptions:{
        headerBackTitle:'返回',
        headerTitleStyle:{
            alignSelf:'center'
        },
        headerRight: <View />,
        headerStyle:{
            backgroundColor:'white',
            height:Platform.OS == 'android' ? 40 : 64
        }
    }
})
const styes = StyleSheet.create({
    tabBarIcon :{

    }
})


AppRegistry.registerComponent('WolfVideo', () => mainstackNavigator);