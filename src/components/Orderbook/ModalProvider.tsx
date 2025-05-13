/** @format */

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import emailjs from '@emailjs/browser';

type Props = {
	isOpen: boolean;
	selectedOrder: any;
	onClose: () => void;
	onSubmit: (data: { name: string; email: string }) => void;
};

const modalStyles: React.CSSProperties = {
	position: 'fixed',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	backgroundColor: '#fff',
	padding: '2rem',
	borderRadius: '8px',
	width: '100%',
	maxWidth: 400,
	boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
	zIndex: 1000,
};

const overlayStyles: React.CSSProperties = {
	position: 'fixed',
	top: 0,
	left: 0,
	right: 0,
	bottom: 0,
	backgroundColor: 'rgba(0,0,0,0.5)',
	zIndex: 999,
};

const pubkey = import.meta.env.VITE_EMAIL_JS_PUBLIC_KEY;
export const ModalProvider: React.FC<Props> = ({ isOpen, onClose, selectedOrder, onSubmit }) => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');

	if (!isOpen) return null;

	const handleSubmit = () => {
		if (!name || !email) return alert('Both fields are required');
		emailjs.init({
			publicKey: pubkey,
			// Do not allow headless browsers
			blockHeadless: true,
		});

		emailjs
			.send('service_s0buggz', 'template_7mf29rb', {
				title: 'Someone Accepted Loan Request',
				name: name,
				time: new Date().toLocaleString(),
				message: `${
					'Request Details: \n' +
					`ID ${selectedOrder.id} \n` +
					`Amount: ${selectedOrder.amount.toLocaleString()} \n` +
					`Custody: ${selectedOrder.custody ? 'Self' : 'Third Party'} \n` +
					`KYC Required: ${selectedOrder.kycRequired ? 'Yes' : 'No'} \n` +
					`LTV: ${selectedOrder.ltv}% \n` +
					`Term: ${selectedOrder.termDays} days \n` +
					`Liquidation Risk: ${selectedOrder.liquidationRisk ? 'Yes' : 'No'} \n` +
					`BTC Chain: ${selectedOrder.btcChain ? 'L1' : 'Bridged'} \n` +
					`Wallet Type: ${selectedOrder.walletType} \n` +
					`Currency: ${selectedOrder.currency} \n` +
					`APR: ${selectedOrder.apr}% \n`
				}`,
				email: email,
			})
			.then(
				() => {
					alert('We will notify you when a request is matched!');
					setName('');
					setEmail('');
					onClose();
				},
				(error) => {
					console.log('FAILED...', error);
				},
			);
	};

	return ReactDOM.createPortal(
		<>
			<div
				style={overlayStyles}
				onClick={onClose}
			/>
			<div style={modalStyles}>
				<h2>Order Details</h2>
				<div style={{ marginBottom: '1rem', fontSize: 14, border: '1px solid #ccc', borderRadius: 6, padding: '1rem' }}>
					<div>
						<strong>Amount:</strong> ${selectedOrder.amount.toLocaleString()}
					</div>

					<div>
						<strong>Custody:</strong> {selectedOrder.custody ? 'Self' : 'Third Party'}
					</div>

					<div>
						<strong>KYC Required:</strong> {selectedOrder.kycRequired ? 'Yes' : 'No'}
					</div>

					<div>
						<strong>LTV:</strong> {selectedOrder.ltv}%
					</div>

					<div>
						<strong>Term:</strong> {selectedOrder.termDays} days
					</div>

					<div>
						<strong>APR:</strong> {selectedOrder.apr}%
					</div>

					<div>
						<strong>Status:</strong> {selectedOrder.status}
					</div>

					<div>
						<strong>Date:</strong> {selectedOrder.timestamp.toLocaleString()}
					</div>
				</div>
				<div style={{ marginBottom: '1rem' }}>
					<h2>Enter your details</h2>
					<label>
						Name: <br />
						<input
							type='text'
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder='Your name'
							style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
						/>
					</label>
				</div>
				<div style={{ marginBottom: '1rem' }}>
					<label>
						Email: <br />
						<input
							type='email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder='you@example.com'
							style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
						/>
					</label>
				</div>
				<button onClick={handleSubmit}>Accept</button>
			</div>
		</>,
		document.body,
	);
};
