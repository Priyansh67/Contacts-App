import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Image,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {openDatabase} from 'react-native-sqlite-storage';

import Icon from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import {TextInput} from 'react-native-gesture-handler';

let db = openDatabase({name: 'ContactDatabase2.db'});

const AllContacts = () => {
  const [contactList, setContactList] = useState([]);

  const [searchText, setSearchText] = useState('');

  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (searchText === '') getAllContactsList();
  }, [isFocused, contactList]);

  const getAllContactsList = () => {
    db.transaction(txn => {
      txn.executeSql('SELECT * FROM table_contact', [], (tex, res) => {
        // console.log('res.length-' + res.rows.length);
        let temp = [];
        for (let i = 0; i < res.rows.length; ++i) {
          // console.log(res.rows.item(i).contact_photo.uri);
          // console.log(res.rows.item(i));
          temp.push(res.rows.item(i));
        }
        setContactList(temp);
      });
    });
  };

  const deleteContact = id => {
    db.transaction(txn => {
      txn.executeSql(
        'DELETE FROM  table_contact where contact_id=?',
        [id],
        (tex, res) => {
          if (res.rowsAffected == 1) {
            ToastAndroid.show('Deleted', ToastAndroid.SHORT);
            getAllContactsList();
          } else {
            console.log('saveData res ' + res);
          }
        },
      );
    });
  };

  const searchContact = text => {
    setSearchText(text);
    const tempContacts = contactList.filter(item => {
      const name = item.contact_name.toLowerCase();
      return name.includes(text.toLowerCase());
    });
    setContactList(tempContacts);
  };

  return (
    <View>
      <View style={{backgroundColor: 'white'}}>
        <TextInput
          style={styles.searchInputBox}
          placeholder="Search contacts"
          value={searchText}
          clearButtonMode="always"
          onChangeText={text => searchContact(text)}
        />
      </View>
      <View>
        <FlatList
          // data={contactList}
          data={contactList.sort((a, b) =>
            a.contact_name.localeCompare(b.contact_name),
          )}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity style={styles.contactListItem}>
                <Image
                  style={styles.profileImage}
                  source={{
                    uri: item.contact_photo,
                    // uri: `data:${item.contact_photo.type};base64,${item.contact_photo.base64}`,
                  }}
                />
                <Text style={styles.contactListItemName}>
                  {item.contact_name}
                </Text>
                <View style={styles.showButtons}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('EditContact', {
                        data: {
                          id: item.contact_id,
                          name: item.contact_name,
                          mobile: item.contact_mobile,
                          landline: item.contact_landline,
                          profilePhoto: item.contact_photo,
                          isFavourite: item.contact_isFavourite,
                        },
                      });
                    }}>
                    <Icon name="edit" size={35} color="blue" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert(
                        'Delete contact?',
                        'This contact will be permanently deleted from your device',
                        [
                          {
                            text: 'Cancel',
                          },
                          {
                            text: 'Delete',
                            onPress: () => deleteContact(item.contact_id),
                          },
                        ],
                        {cancelable: true},
                      );
                      // deleteContact(item.contact_id);
                    }}>
                    <Icon2 name="delete" size={35} color="red" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <TouchableOpacity
        style={styles.addContactButton}
        onPress={() => {
          navigation.navigate('AddNewContact');
        }}>
        <Text style={styles.addContactButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchInputBox: {
    marginLeft: 40,
    marginRight: 20,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
  },
  addContactButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    position: 'absolute',
    top: 590,
    right: 35,
    height: 60,
    backgroundColor: 'white',
    shadowColor: 'black',
    elevation: 9,
    borderRadius: 100,
  },
  addContactButtonText: {
    fontSize: 33,
    color: 'blue',
  },
  contactListItem: {
    width: '100%',
    padding: 10,
    height: 60,
    paddingLeft: 50,
    backgroundColor: 'white',
    flexDirection: 'row',
    // justifyContent: 'space-between',
  },
  contactListItemName: {
    fontSize: 20,
    color: 'black',
    marginTop: 5,
    marginLeft: 30,
  },
  showButtons: {
    flexDirection: 'row',
    width: '30%',
    height: 40,
    marginLeft: 70,
    justifyContent: 'space-between',
    position:'absolute',
    marginTop:10,
    marginLeft:270,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 0,
    paddingRight: 0,
  },
});

export default AllContacts;
