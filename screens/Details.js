import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  useWindowDimensions,
  Platform,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import RenderHtml from 'react-native-render-html';
import RelatedNews from '../components/RelatedNews';
import { useNavigation } from '@react-navigation/native';
import sharePost from '../components/sharePost';
import { WebView } from 'react-native-webview'; // Import WebView from react-native-webview
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Octicons } from '@expo/vector-icons';
import moment from 'moment';
import FullScreenImage from '../components/FullScreenImage';

const Details = ({ route }) => {
  const { width } = useWindowDimensions();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState(null);

  

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const { item } = route.params;
  useEffect(() => {
    fetchPost();
  }, [item.id]);

  const fetchPost = async () => {
    setIsLoading(true);
    try {
      const postId = item.id;
      const response = await axios.get(
        `https://peptechtime.com/wp-json/wp/v2/posts/${postId}?_embed`
      );

      if (response.data) {
        const post = response.data;
        const categoryId = post.categories[0];
        const categoryResponse = await axios.get(
          `https://peptechtime.com/wp-json/wp/v2/categories/${categoryId}`
        );

        const updatedPost = {
          ...post,
          categoryName: categoryResponse.data.name,
        };
        setPosts([updatedPost]);
        setIsLoading(false);
      }
    } catch (error) {
      // console.error('Error fetching post:', error);
      setIsLoading(false);
    }
  };

  const source = {
    html: posts.length > 0 ? posts[0].content.rendered : '',
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPost();
    setRefreshing(false);
  };

  // Custom renderer for the "iframe" tag
  const renderers = {
    iframe: (htmlAttribs, children, convertedCSSStyles, passProps) => {
      const { src } = htmlAttribs;
      return (
        <View style={{ aspectRatio: 16 / 9, width: '100%' }}>
          <WebView allowsFullscreenVideo javaScriptEnabled source={{ uri: src }} />
        </View>
      );
    },
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View
        style={styles.topHeader}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <View  style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Octicons name="chevron-left" size={24} color="black" />
              <Text style={{fontSize:16, fontWeight:'bold'}}> वापस</Text>
          </View>
          
        </TouchableOpacity>
        
        <TouchableOpacity 
        onPress={()=>{sharePost(posts[0].title.rendered, posts[0].link, posts[0]._embedded['wp:featuredmedia'][0].source_url )}}
        >
          <View  style={{ flexDirection: 'row', alignItems: 'center' }}>
            <AntDesign name="sharealt"  size={23} color="black" />
            <Text style={{fontSize:16, fontWeight:'bold'}} > शेयर</Text>
          </View>
        </TouchableOpacity>
        
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {isLoading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        ) : (
          <View>
            {posts.length > 0 ? (
              <View style={styles.content}>
                <TouchableOpacity onPress={() => handleImageClick(posts[0]._embedded['wp:featuredmedia'][0].source_url)}>
                {posts._embedded && posts._embedded['wp:featuredmedia'] && posts._embedded['wp:featuredmedia'][0] ? (
              <Image
                source={{ uri: posts._embedded['wp:featuredmedia'][0].source_url }}
                style={{ height: 400}}
                loadingIndicatorSource={require('../assets/icon.png')}
              />
            ) : null}
                </TouchableOpacity>
                
                <View style={styles.intro}>
                  <Text style={{ fontSize: 22, fontWeight: '800' }}>
                    {posts[0].title.rendered}
                  </Text>
                  
                  <Text>{moment(posts[0].date).format('MMMM DD, YYYY')} </Text>
                  <View style={{ flexDirection: 'row' }}>
                    <Text>Published by </Text>
                    <Text style={{ fontWeight: '600' }}>
                      {posts[0]._embedded.author[0].name}
                    </Text>
                  </View>
                </View>
                <View style={{ padding: 20, top: -130 }}>
                  {/* Use the `renderers` prop to handle the iframe tag */}
                  <RenderHtml
                    contentWidth={width}
                    source={source}
                    renderers={renderers} // Pass the custom renderer here
                  />
                </View>
                <View>
                  <Text style={{ fontSize: 18, fontWeight: 'bold',color:'gray', padding: 10 }}>
                    Related News
                  </Text>
                  <View style={styles.related}>
                    <RelatedNews categoryId={item.categories[0]} />
                  </View>
                </View>
                <FullScreenImage imageUrl={selectedImage} visible={selectedImage !== null} onClose={handleCloseModal} />
              </View>
              
            ) : (
              <Text>No post found.</Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Details;

const styles = StyleSheet.create({
  intro: {
    position: 'relative',
    backgroundColor: '#F5F5F5',
    top: -100,
    padding: 20,
    zIndex: 1,
    borderRadius: 15,
    opacity: 1,
    width: '90%',
    margin: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  content: {
    flexDirection: 'column',
    position: 'relative',
    top: -50,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  related: {},
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 10,
    elevation: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  }
});
