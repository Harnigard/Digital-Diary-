import { GestureResponderEvent } from 'react-native';
import {useState} from "react";

interface SwipeInput {
    onSwipedUp: () => void;
    onSwipedDown: () => void;
}

interface SwipeOutput {
    onTouchStart: (e: GestureResponderEvent) => void;
    onTouchMove: (e: GestureResponderEvent) => void;
    onTouchEnd: () => void;
}

export const useSwipe = (input: SwipeInput): SwipeOutput => {
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    const minSwipeDistance = 50;

    const onTouchStart = (e: GestureResponderEvent) => {
        setTouchEnd(0); // otherwise the swipe is fired even with usual touch events
        setTouchStart(e.nativeEvent.pageY);
    };

    const onTouchMove = (e: GestureResponderEvent) => setTouchEnd(e.nativeEvent.pageY);

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isUpSwipe = distance > minSwipeDistance;
        const isDownSwipe = distance < -minSwipeDistance;
        if (isUpSwipe) {
            console.log("up");
            input.onSwipedUp();
        }
        if (isDownSwipe) {
            console.log("down");
            input.onSwipedDown();
        }
    };

    return {
        onTouchStart,
        onTouchMove,
        onTouchEnd
    };
};