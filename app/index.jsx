import { Link,Redirect,useRootNavigationState } from "expo-router";
import { Pressable, Text, View} from "react-native";
import { useEffect } from "react";
import { useUser } from "@clerk/clerk-expo";

export default function Index() {
  const { user } = useUser(); // Ensure hook is called properly

  const rootNavigationState=useRootNavigationState()
  useEffect(() => {
    checkNavLoaded();
  }, []);
  
  const checkNavLoaded = () => {
    if (!rootNavigationState?.key) return null;
  };

  if (!user) {
    return <Redirect href={'/login'} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Redirect href={'/(tabs)/home'} />
    </View>
  );
}
