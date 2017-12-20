import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  SectionList,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'

export default class TagDetails extends Component {
  renderName = ({index, item}) => {
    return <View style={styles.name}><TextInput multiline={true} defaultValue={item}/></View>
  }

  renderColor = ({index, item}) => {
    return <View style={styles.description}><TextInput multiline={true} defaultValue={item}/></View>
  }

  render () {
    return <View style={styles.container}>
      <SectionList
        sections={[
          {data: [this.props.title || ''], title: 'Name', renderItem: this.renderName, renderSectionHeader: this.renderTitleHeader},
          {data: [this.props.color || ''], title: 'Description', renderItem: this.renderColor, renderSectionHeader: this.renderContentHeader},
        ]}
        renderSectionHeader={({section}) => <View style={styles.sectionHeader}><Text style={styles.sectionHeaderText}>{section.title}</Text></View>}
      />
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  name: {
    padding: 10,
  },
  description: {
    padding: 10,
  },
  notes: {
    padding: 10,
  },
  sectionHeader: {
    padding: 10,
    alignSelf: 'stretch',
    backgroundColor: '#ddd',
    marginBottom: 5,
  },
  sectionHeaderText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
})
