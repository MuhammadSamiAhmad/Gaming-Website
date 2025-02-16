import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

import AnimatedTitle from "./AnimatedTitle";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  /*By placing ScrollTrigger inside the timeline, you're telling GSAP:

When the user scrolls to a specific point (trigger), start the timeline.

The timeline will progress as the user continues to scroll, based on the start and end values. 
Pin: The (pin: true) and (pinSpacing: true) ensure that the #clip element stays fixed (pinned) in place while the animation is active, and the spacing is adjusted to prevent layout jumps.*/
  useGSAP(() => {
    const clipAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "#clip", // The element that triggers the animation
        start: "center center", // Start when the center of the viewport meets the center of #clip
        end: "+=800 center", // End after scrolling 800px past the start point
        scrub: 0.5, // Smoothly scrub through the animation as the user scrolls
        pin: true, // Pin the #clip element in place during the animation
        pinSpacing: true, // Adjust spacing to prevent layout jumps
      },
    });

    clipAnimation.to(".mask-clip-path", {
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
    });
  });

  return (
    <div id="about" className="min-h-screen w-screen">
      <div className="relative mb-8 mt-36 flex flex-col items-center gap-5">
        <p className="font-general text-sm uppercase md:text-[10px]">
          Welcome to Zentry
        </p>

        <AnimatedTitle
          title="Disc<b>o</b>ver the world's <br /> largest shared <b>a</b>dventure"
          containerClass="mt-5 !text-black text-center"
        />

        <div className="about-subtext">
          <p>The Game of Games begins—your life, now an epic MMORPG</p>
          <p className="text-gray-500">
            Zentry unites every player from countless games and platforms, both
            digital and physical, into a unified Play Economy
          </p>
        </div>
      </div>

      <div className="h-dvh w-screen" id="clip">
        <div className="mask-clip-path about-image">
          <img
            src="img/about.webp"
            alt="Background"
            className="absolute left-0 top-0 size-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default About;
