import React, { useState } from 'react';
import { useNavigation } from 'react-navigation-hooks';
import {
	Alert,
	ScrollView,
	Text,
	View,
} from 'react-native';
import { Checkbox } from 'react-native-paper';
import {
	FormImageInput,
	FormTextInput,
	Header,
	LinkButton,
	SpacerInline,
	Title,
} from '@elements';
import useGlobal from '@state';
import * as colors from '@util/colors';
import styles from './ProfileScreen.styles';


export default () => {
	const { navigate } = useNavigation();
	const [ _state, actions ] = useGlobal() as any;
	const { register } = actions;


	const [ city, setCity ] = useState('');
	const [ email, setEmail ] = useState('');
	const [ image, setImage ] = useState();
	const [ license, setLicense ] = useState('');
	const [ organizationName, setOrganizationName ] = useState('');
	const [ password, setPassword ] = useState('');
	const [ street, setStreet ] = useState('');
	const [ state, _setState ] = useState('WA');
	const [ termsOfService, setTermsOfService ] = useState(false);
	const [ zip, setZip ] = useState();

	const toggleTermsOfService = () => setTermsOfService(!termsOfService);

	const validateAndSubmit = async () => {
		if (organizationName === '') { Alert.alert("Please add your organization's name."); return; }
		if (!email.includes('@') || !email.includes('.')) { Alert.alert('Please enter a valid email address.'); return; }
		if (password.length < 8) { Alert.alert('Please enter a password at least 8 characters long.'); return; }
		if (license.length !== 9) { Alert.alert('Please enter your 9-digit UBI with no spaces or dashes.'); return; }
		if (!image) { Alert.alert('Please add an image of your business license to continue.'); return; }
		if (!street || street.split(' ').length < 3) { Alert.alert('Please enter your street number and name.'); return; }
		if (!city) { Alert.alert('Please enter your city.'); return; }
		if (zip.toString().length !== 5) { Alert.alert('Please enter your 5-digit zip code.'); return; }
		if (!termsOfService) { Alert.alert('Please read and accept the terms of service to complete your registration.'); return; }

		const statusCode = await register({
			organizationName, email, password, license, street, city, state, zip, termsOfService,
		});
		switch (statusCode) {
			case (201 || 202): Alert.alert('Registration complete! Please log in to continue.'); navigate('LoginScreen', { email, password }); return;
			case 406: Alert.alert('Error: not accepted'); return;
			case 500: Alert.alert('Internal server error, please try again later.'); return;
			default: Alert.alert("Sorry, that didn't work, please try again later."); console.log(statusCode);
		}
	};


	return (
		<ScrollView contentContainerStyle={styles.outerContainer}>
			<View>
				<Header showMenu={false} />
				<Title text="Registration." />
				<Text style={styles.text}>
					Please add your business's details below.  You will be able to update them once registration is complete.
				</Text>
				<FormTextInput
					text="Organization Name"
					value={organizationName}
					setValue={setOrganizationName}
				/>

				<FormTextInput
					text="Email Address"
					value={email}
					setValue={setEmail}
				/>

				<FormTextInput
					text="Password"
					value={password}
					setValue={setPassword}
				/>

				<FormTextInput
					text="WA State UBI (Business License No.)"
					value={license}
					setValue={setLicense}
				/>

				<FormImageInput
					text="Business License Verification"
					image={image}
					setImage={setImage}
				/>

				<FormTextInput
					text="Street Address"
					value={street}
					setValue={setStreet}
					autoCapitalize="words"
				/>

				<View style={styles.row}>
					<FormTextInput
						text="City"
						value={city}
						setValue={setCity}
						width="40%"
						autoCapitalize="words"
					/>
					<FormTextInput
						text="State"
						value={state}
						setValue={() => { }}
						width="15%"
						autoCapitalize="words"
					/>
					<FormTextInput
						text="Zip"
						value={zip}
						setValue={setZip}
						width="35%"
						autoCapitalize="words"
					/>
				</View>

				<View style={styles.checkboxRow}>
					<View style={styles.checkBox}>
						<Checkbox
							status={termsOfService ? 'checked' : 'unchecked'}
							onPress={toggleTermsOfService}
							color={colors.NAVY_BLUE}
							uncheckedColor="white"
						/>
					</View>
					<SpacerInline width={10} />
					<Text
						style={styles.text}
						onPress={toggleTermsOfService}
					>
						Accept
					</Text>
					<SpacerInline width={10} />
					<View style={{ top: 11 }}>
						<LinkButton
							text="Terms of Service"
							destination="TermsScreen"
						/>
					</View>
				</View>
			</View>


			<View>
				<SpacerInline height={15} />
				<LinkButton
					text="Register"
					onPress={validateAndSubmit}
				/>
				<SpacerInline height={40} />
			</View>
		</ScrollView>
	);
};

