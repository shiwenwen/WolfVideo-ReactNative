/**
 *
 * @sww
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    ScrollView,
    Text,
    Platform,
    StatusBar
} from 'react-native';
import Toast from 'react-native-root-toast'
import {
    checkIsPhoneNum,
    checkisAccordPsd,
    checkIsEmail
} from '../../Utils/Utils';
import {
    MyServiceHttpUtil,
    HttApis
} from '../../Utils/HttpUtil';
export default class UpdateInfo  extends Component {
    _nickName = ''
    _email = ''
    static navigationOptions = ({ navigation }) => ({
        headerRight:<Text onPress={
            navigation.state.params?navigation.state.params.save : null
        } style={styles.save}>保存</Text>
    });

    render() {
        return (
            <View style={styles.container}>
                {
                    Platform.OS == 'android' ? <StatusBar backgroundColor='white' barStyle="dark-content"  />  : null
                }
                <ScrollView style={styles.container}>
                    <View style={styles.item}>
                        <Text style={styles.title}>昵称</Text>
                        <TextInput style={styles.input}
                                   defaultValue={this.props.navigation.state.params.name}
                                   placeholder={'请输入昵称'}
                                   onChangeText={(text) => {
                                       this._onChangeText(1,text)
                                   }}
                                   underlineColorAndroid="transparent"
                                   autoCorrect={false}
                                   maxLength={11}
                        />
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.title}>邮箱</Text>
                        <TextInput style={styles.input}
                                   defaultValue={this.props.navigation.state.params.email}
                                   placeholder={'请输入邮箱'}
                                   keyboardType='email-address'
                                   onChangeText={(text) => {
                                       this._onChangeText(2,text)
                                   }}
                                   underlineColorAndroid="transparent"
                                   autoCorrect={false}

                        />
                    </View>
                </ScrollView>
            </View>
        );
    }

    componentDidMount() {
        this._nickName = this.props.navigation.state.params.name
        this._email = this.props.navigation.state.params.email
        this.props.navigation.setParams({
            save:this._save
        })
    }

    /**
     * 保存
     * @private
     */
    _save = () => {
        if (this._nickName.length < 1) {
            Toast.show('请输入昵称')
            return
        }
        if (!checkIsEmail(this._email)) {
            Toast.show('请输入正确邮箱')
            return
        }
        this._updateInfo()
    }
    /**
     * on change text
     * @param text
     * @private
     */
    _onChangeText(tag: number,text: string) {
        switch (tag) {
            case 1: {
                this._nickName = text
                break
            }
            case 2: {
                this._email = text
            }
        }

    }
    _updateInfo() {
        MyServiceHttpUtil.Post(HttApis.MyServerApis.Base + HttApis.MyServerApis.UpdateInfo,{
            'name':this._nickName,
            'email': this._email,
            'userId':this.props.navigation.state.params.userId
        },(data) => {
            Toast.show(data.txt)
            if (data.status == 'B0000') {
                this.props.navigation.state.params && this.props.navigation.state.params.callback && this.props.navigation.state.params.callback()
                this.props.navigation.goBack()
            }
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
    },
    save: {
        color:'#4ad5bd',
        fontSize:19,
        marginRight:15,
        fontWeight:'bold'
    },
    item: {
        height: 45,
        backgroundColor:'white',
        borderBottomWidth:0.5,
        borderBottomColor:'#ececec',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:'center',
        paddingHorizontal:15
    },
    title: {
        fontSize: 17,
        color: '#333',
        width: 80,

    },
    input: {
        fontSize: 17,
        color: '#333',
        flex:1
    }
});