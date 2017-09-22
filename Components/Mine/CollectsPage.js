/**
 *
 * @sww
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    StatusBar,
    Platform
} from 'react-native';
import {
    MyServiceHttpUtil,
    HttApis
} from '../../Utils/HttpUtil';
import VideoListItem from '../Base/VideoListItem';
import EmptyView from '../Base/EmptyView';
import Toast from 'react-native-root-toast';
var Spinner = require('react-native-spinkit');
const PageSize = 50 ;

export default class CollectsPage extends Component {

    _pageNum = 0
    _total = 0
    _isLoading = false
    constructor(props) {
        super(props)
        this.state = {
            collectList:[],
            isRefreshing:false,
        }
    }
    render() {
        return (
            <View style={styles.container}>
                {
                    Platform.OS == 'android' ? <StatusBar backgroundColor='white' barStyle="dark-content"  />  : null
                }
                {/*/!*ListView*!/*/}
                <FlatList
                    data={this.state.collectList}
                    renderItem={this._renderItem}
                    getItemLayout={(data,index) => {
                        return {length:125,offset:125.5*index,index}
                    }}
                    refreshing={this.state.isRefreshing}
                    onRefresh={this._onRefresh}
                    onEndReached={this._onEndReached}
                    keyExtractor={(item, index) => item.videoId}
                    ItemSeparatorComponent={this._renderItemSeparatorComponent}
                    ListEmptyComponent={<EmptyView onPress={this._onRefresh}/>}
                    ListFooterComponent={() => {
                        return this._total != 0 && this.state.collectList.length < this._total ? <View style={styles.footer}>
                            <Spinner
                                type='ThreeBounce'
                                color='#4AD5BD'
                            />
                        </View> : <View/>
                    }}
                >
                </FlatList>
            </View>
        )
    }

    componentDidMount() {
        this._requestCollects(true)
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
                id:model.videoId,
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
        this._pageNum = 0
        this._requestCollects(false)
    }
    /**
     * 上拉加载
     * @private
     */
    _onEndReached = (distanceFromEnd) =>  {
        console.log(distanceFromEnd)
        if (this.state.collectList.length < 1 ) return
        if (this._isLoading) return
        this._requestCollects(false)
    }
    /*请求数据*/
    _requestCollects(showHUD){
        if (this._total != 0 && this.state.collectList.length >= this._total) {
            return
        }

        this._isLoading = true
        MyServiceHttpUtil.GET(HttApis.MyServerApis.Base + HttApis.MyServerApis.GetCollectList,{
            'pageNum' : this._pageNum,
            'pageSize' : PageSize,
            'userId' : this.props.navigation.state.params.userId
        },(data) => {
            this._isLoading = false
            if (data.status == 'B0000') {
                this._total = data.total
                let collectList = this.state.collectList
                this.setState({
                    isRefreshing:false,
                    collectList: this._pageNum == 0 ? data.collects : collectList.concat(data.collects),
                })
                this._pageNum ++
            }else {
                Toast.show(data.txt)
                this.setState({
                    isRefreshing:false,
                })
            }



        },(error) => {
            this._isLoading = false
            this.setState({
                isRefreshing:false,
            })
        },showHUD)
    }

}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'white'

    },
    footer: {
        paddingVertical:5,
        alignItems:'center',
        backgroundColor:'#efefef'
    },
    separator: {
        height:0.5,
        backgroundColor:'#ececec'
    },
});
