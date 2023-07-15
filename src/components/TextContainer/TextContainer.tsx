import React, {
    ReactNode
} from 'react';
import {
    StyleProp, ViewStyle, TouchableOpacity
} from 'react-native';
import Colors from 'CardicApp/src/theme/Colors';

interface Props {
    containerStyle?: StyleProp<ViewStyle>,
    icon?: any,
    onPressRightChild?: () => void,
    child?: ReactNode,
    rightChild?: ReactNode,
    onPress: () => void,
}

const TextContainer = (props: Props) => {
    return (
        <TouchableOpacity
            onPress={props.onPress}
            style={[{
                alignItems: 'center',
                height: 40,
                borderRadius: 2,
                borderWidth: 1,
                borderColor: Colors.BorderColor,
                backgroundColor: Colors.InputBgTwo,
                paddingHorizontal: 10,
                justifyContent: 'center',
            }, props.containerStyle]
            }>
            {
                props.child && props.child
            }

            {
                props.rightChild && (
                    <TouchableOpacity
                        style={[{
                            position: 'absolute',
                            right: 10,
                        },{
                            
                        }]}
                        onPress={() => {
                            props.onPressRightChild && props.onPressRightChild();
                        }}>
                        {
                            props.rightChild
                        }
                    </TouchableOpacity>
                )
            }
        </TouchableOpacity>
    )
}


export default TextContainer;