import React, {useState, useEffect, useContext} from 'react';
import { NativeModules, View, Text, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { ResultStocker } from '../context/ResultStocker';

const { Mediapipe } = NativeModules;

const LoadingScreen: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'LoadingScreen'>>();
    const route = useRoute<RouteProp<RootStackParamList, "LoadingScreen">>();
    const [userVideoPath] = useState<String>(route.params.userVideoPath);
    const [originalVideoPath] = useState<String>(route.params.originalVideoPath);
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const resultStocker = useContext(ResultStocker);

    useEffect(() => {
        const runPoseEstimation = async () => {
            setLoading(true);
            try {
                if (userVideoPath && originalVideoPath) {
                    const results = await Mediapipe.poseEstimation(userVideoPath, originalVideoPath);
                    if (results) {
                        if(resultStocker){
                            resultStocker.setResult(results);
                            navigation.navigate('Result1Screen', { results: results });
                        }
                    }
                } else {
                    setErrorMessage('もう一度お試しください。');
                }
            } catch (error) {
                setErrorMessage((error as Error).message);
            } finally {
                setLoading(false);
            }
        };

        runPoseEstimation();
    }, [navigation,resultStocker,originalVideoPath, userVideoPath]);
    
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {loading && (
                <ActivityIndicator size="large" color="#0000ff" />
            )}
            {errorMessage && (
                <Text style={{ color: 'red', marginTop: 20 }}>{errorMessage}</Text>
            )}
        </View>
    )
}

export default LoadingScreen;