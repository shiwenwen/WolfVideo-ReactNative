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
    ImageBackground,
    TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
const {width:KSCREEN_WIDTH,height:KSCREEN_HEIGHT} = require('Dimensions').get('window');
import {CustomCachedImage,CachedImage} from "react-native-img-cache";
export default class PlayerListItem  extends Component {
    static propTypes = {
        model:PropTypes.any.isRequired,
        index:PropTypes.number,
        onPress:PropTypes.func
    }
    render() {
        return (
            <TouchableOpacity onPress={() => {
                this.props.onPress(this.props.model,this.props.index)
            }}>
                <View style={styles.container}>
                    {/*图片*/}
                    <ImageBackground style={styles.videoImageBg} resizeMode='cover' source={require('../../sources/imgs/imagePlaceholder.png')}>
                        <CachedImage style={styles.videoImage} resizeMode='cover' source={{uri:this.props.model.image}} ></CachedImage>
                    </ImageBackground >
                    <View style={styles.infoContainer}>
                        <Text style={styles.title} numberOfLines={2}>{this.props.model.title}</Text>
                        <Text style={styles.player} numberOfLines={1}>{'代表:' + this.props.model.barcode}</Text>
                        <Text style={styles.category} numberOfLines={1}>{'影片数:' + this.props.model.total}</Text>
                        <Text style={styles.date} numberOfLines={1}>{'播放数:' + this.props.model.count}</Text>
                    </View>
                </View>

            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height:125,
        flexDirection:'row'
    },
    videoImageBg: {
        marginLeft:15,
        marginTop:8,
        width:90,
        height:110,

    },
    videoImage: {
        width: '100%',
        height: '100%'
    },
    infoContainer: {
        marginLeft:10,
        marginRight:15,
        marginTop:8,
        flex:1
    },
    title: {
        color:'#4AD5BD',
        fontSize:19,
        width:'100%',
        height:42,
    },
    player: {
        marginTop:3,
        color:'orange',
        fontSize:15,
        width:'100%'
    },
    category: {
        marginTop:5,
        color:'#333',
        fontSize:14,
        width:'100%'
    },
    date: {
        marginTop:5,
        color:'#333',
        fontSize:13,
        width:'100%'
    }
});