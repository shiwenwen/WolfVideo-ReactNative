/**
 * 屏幕工具类
 * ui设计基准,iphone 6
 * width:750
 * height:1334
 */
var ReactNative = require('react-native');
var Dimensions = require('Dimensions');
export var screenW = Dimensions.get('window').width;
export var screenH = Dimensions.get('window').height;
var fontScale = ReactNative.PixelRatio.getFontScale();
export var pixelRatio = ReactNative.PixelRatio.get();

/**
 * 屏幕宽度适配,缩放size
 * @param size
 * @returns {Number}
 * @constructor
 */
export function scaleWidthSize(size:Number) {
    return size * screenW/375.0
}
/**
 * 屏幕高度适配,缩放size
 * @param size
 * @returns {Number}
 * @constructor
 */
export function scaleHeightSize(size:Number) {
    return size * screenW/667.0
}