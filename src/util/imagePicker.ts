import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

export default async imageSource => {
	const pickImage = async permissions => {
		const { status } = await Permissions.askAsync(permissions);

		if (status !== 'granted') {
			console.log('No camera roll permissions');
		}

		return ImagePicker.launchCameraAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images, // ?? TODO: Assuming we never want video media types
			allowsEditing: true,
			aspect: [ 16, 9 ],
			quality: 1,
		});
	};

	const pickedImage = await pickImage(imageSource === 'gallery' ? Permissions.CAMERA_ROLL : Permissions.CAMERA);

	return pickedImage.cancelled ? null : pickedImage;
};
