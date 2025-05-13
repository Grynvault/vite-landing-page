/** @format */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import supabase from '../utils/supabase';

interface Stats {
	totalDemand: number;
	totalSupply: number;
	activeRequests: number;
	activeCommitments: number;
}

interface AppContextType {
	stats: Stats;
	loading: boolean;
	error: string | null;
	loanRequests: LoanRequest[];
	lendOffers: LenderOffer[];
	isLoading: boolean;
	addLoanRequest: (payload: LoanRequestPayload) => Promise<{ data: LoanRequest[] | null; error: Error | null }>;
}

type LoanRequest = {
	id: number;
	custody: string;
	currency: string;
	btcChain: string;
	email: string;
	liquidationRisk: string;
	loanAmount: number;
	ltv: number;
	kyc: string;
	termDays: number;
	userRate: number;
	walletType: string;
	status?: string;
	created_at: string;
};

type LenderOffer = {
	id: number;
	created_at: string;
	custody: string;
	currency: string;
	btcChain: string;
	email?: string;
	liquidationRisk: string;
	loanAmount: number;
	ltv: number;
	kyc: string;
	termDays: number;
	userRate: number;
	walletType: string;
	status?: string;
};

type LoanRequestPayload = {
	custody: string;
	currency: string;
	btcChain: string;
	email: string;
	liquidationRisk: string;
	loanAmount: number;
	ltv: number;
	kyc: string;
	termDays: number;
	userRate: number;
	walletType: string;
	// Add more fields if needed
};

const defaultStats: Stats = {
	totalDemand: 0,
	totalSupply: 0,
	activeRequests: 0,
	activeCommitments: 0,
};

const defaultContext: AppContextType = {
	stats: defaultStats,
	loading: true,
	error: null,
	loanRequests: [],
	lendOffers: [],
	isLoading: false,
	addLoanRequest: () => Promise.resolve({ data: null, error: null }),
};

const AppContext = createContext<AppContextType>(defaultContext);

export const useAppContext = () => useContext(AppContext);

interface AppProviderProps {
	children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
	const [stats, setStats] = useState<Stats>(defaultStats);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);
	const [lendOffers, setLendOffers] = useState<LenderOffer[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const getLoanRequest = async () => {
		setIsLoading(true);
		const { data, error } = await supabase.from('loan-request').select('*').order('created_at', { ascending: false });
		if (error) console.error(error);
		else {
			setLoanRequests(data);
		}
		setIsLoading(false);
	};

	const getLenderOffers = async () => {
		setIsLoading(true);
		const { data, error } = await supabase.from('lender-offer').select('*').order('created_at', { ascending: false });
		if (error) {
			console.error(error);
		} else {
			setLendOffers(data);
		}
		setIsLoading(false);
	};

	const addLoanRequest = async (payload: LoanRequestPayload): Promise<{ data: LoanRequest[] | null; error: Error | null }> => {
		const { data, error } = await supabase
			.from('loan-request')
			.insert({ ...payload, status: 'active' })
			.select();

		if (error) throw error;
		// ✅ Update state if data is valid
		if (data) {
			setLoanRequests((prev: LoanRequest[]) => [...prev, ...data]); // spread `data` since it's an array
		}

		return { data, error: null };
	};

	useEffect(() => {
		getLoanRequest();
		getLenderOffers();
	}, []);

	const value = {
		stats,
		loading,
		error,
		loanRequests,
		lendOffers,
		isLoading,
		addLoanRequest,
	};

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
