let currentFadeOutTimer = null; // Store the timer reference

export default function fadeOut(notification, timeExpired)
{
   // clear any existing fade-out timer
   if (currentFadeOutTimer) {
      clearInterval(currentFadeOutTimer);
      notification.style.opacity = 1; // reset opacity to full
   }

   let opacity = 1;
   const fadeDuration = 50;
   const totalSteps = timeExpired / fadeDuration;
   const opacityDecrement = opacity / totalSteps;
   
   currentFadeOutTimer = setInterval(() => {
      if(opacity <= 0) {
         clearInterval(currentFadeOutTimer);
         // notification.style.display = "none"; // su dung cai nay se ko mo rong duoc
         notification.classList.add("element-hidden");
      }

      notification.style.opacity = opacity;
      opacity = opacity - opacityDecrement;

   }, fadeDuration); // fade out the notification within ... seconds
}