import { fadeOutFE, fadeInFE, fadeOutBE } from "./fadeOutNotification.js";

// ----- Show notification BE
const notification = document.querySelector("[show-notification]");

if(notification)
{
   let timeExpiredNotification = notification.getAttribute("show-notification") || 3000;
   timeExpiredNotification = parseInt(timeExpiredNotification);

   // fadeInFE(notification); // thong bao BE ko nen dung fadeIn
   
   fadeOutBE(notification, timeExpiredNotification);
}
// ----- End show notification BE