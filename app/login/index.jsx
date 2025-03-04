import { View, Text,Image, Pressable,Button} from 'react-native'
import React from 'react'
import Colors from './../../constants/Colors'
import { useCallback, useEffect } from 'react'
import * as WebBrowser from 'expo-web-browser'
import * as AuthSession from 'expo-auth-session'
import { useSSO } from '@clerk/clerk-expo'
import * as Linking  from 'expo-linking'

export const useWarmUpBrowser = () => {
    useEffect(() => {
      void WebBrowser.warmUpAsync()
      return () => {
        void WebBrowser.coolDownAsync()
      }
    }, [])
  }
  
  WebBrowser.maybeCompleteAuthSession()

export default function LoginScreen() {
    useWarmUpBrowser();
    const { startSSOFlow } = useSSO()
    const onPress = useCallback(async () => {
        try {
          const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
            strategy: 'oauth_google',
            redirectUrl: Linking.createURL('/home',{scheme:'myapp'}),
          })
          if (createdSessionId) {
            
          } else {
          }
        } catch (err) {
          console.error(JSON.stringify(err, null, 2))
        }
      }, [])
    
  return (
    <View style={{
        backgroundColor:Colors.WHITE,
        height:'100%'
    }}>
        <Image source={require('./../../assets/images/logo2.webp')}
        style={{
            width:'100%',
            height:500
        }}
        />
        <View style={{
            padding:30,
            display:'flex',
            alignItems:'center'
        }}>
        <Text style={{
            fontFamily:'Oswald-Bold',
            fontSize: 30,
            textAlign:'center'
        }}>Feeling Lonely!??</Text>
        <Text style={{
            fontFamily:'Oswald-regular',
            fontSize: 20,
            marginTop:15,
            textAlign:'center',
            color:Colors.DG
        }}>Hang with people nearby you</Text>
        <Pressable 
        onPress={onPress}
        style={{
            padding:14,
            marginTop:50,
            backgroundColor:Colors.LOGO_BG,
            width:'100%',
            borderRadius:14
        }}>
            <Text style={{
                textAlign:'center',
                fontFamily:'Oswald-medium',
                fontSize:20
            }}>
                Get Started
            </Text>
        </Pressable>
        </View>
      
    </View>
  )
}