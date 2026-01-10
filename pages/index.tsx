import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import ArrowIcon from '@/components/ArrowIcon';
import Link from 'next/link';
import Article from '@/components/Article';
import Searchform from '@/components/SearchForm';
import { useEffect, useState } from 'react';
import { SearchResult, CategoryInfo } from '@/utils/search';
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

	// categories state
	const [categories, setCategories] = useState<CategoryInfo[]>([]);

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

	// Fetch categories
	const fetchCategories = async () => {
		try {
			const response = await fetch('/api/categories');
			const data = await response.json();
			console.log(data);
			setCategories(data);
		} catch (error) {
			console.error('Failed to fetch categories:', error);
		}
	};

	useEffect(() => {
		fetchLatestPosts();
		fetchCategories();
	}, []);

	return (
		<main
			className={`min-h-screen h-full bg-[#FBFBFB] pb-8  ${inter.className}`}
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
					<div className='flex gap-4 justify-center flex-wrap'>
						{categories.length > 0 ? (
							categories.map((cat) => (
								<Link
									key={cat.name}
									href={cat.slug}
									className='px-2 py-1 bg-[#DCD1F4] rounded text-xs font-medium text-[#3C0F9F]'
								>
									{cat.name}
								</Link>
							))
						) : (
							<span className='text-xs text-gray-400'>
								Loading categories...
							</span>
						)}
					</div>
				</div>
			</section>
			<div className='flex justify-center'>
				<section className='mt-16 lg:mt-32 px-5 lg:px-20 lg:w-[1440px] w-full'>
					<header className='border-b border-[#E5EBF0] pb-4'>
						<h3 className='text-lg font-semibold text-[#293A49]'>
							Latest
						</h3>
					</header>
					{listLoading && (
						<div className='text-sm text-gray-500 mt-2'>
							Loading...
						</div>
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
					<div className='flex justify-center mt-8'>
						{categories.length > 0 && (
							<Link
								href={categories[0].slug}
								className='flex text-[#556CD6] text-sm font-bold items-center'
							>
								<span className='mr-3'>See all post</span>
								<ArrowIcon />
							</Link>
						)}
					</div>
				</section>
			</div>
		</main>
	);
}
