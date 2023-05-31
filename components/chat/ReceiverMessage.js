import React from 'react'
import { View, Text, Image } from 'react-native'

const ReceiverMessage = ({ message }) => {
    return (
        <View 
        >
            <Image
            source={{
                uri: message.photoURL,
            }} />
            <Text style={{color: 'white'}}>{message.message}</Text>
        </View>
    )
}

export default ReceiverMessage
