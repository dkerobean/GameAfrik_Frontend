import Link from 'next/link';
import React, { useEffect } from 'react';
import { rankings_data } from '../../data/rankings_data';
import Image from 'next/image';
import Recently_added_dropdown from '../../components/dropdown/recently_added_dropdown';
import Head from 'next/head';
import Meta from '../../components/Meta';
import { collectRenkingData } from '../../redux/counterSlice';
import { useSelector, useDispatch } from 'react-redux';

const Index = ({ tournamentData }) => {
	const { filteredRenkingData } = useSelector((state) => state.counter);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(collectRenkingData(rankings_data));
	}, [dispatch]);

	console.log("tournament data 11: " + tournamentData)

	return (
		<>
			{/* <!-- Rankings --> */}
			<section className="relative">
				<div className="container">
					{/* <!-- Table --> */}
					<div className="scrollbar-custom overflow-x-auto">
						<div
							role="table"
							className="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 lg:rounded-2lg w-full min-w-[736px] border bg-white text-sm dark:text-white"
						>
							<div className="dark:bg-jacarta-600 bg-jacarta-50 rounded-t-2lg flex" role="row">
								<div className="w-[28%] py-3 px-4" role="columnheader">
									<span className="text-jacarta-700 dark:text-jacarta-100 w-full overflow-hidden text-ellipsis">
										user
									</span>
								</div>
								<div className="w-[12%] py-3 px-4" role="columnheader">
									<span className="text-jacarta-700 dark:text-jacarta-100 w-full overflow-hidden text-ellipsis">
										rank
									</span>
								</div>
								<div className="w-[12%] py-3 px-4" role="columnheader">
									<span className="text-jacarta-700 dark:text-jacarta-100 w-full overflow-hidden text-ellipsis">
										wins
									</span>
								</div>
								<div className="w-[12%] py-3 px-4" role="columnheader">
									<span className="text-jacarta-700 dark:text-jacarta-100 w-full overflow-hidden text-ellipsis">
										losses
									</span>
								</div>
								<div className="w-[12%] py-3 px-4" role="columnheader">
									<span className="text-jacarta-700 dark:text-jacarta-100 w-full overflow-hidden text-ellipsis">
										Skill level
									</span>
								</div>
								<div className="w-[12%] py-3 px-4" role="columnheader">
									<span className="text-jacarta-700 dark:text-jacarta-100 w-full overflow-hidden text-ellipsis">
										Owners
									</span>
								</div>
								<div className="w-[12%] py-3 px-4" role="columnheader">
									<span className="text-jacarta-700 dark:text-jacarta-100 w-full overflow-hidden text-ellipsis">
										Items
									</span>
								</div>
							</div>
							{tournamentData &&
								tournamentData.participants &&
								tournamentData.participants.map((participant, pIndex) => {
									const {
										id,
										owners,
										items,
										icon,
										avatar,
										username,
										skill_level,
										is_verified,
										rank,

									} = participant;

								const avatarUrl = process.env.NEXT_PUBLIC_APP_BACKEND_URL + avatar;


								return (

									<Link href="#">
										<a className="flex transition-shadow hover:shadow-lg" role="row">
											<div
												className="dark:border-jacarta-600 border-jacarta-100 flex w-[28%] items-center border-t py-4 px-4"
												role="cell"
											>
												<span className="mr-2 lg:mr-4">{id}</span>
												<figure className="relative mr-2 w-8 shrink-0 self-start lg:mr-5 lg:w-12">
													{/* <img src={image} alt={title} className="rounded-2lg" loading="lazy" /> */}
													<Image
														src={avatarUrl}
														alt="user-image"
														height={32}
														width={32}
														layout="responsive"
														objectFit="contain"
														className="rounded-2lg"
													/>

													{is_verified && (
														<div
															className="dark:border-jacarta-600 bg-green absolute -right-2 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white"
															data-tippy-content="Verified Collection"
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																viewBox="0 0 24 24"
																width="24"
																height="24"
																className="h-[.875rem] w-[.875rem] fill-white"
															>
																<path fill="none" d="M0 0h24v24H0z"></path>
																<path d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
															</svg>
														</div>
													)}
												</figure>
												<span className="font-display text-jacarta-700 text-sm font-semibold dark:text-white">
													{username}
												</span>
											</div>
											<div
												className="dark:border-jacarta-600 border-jacarta-100 flex w-[12%] items-center whitespace-nowrap border-t py-4 px-4"
												role="cell"
											>
												<span className="-ml-1" data-tippy-content="ETH">
													<svg className="icon mr-1 h-4 w-4">
														<use xlinkHref="/icons.svg#icon-ETH"></use>
													</svg>
												</span>
												<span className="text-sm font-medium tracking-tight">{rank}</span>
											</div>
											<div
												className="dark:border-jacarta-600 border-jacarta-100 flex w-[12%] items-center border-t py-4 px-4"
												role="cell"
											>
												<span className="text-green">12</span>
											</div>
											<div
												className="dark:border-jacarta-600 border-jacarta-100 flex w-[12%] items-center border-t py-4 px-4"
												role="cell"
											>
												<span className="text-red">2</span>
											</div>
											<div
												className="dark:border-jacarta-600 border-jacarta-100 flex w-[12%] items-center border-t py-4 px-4"
												role="cell"
											>
												<span className="-ml-1" data-tippy-content="ETH">
													<svg className="icon mr-1 h-4 w-4">
														<use xlinkHref="/icons.svg#icon-ETH"></use>
													</svg>
												</span>
												<span className="text-sm font-medium tracking-tight">{skill_level}</span>
											</div>
											<div
												className="dark:border-jacarta-600 border-jacarta-100 flex w-[12%] items-center border-t py-4 px-4"
												role="cell"
											>
												<span>{owners}</span>
											</div>
											<div
												className="dark:border-jacarta-600 border-jacarta-100 flex w-[12%] items-center border-t py-4 px-4"
												role="cell"
											>
												<span>{items}</span>
											</div>
										</a>
									</Link>
								);
							})}
						</div>
					</div>
				</div>
			</section>
			{/* <!-- end rankings --> */}
		</>
	);
};

export default Index;
