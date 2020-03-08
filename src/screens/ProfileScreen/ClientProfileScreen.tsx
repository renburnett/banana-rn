import React, { useState } from 'react';
import { useNavigation } from 'react-navigation-hooks';
import {
	ScrollView,
	View,
	Text,
	Alert,
	TextInput,
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Checkbox } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import useGlobal from '@state';
import * as colors from '@util/colors';
import {
	Title,
	LinkButton,
	FormImageInput,
	FormTextInput,
	SpacerInline,
	Header,
	Icon,
	InputLabel,
} from '@elements';
import styles from './ProfileScreen.styles';

export default () => {
	const { navigate } = useNavigation();
	const [ _state, actions ] = useGlobal() as any;
	const { updateDonorOrClient } = actions;

	// TODO: Change to enum?
	const transportationMethods = [
		'Walk',
		'Bike',
		'Public',
		'Car',
	];

	const itemizeList = list => list.map(item => ({ label: item, value: item }));

	const ChevronDown = () => (
		<View style={styles.iconContainer}>
			<Icon
				name="chevron-down"
				style={styles.chevronIcon}
			/>
		</View>
	);

	const selectPlaceholder = {
		label: 'Select...',
		color: 'gray',
		value: null,
	};

	const [ editing, setEditing ] = useState(false);
	const { user } = _state;

	const [ hidePwd, setHidePwd ] = useState(true);
	const [ email, setEmail ] = useState(user.email);
	const [ transportationMethod, setTransportationMethod ] = useState(user.transportation_method);
	const [ password, setPassword ] = useState('•••••••');
	const [ confirmPassword, setConfirmPassword ] = useState('•••••••');
	const [ street, setStreet ] = useState(user.address_street);
	const [ city, setCity ] = useState(user.address_city);
	const [ state, setState ] = useState(user.address_state); // TODO: update state to US_State or something
	const [ zip, setZip ] = useState(user.address_zip.toString());

	const validateAndSubmit = async () => {
		if (!email.includes('@') || !email.includes('.')) { Alert.alert('Please enter a valid email address.'); return; }
		if (password !== confirmPassword) { Alert.alert('Passwords do not match.'); return; }
		if (password.length < 8) { Alert.alert('Please enter a password at least 8 characters long.'); return; }
		if (!street || street.split(' ').length < 3) { Alert.alert('Please enter your street number and name.'); return; }
		if (!city) { Alert.alert('Please enter your city.'); return; }
		if (zip.toString().length !== 5) { Alert.alert('Please enter your 5-digit zip code.'); return; }
		if (!transportationMethod) { Alert.alert('Please select your preferred method of transportation.'); return; }

		const statusCode = await updateDonorOrClient({
			email,
			street,
			city,
			state,
			zip,
			transportationMethod,
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
				<Title text="Profile" />
				<SpacerInline height={20} />

				<FormTextInput
					text="Email Address"
					value={email}
					setValue={setEmail}
					style={styles.input}
					disabled={!editing}
				/>

				<FormTextInput
					text="Street Address"
					value={street}
					setValue={setStreet}
					autoCapitalize="words"
					style={styles.input}
					disabled={!editing}
				/>

				<View style={styles.row}>
					<FormTextInput
						text="City"
						value={city}
						setValue={setCity}
						width="41%"
						autoCapitalize="words"
						style={styles.input}
						disabled={!editing}
					/>
					<FormTextInput
						text="State"
						value={state}
						setValue={setState}
						width="18%"
						autoCapitalize="words"
						disabled={!editing}
						style={styles.input}
					/>
					<FormTextInput
						text="Zip"
						value={zip}
						setValue={setZip}
						width="33%"
						autoCapitalize="words"
						style={styles.input}
						disabled={!editing}
					/>
				</View>
				<View style={{ width: '48%' }}>
					<InputLabel text="Transportation" />
					<RNPickerSelect
						value={transportationMethod}
						onValueChange={(val, _i) => setTransportationMethod(val)}
						placeholder={selectPlaceholder}
						textInputProps={{ style: styles.input }}
						Icon={() => <ChevronDown />}
						items={itemizeList(transportationMethods)}
						disabled={!editing}
					/>
				</View>
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

			<View>
				{/* TODO: Componentize-- used in both client/donor registration screen and client/donor profile screen */}
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
