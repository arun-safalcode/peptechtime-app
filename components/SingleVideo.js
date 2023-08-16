import { StyleSheet, Text, View, Dimensions  } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useRef } from 'react';
import { Video, ResizeMode } from 'expo-av';
import { useState } from 'react';
import { useEffect } from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
const SingleVideo = ({ item, index, currentIndex }) => {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const videoRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (currentIndex === index) {
            setIsPaused(false); // Autoplay the current video when it's in view
        } else {
            setIsPaused(true); // Pause videos that are not in view
        }
    }, [currentIndex, index]);

    const handlePress = () => {
        if (isPaused) {
            videoRef.current.playAsync();
        } else {
            videoRef.current.pauseAsync();
        }
        setIsPaused(!isPaused);
    };
    const onBuffer = (e) => {
        console.log('buffering', e)
    }
    const onError = (e) => {
        console.log('error', e)
    }
    useEffect(() => {
        // Pause the video when the screen loses focus (navigates away)
        if (!isFocused) {
            videoRef.current.pauseAsync();
            setIsPaused(true);
        }
    }, [isFocused]);





    return (
        <View style={{ width: windowWidth, height: windowHeight, position: 'relative' }}
        >
            <TouchableOpacity onPress={handlePress}
            style={{
                width: '100%',
                height: '100%',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
            }}
            >
                {isPaused ? <>
                    <AntDesign name="pausecircleo" size={50} color="white"
                    style={{
                        position:'absolute',
                        top:350,
                        left:170,
                        zIndex:2
                    }}
                /></> : <>
                
                </>}
                <Video
                    ref={videoRef}
                    resizeMode={ResizeMode.COVER}
                    shouldPlay={!isPaused && currentIndex === index}
                    source={{
                        uri:
                            item.acf.video,
                    }}
                    style={{
                        width: '100%',
                        height: '100%',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                    }}
                />
            </TouchableOpacity>
            
        </View>
    )
}

export default SingleVideo

const styles = StyleSheet.create({

})