import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

export type ImageSourceType = 'camera' | 'localStorage';
export const CAMERA = 'camera';
export const LOCAL_STORAGE = 'localStorage';


interface ImageSourceConfig {
	permissions: Array<Permissions.PermissionType>; // Device permissions required for an image source.
	launchImageSourcingMethod: Function; // Native launcher for the image source.
}

// All of the possible methods of retreiving an image from the device..
const IMAGE_SOURCE_METHODS: {[key in ImageSourceType]: ImageSourceConfig} = {
	camera: {
		// ?? If request for camera roll is too annoying, only request on required devices
		permissions: [ Permissions.CAMERA, Permissions.CAMERA_ROLL ],
		launchImageSourcingMethod: ImagePicker.launchCameraAsync,
	},
	localStorage: {
		permissions: [ Permissions.CAMERA_ROLL ],
		launchImageSourcingMethod: ImagePicker.launchImageLibraryAsync,
	},
};

// Generic options for images, no matter the image source
const IMAGE_OPTIONS: ImagePicker.ImagePickerOptions = {
	mediaTypes: ImagePicker.MediaTypeOptions.Images,
	allowsEditing: true,
	aspect: [ 16, 9 ],
	quality: 1,
};

export async function getImage(imageSource: ImageSourceType): Promise<ImagePicker.ImagePickerResult | null> {
	if (!Object.keys(IMAGE_SOURCE_METHODS).includes(imageSource)) {
		throw new Error(`Invalid image picking source: "${imageSource}".`);
	}

	let pickedImage = {} as ImagePicker.ImagePickerResult; // The user selected image.

	/**
	 * Requests device access permissions and launches the method of image acquisition.
	 * @param {ImageSourceConfig} {} Configuration for a specific method of image acquisition.
	 * @throws When access permission is denied or when an error occurs during the request.
	 */
	const getImageFromSource = async ({
		permissions,
		launchImageSourcingMethod,
	}: ImageSourceConfig): Promise<ImagePicker.ImagePickerResult> => {
		const permissionResponses = await Permissions.askAsync(...permissions);

		// Any unsuccessful permissions status will propogate to this 'status' property.
		if (permissionResponses.status !== 'granted') {
			throw new Error('Permission(s) not granted.');
		}

		return launchImageSourcingMethod(IMAGE_OPTIONS);
	};


	try {
		pickedImage = await getImageFromSource(IMAGE_SOURCE_METHODS[imageSource]);
	} catch (err) {
		// TODO: display alert with error message
	}

	return pickedImage?.cancelled ? null : pickedImage;
}
