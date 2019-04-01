import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, TextInput } from 'react-native';

export default class RSAScreen extends React.Component {
  static navigationOptions = {
    title: 'RSA'
  };

  constructor(props) {
    super(props);
    this.state = {
      p: null,
      q: null,
      e: null,
      plain: '',
      cipher: '',
      publicKey: 'Public'
    };

    this.checkIsPrime = this.checkIsPrime.bind(this);
    this.generateKey = this.generateKey.bind(this);
    this.gcd = this.gcd.bind(this);
  }

  checkIsPrime(num) {
    let i = 2;
    for (; i * i < num && num % i != 0; i++);
    if (i * i > num) {
      return true;
    }
    return false;
  }

  gcd(num1, num2) {
    while (num2 > 0 && num1 % num2 != 0) {
      let temp = num2;
      num2 = num1 % num2;
      num1 = temp;
    }
    return num2;
  }

  generateKey() {
    try {
      if (!this.checkIsPrime(this.state.q) && !this.checkIsPrime(this.state.p)) {
        throw new Error('Not a prime!');
      }
      // bước 1: tính tích n = p * q
      const n = this.state.p * this.state.q;
      // bước 2: tính giá trị hàm Euler của n
      const EulerN = (this.state.p - 1) * (this.state.q - 1);
      //bước 3: Chọn e sao cho 1 < e < Euler(n) và gcd(e, Euler(n)) = 1
      let e = 2;
      console.log('n = ', n)
      console.log('Euler = ', EulerN)
      do {
        e = Math.floor(Math.random() * n) + 2;
      } while (this.gcd(e, EulerN) != 1);
      console.log('e = ', e)
      // //bước 4: tính d sao cho gcd(e * d, Euler(n)) = 1, 1 < d < Euler(n)
      let d = 2;
      do {
        d = Math.floor(Math.random() * n) + 2;
      } while ((e * d - 1) % n != 0)
      console.log('d = ', d)
      this.setState({
        publicKey: '(' + e + ', ' + d + ')'
      })
    } catch (ex) {
      console.log(ex)
    }
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>RSA</Text>
        <Text style={styles.instructions}>
          Nhập plaintext
        </Text>
        <TextInput onChangeText={(text) => { this.setState({ plain: text }) }} style={styles.textInput} ></TextInput>
        <Text style={styles.instructions}>
          Nhập p
        </Text>
        <TextInput onChangeText={(text) => { this.setState({ p: text }) }} style={styles.textInput} ></TextInput>
        <Text style={styles.instructions}>
          Nhập q
        </Text>
        <TextInput onChangeText={(text) => { this.setState({ q: text }) }} style={styles.textInput} ></TextInput>
        <Text style={styles.instructions}>
          Nhập e
        </Text>
        <TextInput onChangeText={(text) => { this.setState({ e: text }) }} style={styles.textInput} ></TextInput>
        <Button onPress={this.generateKey} title="Generate Key"></Button>
        <Text>{this.state.publicKey}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 25,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    width: '100%',
    textAlign: 'left',
    color: '#333333',
    marginLeft: 10
  },
  button: {
    width: '95%',
    marginBottom: 10
  },
  textInput: {
    width: '100%',
    marginLeft: 10
  }
});
