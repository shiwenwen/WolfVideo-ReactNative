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

/*------------------react-navigation------------------------------*/
import { StackNavigator,TabNavigator } from 'react-navigation';
import CategoryPage from "./Components/Category/CategoryPage";
import MinePage from "./Components/Mine/MinePage";
import SearchPage from './Components/Hot/SearchPage'
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
            headerTitleStyle:{
              alignSelf:'center'
            },
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
            headerTitleStyle:{
                alignSelf:'center'
            },
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
        style: {
            height:49,
            backgroundColor:'white',
            borderTopColor:'#d9d9d9',
            borderTopWidth:0.5
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
           // headerTitle:'详情',
           // headerTitleStyle:{
           //     alignSelf:'center'
           // },
           header:null

       }
   },
    // 搜索页
    SearchPage: {
       screen:SearchPage,
        navigationOptions: {
            header:null

        }
    }

},{
    transitionConfig:()=>({
        screenInterpolator:CardStackStyleInterpolator.forHorizontal,
    }),
    navigationOptions:{
        headerBackTitle:'返回',
        headerRight: <View />
    }
})
const styes = StyleSheet.create({
    tabBarIcon :{

    }
})
AppRegistry.registerComponent('WolfVideo', () => mainstackNavigator);