import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {openDatabase} from 'react-native-sqlite-storage';

let db = openDatabase({name: 'ContactDatabase2.db'});

const FavouriteContacts = () => {
  const [contactList, setContactList] = useState([]);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    getAllContactsList();
  }, [isFocused]);

  const getAllContactsList = () => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * FROM table_contact WHERE contact_isFavourite=1',
        [],
        (tex, res) => {
          console.log('res.length-' + res.rows.length);
          let temp = [];
          for (let i = 0; i < res.rows.length; ++i) {
            console.log(res.rows.item(i));
            temp.push(res.rows.item(i));
          }
          setContactList(temp);
        },
      );
    });
  };
  return (
    <View>
      <View>
        <FlatList
          // data={contactList}
          data={contactList.sort((a, b) => a.contact_name.localeCompare(b.contact_name))}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity style={styles.contactListItem}>
                <Text style={styles.contactListItemText}>
                  {item.contact_name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contactListItem: {
    width: '100%',
    padding: 10,
    height: 60,
    paddingLeft: 50,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactListItemText: {
    fontSize: 20,
    color: 'black',
    marginTop: 5,
  },
});

export default FavouriteContacts;
