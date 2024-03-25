import React, { useEffect, useState } from "react";
import Image from "next/image";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { useDispatch, useSelector } from "react-redux";
import { buyModalShow } from "../../redux/counterSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Countdown_timer from "../Countdown_timer";
import Likes from "../likes";
import Link from "next/link";

const CategoryItem = () => {
  const [tournaments, setTournaments] = useState([]);
  const [joinedTournaments, setJoinedTournaments] = useState([]);
  const backendUrl = process.env.NEXT_PUBLIC_APP_BACKEND_URL;
  const dispatch = useDispatch();

  const fetchTournaments = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/tournaments/`);
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

  const fetchJoinedTournaments = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/tournaments/joined/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
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

  useEffect(() => {
    fetchTournaments();
    fetchJoinedTournaments();
  }, []);

  const handleJoinTournament = async (tournamentId) => {
    try {
      const response = await fetch(`${backendUrl}/api/tournaments/join/${tournamentId}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (response.ok) {
        // Refresh joined tournaments list
        fetchJoinedTournaments();
      } else {
        throw new Error("Failed to join tournament");
      }
    } catch (error) {
      console.error("Error joining tournament:", error);
    }
  };

  const handleLeaveTournament = async (tournamentId, tournamentName) => {
    try {
      const response = await fetch(`${backendUrl}/api/tournament/leave/${tournamentId}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (response.ok) {
        fetchJoinedTournaments();
        toast.success(`Left tournament "${tournamentName}" successfully`);
      } else {
        throw new Error("Failed to leave tournament");
      }
    } catch (error) {
      console.error("Error leaving tournament:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-[1.875rem] md:grid-cols-2 lg:grid-cols-4">
      {joinedTournaments.map((tournament) => {
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
        } = tournament;

        // Function to construct image URLs with the backend URL
        const getImageUrl = (imageUrl) => `${backendUrl}${imageUrl}`;

        // Check if the user has joined this tournament
        const isJoined = joinedTournaments.some(({ uuid }) => uuid === tournament.uuid);

        // Calculate the countdown time based on the start_date
        const currentTime = new Date().getTime();
        const startTime = new Date(start_date).getTime();
        const countdownTime = startTime - currentTime;

        // Calculate the total number of participants
        const totalParticipants = participants.length;

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
                    {participants.length} / 12
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
                        src={getImageUrl(host.avatar)} // Use getImageUrl function to get avatar URL
                        alt="Host"
                        className="dark:border-jacarta-600 hover:border-accent dark:hover:border-accent h-6 w-6 rounded-full border-2 border-white"
                      />
                    </Tippy>
                    {participants.map((participant, index) => (
                      <Tippy
                        key={index}
                        content={<span>Participant: {participant.username}</span>}
                      >
                        <img
                          key={index}
                          src={getImageUrl(participant.avatar)} // Use getImageUrl function to get avatar URL
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
                    onClick={() => handleLeaveTournament(tournament.uuid, tournament.name)}
                  >
                    Leave
                  </button>
                ) : (
                  <button
                    className="text-accent font-display text-sm font-semibold"
                    onClick={() => handleJoinTournament(tournament.uuid)}
                  >
                    Join
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
