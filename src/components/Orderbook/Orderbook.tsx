/** @format */

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAppContext } from '../../context/AppContext';
import { motion } from 'framer-motion';
import { ModalProvider } from './ModalProvider';

interface OrderEntry {
	id: string;
	type: 'demand' | 'supply';
	amount: number; // in USD for demand, BTC for supply
	custody: boolean;
	kycRequired: boolean;
	ltv: number; // percentage
	termDays: number;
	liquidationRisk: boolean;
	btcChain: string;
	walletType: string;
	currency: string;
	apr: number;
	timestamp: Date;
	status: 'open' | 'matched' | 'cancelled';
}

interface OrderbookFilters {
	type?: 'demand' | 'supply';
	custody?: boolean;
	kycRequired?: boolean;
	minLtv?: number;
	maxLtv?: number;
	minTermDays?: number;
	maxTermDays?: number;
	liquidationRisk?: boolean;
	btcChain?: 'L1' | 'bridged';
	walletType?: string;
	currency?: string;
	status?: 'open' | 'matched' | 'cancelled' | '';
}

const OrderbookContainer = styled.section`
	width: 100%;
	padding: ${({ theme }) => `${theme.space[16]} ${theme.space[4]}`};
	background-color: ${({ theme }) => theme.colors.background};
`;

const OrderbookContent = styled.div`
	max-width: ${({ theme }) => theme.sizes['5xl']};
	margin: 0 auto;
`;

const SectionTitle = styled.h2`
	font-size: ${({ theme }) => theme.fontSizes['3xl']};
	margin-bottom: ${({ theme }) => theme.space[8]};
	text-align: center;
`;

const SectionDescription = styled.p`
	text-align: center;
	max-width: ${({ theme }) => theme.sizes['3xl']};
	margin: 0 auto ${({ theme }) => theme.space[12]};
	color: ${({ theme }) => theme.colors.secondary};
`;

const FilterContainer = styled.div`
	background-color: ${({ theme }) => theme.colors.cardBg};
	border-radius: ${({ theme }) => theme.radii.lg};
	padding: ${({ theme }) => theme.space[6]};
	margin-bottom: ${({ theme }) => theme.space[8]};
	display: flex;
	flex-wrap: wrap;
	gap: ${({ theme }) => theme.space[4]};
`;

const FilterGroup = styled.div`
	flex: 1;
	min-width: 200px;
`;

const FilterLabel = styled.label`
	display: block;
	margin-bottom: ${({ theme }) => theme.space[2]};
	font-weight: ${({ theme }) => theme.fontWeights.medium};
	font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const FilterSelect = styled.select`
	width: 100%;
	padding: ${({ theme }) => theme.space[2]};
	border-radius: ${({ theme }) => theme.radii.md};
	border: 1px solid ${({ theme }) => theme.colors.borderColor};
	font-size: ${({ theme }) => theme.fontSizes.sm};

	&:focus {
		outline: none;
		border-color: ${({ theme }) => theme.colors.primary};
	}
`;

const TableContainer = styled(motion.div)`
	overflow-x: auto;
	box-shadow: ${({ theme }) => theme.shadows.md};
	border-radius: ${({ theme }) => theme.radii.lg};
	background-color: white;
`;

const Table = styled.table`
	width: 100%;
	border-collapse: collapse;
`;

const TableHead = styled.thead`
	background-color: ${({ theme }) => theme.colors.primary};
	color: white;
`;

const TableHeadCell = styled.th`
	padding: ${({ theme }) => theme.space[4]};
	text-align: left;
	font-weight: ${({ theme }) => theme.fontWeights.semibold};
	font-size: ${({ theme }) => theme.fontSizes.sm};
	white-space: nowrap;
`;

const TableBody = styled.tbody``;

const TableRow = styled(motion.tr)<{ isMatched?: boolean }>`
	cursor: pointer;
	background-color: ${({ isMatched, theme }) => (isMatched ? `rgba(247, 147, 26, 0.1)` : 'white')};
	transition: ${({ theme }) => theme.transitions.easeInOut};

	&:hover {
		background-color: ${({ theme }) => theme.colors.cardBg};
	}

	&:not(:last-child) {
		border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor};
	}
`;

const TableCell = styled.td`
	padding: ${({ theme }) => theme.space[4]};
	font-size: ${({ theme }) => theme.fontSizes.xs};
`;

const TypeBadge = styled.span<{ type: 'demand' | 'supply' }>`
	display: inline-block;
	padding: ${({ theme }) => `${theme.space[1]} ${theme.space[2]}`};
	border-radius: ${({ theme }) => theme.radii.full};
	font-size: ${({ theme }) => theme.fontSizes.xs};
	font-weight: ${({ theme }) => theme.fontWeights.bold};
	background-color: ${({ type, theme }) => (type === 'demand' ? theme.colors.accent : theme.colors.primary)};
	color: white;
	letter-spacing: 1px;
