import React, { useState } from 'react';
import { useNavigation } from 'react-navigation-hooks';
import {
	Alert,
	ScrollView,
	TextInput,
	View,
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import {
	FormImageInput,
	FormTextInput,
	Header,
	LinkButton,
	SpacerInline,
	Title,
	Icon,
	InputLabel,
} from '@elements';
import useGlobal from '@state';
import * as colors from '@util/colors';
import styles from './ProfileScreen.styles';


export default () => {
	const { navigate } = useNavigation();
	const [ _state, actions ] = useGlobal() as any;
	const { updateDonorOrClient } = actions;

	const [ editing, setEditing ] = useState(false);
	const { user } = _state;

	const [ hidePwd, setHidePwd ] = useState(true);
	const [ email, setEmail ] = useState(user.email);
	const [ licenseVerificationImage, setLicenseVerificationImage ] = useState();
	const [ licenseNumber, setLicenseNumber ] = useState(user.business_license);
	const [ organizationName, setOrganizationName ] = useState(user.organization_name);
	const [ password, setPassword ] = useState();
	const [ confirmPassword, setConfirmPassword ] = useState();
	const [ street, setStreet ] = useState(user.address_street);
	const [ city, setCity ] = useState(user.address_city);
	const [ state, setState ] = useState(user.address_state); // TODO: update state to US_State or something
	const [ zip, setZip ] = useState(user.address_zip.toString());
	const [ pickupLocation, setPickupLocation ] = useState(user.pickup_location);

	// TODO: only validate entries that have changed
	const validateAndSubmit = async () => {
		// TODO: redundant with alerts in registration screen
		if (organizationName === '') { Alert.alert("Please add your organization's name."); return; }
		if (!email.includes('@') || !email.includes('.')) { Alert.alert('Please enter a valid email address.'); return; }
		if (licenseNumber.length !== 9) { Alert.alert('Please enter your 9-digit UBI with no spaces or dashes.'); return; }
		if (!licenseVerificationImage) { Alert.alert('Please add an image of your business license to continue.'); return; }
		if (!street || street.split(' ').length < 3) { Alert.alert('Please enter your street number and name.'); return; }
		if (!city) { Alert.alert('Please enter your city.'); return; }
		if (zip.toString().length !== 5) { Alert.alert('Please enter your 5-digit zip code.'); return; }
		if (password !== confirmPassword) { Alert.alert('Passwords do not match.'); return; }
		if (password.length < 8) { Alert.alert('Please enter a password at least 8 characters long.'); return; }

		// TODO: Only provide the inputs that have changed
		const statusCode = await updateDonorOrClient({
			organizationName,
			email,
			password,
			city,
			state,
			zip,
			licenseNumber,
			pickupLocation,
		});

		switch (statusCode) {
			case (200 || 202): Alert.alert('Profile updated!'); setEditing(false); return;
			case 406: Alert.alert('Error: not accepted'); return;
			case 500: Alert.alert('Internal server error, please try again later.'); return;
			default: Alert.alert("Sorry, that didn't work, please try again later."); console.log(statusCode);
		}
	};

	return (
		<ScrollView contentContainerStyle={styles.outerContainer}>
			<View>
				{/* TODO: Change header height */}
				<Header showBackButton={false} />
				{/* <ProfileImage image={image} /> */}

				<FormTextInput
					text="Email"
					value={email}
					setValue={setEmail}
					disabled={!editing}
				/>

				<FormTextInput
					text="Business Name"
					value={organizationName}
					setValue={setOrganizationName}
					disabled={!editing}
				/>

				<FormImageInput
					text="Business License Verification"
					image={licenseVerificationImage}
					setImage={setLicenseVerificationImage}
					editable={editing}
				/>

				<FormTextInput
					text="Business License Number"
					value={licenseNumber}
					setValue={setLicenseNumber}
					disabled={!editing}
				/>

				<FormTextInput
					text="Business Address"
					value={street}
					setValue={setStreet}
					disabled={!editing}
				/>

				<View style={styles.row}>
					<FormTextInput
						text="City"
						value={city}
						setValue={setCity}
						width="40%"
						autoCapitalize="words"
						disabled={!editing}
					/>
					<FormTextInput
						text="State"
						value={state}
						setValue={setState}
						width="15%"
						autoCapitalize="words"
						disabled={!editing}
					/>
					<FormTextInput
						text="Zip"
						value={zip}
						setValue={setZip}
						width="35%"
						autoCapitalize="words"
						disabled={!editing}
					/>
				</View>
				<View>
					<FormTextInput
						text="Pickup Location"
						value={pickupLocation}
						setValue={setPickupLocation}
						width="100%"
						autoCapitalize="words"
						disabled={!editing}
					/>
				</View>

				{editing ? (
					<View>
						<InputLabel text="Password" />
						<View style={styles.passwordContainer}>
							<View style={{ flex: 8 }}>
								<TextInput
									textContentType="password"
									value={password}
									secureTextEntry={hidePwd}
									onChangeText={setPassword}
									style={[ styles.input, styles.iconPadding ]}
									autoCapitalize="none"
									autoCorrect={false}
								/>
							</View>
							<View style={styles.iconContainer}>
								<TouchableWithoutFeedback
									onPress={() => setHidePwd(!hidePwd)}
								>
									<Icon name={hidePwd ? 'lock' : 'unlock'} style={styles.icon} />
								</TouchableWithoutFeedback>
							</View>
						</View>
						<InputLabel text="Confirm Password" />
						<View style={styles.passwordContainer}>
							<View style={{ flex: 8 }}>
								<TextInput
									textContentType="password"
									value={confirmPassword}
									secureTextEntry={hidePwd}
									onChangeText={setConfirmPassword}
									style={[ styles.input, styles.iconPadding ]}
									autoCapitalize="none"
									autoCorrect={false}
								/>
							</View>
							<View style={styles.iconContainer}>
								<TouchableWithoutFeedback
									onPress={() => setHidePwd(!hidePwd)}
								>
									<Icon name={hidePwd ? 'lock' : 'unlock'} style={styles.icon} />
								</TouchableWithoutFeedback>
							</View>
						</View>
					</View>
				) : null}
			</View>

			<View>
				{/* TODO: Componentize-- used in both registration screen and profile screen */}
				<SpacerInline height={15} />
				<LinkButton
					text={editing ? 'Save' : 'Edit'}
					onPress={editing ? validateAndSubmit : () => setEditing(!editing)}
				/>
				<SpacerInline height={40} />
			</View>
		</ScrollView>
	);
};

