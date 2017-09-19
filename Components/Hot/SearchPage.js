/**
 *
 * @sww
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    Text,
    ScrollView,
    Platform,
    FlatList
} from 'react-native';
import HttpUtil from '../../Utils/HttpUtil';
import VideoListItem from '../Base/VideoListItem';
import Toast from 'react-native-root-toast'
export default class SearchPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            resultData:[],

        }
    }
    _key = ''
    render() {
        return (
            <ScrollView style={styles.container}>
                {/*搜索框 头部*/}
                <View style={styles.header}>
                    <TextInput
                        style={styles.input}
                        placeholder='搜索您想看的影片'
                        onChangeText={this._onChangeText}
                        onSubmitEditing={this._onSubmitEditing}
                        underlineColorAndroid="transparent"
                        autoCorrect={false}
                        returnKeyType='search'
                        clearButtonMode='while-editing'
                    ></TextInput>
                    <Text style={styles.cancel} onPress={() => {
                        this.props.navigation.goBack()
                    }}>取消</Text>
                </View>
                {/* 搜索列表 */}
                <FlatList
                    data={this.state.resultData}
                    renderItem={this._renderItem}
                    getItemLayout={(data,index) => {
                        return {length:125,offset:125.5*index,index}
                    }}
                    keyExtractor={(item, index) => item.id}
                    ItemSeparatorComponent={this._renderItemSeparatorComponent}
                >
                </FlatList>
            </ScrollView>
        );
    }

    /**
     * 输入文字改变
     * @param text
     * @private
     */
    _onChangeText = (text) => {
        this._key = text
    }
    _onSubmitEditing = () => {
        if (this._key.trim().length < 1) {
            Toast.show('请输入关键词')
            return
        }
        const url = encodeURI(HttpUtil.APIS.WolfVideoApis.Base+HttpUtil.APIS.WolfVideoApis.Search+`/${this._key}`)
        HttpUtil.GET(url,{},(response) => {

            this.setState({
                resultData:response.rows,
            })

        },(error) => {

        })
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
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'white'
    },
    header:{
        height:Platform.OS == 'android' ? 55 : 75,
        borderBottomColor:'#d9d9d9',
        borderBottomWidth:1,
        flexDirection:'row',
        paddingHorizontal:12,
        alignItems:'center',
        backgroundColor:'#4AD5BD'
    },
    input: {
        flex:1,
        height:35,
        borderRadius:17.5,
        fontSize:15,
        paddingHorizontal:15,
        backgroundColor:'white'
    },
    cancel: {
        marginLeft:10,
        color:'white',
        fontSize:19

    },
    hud: {
        position:'absolute',
        top:Platform.OS == 'android' ? 55 : 75,
        left:0,
        right:0,
        bottom:0
    }
});