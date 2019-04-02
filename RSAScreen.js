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
      d: null,
      input: '',
      plain: '',
      cipher: '',
      publicKey: '',
      privateKey: ''
    };

    this.checkIsPrime = this.checkIsPrime.bind(this);
    this.generateKey = this.generateKey.bind(this);
    this.gcd = this.gcd.bind(this);
    this.powerModulo = this.powerModulo.bind(this);
    this.encrypt = this.encrypt.bind(this);
    this.decrypt = this.decrypt.bind(this);
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

  powerModulo(x, n, m) {
    // Tính: y = x ^ n mod m
    var y = 1;
    var power = x % m;
    while (n > 0) {
      var b = n & 1;
      n = n >> 1;
      if (b == 1) {
        y = (y * power) % m;
      }
      power = (power * power) % m;
    }

    return y;
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
      // bước 3: Chọn e sao cho 1 < e < Euler(n) và gcd(e, Euler(n)) = 1
      let e = 2;
      console.log('n = ', n)
      console.log('Euler = ', EulerN)
      if (this.state.e && this.gcd(this.state.e, EulerN) == 1) {
        e = this.state.e;
      } else {
        do {
          e = Math.floor(Math.random() * n) + 2;
        } while (this.gcd(e, EulerN) != 1);
      }
      console.log('e = ', e)
      // bước 4: tính d sao cho gcd(e * d, Euler(n)) = 1, 1 < d < Euler(n)
      let d = 2;
      do {
        d = Math.floor(Math.random() * n) + 2;
      } while ((e * d - 1) % EulerN != 0)
      console.log('d = ', d)

      this.setState({
        e: e,
        d: d,
        publicKey: '(' + e + ', ' + n + ')',
        privateKey: '(' + d + ', ' + n + ')',
      });
    } catch (ex) {
      console.log(ex)
    }
  }

  encrypt() {
    let e = this.state.e;
    let d = this.state.d;
    let n = this.state.q * this.state.p;
    // bước 5: tìm cipher text
    let plainTextArr = this.state.input.split('');
    console.log(plainTextArr)
    let cipherText = plainTextArr.reduce((accumulator, currentVal) => {
      let M = currentVal.charCodeAt(0);
      let Cipher = this.powerModulo(M, e, n);
      console.log(M, Cipher, String.fromCharCode(Cipher))
      // accumulator += String.fromCharCode(Cipher);
      accumulator += '' + Cipher + ' ';
      return accumulator;
    }, '');
    console.log(cipherText);
    this.setState({
      cipher: cipherText,
      plain: ''
    });
  }

  decrypt() {
    let e = this.state.e;
    let d = this.state.d;
    let n = this.state.q * this.state.p;
    // bước 5: tìm cipher text
    let cipherTextArr = this.state.input.split(' ');
    console.log(cipherTextArr)
    let plainText = cipherTextArr.reduce((accumulator, currentVal) => {
      let C = parseInt(currentVal);
      let plain = this.powerModulo(C, d, n);
      console.log('decrypt', this.powerModulo(C, d, n))
      // accumulator += String.fromCharCode(Cipher);
      accumulator += '' + String.fromCharCode(plain);
      return accumulator;
    }, '');
    console.log(plainText);
    this.setState({
      cipher: '',
      plain: plainText
    });
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
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
        <View style={styles.result}>
          <Text style={styles.textResult}>Public Key: {this.state.publicKey}</Text>
          <Text style={styles.textResult}>Private Key: {this.state.privateKey}</Text>
        </View>
        <Text style={styles.instructions}>
          Nhập plaintext
        </Text>
        <TextInput onChangeText={(text) => { this.setState({ input: text }) }} style={styles.textInput} ></TextInput>
        <View style={styles.buttonGroup}>
          <Button onPress={this.encrypt} title="Encrypt"></Button>
          <Button onPress={this.decrypt} title="Decrypt"></Button>
        </View>
        <View style={styles.result}>
          <Text style={styles.textResult}>{this.state.cipher ? 'Cipher' : 'Plain'} Text: {this.state.cipher ? this.state.cipher : this.state.plain}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  result: {
    borderRadius: 4,
    borderWidth: 2.5,
    borderColor: '#d6d7da',
    marginTop: 10,
    width: '95%',
    marginLeft: 10,
    marginRight: 10,
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 10
  },
  textResult: {
    fontSize: 20
  },
  buttonGroup: {
    width: '50%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  }
});
