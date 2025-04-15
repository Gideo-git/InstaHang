/*import { View, Text } from 'react-native'
import React from 'react'

export default function TabLayout() {
  return (
    <View>
      <Text>TabLayout</Text>
    </View>
  )
}*/
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="map" options={{ title: "Map" }} />
      <Tabs.Screen name="chats" options={{ title: "Chats" }} />
    </Tabs>
  );
}


