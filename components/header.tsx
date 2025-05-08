import React from 'react';
import Logo from './Logo';
import { GitHubIcon } from 'nextra/icons';
import { Link } from 'nextra-theme-docs';

export default function Header() {
	return (
		<nav className='flex justify-between items-center border-b border-[#E5EBF0] px-5 lg:px-[2.2rem] py-3 lg:py-4'>
			<div className=''>
				<Logo />
			</div>
			<Link href='#' target='_blank'>
				<GitHubIcon />
			</Link>
		</nav>
	);
}
