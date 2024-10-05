export default function fadeOut(notification, timeExpired)
{
   let opacity = 1;
   const fadeDuration = 50;
   const totalSteps = timeExpired / fadeDuration;
   const opacityDecrement = opacity / totalSteps;
   
   let timer = setInterval(() => {
      if(opacity <= 0) {
         clearInterval(timer);
         notification.style.display = "none";
      }

      notification.style.opacity = opacity;
      opacity = opacity - opacityDecrement;

   }, fadeDuration); // fade out the notification within ... seconds
}