import { useEffect, useReducer, useRef } from "react";
import Button from "./Button";
import { TiLocationArrow } from "react-icons/ti";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
const totalVideos: number = 4;

gsap.registerPlugin(ScrollTrigger);

interface VidState {
  currentIndex: number;
  isClicked: boolean;
  isLoading: boolean;
  loadedVideos: number;
}

const VidInitialState: VidState = {
  currentIndex: 1,
  isClicked: false,
  isLoading: true,
  loadedVideos: 0,
};

type Action =
  | { type: "incrementIndex"; value: number }
  | { type: "clicked"; value: boolean }
  | { type: "loading"; value: boolean }
  | { type: "loadedVidNum"; value: number };

const reducer = (state: VidState, action: Action): VidState => {
  switch (action.type) {
    case "incrementIndex":
      return {
        ...state,
        currentIndex: (state.currentIndex % totalVideos) + action.value,
      };
    case "clicked":
      return { ...state, isClicked: action.value };
    case "loading":
      return { ...state, isLoading: action.value };
    case "loadedVidNum":
      return { ...state, loadedVideos: state.loadedVideos + action.value };
    default:
      return state;
  }
};
const Hero = () => {
  const nextVideoRef = useRef<HTMLVideoElement>(null);
  const [state, dispatch] = useReducer(reducer, VidInitialState);

  const handleVideoLoad = () => {
    dispatch({ type: "loadedVidNum", value: 1 });
  };

  const handleVideoClick = () => {
    dispatch({ type: "clicked", value: true });
    dispatch({ type: "incrementIndex", value: 1 });
  };

  useEffect(() => {
    if (state.loadedVideos === totalVideos - 1) {
      dispatch({ type: "loading", value: false });
    }
  }, [state.loadedVideos]);

  useGSAP(
    () => {
      if (state.isClicked) {
        gsap.set("#next-video", { visibility: "visible" });
        gsap.to("#next-video", {
          transformOrigin: "center center",
          scale: 1,
          width: "100%",
          height: "100%",
          duration: 1,
          ease: "power1.inOut",
          onStart: () => {
            if (nextVideoRef.current) {
              nextVideoRef.current.play();
            }
          },
        });
        gsap.from("#current-video", {
          transformOrigin: "center center",
          scale: 0,
          duration: 1.5,
          ease: "power1.inOut",
        });
      }
    },
    {
      dependencies: [state.currentIndex],
      revertOnUpdate: true,
    }
  );

  useGSAP(() => {
    gsap.set("#video-frame", {
      clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
      borderRadius: "0% 0% 40% 10%",
    });
    gsap.from("#video-frame", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0% 0% 0% 0%",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#video-frame",
        start: "center center",
        end: "bottom center",
        scrub: true,
      },
    });
  });

  const getVideoSrc = (index: number): string => {
    console.log(index);
    return `videos/hero-${index}.mp4`;
  };
  return (
    <div className="relative h-dvh w-screen overflow-x-hidden">
      {state.isLoading && (
        <div className="flex-center absolute z-[100] h-dvh w-screen overflow-hidden bg-violet-50">
          <div className="three-body">
            <div className="three-body__dot" />
            <div className="three-body__dot" />
            <div className="three-body__dot" />
          </div>
        </div>
      )}
      <div
        id="video-frame"
        className="relative z-10 h-dvh w-screen overflow-x-hidden rounded-lg bg-blue-75"
      >
        <div>
          <div className="mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer overflow-hidden rounded-lg">
            <div
              onClick={handleVideoClick}
              className="origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100"
            >
              <video
                ref={nextVideoRef}
                src={getVideoSrc((state.currentIndex % totalVideos) + 1)}
                loop
                muted
                id="current-video"
                className="size-64 origin-center scale-150 object-cover object-center"
                onLoadedData={handleVideoLoad}
              />
            </div>
          </div>
          <video
            ref={nextVideoRef}
            src={getVideoSrc(state.currentIndex)}
            loop
            muted
            id="next-video"
            className="absolute-center invisible absolute z-20 size-64 object-cover object-center"
            onLoadedData={handleVideoLoad}
          />
          <video
            src={getVideoSrc(state.currentIndex)}
            autoPlay
            loop
            muted
            className="absolute left-0 top-0 size-full object-cover object-center"
            onLoadedData={handleVideoLoad}
          />
        </div>
        <h1 className="special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-75">
          G<b>A</b>MING
        </h1>
        <div className="absolute left-0 top-0 z-40 size-full">
          <div className="mt-24 px-5 sm:px-10">
            <h1 className="special-font hero-heading text-blue-100">
              redefi<b>n</b>e
            </h1>

            <p className="mb-5 max-w-64 font-robert-regular text-blue-100">
              Enter the Metagame Layer <br /> Unleash the Play Economy
            </p>

            <Button
              id="watch-trailer"
              title="Watch Trailer"
              leftIcon={<TiLocationArrow />}
              containerClass="bg-yellow-300 flex-center gap-1"
            />
          </div>
        </div>
      </div>
      <h1 className="special-font hero-heading absolute bottom-5 right-5 text-black">
        G<b>A</b>ming
      </h1>
    </div>
  );
};

export default Hero;
