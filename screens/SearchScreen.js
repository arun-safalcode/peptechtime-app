import * as React from "react";
import { StyleSheet, Text, View, TextInput,RefreshControl , Animated} from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from "react-native-gesture-handler";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";

import axios from 'axios';
import { Pressable } from "react-native";
import {LinearGradient} from 'expo-linear-gradient';
import NewsByCategory from '../components/NewsByCategory';
import SearchNews from "../components/SearchNews";
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/core";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Octicons } from '@expo/vector-icons';
const SearchScreen = ({ route }) => {
  const [categories, setCategories] = useState([]);
  const [categoryClicked, setClicked] = useState(false);
  const [catid,setCatid] = useState('');
  const [catname,setCatName] = useState('');
  const [refreshing, setRefreshing] = useState(false); // Add refreshing state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchData, setSearchData] = useState('');
  const navigation = useNavigation()
  const [scrollEnd, setScrollEnd] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [scrollStatus, setScrollStatus] = useState(false)
  
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
  const filterCategoryNews =(id,name)=>{
    setClicked(true)
    setCatid(id)
    setCatName(name)
  }
  useEffect(() => {
    fetchCategories();
  }, []);
  useEffect(()=>{
    if(route.params != undefined){
      filterCategoryNews(route.params.id,route.params.name)
    }
  },[route.params])

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

  const searchNow = ()=>{
    setSearchQuery(searchData);
  }

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

  return (
    <SafeAreaView style={{ flex: 1,backgroundColor:'#fff' }}>
      <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          margin: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <View  style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Octicons name="chevron-left" size={24} color="black" />
              <Text style={{fontSize:16, fontWeight:'bold'}}> वापस</Text>
          </View>
          
        </TouchableOpacity>
      </View>
      {/* Search Bar  */}
      <View style={styles.top} >
          <TextInput
            placeholder="खबर, विषय, शहर या राज्य खोजें"
            value={searchData}
            onChangeText={(text) => setSearchData(text)}
            style={{paddingLeft:10,fontSize:16, padding:8,borderRadius:15, width:"85%"}}
            returnKeyType="search" // This will change the Return key to "Search" in the keyboard
            onSubmitEditing={searchNow} // This function will be called when the Search button is pressed
          />
          <View style={{padding:12}}>
            {searchQuery != ''?<>
            <Entypo name="circle-with-cross" onPress={()=>{setSearchQuery('');setSearchData('')}} size={20} color="#990F0F" />
            </>:<>
            <TouchableOpacity onPress={()=>{searchNow()}}>

            <AntDesign name="search1" size={20} color="black" />
            </TouchableOpacity>
            </>}
          </View>
        </View>
      </>
      <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      onScroll={handleScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleEndReached}
      >
        

        {searchQuery != ''?
        <>
        {refreshing?<>
          <SearchNews searchData={searchQuery} refreshing={refreshing} key='news' />
        </>:<><SearchNews searchData={searchQuery} scroll={scrollStatus} /></>}
        </>
        :
        <>
          <View style={styles.category} >
          {/* Category  */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} >
            <View style={{ flexDirection: 'row' }}>
                {categories.map((category) => (
                    <Pressable
                      onPress={()=>{filterCategoryNews(category.id,category.name)}}
                      key={category.id}
                    >
                        <LinearGradient
                        colors={ category.id === catid && categoryClicked?['#990F0F', '#FF8086']:['#fff', '#fff']} // Specify your gradient colors
                        start={{ x: 0, y: 0 }} // Start point of the gradient
                        end={{ x: 1, y: 0 }} // End point of the gradient\
                        style={styles.categoryItem}
                        key={category.id}
                        >
                            <View>
                                <Text style={{color:category.id === catid && categoryClicked?"#fff":"#990F0F", fontWeight:'bold'}}>{category.name}</Text>
                            </View>
                        </LinearGradient>
                    </Pressable>
                ))}
            </View>
        </ScrollView>
        </View>
        <View>
          <View style={styles.sliderHeader} >
            <Text style={{ fontSize: 18, fontWeight: 'bold' }} > {categoryClicked?catname:searchQuery} </Text>
            <View style={{ flexDirection: 'row' }}>

              {categoryClicked?<Text onPress={()=>setClicked(false)} style={styles.clearFilter} >Clear Filter</Text>:''}
              {/* <AntDesign name="arrowright" size={24} color="#08294A" /> */}
            </View>
          </View>
          
          <View style={{ marginTop: 20 }} >
            {/* Latest News  */}
            {categoryClicked ? <>{refreshing ? <><NewsByCategory categoryId={catid} refreshing={refreshing} key="news" /></> : <><NewsByCategory categoryId={catid} scroll={scrollStatus} /></>}</> : <></>}
            
          </View>

        </View>
        </>
        }
      


      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    margin: 10,
    borderColor: "#C0C0C0",
    borderRadius: 25
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
  categoryItem:{
    padding:10,
    borderWidth:1,
    borderColor:'#FFB3B6',
    borderRadius:25,
    margin:2,      
  },
  clearFilter:{
    padding:10,
    borderWidth:1,
    borderColor:'#FFB3B6',
    borderRadius:25,
    margin:2,
    color:'#990F0F',
    fontSize:14,
    fontWeight:'normal'
  }
});

export default SearchScreen;
