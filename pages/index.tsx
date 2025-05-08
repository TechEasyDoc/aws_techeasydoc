import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import ArrowIcon from '@/components/ArrowIcon';
import Link from 'next/link';
import Article from '@/components/Article';
import Searchform from '@/components/SearchForm';
import { useEffect, useState } from 'react';
import { SearchResult } from '@/utils/search';
import { SearchResults } from '@/components/SearchResults';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
	// search state
	const [results, setResults] = useState<SearchResult[]>([]);
	const [query, setQuery] = useState('');

	// list state
	const [list, setList] = useState<SearchResult[]>([]);
	const [listLoading, setListLoading] = useState(false);
	const [listError, setListError] = useState(false);

	// Fetch the latest posts
	const fetchLatestPosts = async () => {
		setListLoading(true);
		try {
			const response = await fetch('/api/latest-posts');
			const data = await response.json();
			setList(data);
		} catch (error) {
			setListError(true);
		} finally {
			setListLoading(false);
		}
	};

	useEffect(() => {
		fetchLatestPosts();
	}, []);

	return (
		<main
			className={`min-h-screen h-full bg-[#FBFBFB] pb-8 ${inter.className}`}
		>
			<Header />
			<section className='mt-10 lg:mt-[90px] flex justify-center'>
				<div className='w-full lg:w-[750px]'>
					<h1 className='text-4xl lg:text-[80px] text-center font-bold px-5 lg:px-0 mb-8 lg:mb-16 leading-none lg:leading-[90px] text-[#293A49]'>
						AWS <span className='text-[#556CD6]'>Stuffs</span> made
						easy and enjoyable
					</h1>
					<section className='relative'>
						<Searchform
							onSearchResults={setResults}
							onSearchQuery={setQuery}
						/>
						<SearchResults results={results} query={query} />
					</section>
					<div className='flex gap-4 justify-center'>
						<Link
							href='#'
							className='px-2 py-1 bg-[#DCD1F4] rounded text-xs font-medium text-[#3C0F9F]'
						>
							Storage
						</Link>
						<Link
							href='#'
							className='px-2 py-1 bg-[#DCD1F4] rounded text-xs font-medium text-[#3C0F9F]'
						>
							Compute
						</Link>
						<Link
							href='#'
							className='px-2 py-1 bg-[#DCD1F4] rounded text-xs font-medium text-[#3C0F9F]'
						>
							Database
						</Link>
						<Link
							href='#'
							className='px-2 py-1 bg-[#DCD1F4] rounded text-xs font-medium text-[#3C0F9F]'
						>
							Networking
						</Link>
					</div>
				</div>
			</section>
			<section className='mt-16 lg:mt-32 px-5 lg:px-20'>
				<header className='border-b border-[#E5EBF0] pb-4'>
					<h3 className='text-lg font-semibold text-[#293A49]'>
						Latest
					</h3>
				</header>
				{listLoading && (
					<div className='text-sm text-gray-500 mt-2'>Loading...</div>
				)}
				{listError && (
					<div className='text-sm text-red-500 mt-2'>
						Failed to load latest posts
					</div>
				)}
				{list.map((item) => (
					<Article
						key={item.slug}
						description={item.description!}
						link={item.slug}
						tags={item.tags!}
						title={item.title}
					/>
				))}
				{/* <Article
					description='This post discusses what AWS ECS is and provides a detailed step-by-step guide to using it to build a basic project management application with Flutter'
					link='#'
					tags={['AWS', 'ECS', 'Cloud Deployment']}
					title='How to setup ECS on AWS'
				/>
				<Article
					description='This post discusses what AWS ECS is and provides a detailed step-by-step guide to using it to build a basic project management application with Flutter'
					link='#'
					tags={['AWS', 'ECS', 'Cloud Deployment']}
					title='How to setup ECS on AWS'
				/> */}
				<div className='flex justify-center'>
					<Link
						href='/doc'
						className='flex text-[#556CD6] text-sm font-bold items-center'
					>
						<span className='mr-3'>See all post</span>
						<ArrowIcon />
					</Link>
				</div>
			</section>
		</main>
	);
}
