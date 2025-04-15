import { Stack } from "expo-router";
import { useFonts } from "expo-font";

export default function RootLayout() {
  //const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

  useFonts({
    'Oswald-Regular': require("./../assets/fonts/Oswald-Regular.ttf"),
    'Oswald-Medium': require("./../assets/fonts/Oswald-Medium.ttf"),
    'Oswald-Bold': require("./../assets/fonts/Oswald-Bold.ttf")
  });

  return(
    <Stack>
      <Stack.Screen 
        name="index"
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name="login/index"
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name="login/profile"
        options={{
          title: 'Your Profile',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen 
        name="tabs/map"
        options={{
          title: 'People Nearby',
          headerBackTitle: 'Profile',
        }}
      />
    </Stack>
  );
}