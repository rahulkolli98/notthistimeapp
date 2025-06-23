import React, { useRef } from 'react'
import { TouchableOpacity, Text, Animated } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import { homeStyles } from './HomeStyles'

// Leaf SVG components
const Leaf1 = ({ style }: { style?: any }) => (
  <Svg width="25" height="65" viewBox="0 0 26.3 65.33" style={style}>
    <Path
      d="M13.98 52.87c0.37,-0.8 0.6,-1.74 0.67,-2.74 1.01,1.1 2.23,2.68 1.24,3.87 -0.22,0.26 -0.41,0.61 -0.59,0.97 -2.95,5.89 3.44,10.87 2.98,0.78 0.29,0.23 0.73,0.82 1.03,1.18 0.33,0.4 0.7,0.77 1,1.15 0.29,0.64 -0.09,2.68 1.77,4.91 5.42,6.5 5.67,-2.38 0.47,-4.62 -0.41,-0.18 -0.95,-0.26 -1.28,-0.54 -0.5,-0.41 -1.23,-1.37 -1.66,-1.9 0.03,-0.43 -0.17,-0.13 0.11,-0.33 4.98,1.72 8.4,-1.04 2.38,-3.16 -1.98,-0.7 -2.9,-0.36 -4.72,0.16 -0.63,-0.58 -2.38,-3.82 -2.82,-4.76 1.21,0.56 1.72,1.17 3.47,1.3 6.5,0.5 2.31,-4.21 -2.07,-4.04 -1.12,0.04 -1.62,0.37 -2.49,0.62l-1.25 -3.11c0.03,-0.26 0.01,-0.18 0.1,-0.28 1.35,0.86 1.43,1 3.25,1.45 2.35,0.15 3.91,-0.15 1.75,-2.4 -1.22,-1.27 -2.43,-2.04 -4.22,-2.23l-2.08 0.13c-0.35,-0.58 -0.99,-2.59 -1.12,-3.3l-0.01 -0.01z"
      fill="#000"
    />
  </Svg>
)

const Leaf2 = ({ style }: { style?: any }) => (
  <Svg width="20" height="50" viewBox="0 0 26.3 65.33" style={style}>
    <Path
      d="M13.98 52.87c0.37,-0.8 0.6,-1.74 0.67,-2.74 1.01,1.1 2.23,2.68 1.24,3.87 -0.22,0.26 -0.41,0.61 -0.59,0.97 -2.95,5.89 3.44,10.87 2.98,0.78 0.29,0.23 0.73,0.82 1.03,1.18 0.33,0.4 0.7,0.77 1,1.15 0.29,0.64 -0.09,2.68 1.77,4.91 5.42,6.5 5.67,-2.38 0.47,-4.62 -0.41,-0.18 -0.95,-0.26 -1.28,-0.54 -0.5,-0.41 -1.23,-1.37 -1.66,-1.9 0.03,-0.43 -0.17,-0.13 0.11,-0.33 4.98,1.72 8.4,-1.04 2.38,-3.16 -1.98,-0.7 -2.9,-0.36 -4.72,0.16 -0.63,-0.58 -2.38,-3.82 -2.82,-4.76 1.21,0.56 1.72,1.17 3.47,1.3 6.5,0.5 2.31,-4.21 -2.07,-4.04 -1.12,0.04 -1.62,0.37 -2.49,0.62l-1.25 -3.11c0.03,-0.26 0.01,-0.18 0.1,-0.28 1.35,0.86 1.43,1 3.25,1.45 2.35,0.15 3.91,-0.15 1.75,-2.4 -1.22,-1.27 -2.43,-2.04 -4.22,-2.23l-2.08 0.13c-0.35,-0.58 -0.99,-2.59 -1.12,-3.3l-0.01 -0.01z"
      fill="#000"
    />
  </Svg>
)

const Leaf3 = ({ style }: { style?: any }) => (
  <Svg width="22" height="60" viewBox="0 0 25.29 76.92" style={style}>
    <Path
      d="M13.98 52.87c0.37,-0.8 0.6,-1.74 0.67,-2.74 1.01,1.1 2.23,2.68 1.24,3.87 -0.22,0.26 -0.41,0.61 -0.59,0.97 -2.95,5.89 3.44,10.87 2.98,0.78 0.29,0.23 0.73,0.82 1.03,1.18 0.33,0.4 0.7,0.77 1,1.15 0.29,0.64 -0.09,2.68 1.77,4.91 5.42,6.5 5.67,-2.38 0.47,-4.62 -0.41,-0.18 -0.95,-0.26 -1.28,-0.54 -0.5,-0.41 -1.23,-1.37 -1.66,-1.9 0.03,-0.43 -0.17,-0.13 0.11,-0.33 4.98,1.72 8.4,-1.04 2.38,-3.16 -1.98,-0.7 -2.9,-0.36 -4.72,0.16 -0.63,-0.58 -2.38,-3.82 -2.82,-4.76 1.21,0.56 1.72,1.17 3.47,1.3 6.5,0.5 2.31,-4.21 -2.07,-4.04 -1.12,0.04 -1.62,0.37 -2.49,0.62l-1.25 -3.11c0.03,-0.26 0.01,-0.18 0.1,-0.28 1.35,0.86 1.43,1 3.25,1.45 2.35,0.15 3.91,-0.15 1.75,-2.4 -1.22,-1.27 -2.43,-2.04 -4.22,-2.23l-2.08 0.13c-0.35,-0.58 -0.99,-2.59 -1.12,-3.3l-0.01 -0.01z"
      fill="#000"
    />
  </Svg>
)

interface AnimatedLeafButtonProps {
  onPress: () => void
  text: string
}

export function AnimatedLeafButton({ onPress, text }: AnimatedLeafButtonProps) {
  // Animation values for the leaves
  const leaf1Rotation = useRef(new Animated.Value(10)).current
  const leaf2Rotation = useRef(new Animated.Value(0)).current
  const leaf3Rotation = useRef(new Animated.Value(-5)).current

  const startLeafAnimations = () => {
    // Leaf 1 animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(leaf1Rotation, {
          toValue: -5,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(leaf1Rotation, {
          toValue: 10,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start()

    // Leaf 2 animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(leaf2Rotation, {
          toValue: 15,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(leaf2Rotation, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start()

    // Leaf 3 animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(leaf3Rotation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(leaf3Rotation, {
          toValue: -5,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start()
  }

  return (
    <TouchableOpacity 
      style={homeStyles.createButton} 
      onPress={onPress}
      onPressIn={startLeafAnimations}
    >
      <Text style={homeStyles.createButtonText}>{text}</Text>
      
      {/* Hanging Leaves */}
      <Animated.View 
        style={[
          homeStyles.leaf1,
          {
            transform: [
              { rotate: leaf1Rotation.interpolate({
                inputRange: [-5, 10],
                outputRange: ['-5deg', '10deg']
              })}
            ]
          }
        ]}
      >
        <Leaf1 />
      </Animated.View>
      
      <Animated.View 
        style={[
          homeStyles.leaf2,
          {
            transform: [
              { rotate: leaf2Rotation.interpolate({
                inputRange: [0, 15],
                outputRange: ['0deg', '15deg']
              })}
            ]
          }
        ]}
      >
        <Leaf2 />
      </Animated.View>
      
      <Animated.View 
        style={[
          homeStyles.leaf3,
          {
            transform: [
              { rotate: leaf3Rotation.interpolate({
                inputRange: [-5, 0],
                outputRange: ['-5deg', '0deg']
              })}
            ]
          }
        ]}
      >
        <Leaf3 />
      </Animated.View>
    </TouchableOpacity>
  )
} 