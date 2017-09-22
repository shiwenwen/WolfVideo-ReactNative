/**
 * ActorPage
 * @sww
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    Platform,
    StatusBar
} from 'react-native';
import HttpUtil from '../../../Utils/HttpUtil';
import PlayerListItem from '../../Base/PlayerListItem';
import EmptyView from '../../Base/EmptyView'
export default class ActorPage extends Component {

    constructor(props) {
      super(props);
      this.state = {
          dataList:[],
          isRefreshing:false
      };
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

    componentDidMount() {
        this._requestData(true)
    }
    /*渲染列表Item*/
    _renderItem = (info) => {
        // console.log(info)
        return(
            <PlayerListItem model={info.item} index={info.index} onPress={this._onPressItme}/>
        )
    }
    /*点击item*/
    _onPressItme = (model,index) => {
        console.log('点击了'+index)
        const { navigate } = this.props.navigation;
        navigate(
            'ActorVideoPage',
            {
                title:model.title,
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
        this._isLoading = true
        HttpUtil.GET(HttpUtil.APIS.WolfVideoApis.Base+HttpUtil.APIS.WolfVideoApis.PlayersList ,{},(response) => {
            this.setState({
                isRefreshing:false,
                dataList:response.rows
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