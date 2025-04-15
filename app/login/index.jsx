import React, { useCallback, useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Colors from '../../constants/Colors';

export default function LoginScreen() {
    const [loading, setLoading] = useState(false);
    
    const onPress = useCallback(async () => {
        setLoading(true);
        try {
            // Navigate to the profile form
            router.push('/login/profile');
        } catch (error) {
            console.error('Error navigating:', error);
            Alert.alert('Error', 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);
    
    return (
        <View style={styles.container}>
            <Image 
                source={require('./../../assets/images/logo2.webp')}
                style={styles.logo}
            />
            <View style={styles.contentContainer}>
                <Text style={styles.title}>Feeling Lonely!??</Text>
                <Text style={styles.subtitle}>Hang with people nearby you</Text>
                <Pressable 
                    onPress={onPress}
                    disabled={loading}
                    style={[styles.button, loading && styles.buttonDisabled]}
                >
                    <Text style={styles.buttonText}>
                        {loading ? 'Loading...' : 'Get Started'}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.WHITE,
        height: '100%'
    },
    logo: {
        width: '100%',
        height: 500
    },
    contentContainer: {
        padding: 30,
        display: 'flex',
        alignItems: 'center'
    },
    title: {
        fontFamily: 'Oswald-Bold',
        fontSize: 30,
        textAlign: 'center'
    },
    subtitle: {
        fontFamily: 'Oswald-Regular',
        fontSize: 20,
        marginTop: 15,
        textAlign: 'center',
        color: Colors.DG
    },
    button: {
        padding: 14,
        marginTop: 50,
        backgroundColor: Colors.LOGO_BG,
        width: '100%',
        borderRadius: 14
    },
    buttonDisabled: {
        opacity: 0.7
    },
    buttonText: {
        textAlign: 'center',
        fontFamily: 'Oswald-Medium',
        fontSize: 20
    }
});