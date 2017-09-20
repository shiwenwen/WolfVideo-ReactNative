/**
 * NewPage
 * @sww
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Image
} from 'react-native';
import HttpUtil from '../../Utils/HttpUtil';
import VideoListItem from '../Base/VideoListItem';
import EmptyView from '../Base/EmptyView';
import { HUD } from '../Widgets/LoadingIndicator';
export default class NewPage extends Component {
    static navigationOptions = ({navigation}) => {}
    constructor(props) {
        super(props)
        this.state = {
            newDataList:[],
            isRefreshing:false,
            showHUD: true
        }
    }
    render() {
        return (
            <View style={styles.container}>
                {/*/!*ListView*!/*/}
                <FlatList
                    data={this.state.newDataList}
                    renderItem={this._renderItem}
                    getItemLayout={(data,index) => {
                        return {length:125,offset:125.5*index,index}
                    }}
                    refreshing={this.state.isRefreshing}
                    onRefresh={this._onRefresh}
                    keyExtractor={(item, index) => item.id}
                    ItemSeparatorComponent={this._renderItemSeparatorComponent}
                    ListEmptyComponent={<EmptyView onPress={this._onRefresh}/>}
                >
                </FlatList>
                {
                    this.state.showHUD ? <HUD title={'拼命加载中...'}/> : null
                }
            </View>
        )
    }

    componentDidMount() {
        this._requestNewData()
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
        this._requestNewData()
    }
    /*请求数据*/
    _requestNewData(){

        HttpUtil.GET(HttpUtil.APIS.WolfVideoApis.Base+HttpUtil.APIS.WolfVideoApis.NewList,{},(response) => {

            this.setState({
                isRefreshing:false,
                newDataList:response.rows,
                showHUD:false
            })

        },(error) => {
            this.setState({
                isRefreshing:false,
                showHUD:false
            })
        },false)
    }

}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'white'

    },
    separator: {
        height:0.5,
        backgroundColor:'#ececec'
    },
});
