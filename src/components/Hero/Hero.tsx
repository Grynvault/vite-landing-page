/** @format */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';

const HeroContainer = styled.section`
	width: 100%;
	/* let mobile shrink below 80vh if content is shorter */
	min-height: 80vh;
	margin-top: 48px;
	padding: ${({ theme }) => theme.space[12]} ${({ theme }) => theme.space[4]};
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	/* mobile tweaks */
	@media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
		padding: ${({ theme }) => theme.space[12]} ${({ theme }) => theme.space[2]};
		margin-top: ${({ theme }) => theme.space[6]};
		min-height: auto;
	}
	box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
	border-radius: 24px;
	background: ${({ theme }) => theme.gradients.primary};
	color: white;
	text-align: center;
	position: relative;
	overflow: hidden;
`;

const HeroContent = styled.div`
	max-width: ${({ theme }) => theme.sizes['4xl']};
	z-index: 10;
`;

const Title = styled(motion.h1)`
	font-size: clamp(2.5rem, 8vw, 4.5rem);
	line-height: 1.1;
	margin-bottom: ${({ theme }) => theme.space[6]};
	color: white;
`;

const Subtitle = styled(motion.p)`
	font-size: clamp(1.1rem, 3vw, 1.5rem);
	line-height: 1.5;
	margin-bottom: ${({ theme }) => theme.space[12]};
	color: rgba(255, 255, 255, 0.9);
	max-width: ${({ theme }) => theme.sizes['3xl']};
	margin-left: auto;
	margin-right: auto;
`;

const Stats = styled(motion.div)`
	display: flex;
	justify-content: center;
	gap: ${({ theme }) => theme.space[8]};
	margin-bottom: ${({ theme }) => theme.space[12]};
	flex-wrap: wrap;

	@media (max-width: ${({ theme }) => theme.breakpoints.md}) {
		flex-direction: column;
		gap: ${({ theme }) => theme.space[6]};
	}
`;

const StatItem = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const StatValue = styled.div`
	font-size: ${({ theme }) => theme.fontSizes['4xl']};
	font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

const StatLabel = styled.div`
	font-size: ${({ theme }) => theme.fontSizes.md};
	opacity: 0.8;
	text-transform: uppercase;
	letter-spacing: 1px;
`;

const CTAContainer = styled(motion.div)`
	display: flex;
	gap: ${({ theme }) => theme.space[4]};
	flex-wrap: wrap;
	justify-content: center;
`;

interface CTAButtonProps {
	primary?: boolean;
}

const CTAButton = styled(motion.a)<CTAButtonProps>`
	padding: ${({ theme }) => `${theme.space[4]} ${theme.space[8]}`};
	background-color: ${({ theme, primary }) => (primary ? 'white' : 'transparent')};
	color: ${({ theme, primary }) => (primary ? theme.colors.primary : 'white')};
	font-weight: ${({ theme }) => theme.fontWeights.bold};
	border-radius: ${({ theme }) => theme.radii.md};
	border: 2px solid white;
	font-size: ${({ theme }) => theme.fontSizes.lg};
	cursor: pointer;
	transition: ${({ theme }) => theme.transitions.easeInOut};
	text-decoration: none;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: 200px;

	&:hover {
		transform: translateY(-3px);
		color: ${({ theme, primary }) => (primary ? theme.colors.primary : 'white')};
		box-shadow: ${({ theme }) => theme.shadows.lg};
		text-decoration: none;
	}
`;

const formatCurrency = (value: number): string => {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: 0,
		notation: 'compact',
		compactDisplay: 'short',
	}).format(value);
};

const formatBTC = (value: number): string => {
	return `${value.toFixed(1)} BTC`;
};

const Hero: React.FC = () => {
	const { stats, loanRequests, lendOffers, isLoading } = useAppContext();
	const [totalDemand, setTotalDemand] = useState(0);
	const [totalSupply, setTotalSupply] = useState(0);
	const [activeRequests, setActiveRequests] = useState(0);
	const [activeCommitments, setActiveCommitments] = useState(0);

	useEffect(() => {
		if (loanRequests && lendOffers) {
			setActiveRequests(loanRequests.filter((request) => request.status === 'active').length + lendOffers.filter((request) => request.status === 'active').length);
			setActiveCommitments(loanRequests.filter((request) => request.status === 'matched').length + lendOffers.filter((request) => request.status === 'matched').length);
			setTotalDemand(loanRequests.reduce((acc, request) => acc + request.loanAmount, 0));
		}
	}, [loanRequests, lendOffers]);

	const titleVariants = {
		hidden: { opacity: 0, y: -20 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
	};

	const subtitleVariants = {
		hidden: { opacity: 0, y: -20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.8, delay: 0.3 },
		},
	};

	const statsVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.8, delay: 0.6 },
		},
	};

	const ctaVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.8, delay: 0.9 },
		},
	};

	return (
		<HeroContainer>
			<HeroContent>
				<Title
					variants={titleVariants}
					initial='hidden'
					animate='visible'>
					Bitcoin-Backed Loans on Your Terms
				</Title>

				<Subtitle
					variants={subtitleVariants}
					initial='hidden'
					animate='visible'>
					Grynvault lets you access liquidity from your Bitcoin holdings with transparent, self-custodial lending solutions that prioritize your sovereignty and flexibility.
				</Subtitle>

				<Stats
					variants={statsVariants}
					initial='hidden'
					animate='visible'>
					<StatItem>
						<StatValue>{isLoading ? '...' : formatCurrency(totalDemand)}</StatValue>
						<StatLabel>Total Demand</StatLabel>
					</StatItem>

					<StatItem>
						<StatValue>{isLoading ? '...' : formatBTC(stats.totalSupply)}</StatValue>
						<StatLabel>Total Supply</StatLabel>
					</StatItem>

					<StatItem>
						<StatValue>{isLoading ? '...' : activeRequests}</StatValue>
						<StatLabel>Active Requests</StatLabel>
					</StatItem>

					<StatItem>
						<StatValue>{isLoading ? '...' : activeCommitments}</StatValue>
						<StatLabel>Active Commitments</StatLabel>
					</StatItem>
				</Stats>

				<CTAContainer
					variants={ctaVariants}
					initial='hidden'
					animate='visible'>
					<CTAButton
						primary={true}
						href='#configurator'
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}>
						Configure Loan
					</CTAButton>

					<CTAButton
						href='#orderbook'
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}>
						View Orderbook
					</CTAButton>
				</CTAContainer>
			</HeroContent>
		</HeroContainer>
	);
};

export default Hero;
