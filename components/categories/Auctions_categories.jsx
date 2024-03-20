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
    // You can implement loading more tournaments here if needed
    setLoadMoreBtn(false);
  };

  return (
    <div>
      <section className="py-24">
        <div className="container">
          <HeadLine
            image={`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/emoji-datasource-apple@7.0.2/img/apple/64/2764-fe0f.png`}
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
                      <Likes
                        like={participants.length}
                        classes="flex items-center space-x-1"
                      />
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
