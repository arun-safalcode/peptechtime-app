import { StyleSheet, Text, View ,ActivityIndicator, RefreshControl  } from 'react-native'
import React from 'react'
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import SingleVideo from './SingleVideo';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const VideoComponent = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false); // New state for loading
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0); // New state for the current video index
    const [isRefreshing, setIsRefreshing] = useState(false);

    const flatListRef = useRef(null); // Ref for FlatList


    const fetchPosts = async () => {
        if (!isRefreshing) {
            setIsLoading(true);
        }

        try {
            const response = await axios.get(
                `https://peptechtime.com/wp-json/wp/v2/videos?page=${page}&per_page=5`
            );

            const modifiedPosts = await Promise.all(
                response.data.map(async (post) => {
                    const categoryResponse = await axios.get(
                        `https://peptechtime.com/wp-json/wp/v2/categories/${post.categories[0]}`
                    );
                    const categoryName = categoryResponse.data.name;

                    return { ...post, categoryName };
                })
            );

            setPosts((prevPosts) => [...prevPosts, ...modifiedPosts]);
            setIsLoading(false); // Stop loading
            setIsRefreshing(false);
        } catch (error) {
            // console.error(error);
            setIsLoading(false); // Stop loading
            setIsRefreshing(false);
        }
    };


    useEffect(() => {
        fetchPosts();
    }, [page]);

    const handleChangeIndex = async ({ index }) => {
        setCurrentIndex(index);
        setCurrentVideoIndex(index);
    };

    const loadMorePosts = () => {
        setPage((prevPage) => prevPage + 1);
        console.log(page);

        if (flatListRef.current) {
            flatListRef.current.scrollToIndex({ index: currentVideoIndex+1, animated: false }); // Use currentVideoIndex instead of 0
        }
    };

    const handleScroll = (event) => {
        const contentOffset = event.nativeEvent.contentOffset.y;
        const viewAreaHeight = event.nativeEvent.layoutMeasurement.height;
        const contentHeight = event.nativeEvent.contentSize.height;
        const isEndOfList = contentOffset + viewAreaHeight >= contentHeight;

        if (isEndOfList) {
            loadMorePosts();
        }
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        setPosts([])
        fetchPosts()
        setPage(1); // Reset the page number to fetch the latest data
      };
      


    return (
        <>
        <SwiperFlatList
            data={posts}
            vertical={true}
            onChangeIndex={handleChangeIndex}
            onScroll={handleScroll}
            renderItem={({ item, index }) =>
                <SingleVideo item={item} index={index} currentIndex={currentIndex} />}
            keyExtractor={(item, index) => index}
            ref={flatListRef}
            refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
                  colors={['red']} // Set your desired loading indicator colors
                />
              }
        />
        {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff"  />
        </View>
      )}
        </>
    );
};

export default VideoComponent

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
})