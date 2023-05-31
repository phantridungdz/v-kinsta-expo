import React from 'react'
import { View, Text, Image } from 'react-native'

const SenderMessage = ({message}) => {
    return (
        <View>
            <Image source={{uri: message.imageUrl}}></Image>
        </View>
    )
}

export default SenderMessage
