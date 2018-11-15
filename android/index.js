import React from 'react';
import {AppRegistry, StyleSheet, Text, View, TextInput, TouchableHighlight, NativeModules} from 'react-native';

class HelloWorld extends React.Component {
  constructor (props) {
    super(props)
    NativeModules.Document.setDocumentData(this.props.url, this.props.data)
    this.state = {
      text: props.data,
    }
  }

  saveText = () => {
    NativeModules.Document.saveDocument(this.state.text)
  }

  render () {
    return <View style={styles.container}>
      <TouchableHighlight style={styles.button} onPress={this.saveText}>
        <Text style={styles.hello}>Save!</Text>
      </TouchableHighlight>
      <TextInput style={styles.hello}
        onChangeText={(text) => this.setState({text})}
        multiline={true}
        defaultValue={this.props.data} />
    </View>
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  hello: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: 'black',
  },
  button: {
    backgroundColor: 'orange',
  }
})

AppRegistry.registerComponent('MyReactNativeApp', () => HelloWorld);
