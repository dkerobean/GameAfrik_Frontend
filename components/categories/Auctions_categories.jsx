import React, { useState, useEffect } from "react";
import HeadLine from "../headLine";
import Tippy from "@tippyjs/react";
import Countdown_timer from "../Countdown_timer";
import Auctions_dropdown from "../dropdown/Auctions_dropdown";
import Link from "next/link";
import { useDispatch } from "react-redux";
import "tippy.js/themes/light.css";
import Image from "next/image";
import Likes from "../likes";

const Auctions_categories = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [loadMoreBtn, setLoadMoreBtn] = useState(true);

  useEffect(() => {
    // Function to fetch tournaments from the API
    const fetchTournaments = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/tournaments/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.ok) {
          const tournamentsData = await response.json();
          setData(tournamentsData);
        } else {
          throw new Error("Failed to fetch tournaments");
        }
      } catch (error) {
        console.error("Error fetching tournaments:", error);
      }
    };

    fetchTournaments();
  }, []);

  const handleloadMore = () => {
    setLoadMoreBtn(false);
  };

  return (
    <div>
      <section className="py-24">
        <div className="container">
          <HeadLine
            // image={`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/emoji-datasource-apple@7.0.2/img/apple/64/2764-fe0f.png`}
            text="All Tournaments"
            classes="font-display text-jacarta-700 mb-8 text-center text-3xl dark:text-white"
          />
          <div className="grid grid-cols-1 gap-[1.875rem] md:grid-cols-2 lg:grid-cols-4">
            {data.map((tournament) => {
              const {
                id,
                image,
                name,
                host,
                participants,
                game_type,
                game_mode,
                game_format,
                entry_fee,
                prize_pool,
                start_date,
                end_date,
                status,
                uuid,
              } = tournament;

              return (
                <article key={id}>
                  <div className="dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 rounded-2xl block border bg-white p-[1.1875rem] transition-shadow hover:shadow-lg">
                    <figure className="relative">
                      <img
                        src={`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}${image}`}
                        alt={name}
                        className="w-full h-[230px] rounded-[0.625rem] object-cover"
                      />
                      <div className="absolute top-0 left-0 bg-black bg-opacity-50 text-white p-2 rounded-tl rounded-br">
                      <span className="rounded bg-red py-1 px-2 text-tiny font-bold uppercase leading-none text-white ml-4">
                        {participants.length} / 12
                      </span>
                        {/* <div className="bg-black bg-opacity-50 rounded px-2 py-1">
                          <span className="font-bold"></span> Participants
                        </div> */}
                      </div>
                      <Countdown_timer
                        time={new Date(start_date).getTime() - Date.now()}
                      />
                      <div className="absolute left-3 -bottom-3">
                        <div className="flex -space-x-2">
                          <Tippy content={<span>Host: {host.username}</span>}>
                            <img
                              src={`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}${host.avatar}`}
                              alt="Host"
                              className="h-6 w-6 rounded-full border-2 border-white"
                            />
                          </Tippy>
                          {participants.map((participant, index) => (
                            <Tippy
                              key={index}
                              content={
                                <span>
                                  Participant: {participant.username}{" "}
                                </span>
                              }
                            >
                              <img
                                src={`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}${participant.avatar}`}
                                alt="Participant"
                                className="h-6 w-6 rounded-full border-2 border-white"
                              />
                            </Tippy>
                          ))}
                        </div>
                      </div>
                    </figure>
                    <div className="mt-7 flex items-center justify-between">
                      <span className="font-display text-jacarta-700 text-base dark:text-white">
                        {name}
                      </span>
                    </div>
                    <div className="mt-2 text-sm">
                      <span className="dark:text-jacarta-300 text-jacarta-500">
                        Prize Pool: ${prize_pool}
                      </span>
                    </div>
                    <div className="mt-8 flex items-center justify-between">
                      <button
                        className="text-accent font-display text-sm font-semibold"
                        onClick={() => dispatch(bidsModalShow())}
                      >
                        View
                      </button>
                      <Link href="#">
                        <a className="group flex items-center">
                          <svg className="icon icon-history group-hover:fill-accent dark:fill-jacarta-200 fill-jacarta-500 mr-1 mb-[3px] h-4 w-4">
                            <use xlinkHref="/icons.svg#icon-history"></use>
                          </svg>
                          <span className="group-hover:text-accent font-display dark:text-jacarta-200 text-sm font-semibold">
                            Free Entry
                          </span>
                        </a>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          {loadMoreBtn && (
            <div className="mt-10 text-center">
              <button
                onClick={handleloadMore}
                className="bg-accent shadow-accent-volume hover:bg-accent-dark inline-block rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Auctions_categories;
