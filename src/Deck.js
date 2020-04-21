import React, { useState, useEffect } from 'react';
import { PanResponder, StyleSheet, View, Animated, Dimensions, LayoutAnimation, UIManager } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_TIMING = 250;
const emptyFunction = () => {};

const DeckFs = ({ data, onSwipeRight = emptyFunction, onSwipeLeft = emptyFunction, renderNoMoreCards = emptyFunction, renderCard }) => {
  const [index, setIndex] = useState(0);

  const position = new Animated.ValueXY();

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
    }).start();
  };

  const onSwipeComplete = (direction) => {
    const item = data[index];
    direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item);
    position.setValue({ x: 0, y: 0 });
    setIndex(index + 1);
  };

  const forceSwipe = (direction) => {
    let finalX;
    if (direction === 'right') finalX = SCREEN_WIDTH;
    if (direction === 'left') finalX = -SCREEN_WIDTH;
    Animated.timing(position, {
      toValue: { x: finalX, y: 0 },
      duration: SWIPE_OUT_TIMING,
    }).start(() => {
      onSwipeComplete(direction);
    });
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gesture) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
    },
    onPanResponderRelease: (event, gesture) => {
      if (gesture.dx > SWIPE_THRESHOLD) {
        forceSwipe('right');
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        forceSwipe('left');
      } else {
        resetPosition();
      }
    },
  });

  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ['-120deg', '0deg', '120deg'],
    });

    return { ...position.getLayout(), transform: [{ rotate }] };
  };

  const renderCards = () => {
    if (index >= data.length) return renderNoMoreCards();

    return data
      .map((item, i) => {
        if (i < index) return null;
        return index === i ? (
          <Animated.View style={[getCardStyle(), styles.cardStyle]} {...panResponder.panHandlers} key={item.id}>
            {renderCard(item)}
          </Animated.View>
        ) : (
          <Animated.View key={item.id} style={[styles.cardStyle, { top: 10 * (i - index) }]}>
            {renderCard(item)}
          </Animated.View>
        );
      })
      .reverse();
  };

  useEffect(() => {
    setIndex(0);
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.spring();
  }, [data]);

  return <View>{renderCards()}</View>;
};

export default DeckFs;

const styles = StyleSheet.create({
  cardStyle: {
    position: 'absolute',
    width: SCREEN_WIDTH,
  },
});