`;

const CurrencyAmount = styled.div`
	font-weight: ${({ theme }) => theme.fontWeights.bold};
	font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const CurrencyUnit = styled.span`
	font-size: ${({ theme }) => theme.fontSizes.sm};
	opacity: 0.7;
	margin-left: ${({ theme }) => theme.space[1]};
`;

const APRValue = styled.span<{ value: number }>`
	font-weight: ${({ theme }) => theme.fontWeights.bold};
	color: ${({ value, theme }) => {
		if (value <= 7) return theme.colors.success;
		if (value <= 10) return theme.colors.primary;
		return theme.colors.warning;
	}};
`;

const TabContainer = styled.div`
	display: flex;
	margin-bottom: ${({ theme }) => theme.space[6]};
	border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor};
`;

const Tab = styled.button<{ active: boolean }>`
	padding: ${({ theme }) => `${theme.space[3]} ${theme.space[6]}`};
	background: none;
	border: none;
	border-radius: 0px;
	border-bottom: 3px solid ${({ active, theme }) => (active ? theme.colors.primary : 'transparent')};
	color: ${({ active, theme }) => (active ? theme.colors.primary : theme.colors.text)};
	font-weight: ${({ active, theme }) => (active ? theme.fontWeights.bold : theme.fontWeights.medium)};
	cursor: pointer;
	transition: ${({ theme }) => theme.transitions.easeInOut};

	&:hover {
		color: ${({ theme }) => theme.colors.primary};
	}
`;

const NoResultsMessage = styled.div`
	text-align: center;
	padding: ${({ theme }) => theme.space[8]};
	color: ${({ theme }) => theme.colors.lightText};
`;

const LoaderContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: ${({ theme }) => theme.space[12]};
`;

const Loader = styled.div`
	border: 4px solid ${({ theme }) => theme.colors.borderColor};
	border-top: 4px solid ${({ theme }) => theme.colors.primary};
	border-radius: 50%;
	width: 40px;
	height: 40px;
	animation: spin 1s linear infinite;

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
`;

const formatCurrency = (value: number, currency: string): string => {
	if (['USD', 'EUR', 'GBP'].includes(currency)) {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: currency,
			maximumFractionDigits: 0,
		}).format(value);
	}

	return `${value.toLocaleString()} ${currency}`;
};

const formatBTC = (value: number): string => {
	return value.toFixed(4);
};

const formatDate = (dateString: string): string => {
	const date = new Date(dateString);
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
};

const Orderbook: React.FC = () => {
	const { loanRequests, lendOffers, isLoading } = useAppContext();
	const [orders, setOrders] = useState<OrderEntry[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [activeTab, setActiveTab] = useState<'all' | 'demand' | 'supply'>('all');
	const [filters, setFilters] = useState<OrderbookFilters>({
		status: '',
	});

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState<OrderEntry | null>(null);

	// In a real implementation, this would call the actual API
	// For now, we'll use a mock implementation
	useEffect(() => {
		const fetchOrders = async () => {
			try {
				setLoading(true);
				// Generate mock orders
				const mockOrders: OrderEntry[] = [];
				// Generate demand entries
				loanRequests?.map((loan) => {
					const order: OrderEntry = {
						id: `demand-${loan.id}`,
						type: 'demand',
						amount: loan.loanAmount,
						custody: loan.custody === 'self' ? true : false,
						kycRequired: loan.kyc === 'required' ? true : false,
						ltv: loan.ltv,
						termDays: loan.termDays,
						liquidationRisk: loan.liquidationRisk === 'yes' ? true : false,
						btcChain: loan.btcChain,
						walletType: loan.walletType,
						currency: loan.currency,
						apr: loan.userRate,
						timestamp: new Date(loan.created_at),
						status: loan.status === 'active' ? 'open' : 'matched',
					};

					mockOrders.push(order);
				});

				lendOffers?.map((lend) => {
					const order: OrderEntry = {
						id: `supply-${lend.id}`,
						type: 'supply',
						amount: lend.loanAmount,
						custody: lend.custody === 'self' ? true : false,
						kycRequired: lend.kyc === 'required' ? true : false,
						ltv: lend.ltv,
						termDays: lend.termDays,
						liquidationRisk: lend.liquidationRisk === 'yes' ? true : false,
						btcChain: lend.btcChain,
						walletType: lend.walletType,
						currency: lend.currency,
						apr: lend.userRate,
						timestamp: new Date(lend.created_at),
						status: lend.status === 'active' ? 'open' : 'matched',
					};

					console.log('order ->', order);

					mockOrders.push(order);
				});

				// Apply filters
				let filteredOrders = mockOrders;

				// Filter by type from tab
				if (activeTab === 'demand') {
					filteredOrders = filteredOrders.filter((order) => order.type === 'demand');
				} else if (activeTab === 'supply') {
					filteredOrders = filteredOrders.filter((order) => order.type === 'supply');
				}

				// Apply other filters
				if (filters.custody !== undefined) {
					filteredOrders = filteredOrders.filter((order) => order.custody === filters.custody);
				}

				if (filters.kycRequired !== undefined) {
					filteredOrders = filteredOrders.filter((order) => order.kycRequired === filters.kycRequired);
				}

				if (filters.minLtv) {
					filteredOrders = filteredOrders.filter((order) => order.ltv >= (filters.minLtv || 0));
				}

				if (filters.maxLtv) {
					filteredOrders = filteredOrders.filter((order) => order.ltv <= (filters.maxLtv || 100));
				}

				if (filters.minTermDays) {
					filteredOrders = filteredOrders.filter((order) => order.termDays >= (filters.minTermDays || 0));
				}

				if (filters.maxTermDays) {
					filteredOrders = filteredOrders.filter((order) => order.termDays <= (filters.maxTermDays || 365));
				}

				if (filters.liquidationRisk !== undefined) {
					filteredOrders = filteredOrders.filter((order) => order.liquidationRisk === filters.liquidationRisk);
				}

				if (filters.btcChain) {
					filteredOrders = filteredOrders.filter((order) => order.btcChain === filters.btcChain);
				}

				if (filters.walletType) {
					filteredOrders = filteredOrders.filter((order) => order.walletType === filters.walletType);
				}

				if (filters.currency) {
					filteredOrders = filteredOrders.filter((order) => order.currency === filters.currency);
				}

				if (filters.status) {
					filteredOrders = filteredOrders.filter((order) => order.status === filters.status);
				}

				// Sort by newest first
				filteredOrders.sort((a, b) => {
					return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
				});

				setOrders(filteredOrders);
				setLoading(false);
			} catch (err) {
				console.error('Error fetching orders:', err);
				setLoading(false);
			}
		};

		fetchOrders();
	}, [activeTab, filters, loanRequests, isLoading]);

	const handleTabChange = (tab: 'all' | 'demand' | 'supply') => {
		setActiveTab(tab);
	};

	const handleFilterChange = (key: keyof OrderbookFilters, value: any) => {
		// For select elements with empty value, remove the filter
		if (value === '') {
			const newFilters = { ...filters };
			delete newFilters[key];
			setFilters(newFilters);
		} else {
			setFilters({
				...filters,
				[key]: value,
			});
		}
	};

	const handleRowClick = (order: OrderEntry) => {
		// In a real implementation, this would navigate to order details or show a modal
		setSelectedOrder(order);
		setIsModalOpen(true);
	};

	const handleRequest = () => {
		alert('We will notify you when a request is matched!');
	};

	return (
		<OrderbookContainer id='orderbook'>
			<OrderbookContent>
				<SectionTitle>Live Orderbook</SectionTitle>
				<SectionDescription>
					See real-time demand and supply across the Grynvault platform. This transparent view shows active requests and commitments, letting you gauge market depth and find
					opportunities.
				</SectionDescription>

				<TabContainer>
					<Tab
						active={activeTab === 'all'}
						onClick={() => handleTabChange('all')}>
						All Orders
					</Tab>
					<Tab
						active={activeTab === 'demand'}
						onClick={() => handleTabChange('demand')}>
						Loan Requests
					</Tab>
					<Tab
						active={activeTab === 'supply'}
						onClick={() => handleTabChange('supply')}>
						Lender Offers
					</Tab>
				</TabContainer>

				<FilterContainer>
					<FilterGroup>
						<FilterLabel htmlFor='status'>Status</FilterLabel>
						<FilterSelect
							id='status'
							value={filters.status || ''}
							onChange={(e) => handleFilterChange('status', e.target.value || undefined)}>
							<option value=''>All Statuses</option>
							<option value='open'>Open</option>
							<option value='matched'>Matched</option>
						</FilterSelect>
					</FilterGroup>

					<FilterGroup>
						<FilterLabel htmlFor='custody'>Custody</FilterLabel>
						<FilterSelect
							id='custody'
							value={filters.custody === undefined ? '' : String(filters.custody)}
							onChange={(e) => {
								const value = e.target.value;
								if (value === '') {
									handleFilterChange('custody', undefined);
								} else {
									handleFilterChange('custody', value === 'true');
								}
							}}>
							<option value=''>Any</option>
							<option value='true'>Third-Party</option>
							<option value='false'>Self-Custody</option>
						</FilterSelect>
					</FilterGroup>

					<FilterGroup>
						<FilterLabel htmlFor='kyc'>KYC</FilterLabel>
						<FilterSelect
							id='kyc'
							value={filters.kycRequired === undefined ? '' : String(filters.kycRequired)}
							onChange={(e) => {
								const value = e.target.value;
								if (value === '') {
									handleFilterChange('kycRequired', undefined);
								} else {
									handleFilterChange('kycRequired', value === 'true');
								}
							}}>
							<option value=''>Any</option>
							<option value='true'>Required</option>
							<option value='false'>Not Required</option>
						</FilterSelect>
					</FilterGroup>

					<FilterGroup>
						<FilterLabel htmlFor='ltv'>LTV Range</FilterLabel>
						<FilterSelect
							id='ltv'
							value={filters.minLtv || ''}
							onChange={(e) => handleFilterChange('minLtv', e.target.value ? parseInt(e.target.value) : undefined)}>
							<option value=''>Any LTV</option>
							<option value='50'>50% +</option>
							<option value='60'>60% +</option>
							<option value='70'>70% +</option>
						</FilterSelect>
					</FilterGroup>

					<FilterGroup>
						<FilterLabel htmlFor='term'>Term Length</FilterLabel>
						<FilterSelect
							id='term'
							value={filters.minTermDays || ''}
							onChange={(e) => handleFilterChange('minTermDays', e.target.value ? parseInt(e.target.value) : undefined)}>
							<option value=''>Any Term</option>
							<option value='30'>30+ Days</option>
							<option value='90'>90+ Days</option>
							<option value='180'>180+ Days</option>
							<option value='365'>365+ Days</option>
						</FilterSelect>
					</FilterGroup>

					<FilterGroup>
						<FilterLabel htmlFor='btcChain'>BTC Chain</FilterLabel>
						<FilterSelect
							id='btcChain'
							value={filters.btcChain || ''}
							onChange={(e) => handleFilterChange('btcChain', e.target.value || undefined)}>
							<option value=''>Any Chain</option>
							<option value='L1'>Layer 1 BTC</option>
							<option value='bridged'>Bridged BTC</option>
						</FilterSelect>
					</FilterGroup>
				</FilterContainer>

				{loading || isLoading ? (
					<LoaderContainer>
						<Loader />
					</LoaderContainer>
				) : (
					<TableContainer
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}>
						<Table>
							<TableHead>
								<tr>
									<TableHeadCell>Type</TableHeadCell>
									<TableHeadCell>Amount</TableHeadCell>
									<TableHeadCell>Currency</TableHeadCell>
									<TableHeadCell>LTV</TableHeadCell>
									<TableHeadCell>Term</TableHeadCell>
									<TableHeadCell>APR</TableHeadCell>
									<TableHeadCell>Custody</TableHeadCell>
									<TableHeadCell>KYC</TableHeadCell>
									<TableHeadCell>Liquidation</TableHeadCell>
									<TableHeadCell>Date</TableHeadCell>
									<TableHeadCell>Status</TableHeadCell>
								</tr>
							</TableHead>
							<TableBody>
								{orders.length > 0 ? (
									orders.map((order) => (
										<TableRow
											key={order.id}
											isMatched={order.status === 'matched'}
											onClick={() => handleRowClick(order)}
											whileHover={{ x: 5 }}>
											<TableCell>
												<TypeBadge type={order.type}>{order.type === 'demand' ? 'Borrow' : 'Lend'}</TypeBadge>
											</TableCell>
											<TableCell>
												<CurrencyAmount>
													{formatCurrency(order.amount, 'USD')}
													<CurrencyUnit></CurrencyUnit>
												</CurrencyAmount>
											</TableCell>
											<TableCell>{order.currency}</TableCell>
											<TableCell>{order.ltv}%</TableCell>
											<TableCell>{order.termDays} days</TableCell>
											<TableCell>
												<APRValue value={order.apr}>{order.apr}%</APRValue>
											</TableCell>
											<TableCell>{order.custody ? 'Third-Party' : 'Self'}</TableCell>
											<TableCell>{order.kycRequired ? 'Required' : 'No'}</TableCell>
											<TableCell>{order.liquidationRisk ? 'Yes' : 'No'}</TableCell>
											<TableCell>{formatDate(order.timestamp.toString())}</TableCell>
											<TableCell>{order.status === 'open' ? 'Active' : 'Matched'}</TableCell>
										</TableRow>
									))
								) : (
									<tr>
										<td colSpan={11}>
											<NoResultsMessage>No orders found matching your filters. Try adjusting your criteria.</NoResultsMessage>
										</td>
									</tr>
								)}
							</TableBody>
						</Table>
					</TableContainer>
				)}
			</OrderbookContent>
			<ModalProvider
				isOpen={isModalOpen}
				selectedOrder={selectedOrder}
				onClose={() => setIsModalOpen(false)}
				onSubmit={handleRequest}
			/>
		</OrderbookContainer>
	);
};

export default Orderbook;
