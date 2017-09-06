/**
 * HotPage
 * @sww
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text
} from 'react-native';
import Swiper from 'react-native-swiper';
export default class HotPage extends Component {

    render() {
        return (
            <View style={styles.container}>
                <Swiper
                    style={styles.wrapper}
                    activeDotColor="#4AD5BD"
                    autoplay={true}
                    autoplayTimeout={4}
                    paginationStyle={{
                        bottom: 10
                    }}
                    loop
                >
                    <View style={styles.slide1}>
                        <Text style={styles.text}>Hello Swiper</Text>
                    </View>
                    <View style={styles.slide2}>
                        <Text style={styles.text}>Beautiful</Text>
                    </View>
                    <View style={styles.slide3}>
                        <Text style={styles.text}>And simple</Text>
                    </View>
                    <View style={styles.slide2}>
                        <Text style={styles.text}>Fuck</Text>
                    </View>
                </Swiper >
                <Text style={styles.content}>热门影片</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
    },
    wrapper: {
        flex:1
    },
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB',
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5',
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9',
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    },
    content: {
        flex:2,
        color: "#0097ff"
    }
});