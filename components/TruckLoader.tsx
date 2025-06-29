import React, { useEffect, useRef } from 'react'
import { View, StyleSheet, Animated } from 'react-native'
import Svg, { Path, Circle, Rect } from 'react-native-svg'

interface TruckLoaderProps {
  size?: 'small' | 'medium' | 'large'
}

export function TruckLoader({ size = 'medium' }: TruckLoaderProps) {
  const sizeMap = {
    small: { width: 150, height: 75 },
    medium: { width: 200, height: 100 },
    large: { width: 250, height: 125 }
  }

  const { width, height } = sizeMap[size]

  // Animation values
  const truckBodyAnimation = useRef(new Animated.Value(0)).current
  const roadAnimation = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Truck body suspension animation
    const truckAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(truckBodyAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(truckBodyAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    )

    // Road movement animation
    const roadMovement = Animated.loop(
      Animated.timing(roadAnimation, {
        toValue: 1,
        duration: 1400,
        useNativeDriver: true,
      })
    )

    truckAnimation.start()
    roadMovement.start()

    return () => {
      truckAnimation.stop()
      roadMovement.stop()
    }
  }, [])

  const truckBodyTranslateY = truckBodyAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 3],
  })

  const roadTranslateX = roadAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -350],
  })

  return (
    <View style={[styles.loader, { width, height }]}>
      <View style={styles.truckWrapper}>
        {/* Truck Body */}
        <Animated.View 
          style={[
            styles.truckBody,
            {
              transform: [{ translateY: truckBodyTranslateY }]
            }
          ]}
        >
          <Svg width="130" height="93" viewBox="0 0 198 93" style={styles.truckSvg}>
            <Path strokeWidth={3} stroke="#282828" fill="#F83D3D" d="M135 22.5H177.264C178.295 22.5 179.22 23.133 179.594 24.0939L192.33 56.8443C192.442 57.1332 192.5 57.4404 192.5 57.7504V89C192.5 90.3807 191.381 91.5 190 91.5H135C133.619 91.5 132.5 90.3807 132.5 89V25C132.5 23.6193 133.619 22.5 135 22.5Z" />
            <Path strokeWidth={3} stroke="#282828" fill="#7D7C7C" d="M146 33.5H181.741C182.779 33.5 183.709 34.1415 184.078 35.112L190.538 52.112C191.16 53.748 189.951 55.5 188.201 55.5H146C144.619 55.5 143.5 54.3807 143.5 53V36C143.5 34.6193 144.619 33.5 146 33.5Z" />
            <Path strokeWidth={2} stroke="#282828" fill="#282828" d="M150 65C150 65.39 149.763 65.8656 149.127 66.2893C148.499 66.7083 147.573 67 146.5 67C145.427 67 144.501 66.7083 143.873 66.2893C143.237 65.8656 143 65.39 143 65C143 64.61 143.237 64.1344 143.873 63.7107C144.501 63.2917 145.427 63 146.5 63C147.573 63 148.499 63.2917 149.127 63.7107C149.763 64.1344 150 64.61 150 65Z" />
            <Rect strokeWidth={2} stroke="#282828" fill="#FFFCAB" rx={1} height={7} width={5} y={63} x={187} />
            <Rect strokeWidth={2} stroke="#282828" fill="#282828" rx={1} height={11} width={4} y={81} x={193} />
            <Rect strokeWidth={3} stroke="#282828" fill="#DFDFDF" rx="2.5" height={90} width={121} y="1.5" x="6.5" />
            <Rect strokeWidth={2} stroke="#282828" fill="#DFDFDF" rx={2} height={4} width={6} y={84} x={1} />
          </Svg>
        </Animated.View>

        {/* Truck Tires */}
        <View style={styles.truckTires}>
          <Svg width="24" height="30" viewBox="0 0 30 30" style={styles.tireSvg}>
            <Circle strokeWidth={3} stroke="#282828" fill="#282828" r="13.5" cy={15} cx={15} />
            <Circle fill="#DFDFDF" r={7} cy={15} cx={15} />
          </Svg>
          <Svg width="24" height="30" viewBox="0 0 30 30" style={styles.tireSvg}>
            <Circle strokeWidth={3} stroke="#282828" fill="#282828" r="13.5" cy={15} cx={15} />
            <Circle fill="#DFDFDF" r={7} cy={15} cx={15} />
          </Svg>
        </View>

        {/* Road */}
        <View style={styles.road}>
          <Animated.View 
            style={[
              styles.roadLine,
              {
                transform: [{ translateX: roadTranslateX }]
              }
            ]} 
          />
          <Animated.View 
            style={[
              styles.roadLine2,
              {
                transform: [{ translateX: roadTranslateX }]
              }
            ]} 
          />
        </View>

        {/* Lamp Post */}
        <Animated.View 
          style={[
            styles.lampPost,
            {
              transform: [{ translateX: roadTranslateX }]
            }
          ]}
        >
          <Svg width="90" height="90" viewBox="0 0 453.459 453.459">
            <Path fill="#000000" d="M252.882,0c-37.781,0-68.686,29.953-70.245,67.358h-6.917v8.954c-26.109,2.163-45.463,10.011-45.463,19.366h9.993 c-1.65,5.146-2.507,10.54-2.507,16.017c0,28.956,23.558,52.514,52.514,52.514c28.956,0,52.514-23.558,52.514-52.514 c0-5.478-0.856-10.872-2.506-16.017h9.992c0-9.354-19.352-17.204-45.463-19.366v-8.954h-6.149C200.189,38.779,223.924,16,252.882,16 c29.952,0,54.32,24.368,54.32,54.32c0,28.774-11.078,37.009-25.105,47.437c-17.444,12.968-37.216,27.667-37.216,78.884v113.914 h-0.797c-5.068,0-9.174,4.108-9.174,9.177c0,2.844,1.293,5.383,3.321,7.066c-3.432,27.933-26.851,95.744-8.226,115.459v11.202h45.75 v-11.202c18.625-19.715-4.794-87.527-8.227-115.459c2.029-1.683,3.322-4.223,3.322-7.066c0-5.068-4.107-9.177-9.176-9.177h-0.795 V196.641c0-43.174,14.942-54.283,30.762-66.043c14.793-10.997,31.559-23.461,31.559-60.277C323.202,31.545,291.656,0,252.882,0z M232.77,111.694c0,23.442-19.071,42.514-42.514,42.514c-23.442,0-42.514-19.072-42.514-42.514c0-5.531,1.078-10.957,3.141-16.017 h78.747C231.693,100.736,232.77,106.162,232.77,111.694z" />
          </Svg>
        </Animated.View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  loader: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  truckWrapper: {
    width: 200,
    height: 100,
    flexDirection: 'column',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  truckBody: {
    width: 130,
    marginBottom: 6,
  },
  truckSvg: {
    // Truck body animation handled by Animated.View
  },
  truckTires: {
    width: 130,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingLeft: 15,
    position: 'absolute',
    bottom: 0,
  },
  tireSvg: {
    width: 24,
  },
  road: {
    width: '100%',
    height: 1.5,
    backgroundColor: '#282828',
    position: 'relative',
    bottom: 0,
    alignSelf: 'flex-end',
    borderRadius: 3,
  },
  roadLine: {
    position: 'absolute',
    width: 20,
    height: '100%',
    backgroundColor: '#282828',
    right: -50,
    borderRadius: 3,
    borderLeftWidth: 10,
    borderLeftColor: 'white',
  },
  roadLine2: {
    position: 'absolute',
    width: 10,
    height: '100%',
    backgroundColor: '#282828',
    right: -65,
    borderRadius: 3,
    borderLeftWidth: 4,
    borderLeftColor: 'white',
  },
  lampPost: {
    position: 'absolute',
    bottom: 0,
    right: -90,
    height: 90,
  },
}) 