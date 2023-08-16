import React from 'react';
import { View, Modal,Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useEffect } from 'react';
const FullScreenImage = ({ imageUrl, visible, onClose }) => {

  return (
    <Modal visible={visible} transparent={true}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <View style={{flexDirection:'row', backgroundColor:'#fff', padding:10, borderRadius:5}} >
                <Text style={{fontSize:18, fontWeight:'bold'}} >वापस जाएँ </Text>
                <AntDesign name="closecircleo" size={24} color="#990F0F" />
            </View>
        </TouchableOpacity>
        <Image source={{ uri: imageUrl }} resizeMode="contain" style={styles.image} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection:'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  closeButton: {
    top:280,
    left:130,
    zIndex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default FullScreenImage;
