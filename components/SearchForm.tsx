import React, { useCallback, useEffect, useState } from 'react';
import SearchIcon from '@/components/SearchIcon';
import { SearchResult } from '@/utils/search';

interface SearchProps {
	onSearchResults: (results: SearchResult[]) => void;
	onSearchQuery: (query: string) => void;
}

const Searchform = ({ onSearchQuery, onSearchResults }: SearchProps) => {
	const [query, setQuery] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const performSearch = useCallback(
		async (searchQuery: string) => {
			if (searchQuery.length < 2) {
				onSearchResults([]);
				return;
			}

			setIsLoading(true);
			try {
				const response = await fetch(
					`/api/search?q=${encodeURIComponent(searchQuery)}`
				);
				const results = await response.json();
				onSearchResults(results);
			} catch (error) {
				// console.error('Search failed:', error);
			} finally {
				setIsLoading(false);
			}
		},
		[onSearchResults]
	);

	useEffect(() => {
		const debounceTimer = setTimeout(() => {
			performSearch(query);
			onSearchQuery(query);
		}, 300);

		return () => clearTimeout(debounceTimer);
	}, [query, performSearch, onSearchQuery]);

	return (
		<form action='' className='mb-4'>
			<div className='border border-[#E5EBF0] h-[57px] hover:border-slate-300 rounded-md flex items-center px-3 bg-white focus-within:border-[#E5EBF0]'>
				<input
					type='text'
					className='focus:outline-none w-full'
					placeholder='What would you like to learn'
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					aria-label='Search articles'
				/>
				<SearchIcon />
			</div>
			{isLoading && (
				<div className='text-sm text-gray-500 mt-2'>Searching...</div>
			)}
		</form>
	);
};

export default Searchform;
