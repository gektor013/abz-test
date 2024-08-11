import { useCallback } from "react"
import { ActivityIndicator, Dimensions, StyleSheet, View } from "react-native"

import { WorkingRequest } from "@/shared/components/work-request"
import { ScreenContainer } from "@/shared/ui-kit/screen-container"
import { UsersResponse } from "@/types/users"
import { FlashList } from "@shopify/flash-list"

import { Button } from "@/shared/ui-kit/button"
import { useRoute } from "@react-navigation/native"
import { router as navigationRouter, usePathname } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { NoUsers } from "./_components/no-users"
import { User } from "./_components/user"
import { useUserData } from "./_hooks/useUserData"

export const Users = () => {
  const { isUsersLoading, loadMoreData, users, pageRef } = useUserData()
  const KEY_EXTRACTOR = useCallback(
    (item: UsersResponse["users"][0]) => item.id.toString(),
    []
  )

  const router = useRoute()
  const path = usePathname()
  console.log(path)

  return (
    <ScreenContainer>
      <WorkingRequest requestType="GET" />
      <StatusBar style="dark" />
      <Button
        label="Redirect"
        onPress={() => navigationRouter.push("/(tabs)/users/44")}
      />
      <View style={styles.usersContainer}>
        <FlashList
          data={users}
          numColumns={1}
          refreshing={isUsersLoading}
          nestedScrollEnabled={true}
          onEndReachedThreshold={0.1}
          progressViewOffset={Dimensions.get("window").width}
          indicatorStyle="white"
          contentContainerStyle={{ paddingBottom: 40 }}
          keyExtractor={KEY_EXTRACTOR} // MEMOIZED KEY LIBRARY REQUIRED
          showsVerticalScrollIndicator={false}
          estimatedItemSize={Dimensions.get("window").width}
          onLoad={() => loadMoreData(pageRef.current)} // STARTED IN FIRST LOADING
          onEndReached={() => loadMoreData((pageRef.current += 1))} // STARTED IN WHEN WE SCROLLING TO CENTER OF COMPONENT
          renderItem={({ item }) => <User user={item} />}
          ListFooterComponent={() => <RenderFooter isUsersLoading={isUsersLoading} />}
          ListEmptyComponent={() => (
            <View style={styles.emptyComponentContainer}>
              <NoUsers />
            </View>
          )}
        />
      </View>
    </ScreenContainer>
  )
}

const RenderFooter = ({ isUsersLoading }: { isUsersLoading: boolean }) => {
  if (!isUsersLoading) return null
  return (
    <View style={{ paddingVertical: 20 }}>
      <ActivityIndicator size="large" />
    </View>
  )
}

const styles = StyleSheet.create({
  usersContainer: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 24
  },
  emptyComponentContainer: {
    flex: 1,
    height: Dimensions.get("window").height - 100,
    justifyContent: "center",
    alignItems: "center"
  }
})
