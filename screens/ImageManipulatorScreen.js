import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, Text, View, Image } from 'react-native';
import { Asset, ImageManipulator } from 'expo';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../constants/Colors';

export default class ImageManipulatorScreen extends React.Component {
  static navigationOptions = {
    title: 'ImageManipulator',
  };

  state = {
    ready: false,
    image: null,
    original: null,
  };

  componentWillMount() {
    (async () => {
      const image = Asset.fromModule(require('../assets/images/example2.jpg'));
      await image.downloadAsync();
      this.setState({
        ready: true,
        image,
        original: image,
      });
    })();
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={{ padding: 10 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <Button style={styles.button} onPress={() => this._rotate(90)}>
              <Ionicons name="ios-refresh-outline" size={16} color="#ffffff" /> 90
            </Button>
            <Button style={styles.button} onPress={() => this._rotate(45)}>
              45
            </Button>
            <Button style={styles.button} onPress={() => this._rotate(-90)}>
              -90
            </Button>
            <Button style={styles.button} onPress={() => this._flip({ horizontal: true })}>
              Flip horizontal
            </Button>
            <Button style={styles.button} onPress={() => this._flip({ vertical: true })}>
              Flip vertical
            </Button>
            <Button style={styles.button} onPress={() => this._resize({ width: 250 })}>
              Resize width
            </Button>
            <Button style={styles.button} onPress={() => this._resize({ width: 300, height: 300 })}>
              Resize both to square
            </Button>
            <Button style={styles.button} onPress={() => this._compress(0.1)}>
              90% compression
            </Button>
            <Button style={styles.button} onPress={this._crop}>
              Crop - half image
            </Button>
            <Button style={styles.button} onPress={this._combo}>
              Cccombo
            </Button>
            <Button style={styles.button} onPress={this._reset}>
              Reset
            </Button>
          </View>

          {this.state.ready && this._renderImage()}
        </View>
      </ScrollView>
    );
  }

  _renderImage = () => {
    return (
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: this.state.image.localUri || this.state.image.uri }}
          style={styles.image}
        />
      </View>
    );
  };

  _rotate = async deg => {
    await this._manipulate([{ rotate: deg }]);
  };

  _resize = async size => {
    await this._manipulate([{ resize: size }]);
  };

  _flip = async options => {
    await this._manipulate([{ flip: options }]);
  };

  _compress = async value => {
    await this._manipulate([], { compress: 0.1 });
  };

  _crop = async () => {
    await this._manipulate([
      {
        crop: {
          originX: 0,
          originY: 0,
          width: this.state.original.width / 2,
          height: this.state.original.height,
        },
      },
    ]);
  };

  _combo = async () => {
    await this._manipulate([
      { rotate: 180 },
      { flip: { vertical: true } },
      {
        crop: {
          originX: this.state.original.width / 4,
          originY: this.state.original.height / 4,
          width: 300,
          height: 300,
        },
      },
    ]);
  };

  _reset = () => {
    this.setState({ image: this.state.original });
  };

  _manipulate = async (actions, saveOptions) => {
    const manipResult = await ImageManipulator.manipulate(
      this.state.image.localUri || this.state.image.uri,
      actions,
      saveOptions
    );
    this.setState({ image: manipResult });
  };
}

function Button(props) {
  return (
    <TouchableOpacity onPress={props.onPress} style={[styles.button, props.style]}>
      <Text style={styles.buttonText}>{props.children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  button: {
    padding: 8,
    borderRadius: 3,
    backgroundColor: Colors.tintColor,
    marginRight: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
  },
});
