import React, { useEffect, useState } from 'react';
import { View, Animated, Easing, StyleSheet, Image } from 'react-native';

const Skeleton = () => {
    const skeletonItemWidth = new Animated.Value(250); // Initial width for skeleton item

    useEffect(() => {
        const animateSkeleton = () => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(skeletonItemWidth, {
                        toValue: 100,
                        duration: 2100,
                        easing: Easing.ease,
                        useNativeDriver: false,
                    }),
                    Animated.timing(skeletonItemWidth, {
                        toValue: 250,
                        duration: 1100,
                        easing: Easing.ease,
                        useNativeDriver: false,
                    }),
                ])
            ).start();
        };

        animateSkeleton();
    }, []);

    const animatedStyles = {
        width: skeletonItemWidth,
    };

    return (
        <View style={styles.skeletonLoader}>

            <Animated.View style={[styles.skeletonItem, animatedStyles]}>
                {/* <Image
                    source={{ uri: 'https://peptechtime.com/wp-content/uploads/2023/03/Peptech-Time-New-Logo-300x71.png' }}
                    style={{ height: 50, borderRadius: 8 }}
                /> */}
            </Animated.View>
            <Animated.View style={[styles.skeletonItem, animatedStyles]} >
                {/* <Image
                    source={{ uri: 'https://peptechtime.com/wp-content/uploads/2023/03/Peptech-Time-New-Logo-300x71.png' }}
                    style={{ height: 50, borderRadius: 8 }}
                /> */}
            </Animated.View>
            <Animated.View style={[styles.skeletonItem, animatedStyles]} >
                {/* <Image
                    source={{ uri: 'https://peptechtime.com/wp-content/uploads/2023/03/Peptech-Time-New-Logo-300x71.png' }}
                    style={{ height: 50, borderRadius: 8 }}
                /> */}
            </Animated.View>
            <Animated.View style={[styles.skeletonItem, animatedStyles]} >
                {/* <Image
                    source={{ uri: 'https://peptechtime.com/wp-content/uploads/2023/03/Peptech-Time-New-Logo-300x71.png' }}
                    style={{ height: 50, borderRadius: 8 }}
                /> */}
            </Animated.View>
            <Animated.View style={[styles.skeletonItem, animatedStyles]} >
                {/* <Image
                    source={{ uri: 'https://peptechtime.com/wp-content/uploads/2023/03/Peptech-Time-New-Logo-300x71.png' }}
                    style={{ height: 50, borderRadius: 8 }}
                /> */}
            </Animated.View>
            <Animated.View style={[styles.skeletonItem, animatedStyles]} >
                {/* <Image
                    source={{ uri: 'https://peptechtime.com/wp-content/uploads/2023/03/Peptech-Time-New-Logo-300x71.png' }}
                    style={{ height: 50, borderRadius: 8 }}
                /> */}
            </Animated.View>
            <Animated.View style={[styles.skeletonItem, animatedStyles]} >
                {/* <Image
                    source={{ uri: 'https://peptechtime.com/wp-content/uploads/2023/03/Peptech-Time-New-Logo-300x71.png' }}
                    style={{ height: 50, borderRadius: 8 }}
                /> */}
            </Animated.View>
            <Animated.View style={[styles.skeletonItem, animatedStyles]} >
                {/* <Image
                    source={{ uri: 'https://peptechtime.com/wp-content/uploads/2023/03/Peptech-Time-New-Logo-300x71.png' }}
                    style={{ height: 50, borderRadius: 8 }}
                /> */}
            </Animated.View>
            <Animated.View style={[styles.skeletonItem, animatedStyles]} >
                {/* <Image
                    source={{ uri: 'https://peptechtime.com/wp-content/uploads/2023/03/Peptech-Time-New-Logo-300x71.png' }}
                    style={{ height: 50, borderRadius: 8 }}
                /> */}
            </Animated.View>
        </View>
    );
};
export default Skeleton

const styles = StyleSheet.create({
    skeletonLoader: {
        // borderWidth: 0.2,
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 16,
    },
    skeletonItem: {
        height: 50,
        marginBottom: 8,
        borderRadius: 8,
        backgroundColor: '#d9d9d9',
    }
})