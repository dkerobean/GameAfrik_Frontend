import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from 'next/router';

const Edit = () => {

  const router = useRouter();
  const { tournamentUuid } = router.query;

  const [accessToken, setAccessToken] = useState("");
  const [gamesData, setGamesData] = useState([]);
  const [gameModes, setGameModes] = useState([]);
  const [gameTypes, setGameTypes] = useState([]);
  const [gameFormats, setGameFormats] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    rules: "",
    image: null,
    game: "",
    game_type: "",
    game_mode: "",
    game_format: "",
    entry_fee: "",
    prize_pool: "",
    number_of_participants: "",
    start_date: "",
    end_date: "",
    game_id: "",
  });


  useEffect(() => {
    // Fetch access token from local storage
    const storedAccessToken = localStorage.getItem("accessToken");

    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
    }

    // Fetch games data
    const fetchGamesData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/games/`,
          {
            headers: {
              Authorization: `Bearer ${storedAccessToken}`,
            },
          }
        );
        setGamesData(response.data);
      } catch (error) {
        console.error("Error fetching games data:", error);
      }
    };
    fetchGamesData();

    const fetchGameModes = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/tournament/game_modes/`
        );
        setGameModes(response.data);
      } catch (error) {
        console.error("Error fetching game modes:", error);
      }
    };

    const fetchGameTypes = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/tournament/game_types/`
        );
        setGameTypes(response.data);
      } catch (error) {
        console.error("Error fetching game types:", error);
      }
    };

    const fetchGameFormats = async () => {
      try {
        const response = await axios.get(
         `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/tournament/game_formats/`
        );
        setGameFormats(response.data);
      } catch (error) {
        console.error("Error fetching game formats:", error);
      }
    };

    // Execute all fetch functions
    fetchGameModes();
    fetchGameTypes();
    fetchGameFormats();

    // Fetch tournament data
    const fetchTournamentData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/tournament/single/${tournamentUuid}/`,
          {
            headers: {
              Authorization: `Bearer ${storedAccessToken}`,
            },
          }
        );
        const tournamentData = response.data;

        console.log("here is the tournament data", tournamentData);

        // Convert ISO 8601 format to datetime-local format
      const startDate = tournamentData.start_date.replace("Z", "");
      const endDate = tournamentData.end_date.replace("Z", "");

        // Set form data with fetched tournament data
        setFormData({
          name: tournamentData.name,
          rules: tournamentData.rules,
          game: tournamentData.game.id,
          game_type: tournamentData.game_type,
          game_mode: tournamentData.game_mode,
          game_format: tournamentData.game_format,
          entry_fee: tournamentData.entry_fee,
          prize_pool: tournamentData.prize_pool,
          number_of_participants: tournamentData.number_of_participants,
          start_date: startDate,
          end_date: endDate,
          image: tournamentData.image,
          game_id: tournamentData.game.id,
        });
      } catch (error) {
        console.error("Error fetching tournament data:", error);
      }
    };

    fetchTournamentData();
  }, [tournamentUuid]); //


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleFileChange = (files) => {
    const file = files[0];
    if (file instanceof File) {
      // If a file is uploaded, update the image field with the new file object
      setFormData({
        ...formData,
        image: file,
      });
    } else {
      // If no file is uploaded, keep the existing image value unchanged
      setFormData({
        ...formData,
        image: tournamentData.image,
      });
    }
  };

  console.log("here is the form data", formData)

  const handleSubmit = async (e) => {
    console.log(formData)
    e.preventDefault();

  // Create a new FormData instance
  const data = new FormData();

  // Append all form fields to the FormData instance
  Object.keys(formData).forEach((key) => {
    // If the key is 'image' and the value is a string, skip appending it
    if (key === 'image' && typeof formData[key] === 'string') {
      return;
    }
    data.append(key, formData[key]);
  });

  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/tournament/edit/${tournamentUuid}/`,
      data, // send FormData instance
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data', // add this line
        },
      }
    );

    if (response.status === 200) {
      toast.success("Tournament updated successfully");
      // Delay the redirection for 2 seconds
      setTimeout(() => {
          router.push('/user/avatar_6');
      }, 2000);
    } else {
      toast.error("Error updating tournament");
    }
  } catch (error) {
    console.error("Error updating tournament:", error);
    toast.error("Error updating tournament");
  }
};

  return (
    <div>
      {/* Create */}
      <section className="relative py-24">
        <picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
          <img
            src="/images/gradient_light.jpg"
            alt="gradient"
            className="h-full w-full"
          />
        </picture>
        <div className="container">
          <h1 className="font-display text-jacarta-700 py-16 text-center text-4xl font-medium dark:text-white">
            Edit Tournament
          </h1>
          <div className="mx-auto max-w-[48.125rem]">
            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div className="mb-6">
                <label
                  htmlFor="item-name"
                  className="font-display text-jacarta-700 mb-2 block dark:text-white"
                >
                  Name<span className="text-red">*</span>
                </label>
                <input
                  type="text"
                  id="item-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                  placeholder="Tournament Name"
                  required
                />
              </div>

              {/* Rules */}
              <div className="mb-6">
                <label
                  htmlFor="item-description"
                  className="font-display text-jacarta-700 mb-2 block dark:text-white"
                >
                  Rules
                </label>
                <textarea
                  id="item-description"
                  name="rules"
                  value={formData.rules}
                  onChange={handleChange}
                  className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                  rows="4"
                  required
                  placeholder="Provide rules for this tournament."
                ></textarea>
              </div>

              {/* File Upload */}
              <div className="mb-6">
                <label className="font-display text-jacarta-700 mb-2 block dark:text-white">
                  Image<span className="text-red">*</span>
                </label>
                {formData.image ? (
                  <p className="dark:text-jacarta-300 text-2xs mb-3">
                    Successfully uploaded: {formData.image.name}
                  </p>
                ) : (
                  <p className="dark:text-jacarta-300 text-2xs mb-3">
                    Drag or choose your file to upload: {formData.image}
                  </p>
                )}
                <div className="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 group relative flex max-w-md flex-col items-center justify-center rounded-lg border-2 border-dashed bg-white py-20 px-5 text-center">
                  <input
                    type="file"
                    name="image"
                    id="fileInput"
                    accept=".jpg, .png, .svg, .webm"
                    onChange={(e) => handleFileChange(e.target.files)}
                    className="hidden"
                  />
                  <label htmlFor="fileInput" className="cursor-pointer dark:text-jacarta-300">
                    {formData.image ? `File selected: ${formData.image}` : "Choose file"}
                  </label>
                </div>
              </div>

              {/* Game */}
              <div className="mb-6">
                <label htmlFor="game" className="font-display text-jacarta-700 mb-2 block dark:text-white">
                  Choose A Game
                </label>
                <select
                  id="game"
                  name="game"
                  value={formData.game_id}
                  onChange={handleChange}
                  className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                >
                  <option value="">{formData.game}</option>
                  {gamesData.map((game) => (
                    <option key={game.id} value={game.id}>
                      {game.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Game Type, Mode, Format */}
              <div className="grid grid-cols-3 gap-6">
                {/* Game Type */}
                <div>
                  <label
                    htmlFor="gameType"
                    className="font-display text-jacarta-700 mb-2 block dark:text-white"
                  >
                    Game Type
                  </label>
                  <select
                    id="gameType"
                    name="game_type"
                    value={formData.game_type}
                    onChange={handleChange}
                    className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                  >
                    <option value="">{formData.game_type}</option>
                    {gameTypes.map((game) => (
                      <option key={game.id} value={game.name}>
                        {game.name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Game Mode */}
                <div>
                  <label
                    htmlFor="gameMode"
                    className="font-display text-jacarta-700 mb-2 block dark:text-white"
                  >
                    Game Mode
                  </label>
                  <select
                    id="gameMode"
                    name="game_mode"
                    value={formData.game_mode}
                    onChange={handleChange}
                    className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                  >
                    <option value="">{formData.game_mode}</option>
                    {gameModes.map((game) => (
                      <option key={game.id} value={game.name}>
                        {game.name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Game Format */}
                <div>
                  <label
                    htmlFor="gameFormat"
                    className="font-display text-jacarta-700 mb-2 block dark:text-white"
                  >
                    Game Format
                  </label>
                  <select
                    id="gameFormat"
                    name="game_format"
                    value={formData.game_format}
                    onChange={handleChange}
                    className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                  >
                    <option value="">{formData.game_format}</option>
                    {gameFormats.map((game) => (
                      <option key={game.id} value={game.name}>
                        {game.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Entry Fee */}
              <div className="mb-6">
                <label
                  htmlFor="entryFee"
                  className="font-display text-jacarta-700 mb-2 block dark:text-white"
                >
                  Entry Fee
                </label>
                <input
                  type="number"
                  id="entryFee"
                  name="entry_fee"
                  value={formData.entry_fee}
                  onChange={handleChange}
                  className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                  placeholder="Entry Fee"
                />
              </div>

              {/* Prize Money */}
              <div className="mb-6">
                <label
                  htmlFor="prizeMoney"
                  className="font-display text-jacarta-700 mb-2 block dark:text-white"
                >
                  Prize Money
                </label>
                <input
                  type="number"
                  id="prizeMoney"
                  name="prize_pool"
                  value={formData.prize_pool}
                  onChange={handleChange}
                  className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                  placeholder="Prize Money"
                />
              </div>

              {/* Number of Participants */}
              <div className="mb-6">
                <label
                  htmlFor="participants"
                  className="font-display text-jacarta-700 mb-2 block dark:text-white"
                >
                  Number of Participants
                </label>
                <input
                  type="number"
                  id="participants"
                  name="number_of_participants"
                  value={formData.number_of_participants}
                  onChange={handleChange}
                  className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                  placeholder="Number of Participants"
                />
              </div>

              {/* Start Date */}
              <div className="mb-6">
                <label
                  htmlFor="startDate"
                  className="font-display text-jacarta-700 mb-2 block dark:text-white"
                >
                  Start Date
                </label>
                <input
                  type="datetime-local"
                  id="startDate"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                />
              </div>

              {/* End Date */}
              <div className="mb-10">
                <label
                  htmlFor="endDate"
                  className="font-display text-jacarta-700 mb-2 block dark:text-white"
                >
                  End Date
                </label>
                <input
                  type="datetime-local"
                  id="endDate"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-accent-lighter cursor-default rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
              >
                Save Tournament
              </button>
            </form>
          </div>
        </div>
        <ToastContainer />
      </section>
      {/* End create */}
    </div>
  );
};

export default Edit;
