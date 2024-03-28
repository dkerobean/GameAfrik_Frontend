import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import "tippy.js/dist/tippy.css";
import { useDispatch } from "react-redux";
import Likes from "../likes";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import { bidsModalShow } from "../../redux/counterSlice";
import Link from "next/link";
import Tippy from "@tippyjs/react";
import { useRouter } from "next/router";

const BidsCarousel = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [tournament, setTournament] = useState([]);

  useEffect(() => {
    const fetchBidsData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/tournaments/`
        );
        if (response.ok) {
          const data = await response.json();
          setTournament(data);
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchBidsData();
  }, []);

  return (
    <>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar]}
        spaceBetween={30}
        slidesPerView="auto"
        loop={true}
        breakpoints={{
          240: {
            slidesPerView: 1,
          },
          565: {
            slidesPerView: 2,
          },
          1000: {
            slidesPerView: 3,
          },
          1100: {
            slidesPerView: 4,
          },
        }}
        navigation={{
          nextEl: ".bids-swiper-button-next",
          prevEl: ".bids-swiper-button-prev",
        }}
        className=" card-slider-4-columns !py-5"
      >
        {tournament.map((item) => {
          const { id, image, name, entry_fee, prize_pool, number_of_participants} =
            item;
          const itemLink = image
            .split("/")
            .slice(-1)
            .toString()
            .replace(".jpg", "");

          const imageUrl = `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}${image}`;

          return (
            <SwiperSlide className="text-white" key={id}>
              <article>
                <div className="dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 rounded-2xl block border bg-white p-[1.1875rem] transition-shadow hover:shadow-lg text-jacarta-500">
                  <figure>
                    <Link href={"/item/" + itemLink}>
                      <a>
                        <div className="w-full">
                          <Image
                            src={imageUrl}
                            alt="tournament-image"
                            height={230}
                            width={230}
                            layout="responsive"
                            objectFit="cover"
                            className="rounded-[0.625rem] w-full"
                            loading="lazy"
                          />
                        </div>
                      </a>
                    </Link>
                  </figure>
                  <div className="mt-4 flex items-center justify-between">
                    <Link href={"/item/" + itemLink}>
                      <a>
                        <span className="font-display text-jacarta-700 hover:text-accent text-base dark:text-white">
                          {name}
                        </span>
                      </a>
                    </Link>
                    <span className="dark:border-jacarta-600 border-jacarta-100 flex items-center whitespace-nowrap rounded-md border py-1 px-2">
                      <Tippy content={<span>GOLD</span>}>
                        <img
                          src="/images/eth-icon.svg"
                          alt=""
                          className="w-3 h-3 mr-1"
                        />
                      </Tippy>
                      <span className="text-green text-sm font-medium tracking-tight">
                        ${prize_pool}
                      </span>
                    </span>
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="dark:text-jacarta-300 text-jacarta-500">
                      Entry Fee
                    </span>
                    <span className="dark:text-jacarta-100 text-jacarta-700 ml-2">
                       ${entry_fee}
                    </span>
                  </div>
                  <div className="mt-8 flex items-center justify-between">
                    <button
                      type="button"
                      className="text-accent font-display text-sm font-semibold"
                      onClick={() => dispatch(bidsModalShow())}
                    >
                      View
                    </button>
                    <Likes
                      like={number_of_participants}
                      classes="flex items-center space-x-1"
                    />
                  </div>
                </div>
              </article>
            </SwiperSlide>
          );
        })}
      </Swiper>
      {/* <!-- Slider Navigation --> */}
      <div className="group bids-swiper-button-prev swiper-button-prev shadow-white-volume absolute !top-1/2 !-left-4 z-10 -mt-6 flex !h-12 !w-12 cursor-pointer items-center justify-center rounded-full bg-white p-3 text-jacarta-700 text-xl sm:!-left-6 after:hidden">
        <MdKeyboardArrowLeft />
      </div>
      <div className="group bids-swiper-button-next swiper-button-next shadow-white-volume absolute !top-1/2 !-right-4 z-10 -mt-6 flex !h-12 !w-12 cursor-pointer items-center justify-center rounded-full bg-white p-3 text-jacarta-700 text-xl sm:!-right-6 after:hidden">
        <MdKeyboardArrowRight />
      </div>
    </>
  );
};

export default BidsCarousel;
