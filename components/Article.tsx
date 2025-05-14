import Link from 'next/link';

interface IArtifcle {
	title: string;
	description: string;
	tags: string[];
	link: string;
}

export default function Article({ description, link, tags, title }: IArtifcle) {
	return (
		<Link href={`${link}`} className='p-6 mb-2'>
			<div className='w-full lg:w-[615px] hover:shadow-lg transition duration-300 ease-in-out hover:bg-white rounded-lg p-6'>
				<h5 className='text-sm font-bold text-[#293A49] mb-4'>
					{title}
				</h5>
				<p className='text-sm text-[#94A3B8] mb-4'>{description}</p>
				<div className='flex gap-4'>
					{tags.map((tag, i) => (
						<div
							key={i}
							className='bg-[#E4E4E5] px-2 py-[6px] rounded-full text-xs font-medium text-[#191A23]'
						>
							{tag}
						</div>
					))}
				</div>
			</div>
		</Link>
	);
}
