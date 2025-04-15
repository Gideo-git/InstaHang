import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import Colors from '../../constants/Colors';

export default function MapScreen() {
  // Get user data from route params
  const params = useLocalSearchParams();
  const userData = {
    name: params.name,
    age: parseInt(params.age),
    gender: params.gender,
    location: {
      latitude: parseFloat(params.latitude),
      longitude: parseFloat(params.longitude),
    }
  };

  const [currentLocation, setCurrentLocation] = useState(userData.location);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);
  const locationSubscription = useRef(null);

  useEffect(() => {
    // Start tracking location for real-time updates
    const startLocationTracking = async () => {
      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          distanceInterval: 10, // update every 10 meters
          timeInterval: 5000, // or every 5 seconds
        },
        (location) => {
          const newLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };
          
          setCurrentLocation(newLocation);
          
          // Update user location in database
          updateUserLocationInDatabase(newLocation);
        }
      );
    };

    startLocationTracking();
    fetchNearbyUsers();

    // Cleanup function
    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, []);

  const updateUserLocationInDatabase = (location) => {
    // This is where you would update the user's location in your database
    console.log('Updating user location:', location);
  };

  const fetchNearbyUsers = async () => {
    setLoading(true);
    try {
      // This is where you would fetch nearby users from your database
      // For now, let's mock some nearby users
      const mockNearbyUsers = [
        {
          id: '1',
          name: 'Alex',
          age: 25,
          gender: 'male',
          location: {
            latitude: currentLocation.latitude + 0.001,
            longitude: currentLocation.longitude + 0.002,
          },
        },
        {
          id: '2',
          name: 'Jamie',
          age: 29,
          gender: 'female',
          location: {
            latitude: currentLocation.latitude - 0.002,
            longitude: currentLocation.longitude + 0.001,
          },
        },
        {
          id: '3',
          name: 'Taylor',
          age: 23,
          gender: 'non-binary',
          location: {
            latitude: currentLocation.latitude + 0.003,
            longitude: currentLocation.longitude - 0.001,
          },
        },
      ];
      
      setNearbyUsers(mockNearbyUsers);
    } catch (error) {
      console.error('Error fetching nearby users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserPress = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleRefresh = () => {
    fetchNearbyUsers();
  };

  const handleRecenter = () => {
    mapRef.current?.animateToRegion({
      ...currentLocation,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  // Get gender-specific icon
  const getUserMarkerIcon = (gender) => {
    switch (gender) {
      case 'male':
        return 'male';
      case 'female':
        return 'female';
      default:
        return 'person';
    }
  };

  // Get gender-specific color
  const getUserColor = (gender) => {
    switch (gender) {
      case 'male':
        return '#3498db';
      case 'female':
        return '#e74c3c';
      case 'non-binary':
        return '#9b59b6';
      default:
        return '#2ecc71';
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          ...currentLocation,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {/* Current user location */}
        <Circle
          center={currentLocation}
          radius={100}
          fillColor="rgba(66, 133, 244, 0.2)"
          strokeColor="rgba(66, 133, 244, 0.5)"
        />
        
        {/* Nearby users */}
        {nearbyUsers.map((user) => (
          <Marker
            key={user.id}
            coordinate={user.location}
            onPress={() => handleUserPress(user)}
          >
            <View
              style={[
                styles.userMarker,
                { backgroundColor: getUserColor(user.gender) },
              ]}
            >
              <FontAwesome
                name={getUserMarkerIcon(user.gender)}
                size={16}
                color="white"
              />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Loading indicator */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.LOGO_BG} />
        </View>
      )}

      {/* Control buttons */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={handleRecenter}
        >
          <MaterialIcons name="my-location" size={24} color="black" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.controlButton}
          onPress={handleRefresh}
        >
          <MaterialIcons name="refresh" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* User details modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            {selectedUser && (
              <>
                <View
                  style={[
                    styles.userIcon,
                    { backgroundColor: getUserColor(selectedUser.gender) },
                  ]}
                >
                  <FontAwesome
                    name={getUserMarkerIcon(selectedUser.gender)}
                    size={30}
                    color="white"
                  />
                </View>
                
                <Text style={styles.userName}>{selectedUser.name}</Text>
                <Text style={styles.userDetails}>
                  {selectedUser.age} • {selectedUser.gender.charAt(0).toUpperCase() + selectedUser.gender.slice(1)}
                </Text>
                
                <View style={styles.userActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.messageButton]}
                  >
                    <Text style={styles.actionButtonText}>Message</Text>
                  </TouchableOpacity>
                </View>
                
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <MaterialIcons name="close" size={24} color="black" />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  userMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.LOGO_BG,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  controls: {
    position: 'absolute',
    right: 16,
    bottom: 100,
    alignItems: 'center',
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
  },
  userIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'white',
  },
  userName: {
    fontFamily: 'Oswald-Bold',
    fontSize: 24,
    marginBottom: 8,
  },
  userDetails: {
    fontFamily: 'Oswald-Regular',
    fontSize: 16,
    color: Colors.DG,
    marginBottom: 24,
  },
  userActions: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageButton: {
    backgroundColor: Colors.LOGO_BG,
  },
  actionButtonText: {
    color: 'white',
    fontFamily: 'Oswald-Medium',
    fontSize: 16,
  },
});