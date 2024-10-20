import { fadeOutFE, fadeInFE, fadeOutBE } from "./fadeOutNotification.js";


// ----- Password icon toggled
const passwordForm = document.querySelector(".password-form");

if(passwordForm)
{
   const passwordIcon = passwordForm.querySelector(".password-icon");
   
   passwordIcon.addEventListener("click", () => 
      {
         const passwordInput = passwordForm.querySelector("input[name='password']");
   
         if(passwordIcon.classList.contains("open") == true) {
            passwordIcon.classList.remove("open");
            passwordIcon.innerHTML = `<i class="fa-regular fa-eye-slash"></i>`;
            passwordInput.setAttribute("type", "password");
         }
         else {
            passwordIcon.classList.add("open");
            passwordIcon.innerHTML = `<i class="fa-regular fa-eye"></i>`;
            passwordInput.setAttribute("type", "text");
         }
      }
   );
}
// ----- End password icon toggled


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