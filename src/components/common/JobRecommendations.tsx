import React from 'react'
import {View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native'
import {scale, verticalScale, moderateScale} from 'react-native-size-matters'

import {JobType} from '../../constants/types'
import {useJobRecommendations} from '../../hooks/useJobRecommendations'
import {colors} from '../../constants/colors'

interface JobRecommendationCardProps {
  job: JobType
  onPress: (job: JobType) => void
}

const JobRecommendationCard = ({job, onPress}: JobRecommendationCardProps) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(job)} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <Text style={styles.jobTitle} numberOfLines={1}>
          {job.jobTitle}
        </Text>
        <Text style={styles.salaryInfo}>{job.salaryPackage}</Text>
      </View>

      <Text style={styles.companyName} numberOfLines={1}>
        {job.company}
      </Text>

      <Text style={styles.jobDescription} numberOfLines={2}>
        {job.jobDesc}
      </Text>

      <View style={styles.tagContainer}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{job.category}</Text>
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{job.skill}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

interface JobRecommendationsProps {
  onJobPress: (job: JobType) => void
}

const JobRecommendations = ({onJobPress}: JobRecommendationsProps) => {
  const {recommendations, loading, error, refreshRecommendations} = useJobRecommendations()

  if (loading && recommendations.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  if (error && recommendations.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Couldn't load recommendations</Text>
        <TouchableOpacity onPress={refreshRecommendations} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recommended for you</Text>
        <TouchableOpacity onPress={refreshRecommendations}>
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={recommendations}
        renderItem={({item}) => <JobRecommendationCard job={item} onPress={onJobPress} />}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No recommendations yet</Text>
            <Text style={styles.emptySubText}>
              Try searching for jobs to get personalized recommendations
            </Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: verticalScale(16),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: scale(16),
    marginBottom: verticalScale(10),
  },
  title: {
    fontSize: scale(18),
    fontWeight: '700',
    color: colors.textDark,
  },
  refreshText: {
    fontSize: scale(14),
    color: colors.primary,
    fontWeight: '600',
  },
  listContainer: {
    paddingLeft: scale(16),
    paddingRight: scale(6),
    paddingBottom: verticalScale(5),
  },
  card: {
    width: scale(280),
    backgroundColor: colors.white,
    borderRadius: scale(12),
    padding: scale(16),
    marginRight: scale(10),
    marginBottom: verticalScale(5),
    shadowColor: colors.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  jobTitle: {
    fontSize: scale(16),
    fontWeight: '700',
    color: colors.textDark,
    flex: 1,
    marginRight: scale(8),
  },
  salaryInfo: {
    fontSize: scale(14),
    fontWeight: '600',
    color: colors.primary,
  },
  companyName: {
    fontSize: scale(14),
    color: colors.textMedium,
    marginTop: verticalScale(4),
  },
  jobDescription: {
    fontSize: scale(14),
    color: colors.textLight,
    marginTop: verticalScale(8),
    lineHeight: verticalScale(20),
  },
  tagContainer: {
    flexDirection: 'row',
    marginTop: verticalScale(12),
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: scale(6),
    marginRight: scale(8),
    marginBottom: verticalScale(4),
  },
  tagText: {
    fontSize: scale(12),
    color: colors.primary,
  },
  loadingContainer: {
    padding: scale(30),
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    padding: scale(30),
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: scale(15),
    color: colors.error,
    textAlign: 'center',
    marginBottom: verticalScale(10),
  },
  retryButton: {
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(8),
    backgroundColor: colors.primary,
    borderRadius: scale(6),
  },
  retryText: {
    fontSize: scale(14),
    color: colors.white,
    fontWeight: '600',
  },
  emptyContainer: {
    width: scale(280),
    padding: scale(30),
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: scale(16),
    fontWeight: '600',
    color: colors.textMedium,
    textAlign: 'center',
    marginBottom: verticalScale(8),
  },
  emptySubText: {
    fontSize: scale(14),
    color: colors.textLight,
    textAlign: 'center',
  },
})

export default JobRecommendations
