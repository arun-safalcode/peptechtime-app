import React, { useRef, useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    StatusBar,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Octicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import SwiperFlatList from 'react-native-swiper-flatlist';
import VideoComponent from './VideoComponent';

export default function VideoList() {
    const videoRef = useRef(null);
    const navigation = useNavigation();
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false); // New state for loading
    const [currentIndex, setCurrentIndex] = useState(0);

    const fetchPosts = async () => {
        setIsLoading(true); // Start loading

        try {
            const response = await axios.get(
                `https://peptechtime.com/wp-json/wp/v2/videos?page=${page}&per_page=2`
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

    const loadMorePosts = () => {
        setPage((prevPage) => prevPage + 1);
        console.log(page);
    };

    useEffect(() => {
        if (page > 1) {
            fetchPosts();
        }
    }, [page]);

    useEffect(() => {
        fetchPosts();
    }, []);
    const data = [
        {
            id: "0",
            title: 'Title',
            video: 'https://peptechtime.s3.ap-south-1.amazonaws.com/wp-content/uploads/2023/07/30181247/End-of-Life-Tribute-Mobile-Video-in-Blue-Pink-White-Elegant-Photocentric-Style.mp4'
        },
        {
            id: "1",
            title: 'Title2',
            video: 'https://peptechtime.s3.ap-south-1.amazonaws.com/wp-content/uploads/2023/07/30181318/End-of-Life-Tribute-Mobile-Video-in-Blue-Pink-White-Elegant-Photocentric-Style-1.mp4'
        },
        {
            id: "2",
            title: 'Title2',
            video: 'https://peptechtime.s3.ap-south-1.amazonaws.com/wp-content/uploads/2023/07/30181318/End-of-Life-Tribute-Mobile-Video-in-Blue-Pink-White-Elegant-Photocentric-Style-1.mp4'
        },
        {
            id: "3",
            title: 'Title2',
            video: 'https://peptechtime.s3.ap-south-1.amazonaws.com/wp-content/uploads/2023/07/30181318/End-of-Life-Tribute-Mobile-Video-in-Blue-Pink-White-Elegant-Photocentric-Style-1.mp4'
        },
        {
            id: "4",
            title: 'Title2',
            video: 'https://peptechtime.s3.ap-south-1.amazonaws.com/wp-content/uploads/2023/07/30181318/End-of-Life-Tribute-Mobile-Video-in-Blue-Pink-White-Elegant-Photocentric-Style-1.mp4'
        },
        {
            id: "5",
            title: 'Title2',
            video: 'https://peptechtime.s3.ap-south-1.amazonaws.com/wp-content/uploads/2023/07/30181318/End-of-Life-Tribute-Mobile-Video-in-Blue-Pink-White-Elegant-Photocentric-Style-1.mp4'
        }
    ]

    const onChangeIndex = ({ index }) => {
        setCurrentIndex(index)
    }

    // useEffect(()=>{
    //     // if(!!videoRef.current){
    //     //     videoRef.current.seek(0)
    //     // }
    //     console.log(videoRef.current)
    // },[currentIndex])

    return (
        <View style={styles.container}>
            <SwiperFlatList
                data={data}
                renderItem={({ item, index }) => (
                    <View style={styles.child}>
                        <TouchableOpacity style={{
                                width:'100%',
                                height:'100%',
                                position:'absolute'
                            }}>
                        <Video
                            ref={videoRef}
                            source={{
                                uri:
                                    item.video,
                            }}
                            resizeMode={ResizeMode.COVER}
                            shouldPlay={currentIndex === index}
                            style={{
                                width:'100%',
                                height:'100%',
                                position:'absolute'
                            }}
                            useNativeControls
                        />
                        </TouchableOpacity>
                        
                    </View>
                )}
                vertical={true} // Enable vertical swiping
                onChangeIndex={onChangeIndex}
                onLoadMore={loadMorePosts}
            />
          
        </View>
    );
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'black' },
    child: { width:windowWidth,height:windowHeight, position:'relative' },
});