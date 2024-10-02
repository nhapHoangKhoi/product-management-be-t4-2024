// Button status

const listButtonStatus = document.querySelectorAll("[button-status]");

if(listButtonStatus.length > 0)
{
   // console.log(window.location.href); 
   // http://localhost:3000/admin333/products

   let newURL = new URL(window.location.href);

   listButtonStatus.forEach((eachButton) => {
      eachButton.addEventListener("click", () => 
         {
            const statusOfButton = eachButton.getAttribute("button-status");

            if(statusOfButton != "") {
               newURL.searchParams.set("status", statusOfButton);
            }
            else {
               newURL.searchParams.delete("status");
            }

            // console.log(newURL.href); 
            // http://localhost:3000/admin333/products?status=active

            window.location.href = newURL.href;
         }
      );
   });

   // add class "active" for button
   const statusCurrent = newURL.searchParams.get("status") || "";
   const buttonCurrent = document.querySelector(`[button-status="${statusCurrent}"]`);

   if(buttonCurrent) {
      buttonCurrent.classList.add("active");
   }
}

// End button status