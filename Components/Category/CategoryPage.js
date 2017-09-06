/**
 * CategoryPage
 * @sww
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text
} from 'react-native';

export default class CategoryPage extends Component {

    render() {
        return (
            <View style={styles.container}>
                <Text>影片分类</Text>
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