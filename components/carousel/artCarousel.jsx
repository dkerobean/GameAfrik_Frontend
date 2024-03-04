import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import Image from 'next/image';
import 'tippy.js/dist/tippy.css';
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from 'react-icons/md';
import Link from 'next/link';
import axios from 'axios';

const ArtsCarousel = () => {
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/tournaments/`);
        if (response.status === 200) {
          // Append backend URL to image URLs
          const tournamentsWithImageUrl = response.data.map(tournament => ({
            ...tournament,
            image: `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}${tournament.image}`,
            hostAvatar: `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}${tournament.host.avatar}` // Add hostAvatar property
          }));
          setTournaments(tournamentsWithImageUrl);
          console.log(tournamentsWithImageUrl);
        } else {
          throw new Error('Failed to fetch tournaments');
        }
      } catch (error) {
        console.error('Error fetching tournaments:', error);
      }
    };

    fetchTournaments();
  }, []);

  return (
    <>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        slidesPerView="auto"
        breakpoints={{
          640: { slidesPerView: 1, spaceBetween: 20 },
          768: { slidesPerView: 2, spaceBetween: 20 },
          900: { slidesPerView: 2, spaceBetween: 20 },
          1100: { slidesPerView: 3, spaceBetween: 30 },
        }}
        navigation={{ nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }}
        className="card-slider-4-columns !py-5"
      >
        {tournaments.map((tournament) => (
          <SwiperSlide key={tournament.id}>
            <article>
              <div className="dark:bg-jacarta-700 rounded-lg block overflow-hidden bg-white shadow-md transition-shadow hover:shadow-lg">
                <figure className="relative">
                  <Link href={`/item/${tournament.id}`}>
                    <a>
                      <Image
                        src={tournament.image}
                        alt={tournament.title}
                        height="430"
                        width="379"
                        layout="responsive"
                        className="swiper-lazy h-[430px] w-full object-cover swiper-lazy-loaded rounded-2.5xl"
                      />
                    </a>
                  </Link>
                </figure>
                <div className="p-6">
                  <div className="flex">
                    <Link href={`/item/${tournament.id}`}>
                      <a className="shrink-0 mr-4">
                        <Image
                          src={tournament.hostAvatar} // Use hostAvatar property
                          alt={tournament.host.username}
                          height={40}
                          width={40}
                          className="mr-4 h-10 w-10 rounded-full"
                        />
                      </a>
                    </Link>
                    <div>
                      <Link href={`/item/${tournament.id}`}>
                        <a className="block">
                          <span className="font-display hover:text-accent text-jacarta-700 text-lg leading-none dark:text-white">
                            {tournament.name}
                          </span>
                        </a>
                      </Link>
                      <Link href={`/item/${tournament.id}`}>
                        <a className="text-accent text-2xs">{tournament.host.username}</a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="group swiper-button-prev shadow-white-volume absolute !top-1/2 !-left-4 z-10 -mt-6 flex !h-12 !w-12 cursor-pointer items-center justify-center rounded-full bg-white p-3 text-jacarta-700 text-xl sm:!-left-6 after:hidden">
        <MdKeyboardArrowLeft />
      </div>
      <div className="group swiper-button-next shadow-white-volume absolute !top-1/2 !-right-4 z-10 -mt-6 flex !h-12 !w-12 cursor-pointer items-center justify-center rounded-full bg-white p-3 text-jacarta-700 text-xl sm:!-right-6 after:hidden">
        <MdKeyboardArrowRight />
      </div>
    </>
  );
};

export default ArtsCarousel;