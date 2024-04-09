import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { items_data } from '../../data/items_data';
import Auctions_dropdown from '../../components/dropdown/Auctions_dropdown';
import Link from 'next/link';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Items_Countdown_timer from '../../components/items_countdown_timer';
import { ItemsTabs } from '../../components/component';
import More_items from './more_items';
import Likes from '../../components/likes';
import Meta from '../../components/Meta';
import { useDispatch } from 'react-redux';
import { bidsModalShow } from '../../redux/counterSlice';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Item = () => {
	const [tournaments, setTournaments] = useState([]);
  	const [joinedTournaments, setJoinedTournaments] = useState([]);
	const dispatch = useDispatch();
	const router = useRouter();
	const uuid = router.query.item;
	const backendUrl = process.env.NEXT_PUBLIC_APP_BACKEND_URL;

	const [imageModal, setImageModal] = useState(false);
	const [tournament, setTournament] = useState([]);

	useEffect(() => {
		const accessToken = localStorage.getItem("accessToken");
        const fetchTournamentData = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/tournament/single/${uuid}/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch tournament data');
                }
                const data = await response.json();
                setTournament(data);
				console.log(data);
            } catch (error) {
                console.error('Error fetching tournament data:', error);
            }
        };

        if (uuid && accessToken) {
            fetchTournamentData();
        }
    }, [uuid, backendUrl]);

	function formatStartDate(startDate) {
		const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: 'UTC' };
		return new Date(startDate).toLocaleString('en-US', options);
}

// handle leave and register tournament

