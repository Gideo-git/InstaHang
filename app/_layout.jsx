import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo'
import * as SecureStore from 'expo-secure-store'

const tokenCache = {
  async getToken(key) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) {
        console.log(`${key} was used 🔐`);
      } else {
        console.log("No values stored under key: " + key);
      }
      return item;
    } catch (error) {
      console.error("SecureStore get item error: ", error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },

  async saveToken(key, value) {
    try {
      await SecureStore.setItemAsync(key, value);
      console.log(`Token saved under ${key} ✅`);
    } catch (error) {
      console.error("SecureStore save error:", error);
    }
  },
};


export default function RootLayout() {

  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

  useFonts({
    'Oswald-Regular':require("./../assets/fonts/Oswald-Regular.ttf"),
    'Oswald-Medium':require("./../assets/fonts/Oswald-Medium.ttf"),
    'Oswald-Bold':require("./../assets/fonts/Oswald-Bold.ttf")
  })
  return(
    <ClerkProvider 
    tokenCache={tokenCache} 
    publishableKey={publishableKey}>
    <Stack>
      <Stack.Screen name="index"
      options={{headerShown:false}}/>
      <Stack.Screen name="login/index"
      options={{headerShown:false}}/>
    </Stack>
    </ClerkProvider>
  ) 
}
