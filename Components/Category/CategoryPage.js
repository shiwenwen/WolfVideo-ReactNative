/**
 * CategoryPage
 * @sww
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    SectionList,
    TouchableOpacity
} from 'react-native';
import HttpUtil from '../../Utils/HttpUtil';
import Icon from 'react-native-vector-icons/FontAwesome'
import EmptyView from '../Base/EmptyView'
export default class CategoryPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            category:[


            ],
            isRefreshing:false
        }
    }

    componentDidMount() {
        this._requestCategory(true)
    }
    render() {
        return (
            <View style={styles.container}>
                <SectionList
                    sections={this.state.category}
                    renderItem={this._renderItem}
                    refreshing={this.state.isRefreshing}
                    onRefresh={this._onRefresh}
                    ItemSeparatorComponent={this._renderItemSeparatorComponent}
                    SectionSeparatorComponent={this._renderItemSeparatorComponent}
                    ListEmptyComponent={<EmptyView onPress={this._onRefresh}/>}
                    keyExtractor={(item, index) => item.id}
                    renderSectionHeader={({section}) =>{
                        // console.log(section)
                        return <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>{section.title}</Text>
                        </View>

                    }}
                >

                </SectionList>
            </View>
        );
    }

    /**
     * 渲染item
     * @param info
     * @param index
     * @returns {XML}
     * @private
     */
    _renderItem = (info,index) => {
        // console.log(info,index)
        return <TouchableOpacity style={styles.item} onPress={() => {

        }}>
            <Text style={styles.itemTitle}>{info.item.title+(info.item.count > 0 ? `(${info.item.count})` : '')}</Text>
            <Icon name='chevron-right' size={15} backgroundColor='#d9d9d9' style={styles.itemTitleIcon}/>
        </TouchableOpacity>
    }
    /**
     * 渲染分割线
     * @returns {XML}
     * @private
     */
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
        this._requestCategory(false)
    }
    /*请求数据*/
    _requestCategory(showHUD){

        HttpUtil.GET(HttpUtil.APIS.WolfVideoApis.Base+HttpUtil.APIS.WolfVideoApis.Category,{},(response) => {

            this.setState({
                isRefreshing:false,
                category:[
                    {data:[{title:'演员列表',id:0,count:0}], title:'演员分类',sec:0},
                    {data:response.rows_2, title:'无码高清',sec:2},
                    {data:response.rows_1, title:'剧情薄码',sec:1}
                ]
            })

        },(error) => {
            this.setState({
                isRefreshing:false
            })
        },showHUD,49)
    }

}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'white'
    },
    separator: {
        height:0.5,
        backgroundColor:'#ececec',

    },
    sectionHeader: {
      padding:10,
      backgroundColor:'#efefef'
    },
    sectionTitle:{
      // marginLeft:10
    },
    item: {
        backgroundColor:'white',
        height:45,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingHorizontal:15
    },
    itemTitle: {
        color:'#333',
        fontSize:17,
    },
    itemTitleIcon: {
      width:17,
    }
});