import LinearGradient from "react-native-linear-gradient";

const LoadingGradient = (): React.ReactElement => {
    return (
        <LinearGradient
            colors={['#eeeeee', '#dddddd', '#eeeeee']}
            start={{ x: 1.0, y: 0.0 }}
            end={{ x: 0.0, y: 0.0 }}
            style={{
                flex: 1,
                width: 120
            }}
        />
    );
};
export default LoadingGradient;