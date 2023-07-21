import { Share, Alert, Platform } from 'react-native';

const sharePost = async (postTitle, postUrl, postImage) => {
  try {
    const message = `*${postTitle}*\n${postUrl}`;
    const options = {
      message,
      url: postUrl,
      title: postTitle,
      ...(Platform.OS === 'android' && { url: postImage }), // Include image on Android
    };

    const result = await Share.share(options);

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // Shared with activity type of result.activityType
      } else {
        // Shared
      }
    } else if (result.action === Share.dismissedAction) {
      // Dismissed
    }
  } catch (error) {
    Alert.alert(error.message);
  }
};

export default sharePost;
