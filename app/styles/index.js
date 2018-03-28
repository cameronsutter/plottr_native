import * as vars from './vars'
import { StyleSheet } from 'react-native'

export default AppStyles = {
  headerTitle: {
    color: vars.orange,
    fontSize: 24,
  },
  addButton: {
    color: vars.orange,
    paddingRight: 20,
  },
  deleteButtonContainer: {
    justifyContent: 'center',
    padding: 13,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: vars.grayBorder,
    backgroundColor: vars.grayBackground,
  },
  deleteButton: {
    fontSize: 16,
    color: vars.red,
    textAlign: 'center',
  },
  leftNavButton: {
    color: vars.orange,
    paddingLeft: 20,
  },
  containerView: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  listBackground: {
    backgroundColor: vars.dullBackground,
  },
  listItem: {
    borderColor: vars.grayBorder,
    borderBottomWidth: StyleSheet.hairlineWidth,
    backgroundColor: vars.white,
  },
  touchableItem: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  titleText: {
    fontSize: 16,
  },
  descriptionText: {
    fontSize: 12,
    color: vars.grayText,
  },
  detailsView: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: vars.dullBackground,
  },
  sectionHeader: {
    padding: 10,
    alignSelf: 'stretch',
    backgroundColor: vars.grayBackground,
  },
  sectionHeaderText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    fontSize: 16,
  },
  inputWrapper: {
    padding: 10,
    backgroundColor: vars.white,
  },
  greenSaved: {
    color: vars.green,
    paddingRight: 10,
    fontSize: 18,
  },
}
