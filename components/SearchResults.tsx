import { SearchResult } from '../utils/search';

interface SearchResultsProps {
	results: SearchResult[];
	query: string;
}

export function SearchResults({ results, query }: SearchResultsProps) {
	if (!query) return null;

	return (
		<div className='mt-4 space-y-4 absolute top-12 p-4 border border-transparent rounded-md bg-white shadow-sm transition-all w-full'>
			{results.length === 0 ? (
				<div className='p-4 text-center text-gray-500'>
					No results found for "{query}"
				</div>
			) : (
				results.map((result) => (
					<a
						key={result.slug}
						href={result.slug}
						className='block rounded-md bg-white hover:bg-gray-50 p-2 transition-all'
					>
						<h3 className='text-sm font-bold text-[#293A49]'>
							{result.title}
						</h3>
						{result.date && (
							<p className='text-sm text-[#94A3B8] mt-1'>
								{new Date(result.date).toLocaleDateString()}
							</p>
						)}
						<p className='text-gray-600 mt-2 line-clamp-2'>
							{result.content.slice(0, 150)}...
						</p>
					</a>
				))
			)}
		</div>
	);
}
