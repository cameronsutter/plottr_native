import * as vars from './vars'

export default DetailStyles = {
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
