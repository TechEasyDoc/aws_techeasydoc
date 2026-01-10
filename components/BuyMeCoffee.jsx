export default function BuyMeCoffee() {
	return (
		<a
			href='https://www.buymeacoffee.com/techEasyDoc'
			target='_blank'
			rel='noopener noreferrer'
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				gap: '8px',
				padding: '8px 16px',
				backgroundColor: '#FFDD00',
				color: '#000000',
				borderRadius: '8px',
				fontFamily: 'Cookie, cursive',
				fontSize: '18px',
				fontWeight: 'bold',
				textDecoration: 'none',
				border: '2px solid #000000',
				transition: 'transform 0.2s ease',
			}}
			onMouseOver={(e) =>
				(e.currentTarget.style.transform = 'scale(1.05)')
			}
			onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
		>
			<img
				src='https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg'
				alt='Coffee icon'
				style={{ height: '24px', width: '24px' }}
			/>
			Buy me a coffee
		</a>
	);
}
