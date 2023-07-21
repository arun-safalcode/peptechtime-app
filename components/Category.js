import React, { useState,useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet,FlatList, Pressable, Alert } from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import axios from 'axios';
import { useNavigation } from '@react-navigation/core';

const Category = () => {
    const [categories, setCategories] = useState([]);
    const navigation = useNavigation();
    useEffect(() => {
        fetchCategories();
    }, []);
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

      
      

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} >
        <View style={{ flexDirection: 'row' }}>
            {categories.map((category) => (
                <Pressable
                  onPress={() => navigation.navigate('NewsByCategoryScreen', { category })}
                  key={category.id}
                >
                    <LinearGradient
                    colors={['#990F0F', '#FF8086']} // Specify your gradient colors
                    start={{ x: 0, y: 0 }} // Start point of the gradient
                    end={{ x: 1, y: 0 }} // End point of the gradient\
                    style={styles.categoryItem}
                    key={category.id}
                    >
                        <View>
                            <Text style={{color:"#fff", fontWeight:700}}>{category.name}</Text>
                        </View>
                    </LinearGradient>
                </Pressable>
                
            
            ))}
        </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
    categoryItem:{
      padding:10,
      borderWidth:1,
      borderColor:'#FFB3B6',
      borderRadius:25,
      margin:2,      
    }
  });
export default Category;
