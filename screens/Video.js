import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Octicons } from '@expo/vector-icons';
import VideoComponent from '../components/VideoComponent';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const Video = () => {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const navigation = useNavigation();
    return (
        <SafeAreaView>
            <View
                style={{
                    width: windowWidth,
                    height: windowHeight,
                    backgroundColor: 'black',
                    position: 'relative'
                }}
            >
                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        flexDirection:'row',
                        justifyContent:'flex-start',
                        zIndex:1,
                        padding:10
                    }}
                >
                    <TouchableOpacity
                    style={{
                        flexDirection:'row',
                        justifyContent:'flex-start',
                    }}
                    onPress={() => navigation.goBack()}
                    >
                        <Octicons name='chevron-left' size={28} color='white' />
                        <Text style={{ fontSize:18,fontWeight:'bold', color:'#fff', padding:2}} > वापस</Text>
                    </TouchableOpacity>
                    
                </View>
                <VideoComponent />
            </View>
        </SafeAreaView>

    )
}

export default Video
