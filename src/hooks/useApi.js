/** @format */

import supabase from '../utils/supabase';

export const getLoanRequest = async () => {
	const { data, error } = await supabase.from('loan-request').select('*');
	if (error) throw error;
	return data;
};

export const addLoanRequest = async (payload) => {
	console.log('payload ->', payload);

	const { data, error } = await supabase
		.from('loan-request')
		.insert({ ...payload, status: 'active' })
		.select();

	if (error) throw error;
	return { data, error };
};
