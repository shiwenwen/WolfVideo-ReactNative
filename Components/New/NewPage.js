/**
 * NewPage
 * @sww
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity
} from 'react-native';
export default class NewPage extends Component {
    static navigationOptions = ({navigation}) => {}

    render() {
        return (
            <View style={styles.container}>

                <Text>进入下一页</Text>

            </View>
        );
    }

    componentDidMount() {

    }

}

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems:'center',
        justifyContent:"center"

    }
});
