/**
 * SearchPage
 * @sww
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text
} from 'react-native';

export default class SearchPage extends Component {

    render() {
        return (
            <View style={styles.container}>
                <Text>搜索</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems:'center',
        justifyContent:"center"

    }
});