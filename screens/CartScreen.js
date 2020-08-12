import React, { useEffect } from 'react';
//Redux
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, StyleSheet, Platform, Dimensions } from 'react-native';
//Action
import * as ProductActions from '../store/shop-actions';
//Colors
import Colors from '../constants/Colors';
import { TouchableOpacity, FlatList } from 'react-native-gesture-handler';
//Icon
import { MaterialCommunityIcons } from '@expo/vector-icons';
//component
import CartItem from '../components/Product/CartItem';
import NumberFormat from '../components/UI/NumberFormat';
//Text
import TextGeo from '../components/UI/TextGeo';

const { height } = Dimensions.get('window');

const CartScreen = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const carts = useSelector((state) => state.cart.cartItems);
  const cartItems = carts.items;
  const cartId = carts._id;
  let total = 0;
  carts.items.map((item) => (total += +item.item.price * +item.quantity));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            props.navigation.goBack();
          }}
          style={{ paddingBottom: 8 }}
        >
          <MaterialCommunityIcons name='close' size={25} color='#fff' />
        </TouchableOpacity>
        <TextGeo style={styles.titleHeader}>
          Giỏ Hàng{' '}
          {Object.keys(user).length === 0
            ? ''
            : carts.items.length === 0
            ? ''
            : `(${carts.items.length})`}
        </TextGeo>
        <View style={{ width: 15 }} />
      </View>
      <View style={styles.footer}>
        {Object.keys(user).length === 0 ? (
          <View style={styles.center}>
            <TextGeo style={{ fontSize: 16 }}>
              Bạn cần đăng nhập để xem giỏ hàng!
            </TextGeo>
            <View
              style={{
                borderWidth: 1,
                paddingHorizontal: 15,
                paddingVertical: 5,
                borderColor: Colors.lighter_green,
                borderRadius: 5,
              }}
            >
              <TouchableOpacity
                onPress={() => props.navigation.navigate('SignUp')}
              >
                <TextGeo style={{ fontSize: 16, color: Colors.lighter_green }}>
                  Tiếp tục
                </TextGeo>
              </TouchableOpacity>
            </View>
          </View>
        ) : carts.items.length === 0 ? (
          <View style={styles.center}>
            <TextGeo style={{ fontSize: 16 }}>
              Chưa có sản phẩm nào trong giỏ hàng
            </TextGeo>
          </View>
        ) : (
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.item._id}
            renderItem={({ item }) => {
              return (
                <CartItem
                  item={item}
                  onRemove={() => {
                    dispatch(
                      ProductActions.removeFromCart(carts._id, item.item._id)
                    );
                  }}
                  onAdd={() => {
                    dispatch(ProductActions.addToCart(item.item, user.token));
                  }}
                  onDes={() => {
                    dispatch(
                      ProductActions.decCartQuantity(carts._id, item.item._id)
                    );
                  }}
                />
              );
            }}
          />
        )}
      </View>
      {Object.keys(user).length === 0 ? (
        <></>
      ) : carts.items.length === 0 ? (
        <View />
      ) : (
        <View style={styles.total}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text style={{ fontSize: 14, fontWeight: '500' }}>Thành tiền</Text>
            <NumberFormat price={total.toString()} style={{ fontSize: 14 }} />
          </View>
          <View style={styles.btn}>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('PreOrderScreen', {
                  cartItems,
                  total,
                  cartId,
                });
              }}
            >
              <TextGeo style={{ color: '#fff', fontSize: 16 }}>
                Tiến hành đặt hàng
              </TextGeo>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    width: '100%',
    backgroundColor: Colors.lighter_green,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: Platform.OS === 'android' ? 70 : height < 668 ? 70 : 90,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  titleHeader: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 20,
  },
  footer: {
    flex: 1,
  },
  total: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  btn: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.red,
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  price: {
    color: 'red',
    fontSize: 16,
  },
});
export default CartScreen;
