import React, { Component } from 'react';
import { PanResponder, StyleSheet, View, Animated, Dimensions, LayoutAnimation, UIManager } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_TIMING = 250;

export default class Deck extends Component {
  static defaultProps = {
    onSwipeRight: () => {},
    onSwipeLeft: () => {},
    renderNoMoreCards: () => {},
  };

  state = {
    index: 0,
  };

  position = new Animated.ValueXY();

  resetPosition = () => {
    Animated.spring(this.position, {
      toValue: { x: 0, y: 0 },
    }).start();
  };

  onSwipeComplete = (direction) => {
    const { onSwipeLeft, onSwipeRight, data } = this.props;
    const item = data[this.state.index];
    direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item);
    this.position.setValue({ x: 0, y: 0 });
    this.setState({ index: this.state.index + 1 });
  };

  forceSwipe = (direction) => {
    let finalX;
    if (direction === 'right') finalX = SCREEN_WIDTH;
    if (direction === 'left') finalX = -SCREEN_WIDTH;
    Animated.timing(this.position, {
      toValue: { x: finalX, y: 0 },
      duration: SWIPE_OUT_TIMING,
    }).start(() => {
      this.onSwipeComplete(direction);
    });
  };

  panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gesture) => {
      this.position.setValue({ x: gesture.dx, y: gesture.dy });
    },
    onPanResponderRelease: (event, gesture) => {
      if (gesture.dx > SWIPE_THRESHOLD) {
        this.forceSwipe('right');
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        this.forceSwipe('left');
      } else {
        this.resetPosition();
      }
    },
  });

  getCardStyle() {
    const position = this.position;
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ['-120deg', '0deg', '120deg'],
    });

    return { ...position.getLayout(), transform: [{ rotate }] };
  }

  renderCards() {
    if (this.state.index >= this.props.data.length) return this.props.renderNoMoreCards();

    return this.props.data
      .map((item, i) => {
        if (i < this.state.index) return null;
        return this.state.index === i ? (
          <Animated.View style={[this.getCardStyle(), styles.cardStyle]} {...this.panResponder.panHandlers} key={item.id}>
            {this.props.renderCard(item)}
          </Animated.View>
        ) : (
          <Animated.View key={item.id} style={[styles.cardStyle, { top: 10 * (i - this.state.index) }]}>
            {this.props.renderCard(item)}
          </Animated.View>
        );
      })
      .reverse();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.setState({ index: 0 });
    }
  }

  UNSAFE_componentWillUpdate() {
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.spring();
  }

  render() {
    return <View>{this.renderCards()}</View>;
  }
}

const styles = StyleSheet.create({
  cardStyle: {
    position: 'absolute',
    width: SCREEN_WIDTH,
  },
});
