import React, { useEffect, useState } from "react";
import Image from "next/image";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { useDispatch, useSelector } from "react-redux";
import { buyModalShow } from "../../redux/counterSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { useRouter } from "next/router";
import Auctions_dropdown from "../dropdown/Auctions_dropdown";

const CategoryItem = () => {
  const [tournaments, setTournaments] = useState([]);
  const [joinedTournaments, setJoinedTournaments] = useState([]);
  const backendUrl = process.env.NEXT_PUBLIC_APP_BACKEND_URL;
  const dispatch = useDispatch();
  const router = useRouter();

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
      const response = await fetch(`${backendUrl}/api/tournaments/hosted/`, {
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

  const handleViewButtonClick = (uuid) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      router.push("/login");
    } else {
      // Redirect to the tournament page
      router.push(`/item/${uuid}`);
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
          uuid,
          participants,
        } = tournament;

        // Function to construct image URLs with the backend URL
        const getImageUrl = (imageUrl) => `${backendUrl}${imageUrl}`;

        // Check if the user has joined this tournament
        const isJoined = joinedTournaments.some(({ uuid }) => uuid === tournament.uuid);

        return (
          <article key={id}>
           <div onClick={() => handleViewButtonClick(uuid)}>
            <Link href={`/item/${uuid}`}>
            <div className="dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 rounded-2.5xl block border bg-white p-[1.1875rem] transition-shadow hover:shadow-lg">
              <figure className="relative">
                <img
                  src={getImageUrl(image)} // Use getImageUrl function to get image URL
                  alt={name}
                  className="w-full h-[230px] rounded-[0.625rem] object-cover"
                />

                {/* Render host and participants */}
                <div className="absolute left-3 -bottom-3">
                  <div className="flex -space-x-2">
                    <Tippy content={<span>Host: {host.username}</span>}>
                      <img
                        src={getImageUrl(host.avatar)} // Use getImageUrl function to get avatar URL
                        alt="Host"
                        className="dark:border-jacarta-600 hover:border-accent dark:hover:border-accent h-6  w-6 rounded-full border-2 border-white"
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
                {/* <Auctions_dropdown classes="dark:hover:bg-jacarta-600 dropup hover:bg-jacarta-100 rounded-full " /> */}
              </div>
              <div className="mt-2 text-sm">
                <span className="dark:text-jacarta-200 text-jacarta-700 mr-1">
                  Entry Fee: {entry_fee}
                </span>
                <span className="dark:text-jacarta-300 text-jacarta-500">
                  Prize Pool: {prize_pool}
                </span>
              </div>
              <div className="mt-8 flex items-center justify-between">

                  <button
                    className="text-accent font-display text-sm font-semibold"
                    onClick={handleViewButtonClick}
                  >
                    View Tournament
                  </button>
              </div>
            </div>
            </Link>
            </div>
          </article>
        );
      })}
      <ToastContainer />
    </div>
  );
};

export default CategoryItem;
