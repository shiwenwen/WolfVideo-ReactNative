/**
 *
 * @sww
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-root-toast'
export default class SettingPage extends Component {

    render() {
        return (
            <View style={styles.container}>
                {/*item*/}
                <View style={styles.item}>
                    <Text style={styles.itemTitle}>版本号</Text>
                    <Text style={styles.itemTitle}>{DeviceInfo.getVersion()}</Text>
                </View>
                {
                    this.props.navigation.state.params.userId ? <Icon.Button name='sign-out' style={styles.signOut} onPress={this._signOut}>退出登录</Icon.Button> : null
                }
            </View>
        );
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
        marginBottom:40
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