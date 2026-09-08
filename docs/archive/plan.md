Plan:
1. Replace IntersectionObserver (for active video) with a requestAnimationFrame loop in ShoppableVideoCarousel to flawlessly track the center card.
2. In ShoppableVideoCard, listen for 'shoppable-video-active' to set isActive.
3. Update nearObs to a safe positive rootMargin (600px) so Safari doesn't bug out.
4. Ensure DOM attributes (muted, playsInline, autoplay) are explicitly set BEFORE play().
5. Add data-card-id and className="shoppable-video-card" to the card div.
6. Remove old debug logs to keep it clean.
