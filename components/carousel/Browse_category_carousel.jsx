import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'tippy.js/dist/tippy.css';
import Link from 'next/link';
import axios from 'axios';

const BrowseCategoryCarousel = () => {
    const [games, setGames] = useState([]);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/games/`);
                setGames(response.data);
            } catch (error) {
                console.error('Failed to fetch games:', error);
            }
        };

        fetchGames();
    }, []);

    return (
        <div className="overflow-hidden">
            <Swiper
                slidesPerView="auto"
                spaceBetween={10}
                loop={true}
                breakpoints={{
                    // when window width is >= 640px
                    100: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                    },
                    // when window width is >= 768px
                    700: {
                        slidesPerView: 4,
                        spaceBetween: 20,
                    },
                    900: {
                        slidesPerView: 5,
                        spaceBetween: 20,
                    },
                    1200: {
                        slidesPerView: 7,
                        spaceBetween: 30,
                    },
                }}
                className="card-slider-4-columns py-5" // Removed unnecessary class notation
                style={{ transform: 'scaleX(1.2)' }}
            >
                {games.map((game) => (
                    <SwiperSlide key={game.id}>
                        <article>
                            <Link href={`/collection/explore_collection/${game.id}`}>
                                <a className="dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 rounded-2xl block border bg-white p-[1.1875rem] transition-shadow hover:shadow-lg">
                                    <figure
                                        style={{ backgroundColor: game.bgColor }}
                                        className="rounded-t-[0.625rem] w-full rounded-[0.625rem]"
                                    >
                                        <img src={`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}${game.image}`} alt={game.name} className="w-full" />
                                    </figure>
                                    <div className="mt-4 text-center">
                                        <span className="font-display text-jacarta-700 text-lg dark:text-white">
                                            {game.name}
                                        </span>
                                    </div>
                                </a>
                            </Link>
                        </article>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default BrowseCategoryCarousel;
