import React, { useEffect, useState } from 'react';
import { View, Text, Image, Pressable, ActivityIndicator, Share } from 'react-native';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import Skeleton from './Skeleton';
import sharePost from './sharePost';
import { TouchableOpacity } from 'react-native-gesture-handler';
import moment from 'moment';

const NewsByCategory = ({ categoryId, refreshing, scroll }) => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const fetchPosts = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(
        `https://peptechtime.com/wp-json/wp/v2/posts?_embed&page=${page}&per_page=10&categories=${categoryId}&_order=desc`
      );
      console.log(response.data.length)
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
      setIsLoading(false);
    } catch (error) {
      // console.error(error);
      setIsLoading(false);
    }
  };

  const loadMorePosts = () => {
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    loadMorePosts()
  }, [scroll]);

  useEffect(() => {
    if (page > 1) {
      fetchPosts();
    }
  }, [page, categoryId]);

  useEffect(() => {
    setPosts([]);
    console.log("page=>"+page);
    if(posts.length === 0){
      console.log("news")
      setPage(1)
      fetchPosts();
    }
  }, [categoryId, refreshing])

  return (
    <View>
      {posts.map((item, index) => (
        <TouchableOpacity
          style={styles.newsItem}
          key={index}
          onPress={() => navigation.navigate('Details', { item })}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* Left View  */}
            <View style={styles.newsLeft}>
              {item._embedded && item._embedded['wp:featuredmedia'] && item._embedded['wp:featuredmedia'][0] ? (
                <Image
                  source={{ uri: item._embedded['wp:featuredmedia'][0].source_url }}
                  style={{ width: 100, height: 100, borderRadius: 8 }}
                  loadingIndicatorSource={require('../assets/icon.png')}
                />
              ) : null}
            </View>
            {/* Right View  */}
            <View style={styles.newsright}>
              <Text style={{ fontSize: 18, fontWeight: '700' }}>{item.title.rendered}</Text>
              <View style={{ flexDirection: 'row-reverse', alignItems: 'center', marginTop: 3 }}>

                <TouchableOpacity
                  style={{ zIndex: 99 }}
                  onPress={() => { sharePost(item.title.rendered, item.link, item._embedded['wp:featuredmedia'][0].source_url) }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <AntDesign name="sharealt" size={23} color="#990F0F" />
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }} > शेयर</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* Footer  */}
          <View style={styles.newsFooter}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontWeight: '600' }}>{item.categoryName}</Text>
              <Text>{moment(item.date).format('MMMM DD, YYYY')}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
      {isLoading ? (
        <Skeleton /> // Show the skeleton loader while loading
      ) : (
        <Pressable style={[styles.loadMoreButton]} onPress={loadMorePosts}>
          <Text style={styles.loadMoreButtonText}>Load More</Text>
        </Pressable>
      )}
    </View>
  );
};

export default NewsByCategory;

const styles = {
  newsItem: {
    padding: 16,
    backgroundColor: '#fff',
    borderWidth: 0.2,
    borderColor: '#d9d9d9'
  },
  newsLeft: {
    marginRight: 12,
  },
  newsright: {
    flex: 1,
  },
  newsFooter: {
    marginTop: 8,
  },
  loadMoreButton: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#990F0F',
    borderRadius: 8,
    marginTop: 16,
  },
  loadMoreButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  loader: {
    marginTop: 16,
  },
};
