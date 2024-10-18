import { fadeOutFE, fadeInFE, fadeOutBE } from "./fadeOutNotification.js";


// ----- Update quantities in the cart
const listInputQuantity = document.querySelectorAll("[table-cart] input[name='quantity']");

if(listInputQuantity.length > 0)
{
   listInputQuantity.forEach(eachInput => {
      eachInput.addEventListener("change", () => 
         {
            const productId = eachInput.getAttribute("product-id");
            const quantity = parseInt(eachInput.value);

            // --- Dung phuong thuc GET --- //
            // if(productId && quantity > 0)
            // {
            //    window.location.href = `/cart/update/${productId}/${quantity}`;
            // }
            // --- End dung phuong thuc GET --- //


            // --- Dung phuong thuc PATCH --- //
            const link = `/cart/update/${productId}/${quantity}`;
            
            fetch(link, {
               method: "PATCH"
            })
               .then(responseFromController => responseFromController.json())
               .then(dataFromController => {
                  if(dataFromController.code == 200) {
                     window.location.reload();
                  }
               })
            // --- End dung phuong thuc PATCH --- //
         }
      );
   })
}
// End update quantities in the cart


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