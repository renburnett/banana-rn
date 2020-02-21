import React from 'react';
import {
	View,
	TextInput,
	StyleProp,
	TextStyle,
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import {
	InputLabel,
	Icon,
} from '@elements';
import * as ImageSourcer from '@util/ImageSourcer';
import { useActionSheet } from '@expo/react-native-action-sheet';
import styles from './FormImageInput.styles';

interface FormTextInputProps {
	text: string;
	image: any;
	setImage: Function;
	width?: number | string;
	autoCapitalize?: 'words' | 'sentences' | 'none' | 'characters';
	inline?: boolean;
	upperCase?: boolean;
	editable?: boolean;
	style?: StyleProp<TextStyle>;
}

export default ({
	text,
	image,
	setImage,
	width = '100%',
	autoCapitalize = 'none',
	inline = false,
	upperCase = true,
	editable = false,
	style,
}: FormTextInputProps) => {
	const { showActionSheetWithOptions } = useActionSheet();

	/**
	 * Shows the image source action sheet and sets the image to the image selected
	 * by the user.
	 */
	const handleImageInputPress = () => showActionSheetWithOptions({
		options: [ 'Choose from library', 'Take image with camera', 'Cancel' ],
		cancelButtonIndex: 2,
		destructiveButtonIndex: -1,
	},
	async buttonIndex => {
		let imageSource;

		switch (buttonIndex) {
			case 0:
				imageSource = ImageSourcer.LOCAL_STORAGE;
				break;
			case 1:
				imageSource = ImageSourcer.CAMERA;
				break;
			case 2:
				console.log('Image input canceled');
				break;
			default:
				break;
		}

		setImage(await ImageSourcer.sourceImage(imageSource));
	});

	return (
		<View style={inline ? styles.inlineContainer : { ...styles.container, width }}>
			<InputLabel text={text} upperCase={upperCase} />
			<View style={styles.row}>
				<View style={{ flex: 4 }}>
					<TextInput
						value={image?.uri}
						style={inline ? [
							styles.input,
							editable && styles['input--editable'],
							style,
							{ textAlign: 'right' },
						] : [
							styles.input,
							editable && styles['input--editable'],
							style,
							{ textAlign: 'right' },
						]}
						autoCapitalize={autoCapitalize}
						editable={editable}
					/>
				</View>

				<TouchableWithoutFeedback
					onPress={handleImageInputPress}
				>
					<Icon name="image" style={styles.icon} />
				</TouchableWithoutFeedback>
			</View>
		</View>
	);
};

