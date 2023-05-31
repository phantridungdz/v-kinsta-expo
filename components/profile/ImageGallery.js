import { View, Text, Image } from 'react-native'
import React from 'react'

const ImageGallery = ({message}) => {
  return (
    <View style={{flex: 1, margin: 1}}>
      <Image source={{uri: message.imageUrl}} style={{width:140, height:140}}></Image>
    </View>
  )
}

export default ImageGallery