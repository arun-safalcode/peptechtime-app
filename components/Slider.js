import { View, Text, Image, Pressable, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import React, { useEffect, useState,useRef  } from 'react';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';
import Carousel, { ParallaxImage } from 'react-native-snap-carousel';
const { width: screenWidth } = Dimensions.get('window');
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/core';

const Slider = ({ refreshing }) => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false); // New state for loading
  const carouselRef = useRef(null);
  const navigation = useNavigation();



  const fetchPosts = async () => {
    setIsLoading(true); // Start loading

    try {
      const response = await axios.get(
        `https://peptechtime.com/wp-json/wp/v2/posts?_embed&page=${page}&per_page=1&categories=20&_order=desc`
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
    } catch (error) {
      // console.error(error);
      setIsLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    if (page > 1) {
      fetchPosts();
    }
  }, [page]);

  useEffect(() => {
    fetchPosts();
    carouselRef.current?.startAutoplay();
    setPosts([]);
  }, [refreshing]);

  const renderItem = ({ item, index }, parallaxProps) => {
    return (
        <Pressable 
        style={styles.item} 
        key={index}
        onPress={() =>
            navigation.navigate("Details", {item})
          }
        >
        <ParallaxImage
          source={{ uri: item._embedded['wp:featuredmedia'][0].source_url }}
          containerStyle={styles.imageContainer}
          style={styles.image}
          parallaxFactor={0.4}
          {...parallaxProps}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.2)']}
          start={{ x: 0, y: 0 }} // Start point of the gradient
          end={{ x: 0, y: 10 }} // End point of the gradient\
          style={styles.overlay}
        />
        <Text style={styles.title} numberOfLines={2}>
          {item.title.rendered}
        </Text>
      </Pressable>
    );
  };

  return (
    <View>
      <Carousel
        ref={carouselRef}
        sliderWidth={screenWidth}
        sliderHeight={screenWidth}
        itemWidth={screenWidth - 50}
        data={posts}
        renderItem={renderItem}
        hasParallaxImages={true}
        autoplay={false} // Enable autoplay
        // autoplayInterval={3000} // Set autoplay interval in milliseconds
      />
    </View>
  );
};

export default Slider;

const styles = StyleSheet.create({
  item: {
    width: screenWidth - 40,
    height: screenWidth - 150,
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  title: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    color: 'white',
    fontSize: 28,
    fontWeight: '800',
    borderRadius: 8,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    borderRadius: 8,
  },
});
