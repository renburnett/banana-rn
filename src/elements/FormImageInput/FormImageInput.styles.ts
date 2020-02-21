import { StyleSheet } from 'react-native';
import * as colors from '@util/colors';

// TODO: create global style objects, atomic classes, or use SASS to reduce redundancy

export default StyleSheet.create({
	container: {
	},
	inlineContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 10,
	},
	text: {
		fontFamily: 'open-sans-regular',
		fontSize: 18,
		color: colors.NAVY_BLUE,
	},
	input: {
		height: 40,
		marginBottom: 14,
		backgroundColor: colors.LIGHT_GRAY_DISABLED,
		paddingHorizontal: 8,
		width: '100%',
	},
	'input--editable': {
		backgroundColor: colors.WHITE,
	},
	row: { // TODO: redundant with  RegistrationScreen style
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	icon: { // TODO: redundant with RegistrationScreen style
		fontSize: 24,
		color: colors.NAVY_BLUE,
	},
});
