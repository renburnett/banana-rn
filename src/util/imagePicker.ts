import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

// TODO: add take picture functionality, abstract this out to a util or state.  See https://docs.expo.io/versions/latest/sdk/imagepicker/#imagepickerlaunchcameraasyncoptions
export default async () => {
	const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
	if (status !== 'granted') {
		console.log('No camera roll permissions');
	}
	const pickedImage = await ImagePicker.launchImageLibraryAsync({
		mediaTypes: ImagePicker.MediaTypeOptions.All,
		allowsEditing: true,
		aspect: [ 16, 9 ],
		quality: 1,
	});

	return pickedImage.cancelled ? null : pickedImage;
};
