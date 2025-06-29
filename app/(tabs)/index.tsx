import React from 'react'
import { View, Text, FlatList, RefreshControl } from 'react-native'
import { useRouter } from 'expo-router'
import { useUserLists } from '../../hooks/useUserLists'
import { useHomeSearch } from '../../hooks/useHomeSearch'
import { 
  homeStyles, 
  AnimatedLeafButton, 
  ShoppingListCard, 
  SearchSection, 
  EmptyState, 
  ErrorState, 
  LoadingState 
} from '../../components'

export default function Home() {
  const { lists, loading, error, refetch, deleteList } = useUserLists()
  const router = useRouter()
  const { searchQuery, setSearchQuery, filteredLists, clearSearch } = useHomeSearch(lists)

  const handleListPress = (list: any) => {
    router.push(`/list/${list.id}`)
  }

  const handleCreateList = () => {
    router.push('/(tabs)/create')
  }

  const handleDeleteList = async (listId: string) => {
    try {
      await deleteList(listId)
    } catch (err) {
      console.error('Error deleting list:', err)
    }
  }

  const renderEmptyState = () => {
    if (searchQuery.trim()) {
      return (
        <EmptyState
          type="no-search-results"
          searchQuery={searchQuery}
          onClearSearch={clearSearch}
        />
  )
    }

    return (
      <EmptyState
        type="no-lists"
        onCreateList={handleCreateList}
      />
    )
  }

  // Loading state
  if (loading && lists.length === 0) {
    return <LoadingState />
  }

  // Error state
  if (error && lists.length === 0) {
    return (
      <View style={homeStyles.container}>
        <ErrorState error={error} onRetry={refetch} />
      </View>
    )
  }

  return (
    <View style={homeStyles.container}>
      {/* Header */}
      <View style={homeStyles.header}>
        <Text style={homeStyles.title}>My Shopping Lists</Text>
        <AnimatedLeafButton 
          onPress={handleCreateList}
          text="+ New List"
        />
      </View>

      {/* Search Section */}
      <SearchSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalResults={lists.length}
        filteredResults={filteredLists.length}
      />

      {/* Lists */}
      <FlatList
        data={filteredLists}
        renderItem={({ item }) => (
          <ShoppingListCard
            list={item}
            onPress={handleListPress}
            onDelete={handleDeleteList}
            isOwner={item.is_owner}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={filteredLists.length === 0 ? homeStyles.emptyContainer : homeStyles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading && lists.length > 0}
            onRefresh={refetch}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  )
}