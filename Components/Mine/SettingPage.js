/**
 *
 * @sww
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    StatusBar,
    Platform
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-root-toast'
import {ImageCache} from 'react-native-img-cache'

export default class SettingPage extends Component {

    render() {
        return (
            <View style={styles.container}>
                {
                    Platform.OS == 'android' ? <StatusBar backgroundColor='white' barStyle="dark-content"  />  : null
                }
                {/*item*/}
                <TouchableOpacity style={styles.item} onPress={()=>{
                    this._didSelectItem(0)
                }}>
                    <Text style={styles.itemTitle}>版本号</Text>
                    <Text style={styles.itemTitle}>{DeviceInfo.getVersion()}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.item,{marginBottom:50}]} onPress={()=>{
                    this._didSelectItem(1)
                }}>
                    <Text style={styles.itemTitle}>缓存</Text>
                    <Text style={styles.itemTitle}>点击清理</Text>
                </TouchableOpacity>

                {
                    this.props.navigation.state.params.userId ? <Icon.Button name='sign-out' style={styles.signOut} onPress={this._signOut}>退出登录</Icon.Button> : null
                }
            </View>
        );
    }
    _didSelectItem(index: number) {
        switch (index) {
            case 0: {
                break
            }
            case 1: {
                ImageCache.get().clear()
                Toast.show('清理成功')
                break
            }
        }
    }
    _signOut = () => {
        storage.remove({
            key: 'userInfo'
        }).then(res => {
            Toast.show('退出成功')
            this.props.navigation.state.params.callback && this.props.navigation.state.params.callback()
            this.props.navigation.goBack()
        }).catch(error => {
            Toast.show('退出失败')
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems:'center'
    },
    item: {
        height:45,
        borderBottomColor:'#ececec',
        borderBottomWidth:0.5,
        flexDirection:'row',
        backgroundColor:'white',
        paddingHorizontal:15,
        justifyContent: 'space-between',
        alignItems: 'center',
        width:'100%',
    },
    itemTitle: {
        fontSize: 17,
        color: '#333'
    },
    signOut: {
        backgroundColor:'#4ad5bd',
        paddingHorizontal:60,
        paddingVertical:10
    }
});