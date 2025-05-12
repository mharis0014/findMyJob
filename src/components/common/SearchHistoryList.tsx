import React, {useEffect} from 'react'
import {View, Text, TouchableOpacity, StyleSheet, FlatList, Image} from 'react-native'
import {scale, verticalScale} from 'react-native-size-matters'

import {useSearchHistory} from '../../hooks/useSearchHistory'
import {colors} from '../../constants/colors'
import ICONS from '../../constants/icons'

interface SearchHistoryListProps {
  onSelectTerm: (term: string) => void
}

const SearchHistoryList = ({onSelectTerm}: SearchHistoryListProps) => {
  const {searchHistory, loading, loadSearchHistory, removeSearchTerm, clearSearchHistory} =
    useSearchHistory()

  useEffect(() => {
    loadSearchHistory()
  }, [loadSearchHistory])

  if (loading && searchHistory.length === 0) {
    return null // Don't show anything while initially loading
  }

  if (searchHistory.length === 0) {
    return null // Don't display if there's no history
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Searches</Text>
        <TouchableOpacity onPress={clearSearchHistory}>
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={searchHistory}
        keyExtractor={(item, index) => `history-${index}-${item}`}
        renderItem={({item}) => (
          <TouchableOpacity style={styles.historyItem} onPress={() => onSelectTerm(item)}>
            <View style={styles.historyItemContent}>
              <Image source={ICONS.history} style={styles.historyIcon} />
              <Text style={styles.historyText} numberOfLines={1}>
                {item}
              </Text>
            </View>
            <TouchableOpacity style={styles.removeButton} onPress={() => removeSearchTerm(item)}>
              <Image source={ICONS.close} style={styles.removeIcon} />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
        style={styles.list}
        scrollEnabled={searchHistory.length > 5}
        nestedScrollEnabled
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: scale(10),
    marginHorizontal: scale(16),
    marginTop: verticalScale(4),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxHeight: verticalScale(300),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  title: {
    fontSize: scale(16),
    fontWeight: '600',
    color: colors.black,
  },
  clearText: {
    fontSize: scale(14),
    color: colors.primary,
  },
  list: {
    maxHeight: verticalScale(200),
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(8),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.lightGray,
  },
  historyItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  historyIcon: {
    width: scale(16),
    height: scale(16),
    marginRight: scale(12),
    tintColor: colors.textSecondary,
  },
  historyText: {
    fontSize: scale(14),
    color: colors.textPrimary,
    flex: 1,
  },
  removeButton: {
    padding: scale(4),
  },
  removeIcon: {
    width: scale(16),
    height: scale(16),
    tintColor: colors.textSecondary,
  },
})

export default SearchHistoryList
