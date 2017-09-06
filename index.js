/**
 * WolfVideo
 * @sww
 */
import React, { Component } from 'react';
import SplashScreen from 'react-native-splash-screen'
import {
    StyleSheet,
    Text,
    View,
    Platform
} from 'react-native';
var ScrollableTabView = require('react-native-scrollable-tab-view');
import HotPage from "./Components/Hot/HotPage"
import NewPage from "./Components/New/NewPage"
export default class WolfVideo extends Component {
    componentDidMount() {
        SplashScreen.hide()
    }
    render() {

        return (
            <ScrollableTabView
                tabBarActiveTextColor="#4AD5BD"
                tabBarUnderlineStyle={{backgroundColor:'#4AD5BD'}}
                tabBarTextStyle={{fontSize:15}}
                renderTabBar={() => <ScrollableTabView.ScrollableTabBar/>}
                style={{marginTop:Platform.OS=='android'?0:10}}
            >
                <HotPage tabLabel='热门影片'/>
                <NewPage tabLabel='最新影片'/>
                <NewPage tabLabel='演员列表'/>
                <NewPage tabLabel='影片分类'/>
                <NewPage tabLabel='搜索'/>
                <NewPage tabLabel='我的'/>
            </ScrollableTabView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },

});