import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import Likes from "../likes";
import Auctions_dropdown from "../dropdown/Auctions_dropdown";
import { useDispatch, useSelector } from "react-redux";
import { buyModalShow } from "../../redux/counterSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CategoryItem = () => {
  const [tournaments, setTournaments] = useState([]);
  const backendUrl = process.env.NEXT_PUBLIC_APP_BACKEND_URL;
  const dispatch = useDispatch();
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
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

    fetchTournaments();
  }, [accessToken]);

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
        toast.success("Successfully registered for the tournament!");
      } else {
        throw new Error("Failed to register for the tournament");
      }
    } catch (error) {
      console.error("Error registering for the tournament:", error);
      toast.error("Failed to register for the tournament");
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
          uuid,
        } = tournament;

        // Function to construct image URLs with the backend URL
        const getImageUrl = (imageUrl) => `${backendUrl}${imageUrl}`;

        return (
          <article key={id}>
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
                  onClick={() => handleRegister(uuid)}
                >
                  Register
                </button>
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

