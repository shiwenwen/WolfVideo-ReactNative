/**
 *
 * @sww
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Animated,
    Easing,
    Text
} from 'react-native';

var Spinner = require('react-native-spinkit');
import Protypes from 'prop-types'
import RootSiblings from 'react-native-root-siblings';
// const {WIDTH, HRIGHT} = Dimensions.get('window');

/**
 * List of available types

 CircleFlip
 Bounce
 Wave
 WanderingCubes
 Pulse
 ChasingDots
 ThreeBounce
 Circle
 9CubeGrid
 WordPress (IOS only)
 FadingCircle
 FadingCircleAlt
 Arc (IOS only)
 ArcAlt (IOS only)
 */
/**
 * 加载指示器
 */
/**
 * 位置
 * @type {{left: number, right: (number|string), top: Window, bottom: (number|string)}}
 */
export type Position = {
    left: number,
    right: number,
    top: number,
    bottom: number
}
export default class LoadingIndicator {
    /*标题*/
    static _title
    /*类型*/
    static  _type
    /*颜色*/
    static _color
    /*尺寸*/
    static  _size
    /*位置*/
    static _postion
    /*当前指示器*/
    static _currentIndicator = null

    /**
     * 显示加载指示器
     * @param title
     * @param type
     * @param color
     * @param size
     * @returns RootSiblings
     */
    static show(title: string,postion:Position = {left:0,right:0,top:0,bottom:0},type: string = 'Wave',color: string = '#4AD5BD',size: number = 50) {
        LoadingIndicator._title = title
        LoadingIndicator._type = type
        LoadingIndicator._color = color
        LoadingIndicator._size = size
        LoadingIndicator._postion = postion
        if (LoadingIndicator._currentIndicator) {
            // console.log('销毁菊花')
            // LoadingIndicator._currentIndicator.destroy()
            LoadingIndicator._currentIndicator.update(<HUD type={LoadingIndicator._type} title={LoadingIndicator._title} color={LoadingIndicator._color} size={LoadingIndicator._size}
                                                           style={{...LoadingIndicator._postion}}></HUD>)
            return
        }
        LoadingIndicator._currentIndicator = new RootSiblings(<HUD type={LoadingIndicator._type} title={LoadingIndicator._title} color={LoadingIndicator._color} size={LoadingIndicator._size}
                                                                   style={{...LoadingIndicator._postion}}></HUD>)

    }

    /**
     * 隐藏加载指示器
     */
    static hidden() {
        LoadingIndicator._currentIndicator.destroy()
    }

    /**
     * 更新加载指示器文字
     * @param title
     */
    static updateTitle(title: string) {
        LoadingIndicator._title = title
        LoadingIndicator._currentIndicator.update(<HUD type={LoadingIndicator._type} title={LoadingIndicator._title} color={LoadingIndicator._color} size={LoadingIndicator._size}
                                                       style={{...LoadingIndicator._postion}}></HUD>)
    }
}

export class HUD extends Component {
    static defaultProps = {
        willHidden: false,
        type: 'Wave',
        color: '#4AD5BD',
        size: 50,
    }
    static propTypes = {
        //样式
        type: Protypes.string,
        color: Protypes.string,
        size: Protypes.number,
        title: Protypes.string,
        willHidden: Protypes.bool,
    }
    constructor(props) {
        super(props)
        this.state = {
            opacity:new Animated.Value(0.2)
        }
    }
    render() {
        return (
            <Animated.View style={[styles.container,{opacity:this.state.opacity},this.props.style]}>
                <Spinner type={this.props.type} size={this.props.size} color={this.props.color}/>
                {this._renderTextView()}
            </Animated.View>
        );
    }
    _renderTextView() {
        if (this.props.title) {
            return(
                <Text style={styles.title}>{this.props.title}</Text>
            )
        }
    }

    componentDidMount() {
        this._insShow();

    }
    componentDidUpdate() {
        if (this.props.willHidden) {
            this._willHidden()
        }
    }
    _insShow(){
        Animated.timing(this.state.opacity,{
            toValue: 1,
            duration: 250 ,
            easing: Easing.out(Easing.ease),
            useNativeDriver:true
        }).start()

    }
    _willHidden() {
        this.props.siblingManager&&this.props.siblingManager.destroy()

        Animated.timing(this.state.opacity, {
            toValue: 0,
            duration: 250,
            easing: Easing.in(Easing.ease),
            useNativeDriver:true
        }).start(({finished})=>{
            if(finished){
                this.props.siblingManager&&this.props.siblingManager.destroy()
            }
        });
    }

}

const styles = StyleSheet.create({
    container: {
        // height: '100%',
        // width: '100%',
        position: 'absolute',
        left:0,
        right:0,
        top:0,
        bottom:0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        color: 'white',
        fontSize: 15,
        marginTop: 5,
    }

});