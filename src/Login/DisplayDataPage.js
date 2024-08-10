import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, Image, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Linking from 'expo-linking';
import { Ionicons } from '@expo/vector-icons';  // Import Ionicons from expo vector icons

const DisplayDataPage = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scannedData, setScannedData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userNotFound, setUserNotFound] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [manualQRCode, setManualQRCode] = useState('');
  const [loading, setLoading] = useState(false); // State for loading

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const fetchUserData = async (qrcode) => {
    setLoading(true); // Set loading to true before starting the fetch
    try {
      const response = await fetch('https://railway-qbx4.onrender.com/vendor/fetchVendorDataByQR', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qrcode }),
      });

      const result = await response.json();
      console.log('API Response:', result);

      if (result.message === 'User not found') {
        setUserNotFound(true);
        setUserData(null);
      } else {
        setUserNotFound(false);
        console.log('User Data:', result.user);
        setUserData(result.user);
        setManualQRCode('');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false); // Set loading to false after the fetch is complete
    }
  };

  const handleBarCodeScanned = ({ type, data }) => {
    setScannedData(data);
    setCameraVisible(false);
    fetchUserData(data);
  };

  const handleCameraOpen = () => {
    if (hasPermission) {
      setCameraVisible(true);
    } else {
      Alert.alert('No access to camera');
    }
  };

  const handleCameraClose = () => {
    setCameraVisible(false);
    setScannedData(null);
  };

  const handleManualSubmit = () => {
    fetchUserData(manualQRCode);
  };

  const handleClearQRCode = () => {
    console.log("Clear button pressed");  // Debug log
    setManualQRCode('');
    setUserData(null);  // Set userData to null
    setUserNotFound(false);
  };
  

  const handleOpenPDF = (pdfUrl) => {
    Linking.openURL(pdfUrl);
  };
  const handledatanull = () =>{
    console.log("Clear button pressed");  // Debug log
    setManualQRCode('');
    setUserData(null);  // Set userData to null
    setUserNotFound(false);
  }

  return (
    <View style={styles.container}>
      {userData == null && !loading && (
        <View style={{ marginBottom: 20 }}>
          <Button title="Scan QR Code" onPress={handleCameraOpen} />
        </View>
      )}
      
      {cameraVisible && (
        <>
          <BarCodeScanner
            onBarCodeScanned={handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
          <Button title="Close Camera" onPress={handleCameraClose} />
        </>
      )}

      {!cameraVisible && (
        <>
          <View style={styles.inputContainer}>
            {userData == null && (
              <TextInput
                style={styles.input}
                placeholder="Enter QR code"
                value={manualQRCode}
                onChangeText={(text) => {
                  setManualQRCode(text);
                  setUserNotFound(false);
                }}
              />
            )}
            {userData !== null && (
           <TouchableOpacity onPress={handleClearQRCode} style={styles.clearIcon}>
           <Ionicons name="close-circle" size={34} color="red" />
         </TouchableOpacity>
         
         
            )}
            {userData !== null &&  (<View style={{ marginTop: 20, display:'none' }}>
                <Button title="close" onPress={handledatanull} />
              </View>)}
          </View>
          {userNotFound && <Text style={styles.errorText}>User not found</Text>}
          {userData == null && !loading && (
            <View style={{ marginBottom: 20 }}>
              <View style={{ marginTop: 20 }}>
                <Button title="Submit" onPress={handleManualSubmit} />
              </View>
            </View>
          )}
        </>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        userData && (
          <ScrollView style={styles.scannedDataContainer}>
            <Text><Text style={styles.bold}>First Name {" "}:{" "}</Text> <Text>{userData.fname}</Text></Text>
            <Text><Text style={styles.bold}>Last Name{" "}:</Text> {userData.lname}</Text>
            <Text><Text style={styles.bold}>Mobile{" "}:</Text> {userData.mobile}</Text>
            <Text><Text style={styles.bold}>Aadhar Number{" "}:</Text> {userData.aadhar}</Text>
            <Text><Text style={styles.bold}>Location of Stall{" "}:</Text> {userData.locationOfStall}</Text>
            <Text><Text style={styles.bold}>Date of Birth{" "}:</Text> {(userData.dob).slice(0,10)}</Text>
            <Text><Text style={styles.bold}>Medical Validity From{ " "}:</Text> {(userData.medicalValidityDateFrom).slice(0,10)}</Text>
            <Text><Text style={styles.bold}>Medical Validity To{" "}:</Text> {(userData.medicalValidityDateTo).slice(0,10)}</Text>
            <Text><Text style={styles.bold}>Start Date{" "}:</Text> {(userData.startDate).slice(0,10)}</Text>
            <Text><Text style={styles.bold}>End Date{" "}:</Text> {(userData.endDate).slice(0,10)}</Text>

            {/* Display the Aadhar Card */}
            <Text><Text style={styles.bold}>Aadhar Card:</Text></Text>
            {userData.aadharCardImg.endsWith('.pdf') ? (
              <>
                <Image
                  source={{ uri: 'https://img.freepik.com/premium-vector/pdf-icon-flat-pdf-vector-icon-flat-design-vector-icon_874723-147.jpg?ga=GA1.1.568218271.1720937116&semt=ais_hybrid' }}
                  style={styles.pdfIcon}
                />
                <TouchableOpacity onPress={() => Linking.openURL(userData.aadharCardImg)}>
                  <Text style={styles.downloadButton}>Download Aadhar Card</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Image source={{ uri: userData.aadharCardImg }} style={styles.image} />
            )}

            {/* Display the Medical Validity Document */}
            <Text><Text style={styles.bold}>Medical Validity Document:</Text></Text>
            {userData.madicalValidityDocument.endsWith('.pdf') ? (
              <>
                <Image
                  source={{ uri: 'https://img.freepik.com/premium-vector/pdf-icon-flat-pdf-vector-icon-flat-design-vector-icon_874723-147.jpg?ga=GA1.1.568218271.1720937116&semt=ais_hybrid' }}
                  style={styles.pdfIcon}
                />
                <TouchableOpacity onPress={() => Linking.openURL(userData.madicalValidityDocument)}>
                  <Text style={styles.downloadButton}>Download Medical Validity Document</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Image source={{ uri: userData.madicalValidityDocument }} style={styles.image} />
            )}

            {/* Display the Police Verification Document */}
            <Text><Text style={styles.bold}>Police Verification Document:</Text></Text>
            {userData.policeVarificationDocument.endsWith('.pdf') ? (
              <>
                <Image
                  source={{ uri: 'https://img.freepik.com/premium-vector/pdf-icon-flat-pdf-vector-icon-flat-design-vector-icon_874723-147.jpg?ga=GA1.1.568218271.1720937116&semt=ais_hybrid' }}
                  style={styles.pdfIcon}
                />
                <TouchableOpacity onPress={() => Linking.openURL(userData.policeVarificationDocument)}>
                  <Text style={styles.downloadButton}>Download Police Verification Document</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Image source={{ uri: userData.policeVarificationDocument }} style={styles.image} />
            )}

            {/* Display the Profile Picture */}
            <Text><Text style={styles.bold}>Profile Picture:</Text></Text>
            <Image source={{ uri: userData.profilePic }} style={styles.image} />
          </ScrollView>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
  },
  scannedDataContainer: {
    marginTop: 50,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    width: '90%',
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 10,
  },
  pdfIcon: {
    width: 80,
    height: 80,
    marginVertical: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  clearIcon: {
    top: 5,
    left: '90%',
    position: 'absolute',
  },
  errorText: {
    color: 'red',
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
  downloadButton: {
    color: 'blue',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});

export default DisplayDataPage;