const fetchTournaments = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/tournaments/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTournaments(data);
      } else {
        throw new Error("Failed to fetch tournaments");
      }
    } catch (error) {
      console.error("Error fetching tournaments:", error);
    }
  };

  useEffect(() => {
    fetchTournaments();
    fetchJoinedTournaments();
  }, []);

  const fetchJoinedTournaments = async () => {
	const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await fetch(`${backendUrl}/api/tournaments/joined/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setJoinedTournaments(data);
      } else {
        throw new Error("Failed to fetch joined tournaments");
      }
    } catch (error) {
      console.error("Error fetching joined tournaments:", error);
    }
  };

  const handleRegister = async (tournamentId) => {
	const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await fetch(`${backendUrl}/api/tournament/join/${tournamentId}/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tournamentId }),
      });
      if (response.ok) {
        fetchJoinedTournaments()
        fetchTournaments();
        toast.success("Successfully registered for the tournament!");

      } else {
        throw new Error("Failed to register for the tournament");
      }
    } catch (error) {
      console.error("Error registering for the tournament:", error);
      toast.error("Failed to register for the tournament");
    }
  };

  const handleLeave = async (tournamentId) => {
	const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await fetch(`${backendUrl}/api/tournament/leave/${tournamentId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        toast.success("Successfully left the tournament!");
        fetchTournaments();


        // Remove the tournament from the joined tournaments list
        setJoinedTournaments(joinedTournaments.filter(tournament => tournament.uuid !== tournamentId));
      } else {
        throw new Error("Failed to leave the tournament");
      }
    } catch (error) {
      console.error("Error leaving the tournament:", error);
      toast.error("Failed to leave the tournament");
    }
  };

  	// Check if the user has joined this tournament
	const isJoined = joinedTournaments.some(tournament => tournament.uuid === uuid);
	console.log("Joined the tournament", isJoined);
	console.log("joined", joinedTournaments);


	// Calculate countdownTime only if tournament is available
    const countdownTime = tournament ? new Date().getTime() - new Date(tournament.start_date).getTime() : null;

	return (
		<>
			<Meta title={`${tournament.name} || GamingAfrik`} />
			{/*  <!-- Item --> */}
			<section className="relative lg:mt-24 lg:pt-24 lg:pb-24 mt-24 pt-12 pb-24">
				<picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
					<img src="/images/gradient_light.jpg" alt="gradient" className="h-full" />
				</picture>
				<div className="container">

								<div className="md:flex md:flex-wrap" key={uuid}>
									{/* <!-- Image --> */}
									<figure className="mb-8 md:w-2/5 md:flex-shrink-0 md:flex-grow-0 md:basis-auto lg:w-1/2 w-full">
										<button className=" w-full" onClick={() => setImageModal(true)}>
											<img src={`${backendUrl}/${tournament.image}`} alt="tournamentt-image" className="rounded-2xl cursor-pointer w-full" />
										</button>
										{/* <!-- Modal --> */}
										<div className={imageModal ? 'modal fade show block' : 'modal fade'}>
											<div className="modal-dialog !my-0 flex h-full max-w-4xl items-center justify-center">
												<img src="#" alt="title" className="h-full rounded-2xl" />
											</div>

											<button
												type="button"
												className="btn-close absolute top-6 right-6"
												onClick={() => setImageModal(false)}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
													width="24"
													height="24"
													className="h-6 w-6 fill-white"
												>
													<path fill="none" d="M0 0h24v24H0z" />
													<path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" />
												</svg>
											</button>
										</div>
										{/* <!-- end modal --> */}
									</figure>

									{/* <!-- Details --> */}
									<div className="md:w-3/5 md:basis-auto md:pl-8 lg:w-1/2 lg:pl-[3.75rem]">
										{/* <!-- Collection / Likes / Actions --> */}
										<div className="mb-3 flex">
											{/* <!-- Collection --> */}
											<div className="flex items-center">
												<Link href="#">
													<a className="text-accent mr-2 text-sm font-bold">{tournament.game && tournament.game.name}</a>
												</Link>
												{/* <span
													className="dark:border-jacarta-600 bg-green inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white"
													data-tippy-content="Verified Collection"
												>
													<Tippy content={<span>Verified Collection</span>}>
														<svg className="icon h-[.875rem] w-[.875rem] fill-white">
															<use xlinkHref="/icons.svg#icon-right-sign"></use>
														</svg>
													</Tippy>
												</span> */}
											</div>

											{/* <!-- Likes / Actions --> */}
											{tournament && tournament.participants && (
												<div className="ml-auto flex items-stretch space-x-2 relative">
													<div className="">
														<span className="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 flex items-center space-x-1 rounded-xl border bg-white py-1 px-3">
															{tournament.participants.length} / {tournament.number_of_participants}
														</span>
													</div>
												</div>
											)}

										</div>

										<h1 className="font-display text-jacarta-700 mb-4 text-4xl font-semibold dark:text-white">
											{tournament.name}
										</h1>

										<div className="mb-8 flex items-center space-x-4 whitespace-nowrap">
											<div className="flex items-center">
												<Tippy content={<span>ETH</span>}>
													<span className="-ml-1">
														<svg className="icon mr-1 h-4 w-4">
															<use xlinkHref="/icons.svg#icon-ETH"></use>
														</svg>
													</span>
												</Tippy>
												<span className="text-green text-sm font-medium tracking-tight">
													$ {tournament.prize_pool}
												</span>
											</div>
											<span className="dark:text-jacarta-300 text-jacarta-400 text-sm">
												{tournament.game_type}
											</span>
											<span className="dark:text-jacarta-300 text-jacarta-400 text-sm">
												{tournament.game_mode}
											</span>
											<span className="dark:text-jacarta-300 text-jacarta-400 text-sm">
												{tournament.game_format}
											</span>
										</div>

										<p className="dark:text-jacarta-300 mb-10">{tournament.description}</p>

										{/* <!-- Creator / Owner --> */}
										<div className="mb-8 flex flex-wrap">
											<div className="mr-8 mb-4 flex">
												<figure className="mr-4 shrink-0">
													<Link href="/user/avatar_6">
														<a className="relative block">
															<img
																src={`${backendUrl}/${tournament.host && tournament.host.avatar}`}
																alt="creatorname"
																className="rounded-2lg h-12 w-12"
																loading="lazy"
															/>
															<div
																className="dark:border-jacarta-600 bg-green absolute -right-3 top-[60%] flex h-6 w-6 items-center justify-center rounded-full border-2 border-white"
																data-tippy-content="Verified Collection"
															>
																<Tippy content={<span>Verified</span>}>
																	<svg className="icon h-[.875rem] w-[.875rem] fill-white">
																		<use xlinkHref="/icons.svg#icon-right-sign"></use>
																	</svg>
																</Tippy>
															</div>
														</a>
													</Link>
												</figure>
												<div className="flex flex-col justify-center">
													<span className="text-jacarta-400 block text-sm dark:text-white">
														Hosted by
													</span>
													<Link href="/user/avatar_6">
														<a className="text-accent block">
															<span className="text-sm font-bold">{tournament.host && tournament.host.username}</span>
														</a>
													</Link>
												</div>
											</div>

											{/* <div className="mb-4 flex">
												<figure className="mr-4 shrink-0">
													<Link href="/user/avatar_6">
														<a className="relative block">
															<img
																src={`${backendUrl}/${tournament.host.avatar}`}
																alt="host"
																className="rounded-2lg h-12 w-12"
																loading="lazy"
															/>
															<div
																className="dark:border-jacarta-600 bg-green absolute -right-3 top-[60%] flex h-6 w-6 items-center justify-center rounded-full border-2 border-white"
																data-tippy-content="Verified Collection"
															>
																<Tippy content={<span>Verified Collection</span>}>
																	<svg className="icon h-[.875rem] w-[.875rem] fill-white">
																		<use xlinkHref="/icons.svg#icon-right-sign"></use>
																	</svg>
																</Tippy>
															</div>
														</a>
													</Link>
												</figure>
												<div className="flex flex-col justify-center">
													<span className="text-jacarta-400 block text-sm dark:text-white">
														Hosted by
													</span>
													<Link href="/user/avatar_6">
														<a className="text-accent block">
															<span className="text-sm font-bold">{tournament.host && tournament.host.username}</span>
														</a>
													</Link>
												</div>
											</div> */}
										</div>

										{/* <!-- Bid --> */}
										<div className="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 rounded-2lg border bg-white p-8">
											<div className="mb-8 sm:flex sm:flex-wrap">
												{/* <!-- Highest bid --> */}
												<div className="sm:w-1/2 sm:pr-4 lg:pr-8">
													<div className="block overflow-hidden text-ellipsis whitespace-nowrap">
														<span className="dark:text-jacarta-300 text-jacarta-400 text-sm">
															Entry Fee{' '}
														</span>
														<Link href="/user/avatar_6">
															<a className="text-accent text-sm font-bold">
																${tournament.entry_fee}
															</a>
														</Link>
													</div>
													<div className="mt-3 flex">
														{/* <figure className="mr-4 shrink-0">
															<Link href="#">
																<a className="relative block">
																	<img
																		src="/images/avatars/avatar_4.jpg"
																		alt="avatar"
																		className="rounded-2lg h-12 w-12"
																		loading="lazy"
																	/>
																</a>
															</Link>
														</figure> */}
														<div>
															<div className="flex items-center whitespace-nowrap">
																<Tippy content={<span>GOLD</span>}>
																	<span className="-ml-1">
																		<svg className="icon mr-1 h-4 w-4">
																			<use xlinkHref="/icons.svg#icon-ETH"></use>
																		</svg>
																	</span>
																</Tippy>
																<span className="text-green text-lg font-medium leading-tight tracking-tight">
																	price ${tournament.prize_pool}
																</span>
															</div>
															{/* <span className="dark:text-jacarta-300 text-jacarta-400 text-sm">
																~10,864.10
															</span> */}
														</div>
													</div>
												</div>

												{/* <!-- Countdown --> */}
												<div className="dark:border-jacarta-600 sm:border-jacarta-100 mt-4 sm:mt-0 sm:w-1/2 sm:border-l sm:pl-4 lg:pl-8">
													<span className="js-countdown-ends-label text-jacarta-400 dark:text-jacarta-300 text-sm">
														Tournament Begins In
													</span>
													<span className="text-jacarta-400 mt-4 dark:text-jacarta-300 text-lg">
													<p>{formatStartDate(tournament.start_date)}</p>

													</span>
													{/* <Items_Countdown_timer time={countdownTime} /> */}
												</div>
											</div>

											<Link href="#">
											{isJoined ? (
												<button
													className="bg-accent shadow-accent-volume hover:bg-accent-dark inline-block w-full rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
													onClick={() => handleLeave(tournament.uuid)}
												>
													Leave
												</button>
												) : (
													<button
													className="bg-accent shadow-accent-volume hover:bg-accent-dark inline-block w-full rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
													onClick={() => handleRegister(tournament.uuid)}
												>
													Register
												</button>
												)}
											</Link>
										</div>
										{/* <!-- end bid --> */}
									</div>
									{/* <!-- end details --> */}
								</div>
					<ItemsTabs />
				</div>
				<ToastContainer />
			</section>
			{/* <!-- end item --> */}

			<More_items />
		</>
		);
};

export default Item;
