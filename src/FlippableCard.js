import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Animated } from 'react-native';

const FlippableCard = () => {
  const animatedValue = new Animated.Value(0);
  let currentValue = 0;

  animatedValue.addListener(({ value }) => {
    currentValue = value;
  });

  const frontAnimatedStyle = () => {
    const frontInterpolate = animatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: ['0deg', '180deg'],
    });
    return { transform: [{ perspective: 800 }, { rotateY: frontInterpolate }] };
  };

  const backAnimatedStyle = () => {
    const backInterpolate = animatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: ['180deg', '360deg'],
    });
    return { transform: [{ perspective: 800 }, { rotateY: backInterpolate }] };
  };

  const flipCard = () => {
    if (currentValue >= 90) {
      Animated.spring(animatedValue, {
        toValue: 0,
        friction: 8,
        tension: 10,
      }).start();
    } else {
      Animated.spring(animatedValue, {
        toValue: 180,
        friction: 8,
        tension: 10,
      }).start();
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Animated.View style={[styles.flipCard, styles.flipCardFront, frontAnimatedStyle()]}>
          <Text style={styles.flipText}>This text is flipping on the front</Text>
        </Animated.View>
        <Animated.View style={[styles.flipCard, styles.flipCardBack, backAnimatedStyle()]}>
          <Text style={styles.flipText}>This text is flipping on the back</Text>
        </Animated.View>
      </View>
      <TouchableOpacity onPress={flipCard}>
        <Text>Flip!</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FlippableCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ perspective: 1000 }],
    position: 'relative',
  },
  flipCard: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'orange',
    backfaceVisibility: 'hidden',
  },
  flipCardBack: {
    backgroundColor: 'red',
    position: 'absolute',
    top: 0,
  },
  flipCardFront: {},
  flipText: {
    color: 'white',
  },
});
``;
