import React, { Component } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Animated } from 'react-native';

export default class AnimatedBasic extends Component {
  UNSAFE_componentWillMount() {
    this.animatedValue = new Animated.Value(0);
    this.value = 0;
    this.animatedValue.addListener(({ value }) => {
      this.value = value;
    });
  }

  frontAnimatedStyle = () => {
    const animatedValue = this.animatedValue;
    const frontInterpolate = animatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: ['0deg', '180deg'],
    });
    return { transform: [{ rotateY: frontInterpolate }] };
  };

  backAnimatedStyle = () => {
    const animatedValue = this.animatedValue;
    const backInterpolate = animatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: ['180deg', '360deg'],
    });
    return { transform: [{ rotateY: backInterpolate }] };
  };

  flipCard() {
    if (this.value >= 90) {
      Animated.spring(this.animatedValue, {
        toValue: 0,
        friction: 8,
        tension: 10,
      }).start();
    } else {
      Animated.spring(this.animatedValue, {
        toValue: 180,
        friction: 8,
        tension: 10,
      }).start();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Animated.View style={[styles.flipCard, this.frontAnimatedStyle()]}>
            <Text style={styles.flipText}>This text is flipping on the front</Text>
          </Animated.View>
          <Animated.View style={[styles.flipCard, styles.flipCardBack, this.backAnimatedStyle()]}>
            <Text style={styles.flipText}>This text is flipping on the back</Text>
          </Animated.View>
        </View>
        <TouchableOpacity onPress={() => this.flipCard()}>
          <Text>Flip!</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipCard: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
    backfaceVisibility: 'hidden',
  },
  flipCardBack: {
    backgroundColor: 'red',
    position: 'absolute',
    top: 0,
  },
  flipText: {
    color: 'white',
  },
});
