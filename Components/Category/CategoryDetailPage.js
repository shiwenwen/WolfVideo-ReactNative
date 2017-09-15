/**
 *
 * @sww
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    FlatList
} from 'react-native';
import HttpUtil from '../../Utils/HttpUtil';
import VideoListItem from '../Base/VideoListItem';
import EmptyView from '../Base/EmptyView'
var Spinner = require('react-native-spinkit');
const PageSize = 99
export default class CategoryDetailPage extends Component {
    static navigationOptions = ({ navigation, screenProps }) => {
        console.log(screenProps)
         return {
                    headerTitle: navigation.state.params.title
                }

    };
    _isLoading = false
    constructor(props) {
        super(props)
        this.state = {
            dataList:[],
            isRefreshing:false
        }
    }
    _pageNum = 1
    _total = 0

    componentDidMount() {
        this._requestData(true)
    }
    render() {
        return (
            <View style={styles.container}>
                {/*ListView*/}
                <FlatList
                    data={this.state.dataList}
                    renderItem={this._renderItem}
                    getItemLayout={(data,index) => {
                        return {length:125,offset:125.5*index,index}
                    }}
                    refreshing={this.state.isRefreshing}
                    onRefresh={this._onRefresh}
                    onEndReached={this._onEndReached}
                    // onEndReachedThreshold={0.001}
                    keyExtractor={(item, index) => item.id}
                    ItemSeparatorComponent={this._renderItemSeparatorComponent}
                    ListEmptyComponent={<EmptyView onPress={this._onRefresh}/>}
                    ListFooterComponent={() => {
                       return this._total != 0 && this.state.dataList.length < this._total ? <View style={styles.footer}>
                            <Spinner
                                type='ThreeBounce'
                                color='#4AD5BD'
                            />
                        </View> : <View/>
                    }}
                >
                </FlatList>
            </View>
        );
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
                count:model.count
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
        this._pageNum = 1
        this._requestData(false)
    }

    /**
     * 上拉加载
     * @private
     */
    _onEndReached = (distanceFromEnd) =>  {
        console.log(distanceFromEnd)
        if (this.state.dataList.length < 1 ) return
        if (this._isLoading) return
        this._requestData(false)
    }
    /*请求数据*/
    _requestData(showHUD){
        console.log(this._pageNum)
        if (this._total != 0 && this.state.dataList.length >= this._total) {
            return
        }

        this._isLoading = true
        HttpUtil.GET(HttpUtil.APIS.WolfVideoApis.Base+HttpUtil.APIS.WolfVideoApis.CatDetail + `/${this.props.navigation.state.params.catId}/${this._pageNum}`,{},(response) => {
            this._isLoading = false
            this._total = response.total
            let dataList = this.state.dataList
            this.setState({
                isRefreshing:false,
                dataList:this._pageNum == 1 ? response.rows : dataList.concat(response.rows),
            })
            this._pageNum ++
        },(error) => {
            _isLoading = false
            this.setState({
                isRefreshing:false
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