import 'react-native-gesture-handler';
import {
  DrawerActions,
  NavigationContainer,
  useNavigation,
} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';

import React from 'react';
import AllContacts from '../screens/AllContacts';
import FavouriteContacts from '../screens/FavouriteContacts';
import AddNewContact from '../screens/AddNewContact';
import Icon from 'react-native-vector-icons/Ionicons';
import EditContact from '../screens/EditContact';

const StackNav = () => {
  const Stack = createStackNavigator();
  const navigation = useNavigation();

  return (
    <Stack.Navigator
      initialRouteName="Contacts"
      screenOptions={{
        headerLeft: () => {
          return (
            <Icon
              name="menu-outline"
              size={30}
              color="#000"
              style={{marginLeft:15}}
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            />
          );
        },
      }}>
      <Stack.Screen
        name="AllContacts"
        component={AllContacts}
        options={{
          title: 'Contacts List',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="AddNewContact"
        component={AddNewContact}
        options={{
          title: 'Add New Contact',
          headerTitleAlign: 'center',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EditContact"
        component={EditContact}
        options={{
          title: 'Add New Contact',
          headerTitleAlign: 'center',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

const DrawerNav = () => {
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator screenOptions={{headerShown: false}}>
      <Drawer.Screen
        name="Contacts"
        component={StackNav}
        options={{
          headerTitleAlign: 'center',
        }}
      />
      <Drawer.Screen
        name="FavouriteContacts"
        component={FavouriteContacts}
        options={{
          title: 'Favourite Contacts',
          headerTitleAlign: 'center',
          headerShown: true,
        }}
      />
    </Drawer.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <DrawerNav/>
    </NavigationContainer>
  );
};

export default AppNavigator;
