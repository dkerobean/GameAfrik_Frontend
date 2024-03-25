import React, { useEffect, useState } from "react";
import Image from "next/image";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import Likes from "../likes";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Countdown_timer from "../Countdown_timer";
import Link from "next/link";

const CategoryItem = () => {
  const [tournaments, setTournaments] = useState([]);
  const [joinedTournaments, setJoinedTournaments] = useState([]);
  const backendUrl = process.env.NEXT_PUBLIC_APP_BACKEND_URL;
  const dispatch = useDispatch();
  const accessToken = localStorage.getItem("accessToken");

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
  }, [accessToken]);

  const fetchJoinedTournaments = async () => {
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

  return (
    <div className="grid grid-cols-1 gap-[1.875rem] md:grid-cols-2 lg:grid-cols-4">
      {tournaments.map((tournament) => {
        const {
          id,
          name,
          image,
          game_type,
          game_mode,
          game_format,
          entry_fee,
          prize_pool,
          start_date,
          end_date,
          status,
          host,
          participants,
          number_of_participants,
          uuid,
        } = tournament;

        // Function to construct image URLs with the backend URL
        const getImageUrl = (imageUrl) => `${backendUrl}${imageUrl}`;

        // Calculate the countdown time based on the start_date
        const currentTime = new Date().getTime();
        const startTime = new Date(start_date).getTime();
        const countdownTime = startTime - currentTime;

        // Calculate the total number of participants
        const totalParticipants = participants.length;

        // Check if the user has joined this tournament
        const isJoined = joinedTournaments.some(tournament => tournament.uuid === uuid);

        return (
          <article key={id}>
            <div className="dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 rounded-2.5xl block border bg-white p-[1.1875rem] transition-shadow hover:shadow-lg">
              <figure className="relative">
                <img
                  src={getImageUrl(image)} // Use getImageUrl function to get image URL
                  alt={name}
                  className="w-full h-[230px] rounded-[0.625rem] object-cover"
                />
                <div className="absolute top-0 left-0 bg-black bg-opacity-50 text-white p-2 rounded-tl rounded-br">
                      <span className="rounded bg-red py-1 px-2 text-tiny font-bold uppercase leading-none text-white ml-4">
                        {participants.length} / {number_of_participants}
                      </span>
                        {/* <div className="bg-black bg-opacity-50 rounded px-2 py-1">
                          <span className="font-bold"></span> Participants
                        </div> */}
                      </div>
                  <Countdown_timer time={countdownTime} />
                {/* Render host and participants */}
                <div className="absolute left-3 -bottom-3">
                  <div className="flex -space-x-2">
                    <Tippy content={<span>Host: {host.username}</span>}>
                      <img
                        src={getImageUrl(host.avatar)}
                        alt="Host"
                        className="dark:border-jacarta-600 hover:border-accent dark:hover:border-accent h-6 w-6 rounded-full border-2 border-white"
                      />
                    </Tippy>
                    {participants.map((participant, index) => (
                      <Tippy
                        key={index}
                        content={<span>Participant: {participant.username} </span>}
                      >

                        <img
                          key={index}
                          src={getImageUrl(participant.avatar)}
                          alt="Participant"
                          className="dark:border-jacarta-600 hover:border-accent dark:hover:border-accent h-6 w-6 rounded-full border-2 border-white"
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
                {/* <span className="dark:text-jacarta-200 text-jacarta-700 mr-1">
                  Entry Fee: {entry_fee}
                </span> */}
                <span className="dark:text-jacarta-300 text-jacarta-500">
                  Prize Pool: ${prize_pool}
                </span>
              </div>
              <div className="mt-8 flex items-center justify-between">
                {isJoined ? (
                  <button
                    className="text-accent font-display text-sm font-semibold"
                    onClick={() => handleLeave(uuid)}
                  >
                    Leave
                  </button>
                ) : (
                  <button
                    className="text-accent font-display text-sm font-semibold"
                    onClick={() => handleRegister(uuid)}
                  >
                    Register
                  </button>
                )}
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
      <ToastContainer />
    </div>
  );
};

export default CategoryItem;
