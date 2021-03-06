/**
 *
 * @sww
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Platform,
    StatusBar
} from 'react-native';
import HttpUtil from '../../../Utils/HttpUtil';
import VideoListItem from '../../Base/VideoListItem';
import EmptyView from '../../Base/EmptyView'
export default class ActorVideoPage extends Component {
    static navigationOptions = ({ navigation, screenProps }) => {
        console.log(screenProps)
         return {
                    headerTitle: navigation.state.params.title
                }

    };
    constructor(props) {
        super(props)
        this.state = {
            dataList:[],
            isRefreshing:false
        }
    }

    componentDidMount() {
        this._requestData(true)
    }
    render() {
        return (
            <View style={styles.container}>
                {
                    Platform.OS == 'android' ? <StatusBar backgroundColor='white' barStyle="dark-content"  />  : null
                }
                {/*ListView*/}
                <FlatList
                    data={this.state.dataList}
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
        const { navigate ,state} = this.props.navigation;
        navigate(
            'VideoDetail',
            {
                title:model.title,
                id:model.id,
                barcode:model.barcode,
                play_conver:model.playcover,
                player:state.params.title,
                sys_ctime:model.sys_ctime,
                cat_text:model.cat_text,
                count:0,
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
        this._requestData(false)
    }

    /*请求数据*/
    _requestData(showHUD){
        const url = encodeURI(HttpUtil.APIS.WolfVideoApis.Base+HttpUtil.APIS.WolfVideoApis.PlayerDetail+`/${this.props.navigation.state.params.title}`)
        HttpUtil.GET(url,{},(response) => {
            this.setState({
                isRefreshing:false,
                dataList: response.rows,
            })
        },(error) => {
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
    separator: {
        height:0.5,
        backgroundColor:'#ececec'
    },
});