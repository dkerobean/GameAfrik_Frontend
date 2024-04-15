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

const Create = () => {
  const [accessToken, setAccessToken] = useState("");
  const [gamesData, setGamesData] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    rules: "",
    image: null,
    game: "",
    gameType: "",
    gameMode: "",
    gameFormat: "",
    entryFee: "",
    prizeMoney: "",
    participants: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    // Fetch games data
    const fetchGamesData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/games/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setGamesData(response.data);
      } catch (error) {
        console.error("Error fetching games data:", error);
      }
    };
    fetchGamesData();

    // Retrieve access token from local storage
    const storedAccessToken = localStorage.getItem("accessToken");
    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (file) => {
    setFormData({
      ...formData,
      image: file,
    });
  };

  const handleSubmit = () => {
    // Submit form data to the Django API endpoint
    axios.post(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/tournaments/create/`, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => {
      // Handle successful response
      console.log("Tournament created successfully:", response.data);
    })
    .catch(error => {
      // Handle error
      console.error("Error creating tournament:", error);
    });
  };
  return (
  <div>
    <Meta title="Create || Xhibiter | NFT Marketplace Next.js Template" />
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
                <div className="relative z-10 cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className="fill-jacarta-500 mb-4 inline-block dark:fill-white"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M16 13l6.964 4.062-2.973.85 2.125 3.681-1.732 1-2.125-3.68-2.223 2.15L16 13zm-2-7h2v2h5a1 1 0 0 1 1 1v4h-2v-3H10v10h4v2H9a1 1 0 0 1-1-1v-5H6v-2h2V9a1 1 0 0 1 1-1h5V6zM4 14v2H2v-2h2zm0-4v2H2v-2h2zm0-4v2H2V6h2zm0-4v2H2V2h2zm4 0v2H6V2h2zm4 0v2h-2V2h2zm4 0v2h-2V2h2z" />
                  </svg>
                  <p className="dark:text-jacarta-300 mx-auto max-w-xs text-xs">
                    JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG, GLB, GLTF. Max size: 10 MB
                  </p>
                </div>
                <div className="dark:bg-jacarta-600 bg-jacarta-50 absolute inset-4 cursor-pointer rounded opacity-0 group-hover:opacity-100 ">
                  <FileUploader
                    handleChange={handleFileChange}
                    name="file"
                    types={[
                      "JPG", "PNG", "GIF", "SVG", "MP4", "WEBM",
                      "MP3", "WAV", "OGG", "GLB", "GLTF"
                    ]}
                    classes="file-drag"
                    maxSize={10 * 1024 * 1024} // 10 MB
                    minSize={0}
                  />
                </div>
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
                  name="gameType"
                  value={formData.gameType}
                  onChange={handleChange}
                  className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                >
                  <option value="">Select Game Type</option>
                  {/* Render game types options */}
                </select>
              </div>
              {/* Game Mode */}
              <div>
                <label htmlFor="gameMode" className="font-display text-jacarta-700 mb-2 block dark:text-white">
                  Game Mode
                </label>
                <select
                  id="gameMode"
                  name="gameMode"
                  value={formData.gameMode}
                  onChange={handleChange}
                  className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                >
                  <option value="">Select Game Mode</option>
                  {/* Render game modes options */}
                </select>
              </div>
              {/* Game Format */}
              <div>
                <label htmlFor="gameFormat" className="font-display text-jacarta-700 mb-2 block dark:text-white">
                  Game Format
                </label>
                <select
                  id="gameFormat"
                  name="gameFormat"
                  value={formData.gameFormat}
                  onChange={handleChange}
                  className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                >
                  <option value="">Select Game Format</option>
                  {/* Render game formats options */}
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
                name="entryFee"
                value={formData.entryFee}
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
                name="prizeMoney"
                value={formData.prizeMoney}
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
                name="participants"
                value={formData.participants}
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
                name="startDate"
                value={formData.startDate}
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
                name="endDate"
                value={formData.endDate}
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
    </section>
    {/* End create */}
  </div>
);

};

export default Create;
