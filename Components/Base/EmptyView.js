/**
 *
 * @sww
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity
} from 'react-native';
const ScreenUtil = require('../../Utils/ScreenUtil')
import PropTypes from 'prop-types'
import Orientation from 'react-native-orientation';
export default class EmptyView extends Component {
    static propTypes = {
        onPress:PropTypes.func
    }
    constructor(props) {
        super(props)
        this.state = {
            height:0
        }
    }
    render() {
        return (
            <View style={[styles.emptyView,{height:this.state.height}]}>
                <TouchableOpacity onPress={this.props.onPress} style={styles.emptyViewTouch}>
                    <Image source={require('../../sources/imgs/icon60.png')} resizeMode='contain'/>
                    <Text style={styles.emptyViewText}>暂无内容，下拉或点击图标可刷新</Text>
                </TouchableOpacity>
            </View>
        );
    }

    componentDidMount() {
        Orientation.addOrientationListener(this._orientationDidChange);
        Orientation.getOrientation((err, orientation) => {
            if (orientation == 'LANDSCAPE') {
                this.setState({
                    height:ScreenUtil.screenW - 70
                })
            }else {
                this.setState({
                    height:ScreenUtil.screenH *2 /3
                })
            }
        });
    }
    _orientationDidChange = (orientation) => {
        console.log('当前屏幕方向 : ' + orientation)
        if (orientation == 'LANDSCAPE') {
            this.setState({
                height:ScreenUtil.screenW - 70
            })
        }else {
            this.setState({
                height:ScreenUtil.screenH *2 /3
            })
        }
    }
    componentWillUnmount() {
        Orientation.removeOrientationListener(this._orientationDidChange);
    }
}


const styles = StyleSheet.create({
    emptyView: {
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    emptyViewTouch: {
        alignItems:'center',
    },
    emptyViewText: {
        color:'#4AD5BD',
        marginTop:10
    },
});