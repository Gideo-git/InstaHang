import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as Location from 'expo-location';
import { Picker } from '@react-native-picker/picker';
import Colors from '../../constants/Colors';

export default function UserProfileForm() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert('Missing Information', 'Please enter your name');
      return false;
    }
    
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 120) {
      Alert.alert('Invalid Age', 'Please enter a valid age between 18 and 120');
      return false;
    }
    
    if (!gender) {
      Alert.alert('Missing Information', 'Please select your gender');
      return false;
    }
    
    return true;
  };

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'We need location permissions to show you people nearby. Please enable location services in your device settings.',
        [{ text: 'OK' }]
      );
      return false;
    }
    
    return true;
  };

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Location Error', 'Could not get your current location. Please try again.');
      return null;
    }
  };

  const saveUserProfile = async (userLocation) => {
    // This is where you would save the user data to your database
    // For now, we'll just mock this with a timeout
    return new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // Request location permission
      const permissionGranted = await requestLocationPermission();
      if (!permissionGranted) {
        setLoading(false);
        return;
      }
      
      // Get current location
      const userLocation = await getCurrentLocation();
      if (!userLocation) {
        setLoading(false);
        return;
      }
      
      // Save user profile to database (mocked)
      await saveUserProfile(userLocation);
      
      // Navigate to map screen with user data
      router.push({
        pathname: '/(tabs)/map',
        params: {
          name: name,
          age: parseInt(age),
          gender: gender,
          latitude: userLocation.latitude,
          longitude: userLocation.longitude
        }
      });
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [name, age, gender]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tell us about yourself</Text>
        <Text style={styles.subtitle}>This info will be shown to people nearby</Text>
      </View>
      
      <View style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          maxLength={30}
        />
        
        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={setAge}
          placeholder="Enter your age"
          keyboardType="numeric"
          maxLength={3}
        />
        
        <Text style={styles.label}>Gender</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={gender}
            onValueChange={(value) => setGender(value)}
            style={styles.picker}
          >
            <Picker.Item label="Select your gender" value="" />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Non-binary" value="non-binary" />
            <Picker.Item label="Prefer not to say" value="not-specified" />
          </Picker>
        </View>
        
        <View style={styles.footerText}>
          <Text style={styles.privacyText}>
            By continuing, you agree to share your location with nearby users.
            Your precise location will only be visible to users within your area.
          </Text>
        </View>
        
        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.WHITE} />
          ) : (
            <Text style={styles.buttonText}>Continue to Map</Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Oswald-Bold',
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: 'Oswald-Regular',
    fontSize: 16,
    textAlign: 'center',
    color: Colors.DG,
  },
  form: {
    padding: 20,
  },
  label: {
    fontFamily: 'Oswald-Medium',
    fontSize: 16,
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
  },
  picker: {
    height: 50,
  },
  button: {
    backgroundColor: Colors.LOGO_BG,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: Colors.WHITE,
    fontFamily: 'Oswald-Medium',
    fontSize: 18,
  },
  footerText: {
    marginTop: 20,
  },
  privacyText: {
    color: Colors.DG,
    textAlign: 'center',
    fontSize: 14,
  },
});