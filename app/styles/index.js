import * as vars from './vars'

export default AppStyles = {
  headerTitle: {
    color: vars.orange,
    fontSize: 24,
  },
  addButton: {
    color: vars.orange,
    paddingRight: 20,
  },
  containerView: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  listItem: {
    borderColor: vars.grayBorder,
    borderBottomWidth: 1,
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
    backgroundColor: vars.white,
  },
  sectionHeader: {
    padding: 10,
    alignSelf: 'stretch',
    backgroundColor: vars.grayBackground,
    marginBottom: 5,
  },
  sectionHeaderText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    fontSize: 15,
  },
  inputWrapper: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
  },
  greenSaved: {
    color: vars.green,
    paddingRight: 10,
    fontSize: 18,
  },
}
