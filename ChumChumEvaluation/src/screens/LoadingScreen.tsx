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
                    if (results && resultStocker) {
                        // 合計スコアの計算
                        const totalScore = results.eachTimeScore.reduce((acc: number, score: number) => acc + score, 0) / results.eachTimeScore.length;
                        // ランクの計算
                        const rank = calculateRank(totalScore);
                        // ベストショットとワーストショットを設定
                        const [userImageData, originalImageData] = setBestAndWorst(results);
                        //グラフ作成
                        const graphData = {
                            labels: results.eachTimeScore.map((_: number, index: number) => (index + 1).toString()),
                            datasets: [
                                {
                                    data: results.eachTimeScore,
                                },
                            ],
                        };
    
                        // 結果の更新
                        await resultStocker.setResult({
                            ...results,
                            totalScore,
                            userImageData,
                            originalImageData,
                            rank,
                            graphData,
                        });
    
                        // 結果を設定した後に画面遷移
                        navigation.navigate('Result1Screen');
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
    }, [userVideoPath, originalVideoPath]);
    
    const calculateRank = (score: number): string => {
        if (score > 80) return 'god';
        if (score > 60) return 'center';
        if (score > 40) return 'backdancer';
        if (score > 20) return 'practice';
        return 'normal';
    };

    // ベストショットとワーストショットを設定
    const setBestAndWorst = (result: any): [string[], string[]] => {
        if (!result) return [[], []];

        let maxScoreIndex = 0;
        let minScoreIndex = 0;

        result.eachTimeScore.forEach((score: number, index: number) => {
            if (score > result.eachTimeScore[maxScoreIndex]) maxScoreIndex = index;
            if (score < result.eachTimeScore[minScoreIndex]) minScoreIndex = index;
        });

        const userImageData = [result.userImageData[maxScoreIndex], result.userImageData[minScoreIndex]];
        const originalImageData = [result.originalImageData[maxScoreIndex], result.originalImageData[minScoreIndex]];

        return [userImageData, originalImageData];
    };

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