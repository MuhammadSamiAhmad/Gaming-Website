import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import clsx from "clsx"; // Utility for conditionally joining class names

gsap.registerPlugin(ScrollTrigger); // Register ScrollTrigger plugin with GSAP

interface AnimatedTitleProps {
  title: string; // The title text, which may contain HTML tags (e.g., <b>)
  containerClass?: string; // Optional CSS class for the container
}

const AnimatedTitle = ({ title, containerClass }: AnimatedTitleProps) => {
  const containerRef = useRef<HTMLDivElement>(null); // Ref to the container element for GSAP animations

  useEffect(() => {
    // GSAP context ensures proper cleanup of animations
    const ctx = gsap.context(() => {
      // Create a timeline for the title animation
      const titleAnimation = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current, // Element that triggers the animation
          start: "100 bottom", // Animation starts when the bottom of the viewport is 100px past the trigger
          end: "center bottom", // Animation ends when the center of the viewport reaches the bottom of the trigger
          toggleActions: "play none none reverse", // Play animation on enter, reverse on leave
          //Actions Order: onEnter onEnterBack onLeaveBack onLeave
          // Applicable Actions: play pause resume reset restart complete reverse none
        },
      });

      // Animate each word in the title
      titleAnimation.to(
        ".animated-word", // Target elements with the class "animated-word"
        {
          opacity: 1, // Fade in the words
          transform: "translate3d(0, 0, 0) rotateY(0deg) rotateX(0deg)", // Reset transformations
          ease: "power2.inOut", // Smooth easing function
          stagger: 0.02, // Delay between each word's animation
        },
        0 // Start the animation at time 0 in the timeline
      );
    }, containerRef); // Scope the GSAP context to the containerRef

    return () => ctx.revert(); // Clean up animations when the component unmounts
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div
      ref={containerRef}
      className={clsx("animated-title", containerClass)} // Use clsx to conditionally join class names
    >
      {/* Split the title by <br /> to handle line breaks */}
      {title.split("<br />").map((line, index) => (
        <div
          key={index}
          className="flex-center max-w-full flex-wrap gap-2 px-10 md:gap-3"
        >
          {/* Split each line into words and render them */}
          {line.split(" ").map((word, idx) => (
            <span
              key={idx}
              className="animated-word"
              dangerouslySetInnerHTML={{ __html: word }} // Render raw HTML (e.g., <b> tags)
              /*
                dangerouslySetInnerHTML is used to render HTML content directly.
                It's called "dangerous" because it can expose your app to XSS attacks
                if the HTML comes from an untrusted source. Always sanitize the content
                if it's not fully trusted (e.g., using DOMPurify).
              */
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default AnimatedTitle;
