import React from 'react'
import {View, StyleSheet} from 'react-native'

import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder'
import LinearGradient from 'react-native-linear-gradient'

import {colors} from '../../constants/colors'

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient)

const JobCardShimmer = () => {
  return (
    <View style={styles.card}>
      <ShimmerPlaceholder style={styles.title} />
      <ShimmerPlaceholder style={styles.description} />
      <ShimmerPlaceholder style={styles.infoRow} />
      <ShimmerPlaceholder style={styles.infoRow} />
      <ShimmerPlaceholder style={styles.infoRow} />
      <View style={styles.buttonContainer}>
        <ShimmerPlaceholder style={styles.button} />
        <ShimmerPlaceholder style={styles.button} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 6,
    elevation: 2,
  },
  title: {
    width: '60%',
    height: 20,
    borderRadius: 4,
    marginBottom: 10,
  },
  description: {
    width: '90%',
    height: 16,
    borderRadius: 4,
    marginBottom: 12,
  },
  infoRow: {
    width: '50%',
    height: 14,
    borderRadius: 4,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  button: {
    width: '45%',
    height: 36,
    borderRadius: 6,
  },
})

export default JobCardShimmer
