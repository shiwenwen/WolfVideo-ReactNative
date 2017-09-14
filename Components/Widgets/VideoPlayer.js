/**
 *
 * @sww
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Animated,
    Text,
    StatusBar
} from 'react-native';
import PropTypes from 'prop-types';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/FontAwesome';
import TimerMixin from 'react-timer-mixin';
const reactMixin = require('react-mixin');
var Spinner = require('react-native-spinkit');
import Slider from "react-native-slider";
import Toast from 'react-native-root-toast';
export default class VideoPlayer extends Component {
    static propTypes = {
        ...Video.propTypes,
        goBack:PropTypes.func,
        title:PropTypes.string
    }

    /**
     * 时间格式化
     * @param time
     */
    static timeIntervalFormat(time : number) : string{
        const intTime = parseInt(time)
        const sec = intTime % 60
        const hour = parseInt(intTime / ( 60 * 60 ))
        const min = parseInt(intTime/60) - hour * 60
        toDouble = function (num: number) : string{
            if (num < 10 ) {
                return `0${num}`
            }
            return `${num}`
        }

        return `${toDouble(hour)}:${toDouble(min)}:${toDouble(sec)}`
    }
    constructor(props) {
        super(props)
        this.state = {
            paused:false,
            fadeAnim: new Animated.Value(0),
            showControl:false,
            showLoading:true,
            duration:0,
            currentTime:0,
            playableDuration:0,
            showError:false,
            source:this.props.source
        }
    }
    componentDidMount() {

        console.log('视频组件加载')

    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.source.uri !== nextProps.source.uri) {
            this.setState({
                source:nextProps.source
            })
        }
    }

    render() {
        return (
            <TouchableOpacity style={[styles.container,this.props.style]} onPress={this._videoControl} activeOpacity={1}>
                <Video
                    resizeMode='contain'
                    {...this.props}
                    source={this.state.source}
                    paused={this.state.paused}
                    style={styles.video}
                    onLoadStart={this._loadStart}            // Callback when video starts to load
                    onLoad={this._onLoad}               // Callback when video loads
                    onProgress={this._onProgress}               // Callback every ~250ms with currentTime
                    onEnd={this._onEnd}                      // Callback when playback finishes
                    onError={this._videoError}               // Callback when video cannot be loaded
                    onBuffer={this._onBuffer}                // Callback when remote video is buffering
                    onTimedMetadata={this._onTimedMetadata}
                    onReadyForDisplay={this._onReadyForDisplay}
                    ref={(ref) => {
                        this.player = ref
                    }}
                />
                {
                    this._renderControl()
                }
                {
                    this._renderLoading()
                }
                {
                    this._renderError()
                }
            </TouchableOpacity>

        );
    }

    /**
     * 开始加载
     * @private
     */
    _loadStart = (event) => {
        console.log('loadStart')
        // { src:
        // { isNetwork: true,
        //     type: '',
        //     uri: 'http://baobab.wdjcdn.com/1456665467509qingshu.mp4' } }

        this.setState({
            showLoading:true,
            showError:false,
        })
        this.props.onLoadStart && this.props.onLoadStart(event)
    }
    /**
     *onLoad
     * @private
     */
    _onLoad = (event) => {
        console.log('onLoad')
        // { canStepForward: true,
        //     canStepBackward: true,
        //     canPlayReverse: true,
        //     canPlaySlowForward: true,
        //     canPlayFastForward: true,
        //     naturalSize: { orientation: 'landscape', height: 720, width: 1280 },
        //     canPlaySlowReverse: true,
        //         currentTime: 0,
        //     duration: 427.386 }
        this.setState({
            duration:event.duration,
            currentTime:0,
            // showLoading:false,
            // showError:false,

        })
        this.props.onLoad && this.props.onLoad(event)

    }
    /**
     * 加载进度
     * @private
     */
    _onProgress = (event) => {

        // { playableDuration: 12.822, currentTime: 0.214 }
        this.setState({
            currentTime: event.currentTime,
            showLoading: event.playableDuration <= event.currentTime && event.currentTime < this.state.duration,
            playableDuration: event.playableDuration,
        })
        this.props.onProgress && this.props.onProgress(event)
    }
    /**
     * 结束
     * @private
     */
    _onEnd = (event) => {
        console.log('onEnd')
        this.props.onEnd && this.props.onEnd(event)
    }
    /**
     * 失败
     * @private
     */
    _videoError = (event) => {
        console.log('videoError')
        console.log(event)
        Toast.show('播放错误' + event.error.extra)
        this.setState({
            showError:true,
            showLoading:false
        })
        this.props.videoError && this.props.videoError(event)
    }

    /**
     * 缓冲
     * @returns {*}
     * @private
     */
    _onBuffer = (event) => {
        console.log('onBuffer')
        console.log(event)
    }
    /**
     * _onTimedMetadata
     * @private
     */
    _onTimedMetadata = (event) => {
        console.log('onTimedMetadata')
        console.log(event)
    }
    /**
     * 准备开始播放
     * @param event
     * @private
     */
    _onReadyForDisplay = (event) => {
        console.log('onReadyForDisplay')
        this.setState({
            showLoading:false,

        })

    }

    /**
     * 渲染加载
     * @returns {*}
     * @private
     */
    _renderLoading() {
        return this.state.showLoading ? <Spinner type='Circle' style={styles.loading} color='white' size={35}  /> : null
    }
    /**
     * 控制层视图
     * @returns {*}
     * @private
     */
    _renderControl() {
        return this.state.showControl ? (

            <Animated.View style={[styles.control,{opacity:this.state.fadeAnim}]} >
                {/* 返回按钮 标题*/}
                <View style={styles.header}>
                    <Icon name='chevron-left' color='white' size={20} style={styles.back} onPress={this._onBackPress}/>
                    <Text style={styles.title} numberOfLines={1}>{this.props.title}</Text>
                </View>
                {/* 暂停 播放 */}
                <Icon name={this.state.paused ? 'play-circle-o' : 'pause-circle-o'} color='white' size={50} onPress={this._playPause}
                      style={styles.paused} />
                {/* 时间 进度条 全屏*/}
                <View style={styles.progressBar}>
                    <Text style={styles.currentTime}>{VideoPlayer.timeIntervalFormat(this.state.currentTime)}</Text>
                    <Slider
                        style={styles.slider}
                        value={this.state.currentTime}
                        onValueChange={this._onValueChange}
                        maximumValue={this.state.duration}
                        minimumTrackTintColor='#4AD5BD'
                        maximumTrackTintColor='white'
                        // thumbTintColor='#4AD5BD'
                        thumbStyle={styles.sliderThumb}
                    />
                    <Text style={styles.duration}>{VideoPlayer.timeIntervalFormat(this.state.duration)}</Text>
                </View>


            </Animated.View>
        ) : null
    }

    /**
     * 渲染播放错误 重新加载
     * @private
     */
    _renderError() {
        return this.state.showError ? <TouchableOpacity onPress={this._reload} style={styles.reloadTouch}>
            <Text style={styles.reloadText}>重新加载</Text>
        </TouchableOpacity> : null
    }

    /**
     * 重新加载
     * @private
     */
    _reload = () => {
        console.log('重新加载')
        this.setState({
            source:{uri:''}
        })
        setTimeout(() => {
            this.setState({
                source:this.props.source
            })
        },1000)

    }
    /**
     * 全屏
     * @private
     */
    _onFullScreen = () => {

    }
    /**
     * 滑动修改进度
     * @param value
     * @private
     */
    _onValueChange = (value) => {
        this.player.seek(value)
    }
    /**
     * 控制显示 控制层
     * @private
     */
    _videoControl = () => {
        if (!this.state.showControl) {

            Animated.timing(                            // 随时间变化而执行的动画类型
                this.state.fadeAnim,                      // 动画中的变量值
                {
                    toValue: 0.8,                             // 透明度最终变为1，即完全不透明
                    useNativeDriver:true,
                    duration:0
                }
            ).start(({finished})=>{
                if(finished){
                    this.setState({
                        showControl:true
                    })
                    setTimeout(() => {

                        Animated.timing(                            // 随时间变化而执行的动画类型
                            this.state.fadeAnim,                      // 动画中的变量值
                            {
                                toValue: 0,                             // 透明度最终变为1，即完全不透明
                                useNativeDriver:true
                            }
                        ).start(({finished})=>{
                            if(finished){
                                this.setState({
                                    showControl:false
                                })
                            }
                        });

                    },5000)
                }
            });
        }else {

            Animated.timing(                            // 随时间变化而执行的动画类型
                this.state.fadeAnim,                      // 动画中的变量值
                {
                    toValue: 0,                             // 透明度最终变为1，即完全不透明
                    useNativeDriver:true
                }
            ).start(({finished})=>{
                if(finished){
                    this.setState({
                        showControl:false
                    })
                }
            });
        }

    }
    /**
     * 返回
     * @private
     */
    _onBackPress = () => {
        this.props.goBack && this.props.goBack()

    }
    /**
     * 播放暂停
     * @private
     */
    _playPause = () => {
        this.setState({
            paused:!this.state.paused
        })
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor:'black',
        alignItems:'center',
        justifyContent:'center'
    },
    loading: {

    },
    control: {

        position:'absolute',
        flex:1,
        left:0,
        top:0,
        right:0,
        bottom:0,
        justifyContent:'space-between',
    },
    header: {
        flexDirection:'row',
        alignItems:'center',
    },
    title: {
        flex:1,
        padding:10,
        color:'white',
        fontSize:15
    },
    back: {
        marginLeft:10

    },
    paused: {
        alignSelf:'center',
    },
    video: {
        position:'absolute',
        left:0,
        right:0,
        top:0,
        bottom:0,
        zIndex:-1
    },
    progressBar:{
        height:30,
        paddingHorizontal:5,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        backgroundColor:'rgba(255,255,255,0.3)'
    },
    sliderThumb:{
        height:18,
        width:18,
        borderRadius:9,
        backgroundColor:'white',
        borderWidth:3,
        borderColor:'#4AD5BD',
    },
    currentTime: {
        color:'white',
        fontSize:12,
        width:65,
        textAlign:'center'
    },
    duration: {
        color:'white',
        fontSize:12,
        width:65,
        textAlign:'center'
    },
    slider: {
        height:20,
        flex:1,
        marginHorizontal:5
    },
    reloadTouch: {

        paddingHorizontal:10,
        paddingVertical:5,
        borderColor:'#4AD5BD',
        borderWidth:1,
        borderRadius:3,
        opacity:0.8
    },
    reloadText: {
        fontSize:15,
        fontWeight:'bold',
        color:'#4AD5BD',
        opacity:0.8
    }

});
reactMixin.onClass(VideoPlayer,TimerMixin)