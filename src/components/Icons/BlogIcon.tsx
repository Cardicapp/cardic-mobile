import React from 'react';
import Svg, { Path, PathProps, SvgProps } from "react-native-svg";
interface IconProps extends SvgProps {
    pathProps?: PathProps
}
export default (props: IconProps) => {

    return <Svg
        width="18" height="16" viewBox="0 0 18 16" fill="none"
        {...props}
    >
        <Path
            d="M0.666687 1.3275C0.668212 1.10865 0.755771 0.899181 0.910448 0.744348C1.06512 0.589515 1.2745 0.501746 1.49335 0.5H16.5067C16.9634 0.5 17.3334 0.870833 17.3334 1.3275V14.6725C17.3318 14.8914 17.2443 15.1008 17.0896 15.2557C16.9349 15.4105 16.7255 15.4983 16.5067 15.5H1.49335C1.27403 15.4998 1.06377 15.4125 0.908762 15.2573C0.753755 15.1022 0.666687 14.8918 0.666687 14.6725V1.3275ZM9.00002 2.16667V13.8333H15.6667V2.16667H9.00002ZM9.83335 3.83333H14.8334V5.5H9.83335V3.83333ZM9.83335 6.33333H14.8334V8H9.83335V6.33333Z" 
            fill="white"
            {...props.pathProps}
        />
    </Svg>
};