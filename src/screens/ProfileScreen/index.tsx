import React from 'react';
import useGlobal from '@state';
import DonorProfileScreen from './DonorProfileScreen';
import ClientProfileScreen from './ClientProfileScreen';

export default () => {
	const [ state ] = useGlobal();
	const { userIdentity } = state;
	switch (userIdentity) {
		case 'donor': return <DonorProfileScreen />;
		case 'client':
		default: return <ClientProfileScreen />;
	}
};
