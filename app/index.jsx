import { Link,Redirect,useRootNavigationState } from "expo-router";
import { Pressable, Text, View} from "react-native";
import { useEffect } from "react";
import { useUser } from "@clerk/clerk-expo";

export default function Index() {
  //const { user } = useUser(); // Ensure hook is called properly


  return (
    <View style={{ flex: 1 }}>
      <Redirect href={'/login'} />
    </View>
  );
}
