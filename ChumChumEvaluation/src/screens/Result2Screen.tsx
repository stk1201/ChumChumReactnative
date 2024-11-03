import React, { useContext } from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { ResultStocker } from '../context/ResultStocker';

const Result2Screen: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Result2Screen'>>();
    
    const resultStocker = useContext(ResultStocker);
    const userImageData = resultStocker?.result?.userImageData;
    const originalImageData = resultStocker?.result?.originalImageData;

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>結果2画面</Text>
            <Text>ベストショット</Text>
            {userImageData && userImageData.length > 0 && originalImageData && originalImageData.length > 0 && (
                <View style={styles.imageRow}>
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: `data:image/jpeg;base64,${userImageData[0]}` }} style={styles.image} resizeMode="contain"/>
                    </View>
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: `data:image/jpeg;base64,${originalImageData[0]}` }} style={styles.image} resizeMode="contain"/>
                    </View>
                </View>
            )}
            <Text>ワーストショット</Text>
            {userImageData && userImageData.length > 0 && originalImageData && originalImageData.length > 0 && (
                <View style={styles.imageRow}>
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: `data:image/jpeg;base64,${userImageData[1]}` }} style={styles.image} resizeMode="contain"/>
                    </View>
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: `data:image/jpeg;base64,${originalImageData[1]}` }} style={styles.image} resizeMode="contain"/>
                    </View>
                </View>
            )}
            <Button title='NEXT' onPress={() => navigation.navigate('Result3Screen')} />
        </View>
    );
}

const styles = StyleSheet.create({
    imageRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 5,
    },
    imageContainer: {
        marginHorizontal: 10, // 画像間のスペースを追加
    },
    image: {
        width: 135,
        height: 300,
    },
});

export default Result2Screen;