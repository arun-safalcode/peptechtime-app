import * as React from "react";
import { StyleSheet, Text, View, RefreshControl, Animated, Linking } from "react-native";
import { AntDesign, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from "../components/Slider";
import News from "../components/News";
import { ScrollView } from "react-native";
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
import { Entypo } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

import AsyncStorage from '@react-native-async-storage/async-storage';


const Home = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [categoryClicked, setClicked] = useState(false);
  const [catid, setCatid] = useState('');
  const [catname, setCatName] = useState('');
  const [refreshing, setRefreshing] = useState(false); // Add refreshing state
  const navigation = useNavigation();
  const scrollViewRef = useRef();
  const [scrollEnd, setScrollEnd] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [scrollStatus, setScrollStatus] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState(null);

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
    navigation.navigate("Search", { id, name })
  }
  useEffect(() => {
    fetchCategories();
    fetchSubCategory();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true); // Set refreshing state to true
    // console.log("refreshing")
    try {
      // Fetch the latest data here
      // For example, you can call your fetchCategories function again
      await fetchCategories();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setTimeout(() => {
      setRefreshing(false);
    }, 3000);
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

  const handleUserButtonClick = () => {
    navigation.navigate('LoginScreen')
  }

  const fetchSubCategory = async () => {
    try {
      const response = await axios.get('https://peptechtime.com/wp-json/wp/v2/categories?parent=94&per_page=100');
      setSubcategories(response.data);
    } catch (error) {
      //   console.error('Error fetching categories:', error);
    }
  }

  useEffect(() => {
    async function fetchSelectedLocation() {
      try {
        const storedValue = await AsyncStorage.getItem('selectedLocation');
        setSelectedLocation(storedValue)
      } catch (error) {
        console.log('Error retrieving selected location:', error);
      }
    }

    fetchSelectedLocation();
  }, []);

  const handleSelectLocation = async (itemValue) => {
    if (selectedLocation != null || selectedLocation != undefined) {
      try {
        if(itemValue === null || itemValue === undefined){
          await AsyncStorage.removeItem('selectedLocation');
          setSelectedLocation(itemValue);
        }else{
          await AsyncStorage.setItem('selectedLocation', itemValue);
          setSelectedLocation(itemValue);
        }
      } catch (error) {
        console.log('Error storing selected location:', error);
      }
    } else {
      console.log('Invalid value: null or undefined');
    }
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}
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

            {/* Login button  */}
            <TouchableRipple
              rippleColor="rgba(0, 0, 0, 0.32)" // Customize the ripple color here
              onPress={handleUserButtonClick}
            >
            <Entypo 
              name="user" 
              size={24} 
              color="#990F0F"
              style={{ marginRight: 0, padding: 5 }}
            />
          </TouchableRipple>

          </View>


        </View>
        <ScrollView
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onMomentumScrollEnd={handleEndReached}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          style={styles.scrollView}
      >
        <View style={styles.category} >
          {/* Category  */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} >
            <View style={{ flexDirection: 'row' }}>
              {categories
              .filter(category => category.id === 311 
                || category.id === 94
                || category.id === 321
                || category.id === 316
                || category.id === 317
                || category.id === 318
                || category.id === 10
                || category.id === 319
                || category.id === 320
                || category.id === 96
                ) 
              .reverse()
              .map((category, index) => (
                <>
                <Pressable
                  onPress={() => { filterCategoryNews(category.id, category.name) }}
                  key={index}
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
                </>
                
              ))}
            </View>
          </ScrollView>
          <Picker
            selectedValue={selectedLocation}
            onValueChange={(itemValue, itemIndex) => {
              setSelectedLocation(itemValue);
              handleSelectLocation(itemValue); // Call your second function here
            }}
          >
            <Picker.Item label="जिला चुनें" value={null} TouchableRipple={true} style={styles.locationText} />
            <Picker.Item label="मध्यप्रदेश" value="94" TouchableRipple={true} style={styles.locationText} />
            {subcategories.map(subCategory => (

              <Picker.Item key={subCategory.id} label={subCategory.name} value={subCategory.id.toString()} TouchableRipple style={styles.locationText} />
            ))}
            <Picker.Item label="" value="" enabled={false} TouchableRipple />
          </Picker>
          <View style={{ flexDirection: 'row' }}>
            {selectedLocation != null ? <Text onPress={() => {handleSelectLocation(null);onRefresh()}} style={styles.clearFilter} >जिला रिसेट करें</Text> : ''}
          </View>
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
            <Slider refreshing={refreshing} key="newsslider" />
              {/* {refreshing ? <><Slider refreshing={refreshing} key="newsslider" /></> : <><Slider /></>} */}
            </>
          }
        </View>
        <View style={{ marginTop: 20 }}>
          {/* Latest News  */}
          {selectedLocation === null
          ?<>
            <><News scroll={scrollStatus} refreshing={refreshing} key="newsref2" /></>            
          </>
          :
          <>
            <><NewsByCategory categoryId={selectedLocation} refreshing={refreshing} scroll={scrollStatus} key="newscat" /></>
          </>
          }
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
  locationText: {
    fontSize: 18,
    fontWeight: '800'
  },
  scrollView: {
    zIndex: 1, // Set the zIndex property to control the stacking order
  },

});

export default Home;
