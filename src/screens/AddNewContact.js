import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/AntDesign';
import {openDatabase} from 'react-native-sqlite-storage';
import {useNavigation} from '@react-navigation/native';

let db = openDatabase({name: 'ContactDatabase2.db'});

const AddNewContact = () => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [landline, setLandline] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [isFavourite, setIsFavourite] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    db.transaction(txn => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='table_contact'",
        [],
        (tx, res) => {
          // console.log('database no :', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS table_contact', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_contact(contact_id INTEGER PRIMARY KEY AUTOINCREMENT, contact_name VARCHAR(20), contact_mobile INT(10), contact_landline INT(10), contact_photo VARCHAR(255), contact_isFavourite BOOLEAN)',
              [],
            );
          }
        },
      );
    });
  }, []);

  const saveData = () => {
    db.transaction(txn => {
      txn.executeSql(
        'INSERT INTO table_contact (contact_name, contact_mobile, contact_landline, contact_photo, contact_isFavourite) VALUES (?,?,?,?,?)',
        [name, mobile, landline, profilePhoto, isFavourite],
        (tex, res) => {
          if (res.rowsAffected == 1) {
            ToastAndroid.show('Saved',ToastAndroid.SHORT)
            navigation.goBack();
          } else {
            console.log('saveData res '+res);
          }
        },
        error => {
          console.log(error);
        },
      );
    });
  };

  const selectImage = () => {
    let options = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      includeBase64: true,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('Cancelled profilePhoto upload');
        return;
      } else if (response.error) {
        console.log(response.error);
        return;
      }
      // console.log('Image', response.assets[0]);
      setProfilePhoto(response.assets[0]);
    });

    // launchCamera(options, response => {
    //   setProfilePhoto(response.assets[0])
    // })
  };

  return (
    <View style={{flex: 1}}>
      <View style={{marginTop: 50}}>

        <View style={{marginLeft:45 ,flexDirection:'row'}}>
          <Text style={{fontSize: 30, color: 'black'}}>
            New Contact
          </Text>
          <TouchableOpacity 
            style={{marginLeft:90}}
            onPress={()=>{setIsFavourite(!isFavourite)}} >
            {
              isFavourite 
              ? <Icon2 name="star" size={35} color="black" />
              : <Icon2 name="staro" size={35} color="black" />
            }
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.profilePhotoUploadButton}
          onPress={selectImage}>
          {profilePhoto ? (
            <Image
              style={{width: 80, height: 80, borderRadius: 40}}
              source={{
                uri: `data:${profilePhoto.type};base64,${profilePhoto.base64}`,
              }}
            />
          ) : (
            <Icon name="camera" size={30} color="black" />
          )}
        </TouchableOpacity>

        <TextInput
          placeholder="Enter Name"
          value={name}
          onChangeText={val => setName(val)}
          style={styles.textInput}
        />
        <TextInput
          placeholder="Enter Mobile"
          value={mobile}
          onChangeText={val => setMobile(val)}
          style={styles.textInput}
          keyboardType="number-pad"
        />
        <TextInput
          placeholder="Enter Landline"
          value={landline}
          onChangeText={val => setLandline(val)}
          style={styles.textInput}
          keyboardType="number-pad"
        />
        <TouchableOpacity style={styles.saveButton} onPress={saveData}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    width: '80%',
    height: 50,
    // borderWidth: 1.5,
    backgroundColor: 'white',
    // borderColor: 'blue',
    alignSelf: 'center',
    marginTop: 40,
    borderRadius: 10,
    paddingLeft: 20,
    shadowColor: 'black',
    elevation: 5,
  },
  saveButton: {
    width: 150,
    height: 50,
    backgroundColor: 'white',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    borderRadius: 10,
    shadowColor: 'black',
    elevation: 5,
  },
  saveButtonText: {
    color: 'blue',
    fontSize: 16,
  },
  profilePhotoUploadButton: {
    width: 80,
    height: 80,
    backgroundColor: 'white',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    borderRadius: 50,
    // borderColor: 'black',
    // borderWidth: 1.5,
    shadowColor: 'black',
    elevation: 6,
  },
});

export default AddNewContact;
