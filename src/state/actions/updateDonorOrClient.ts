import railsAxios from '@util/railsAxios';

interface DonorUpdateProps {
	organizationName?: string;
	email?: string;
	password?: string;
	license?: string;
	street?: string;
	city?: string;
	state?: string;
	zip?: string;
	licenseVerificationImage?: any; // TODO: update type
	pickupLocation?: string;
}

interface ClientUpdateProps {
	email?: string;
	password?: string;
	street?: string;
	city?: string;
	state?: string;
	zip?: string;
	transportationMethod?: string;
	incomeVerificationImage?: any;
}

// TODO: Consolidate two functions into one; add donor/client flag ??
export const updateDonor = async (store, donor: DonorUpdateProps) => {
	const { userIdentity, user, jwt } = store.state;
	const updatedDonor = { ...donor };

	Object.entries(donor).forEach(([ key, value ]) => {
		if (value === user[key]) {
			updatedDonor[key] = undefined;
		}
	});

	const {
		organizationName, email, password, license, street, city, state, zip, licenseVerificationImage, pickupLocation,
	} = updatedDonor;

	const route = userIdentity === 'donor' ? 'donors' : 'clients';
	const endpoint = `/${route}/${user.id}/update`;

	try {
		const response = await railsAxios(jwt).patch(endpoint, JSON.stringify({
			[userIdentity]: {
				email,
				password,
				organization_name: organizationName,
				business_license: license,
				address_street: street,
				address_city: city,
				address_zip: zip,
				address_state: state,
				license_verification_image: licenseVerificationImage,
				pickup_location: pickupLocation,
			},
		}));

		const { status } = response;
		return status || 'Error';
	} catch (error) {
		return 500;
	}
};

export const updateClient = async (store, client: ClientUpdateProps) => {
	const { userIdentity, user, jwt } = store.state;
	const updatedClient = { ...client };

	Object.entries(client).forEach(([ key, value ]) => {
		if (value === user[key]) {
			updatedClient[key] = undefined;
		}
	});

	const {
		email, password, street, city, state, zip, transportationMethod, incomeVerificationImage,
	} = updatedClient;

	const route = userIdentity === 'donor' ? 'donors' : 'clients';
	const endpoint = `/${route}/${user.id}/update`;

	try {
		const response = await railsAxios(jwt).patch(endpoint, JSON.stringify({
			[userIdentity]: {
				email,
				password,
				address_street: street,
				address_city: city,
				address_zip: zip,
				address_state: state,
				transportation_method: transportationMethod,
				income_verification_image: incomeVerificationImage,
			},
		}));

		const { status } = response;
		return status || 'Error';
	} catch (error) {
		return 500;
	}
};

const updateDonorOrClient = async (store, user) => {
	const { userIdentity } = store.state;
	const statusCode = userIdentity === 'donor'
		? await updateDonor(store, user)
		: await updateClient(store, user);
	return statusCode;
};

export { updateDonorOrClient };
