import React from 'react';
import Logo from './Logo';
import { GitHubIcon } from 'nextra/icons';
import Link from 'next/link';
import BuyMeCoffee from './BuyMeCoffee';

export default function Header() {
	return (
		<nav className='flex justify-center border-b border-[#E5EBF0] px-5 lg:px-[2.2rem] py-3 lg:py-4'>
			<div className='flex justify-between items-center lg:w-[1440px] w-full'>
				<div className=''>
					<Logo />
				</div>
				<div className='flex items-center gap-4'>
					<BuyMeCoffee />
					<Link
						href='https://github.com/TechEasyDoc/aws_techeasydoc'
						target='_blank'
					>
						<GitHubIcon />
					</Link>
				</div>
			</div>
		</nav>
	);
}
