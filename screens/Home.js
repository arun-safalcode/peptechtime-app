import * as React from "react";
import { StyleSheet, Text, View, RefreshControl, Animated,Linking  } from "react-native";
import { AntDesign, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from "../components/Slider";
import News from "../components/News";
import { ScrollView } from "react-native-gesture-handler";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import axios from 'axios';
import { Pressable, Image } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import NewsByCategory from '../components/NewsByCategory';
import { TouchableRipple } from 'react-native-paper';
import { useNavigation } from "@react-navigation/core";
import { getPushDataObject } from 'native-notify';


const Home = () => {
  const [categories, setCategories] = useState([]);
  const [categoryClicked, setClicked] = useState(false);
  const [catid, setCatid] = useState('');
  const [catname, setCatName] = useState('');
  const [refreshing, setRefreshing] = useState(false); // Add refreshing state
  const navigation = useNavigation();
  const scrollViewRef = React.useRef(null);
  const [scrollEnd, setScrollEnd] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [scrollStatus, setScrollStatus] = useState(false)

  let pushDataObject = getPushDataObject();
  useEffect(() => {
    if (pushDataObject.id) {
      const item = {
        id: pushDataObject.id
      };
      navigation.navigate("Details", { item });
    }
  }, [pushDataObject])


  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://peptechtime.com/wp-json/wp/v2/categories?has_news=true&order=desc&orderby=name');
      const categoriesData = response.data;

      // Filter out subcategories (categories without a parent)
      const mainCategories = categoriesData.filter(category => category.parent === 0);
      setCategories(mainCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  const filterCategoryNews = (id, name) => {
    setClicked(true)
    setCatid(id)
    setCatName(name)
  }
  useEffect(() => {
    fetchCategories();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true); // Set refreshing state to true
    try {
      // Fetch the latest data here
      // For example, you can call your fetchCategories function again
      await fetchCategories();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setRefreshing(false); // Set refreshing state back to false after data fetching is done
  };



  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event) => {
        const contentHeight = event.nativeEvent.contentSize.height;
        const layoutHeight = event.nativeEvent.layoutMeasurement.height;
        const scrollOffset = event.nativeEvent.contentOffset.y;
        const isScrollEnd = layoutHeight + scrollOffset >= contentHeight - layoutHeight;
        setScrollEnd(isScrollEnd);
      },
    }
  );

  const handleEndReached = () => {
    setScrollStatus(false);
    if (scrollEnd) {
      setScrollStatus(true);
    }
  };


  const handleYouTubeButtonClick = () => {
    const youtubeURL = 'https://www.youtube.com/channel/UCNkKlUNygj1eRsp_dfMJJ1g'; // Replace with your YouTube URL
    Linking.openURL(youtubeURL)
      .catch(error => console.error('Error opening YouTube URL:', error));
  };
  
  const handleFacebookButtonClick = () => {
    const facebookURL = 'https://www.facebook.com/peptechtimemp/'; // Replace with your Facebook URL
    Linking.openURL(facebookURL)
      .catch(error => console.error('Error opening Facebook URL:', error));
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}
    >
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleEndReached}
      >
        {/* Search Bar  */}

        <View style={styles.top}>
          <Image
            style={styles.logo}
            source={require('../assets/logo.png')}
            resizeMode="contain"
          />
          <View style={{ flexDirection: 'row' }} >

            <TouchableRipple
              rippleColor="rgba(0, 0, 0, 0.32)" // Customize the ripple color here
              onPress={handleYouTubeButtonClick}
            >
              <Feather
                name="youtube"
                size={26}
                color="#990F0F"
                style={{ marginRight: 0, padding: 5 }}
              />
            </TouchableRipple>
            <TouchableRipple
              rippleColor="rgba(0, 0, 0, 0.32)" // Customize the ripple color here
              onPress={handleFacebookButtonClick}
            >
              <AntDesign
                name="facebook-square"
                size={24}
                color="#990F0F"
                style={{ marginRight: 0, padding: 5 }}
              />
            </TouchableRipple>
          </View>


        </View>

        <View style={styles.category} >
          {/* Category  */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} >
            <View style={{ flexDirection: 'row' }}>
              {categories.map((category) => (
                <Pressable
                  onPress={() => { filterCategoryNews(category.id, category.name) }}
                  key={category.id}
                >
                  <LinearGradient
                    colors={category.id === catid && categoryClicked ? ['#990F0F', '#FF8086'] : ['#fff', '#fff']} // Specify your gradient colors
                    start={{ x: 0, y: 0 }} // Start point of the gradient
                    end={{ x: 1, y: 0 }} // End point of the gradient\
                    style={styles.categoryItem}
                    key={category.id}
                  >
                    <View>
                      <Text style={{ color: category.id === catid && categoryClicked ? "#fff" : "#990F0F", fontWeight: 'bold' }}>{category.name}</Text>
                    </View>
                  </LinearGradient>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>
        <View>
          <View style={styles.sliderHeader} >
            <Text style={{ fontSize: 18, fontWeight: 'bold' }} > {categoryClicked ? catname : 'Latest News'} </Text>
            <View style={{ flexDirection: 'row' }}>

              {categoryClicked ? <Text onPress={() => setClicked(false)} style={styles.clearFilter} >Clear Filter</Text> : ''}
              {/* <AntDesign name="arrowright" size={24} color="#08294A" /> */}
            </View>
          </View>
          {/* Post Slider  */}
          {categoryClicked ? '' :
            <>
              {refreshing ? <><Slider refreshing={refreshing} key="news" /></> : <><Slider /></>}
            </>
          }
        </View>

        <View style={{ marginTop: 20 }} >
          {/* Latest News  */}
          {categoryClicked ? <>{refreshing ? <><NewsByCategory categoryId={catid} refreshing={refreshing} key="news" /></> : <><NewsByCategory categoryId={catid} scroll={scrollStatus} /></>}</> : <>{refreshing ? <News refreshing={refreshing} key="news" /> : <News scroll={scrollStatus} />}</>}
        </View>
      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderColor: "#C0C0C0",
    borderBottomWidth: 1
  },
  logo: {
    width: 200, // Set the desired width of the logo
    height: 40, // Set the desired height of the logo
    position: 'relative',
  },
  category: {
    padding: 5,
    margin: 5,
  },
  sliderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 5,
    padding: 10
  },
  categoryItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#FFB3B6',
    borderRadius: 25,
    margin: 2,
  },
  clearFilter: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#FFB3B6',
    borderRadius: 25,
    margin: 2,
    color: '#990F0F',
    fontSize: 14,
    fontWeight: 'normal'
  },

});

export default Home;
