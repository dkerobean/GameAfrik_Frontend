import React, { useState, useEffect } from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // optional
import Collection_dropdown2 from "../../components/dropdown/collection_dropdown2";
import {
  collectionDropdown2_data,
  EthereumDropdown2_data,
} from "../../data/dropdown";
import { FileUploader } from "react-drag-drop-files";
import Proparties_modal from "../../components/modal/proparties_modal";
import { useDispatch } from "react-redux";
import { showPropatiesModal } from "../../redux/counterSlice";
import Meta from "../../components/Meta";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Create = () => {
  const [accessToken, setAccessToken] = useState("");
  const [gamesData, setGamesData] = useState([]);
  const [gameModes, setGameModes] = useState([]);
  const [gameTypes, setGameTypes] = useState([]);
  const [gameFormats, setGameFormats] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    rules: "",
    image: null, // Initialize image field to null
    game: "",
    game_type: "",
    game_mode: "",
    game_format: "",
    entry_fee: "",
    prize_pool: "",
    number_of_participants: "",
    start_date: "",
    end_date: "",
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
        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/games/`, {
          headers: {
            Authorization: `Bearer ${storedAccessToken}`,
          },
        });
        setGamesData(response.data);
      } catch (error) {
        console.error("Error fetching games data:", error);
      }
    };
    fetchGamesData();

    const fetchGameModes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/tournament/game_modes/"
        );
        setGameModes(response.data);
      } catch (error) {
        console.error("Error fetching game modes:", error);
      }
    };

    const fetchGameTypes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/tournament/game_types/"
        );
        setGameTypes(response.data);
      } catch (error) {
        console.error("Error fetching game types:", error);
      }
    };

    const fetchGameFormats = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/tournament/game_formats/"
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

  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


const handleFileChange = (files) => {
  const file = files[0];
  if (file instanceof File) {
    setFormData({
      ...formData,
      image: file,
    });
  }

};

const handleSubmit = async (e) => {
  e.preventDefault();

  // Create a new FormData instance
  const data = new FormData();

  // Append all form fields to the form data
  Object.keys(formData).forEach((key) => {
    data.append(key, formData[key]);
  });     

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/tournament/create/`,
      data, // Send the form data
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // Add this line to set the content type as form data
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.status === 201) {
      toast.success(`Tournament created successfully`);
    } else {
      toast.error("Error creating tournament");
    }
  } catch (error) {
    console.error("Error creating tournament:", error);
    toast.error("Error creating tournament");
    console.log("formData error", formData);
  }
};



  return (
  <div>
    <Meta title="Create" />
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
          Create Tournament
        </h1>
        <div className="mx-auto max-w-[48.125rem]">
          {/* Form */}
          <form onSubmit={handleSubmit}>

            {/* Name */}
            <div className="mb-6">
              <label htmlFor="item-name" className="font-display text-jacarta-700 mb-2 block dark:text-white">
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
              <label htmlFor="item-description" className="font-display text-jacarta-700 mb-2 block dark:text-white">
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
                  Drag or choose your file to upload
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
                {formData.image ? `File selected: ${formData.image.name}` : "Choose file"}
              </label>
              </div>
            </div>

            {/* Game */}
            <div className="mb-6">
              <label htmlFor="game" className="font-display text-jacarta-700 mb-2 block dark:text-white">
                Choose Game
              </label>
              <select
                id="game"
                name="game"
                value={formData.game}
                onChange={handleChange}
                className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
              >
                <option value="">Select Game</option>
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
                <label htmlFor="gameType" className="font-display text-jacarta-700 mb-2 block dark:text-white">
                  Game Type
                </label>
                <select
                  id="gameType"
                  name="game_type"
                  value={formData.game_type}
                  onChange={handleChange}
                  className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                >
                  <option value="">Select Game Type</option>
                  {gameTypes.map((game) => (
                  <option key={game.id} value={game.name}>
                    {game.name}
                  </option>
                ))}
                </select>
              </div>
              {/* Game Mode */}
              <div>
                <label htmlFor="gameMode" className="font-display text-jacarta-700 mb-2 block dark:text-white">
                  Game Mode
                </label>
                <select
                  id="gameMode"
                  name="game_mode"
                  value={formData.game_mode}
                  onChange={handleChange}
                  className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                >
                  <option value="">Select Game Mode</option>
                  {gameModes.map((game) => (
                  <option key={game.id} value={game.name}>
                    {game.name}
                  </option>
                ))}
                </select>
              </div>
              {/* Game Format */}
              <div>
                <label htmlFor="gameFormat" className="font-display text-jacarta-700 mb-2 block dark:text-white">
                  Game Format
                </label>
                <select
                  id="gameFormat"
                  name="game_format"
                  value={formData.game_format}
                  onChange={handleChange}
                  className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                >
                  <option value="">Select Game Format</option>
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
              <label htmlFor="entryFee" className="font-display text-jacarta-700 mb-2 block dark:text-white">
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
              <label htmlFor="prizeMoney" className="font-display text-jacarta-700 mb-2 block dark:text-white">
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
              <label htmlFor="participants" className="font-display text-jacarta-700 mb-2 block dark:text-white">
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
              <label htmlFor="startDate" className="font-display text-jacarta-700 mb-2 block dark:text-white">
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
              <label htmlFor="endDate" className="font-display text-jacarta-700 mb-2 block dark:text-white">
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
              Create Tournament
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

export default Create;
