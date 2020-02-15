import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

export default async imageSource => {
	const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
	if (status !== 'granted') {
		console.log('No camera roll permissions');
	}

	const pickGalleryImage = await ImagePicker.launchImageLibraryAsync({
		mediaTypes: ImagePicker.MediaTypeOptions.All, // ?? TODO: restrict only to images
		allowsEditing: true,
		aspect: [ 16, 9 ],
		quality: 1,
	});

	const pickCameraImage = await ImagePicker.launchCameraAsync({
		mediaTypes: ImagePicker.MediaTypeOptions.Images,
		allowsEditing: true,
		aspect: [ 16, 9 ],
		quality: 1,
	});


	const pickImage = () => (imageSource === 'gallery' ? pickGalleryImage : pickCameraImage);
	const pickedImage = await pickImage();

	return pickedImage.cancelled ? null : pickedImage;
};
