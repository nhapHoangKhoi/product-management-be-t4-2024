let currentFadeOutTimerFE = null; // store the timer reference
let currentFadeOutTimerBE = null;

// 2 ham fadeout giong y chang nhau, chi la tach ra thoi
const fadeOutFE = (notification, timeExpired) => 
{
   // clear any existing fade-out timer
   if (currentFadeOutTimerFE) {
      clearInterval(currentFadeOutTimerFE);
      notification.style.opacity = 1; // reset opacity to full
   }

   const timeExistClear = timeExpired;

   let opacity = 1;
   const fadeDuration = 35; // toc do lam mo, so cang nho thi mo cang nhanh
   const totalSteps = 20;
   const opacityDecrement = opacity / totalSteps;
   
   currentFadeOutTimerFE = setTimeout(() => {

      currentFadeOutTimerFE = setInterval(() => {
         if(opacity <= 0) {
            clearInterval(currentFadeOutTimerFE);
            // notification.style.display = "none"; // su dung cai nay se ko mo rong duoc
            notification.classList.add("element-hidden");
         }
   
         notification.style.opacity = opacity;
         opacity = opacity - opacityDecrement;
   
         // ensure opacity does not go below 0
         if (opacity < 0) {
            opacity = 0;
         }
      }, fadeDuration); // fade out the notification within ... miliseconds

   }, timeExistClear);
}

const fadeInFE = (notification, fadeDuration = 1) => 
{
   notification.style.opacity = 0;
   notification.classList.remove("element-hidden");

   let opacity = 0;
   const totalSteps = 20;
   const opacityIncrement = 1 / totalSteps;

   const fadeInInterval = setInterval(() => {
      if (opacity >= 1) {
         clearInterval(fadeInInterval); // stop when fully visible
      }

      notification.style.opacity = opacity;
      opacity = opacity + opacityIncrement;

      // ensure opacity does not exceed 1
      if (opacity > 1) {
         opacity = 1;
      }
   }, fadeDuration); // fade-in interval
}

// 2 ham fadeout giong y chang nhau, chi la tach ra thoi
const fadeOutBE = (notification, timeExpired) => 
{
   // clear any existing fade-out timer
   if (currentFadeOutTimerBE) {
      clearInterval(currentFadeOutTimerBE);
      notification.style.opacity = 1; // reset opacity to full
   }

   const timeExistClear = timeExpired;

   let opacity = 1;
   const fadeDuration = 35; // toc do lam mo, so cang nho thi mo cang nhanh
   const totalSteps = 20;
   const opacityDecrement = opacity / totalSteps;

   currentFadeOutTimerBE = setTimeout(() => {

      currentFadeOutTimerBE = setInterval(() => {
         if(opacity <= 0) {
            clearInterval(currentFadeOutTimerBE);
            // notification.style.display = "none"; // su dung cai nay se ko mo rong duoc
            notification.classList.add("element-hidden");
         }
   
         notification.style.opacity = opacity;
         opacity = opacity - opacityDecrement;
   
         // ensure opacity does not go below 0
         if (opacity < 0) {
            opacity = 0;
         }
      }, fadeDuration); // fade out the notification within ... seconds

   }, timeExistClear);
}

// ----- Button status
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
            newURL.searchParams.delete("page");

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
// ----- End button status


// ----- Button change status
const listButtonChangeStatus = document.querySelectorAll("[button-change-status]");

if(listButtonChangeStatus.length > 0)
{
   listButtonChangeStatus.forEach((eachButton) => {
      eachButton.addEventListener("click", () => 
         {
            const link = eachButton.getAttribute("link");
            
            fetch(link, {
               method: "PATCH",
               headers: {
                  "Content-Type": "application/json"
               }
            })
               .then(res => res.json())
               .then(data => {
                  if(data.code == 200) {
                     window.location.reload();
                  }
               })
         }
      );
   });
}
// ----- End button change status


// ----- Button check items
const inputCheckAll = document.querySelector("input[name='checkAll']");

if(inputCheckAll)
{
   const listInputCheckItem = document.querySelectorAll("input[name='checkItem']");
   const listElementsHidden = document.querySelectorAll("button.element-hidden");

   // when click the checkAll button
   inputCheckAll.addEventListener("click", () => 
      {
         listInputCheckItem.forEach((eachInputItem) => 
            {
               eachInputItem.checked = inputCheckAll.checked; // true, false
            }
         );

         if(listElementsHidden.length > 0 && listInputCheckItem.length > 0) 
         {
            if(inputCheckAll.checked == true) {
               listElementsHidden.forEach((eachElement) => {
                  eachElement.classList.remove("element-hidden");
               });
            }
            else {
               listElementsHidden.forEach((eachElement) => {
                  eachElement.classList.add("element-hidden");
               });
            }
         }
      }
   );

   // when click the checkItem button
   listInputCheckItem.forEach((eachInputItem) => {
      eachInputItem.addEventListener("click", () => 
         {
            const listCheckedItem = document.querySelectorAll("input[name='checkItem']:checked");
            
            if(listInputCheckItem.length == listCheckedItem.length) {
               inputCheckAll.checked = true;
            }
            else {
               inputCheckAll.checked = false;
            }


            if(listElementsHidden.length > 0)
            {
               if(listCheckedItem.length > 0) {
                  listElementsHidden.forEach((eachElement) => {
                     eachElement.classList.remove("element-hidden");
                  });
               }
               else {
                  listElementsHidden.forEach((eachElement) => {
                     eachElement.classList.add("element-hidden");
                  });
               }
            }
         }
      );
   });
}
// ----- End button check items


// ----- Box updates multi items
const boxUpdate = document.querySelector("[box-updates]");

if(boxUpdate)
{
   const buttonUpdate = boxUpdate.querySelector("button");

   buttonUpdate.addEventListener("click", () => 
      {
         const selectBox = boxUpdate.querySelector("select");
         const selectedValue = selectBox.value;

         const listCheckedItem = document.querySelectorAll("input[name='checkItem']:checked");
         const listOfIds = [];

         listCheckedItem.forEach((eachInput) => 
            {
               listOfIds.push(eachInput.value);
            }
         );

         const link = boxUpdate.getAttribute("box-updates");

         if(selectedValue != "" && listOfIds.length > 0) 
         {
            const dataSubmit = {
               selectedValue: selectedValue,
               listOfIds: listOfIds
            };

            fetch(link, {
               method: "PATCH",
               headers: {
                  "Content-Type": "application/json"
               },
               body: JSON.stringify(dataSubmit)
            })
               .then(responseFromController => responseFromController.json())
               .then(dataFromController => {
                  if(dataFromController.code == 200) {
                     window.location.reload();
                  }
               })
         }
         else {
            // alert("Hành động và item phải được chọn!");

            // ----- Notification chi ben FE -----/
            const notificationFEError = document.querySelector(".alert-danger[show-notification-fe]");

            if(notificationFEError)
            {
               let timeExpiredNotification = notificationFEError.getAttribute("show-notification-fe") || 3000;
               timeExpiredNotification = parseInt(timeExpiredNotification);

               const notificationContent = notificationFEError.querySelector(".inner-content");
               notificationContent.innerText = "Hành động và item phải được chọn!";
               
               fadeInFE(notificationFEError);

               fadeOutFE(notificationFEError, timeExpiredNotification);
            }
            // ----- End notification chi ben FE -----/
         }
      }
   );
}
// ----- End box updates multi items


// ----- Button delete many records (y tuong tu "Box updates multi items, Button check items")
const buttonDeleteMany = document.querySelector("[button-delete-many]");

if(buttonDeleteMany)
{
   buttonDeleteMany.addEventListener("click", () => 
      {
         const listCheckedItem = document.querySelectorAll("input[name='checkItem']:checked");
         const listOfIds = [];
         const link = buttonDeleteMany.getAttribute("button-delete-many");
         console.log(link);
         
         const action = buttonDeleteMany.getAttribute("value");
         
         listCheckedItem.forEach((eachInput) => 
            {
               listOfIds.push(eachInput.value);
            }
         );
         
         if(action != "" && listOfIds.length > 0)
         {
            const dataSubmit = {
               selectedValue: action,
               listOfIds: listOfIds
            };

            fetch(link, {
               method: "DELETE",
               headers: {
                  "Content-Type": "application/json"
               },
               body: JSON.stringify(dataSubmit)
            })
               .then(responseFromController => responseFromController.json())
               .then(dataFromController => {
                  if(dataFromController.code == 200) {
                     window.location.reload();
                  }
               })
         }
      }
   );
}
// ----- End button delete many records


// ----- Button recover many records (y tuong tu "Box updates multi items, Button check items")
const buttonRecoverMany = document.querySelector("[button-recover-many]");

if(buttonRecoverMany)
{
   buttonRecoverMany.addEventListener("click", () => 
      {
         const listCheckedItem = document.querySelectorAll("input[name='checkItem']:checked");
         const listOfIds = [];
         const link = buttonRecoverMany.getAttribute("button-recover-many");
         const action = buttonRecoverMany.getAttribute("value");
         
         listCheckedItem.forEach((eachInput) => 
            {
               listOfIds.push(eachInput.value);
            }
         );
         
         if(action != "" && listOfIds.length > 0)
         {
            const dataSubmit = {
               selectedValue: action,
               listOfIds: listOfIds
            };

            fetch(link, {
               method: "PATCH",
               headers: {
                  "Content-Type": "application/json"
               },
               body: JSON.stringify(dataSubmit)
            })
               .then(responseFromController => responseFromController.json())
               .then(dataFromController => {
                  if(dataFromController.code == 200) {
                     window.location.reload();
                  }
               })
         }
      }
   );
}
// ----- End button recover many records


// ----- Change item position
const listInputPosition = document.querySelectorAll("input[name='position']");

if(listInputPosition.length > 0)
{
   listInputPosition.forEach((eachInput) => {
      eachInput.addEventListener("change", () => 
         {
            const itemPosition = parseInt(eachInput.value);
            const link = eachInput.getAttribute("link");

            const dataSubmit = {
               itemPosition: itemPosition
            };

            fetch(link, {
               method: "PATCH",
               headers: {
                  "Content-Type": "application/json"
               },
               body: JSON.stringify(dataSubmit) // chuyen ve JSON
            })
               .then(responseFromController => responseFromController.json())
               .then(dataFromController => {
                  console.log("cap nhat vi tri: ", dataFromController);
               })
         }
      );
   });
}
// ----- End change item position


// ----- Form search
const formSearch = document.querySelector("[form-search]"); // neu ko co thi formSearch tra ve null

if(formSearch)
{
   let newURL = new URL(window.location.href);

   formSearch.addEventListener("submit", (event) => 
      {
         event.preventDefault();

         const searchedKeyword = event.target.elements.inputKeyword.value;
         newURL.searchParams.delete("page");

         if(searchedKeyword) {
            newURL.searchParams.set("inputKeyword", searchedKeyword);
         }
         else {
            newURL.searchParams.delete("inputKeyword");
         }

         // http://localhost:3000/admin333/products?keyword=iPhone
         window.location.href = newURL.href;
      }
   );
}
// ----- End form search


// ----- Get deleted records
const buttonTrash = document.querySelector("[button-trash]");

if(buttonTrash)
{
   buttonTrash.addEventListener("click", () =>
      {
         const link = buttonTrash.getAttribute("button-trash");

         fetch(link)
            .then(responseFromController => {
               window.location.href = responseFromController.url;
            })
      }
   );
}
// ----- End get deleted records


// ----- Permanent delete record
const listButtonDeletePermanent = document.querySelectorAll("[button-delete-permanent]");

if(listButtonDeletePermanent.length > 0)
{
   listButtonDeletePermanent.forEach((eachButton) => {
      eachButton.addEventListener("click", () => 
         {  
            const link = eachButton.getAttribute("button-delete-permanent");
            
            fetch(link, {
               method: "DELETE"
            })
               .then(responseFromController => responseFromController.json())
               .then(dataFromController => {
                  if(dataFromController.code == 200) {
                     window.location.reload();
                  }
               })
         }
      );
   });
}
// ----- End permanent delete record


// ----- Pagination
const listButtonPagination = document.querySelectorAll("[button-pagination]");

if(listButtonPagination.length > 0)
{
   let newURL = new URL(window.location.href);

   listButtonPagination.forEach((eachButton) => {
      eachButton.addEventListener("click", () => 
         {
            const page = eachButton.getAttribute("button-pagination");
            
            if(page) {
               newURL.searchParams.set("page", page);
            }
            else {
               newURL.searchParams.delete("page");
            }

            window.location.href = newURL.href;
         }
      );
   });
}
// ----- End pagination


// ----- Preview image
const elementUploadImage = document.querySelector("[upload-image]");

if(elementUploadImage)
{
   const elementInputUploadImage = elementUploadImage.querySelector("[upload-image-input]");
   const elementPreviewUploadImage = elementUploadImage.querySelector("[upload-image-preview]");

   elementInputUploadImage.addEventListener("change", () => 
      {
         // console.log(elementInputUploadImage.files); // tra ra mot mang data
         const uploadedFile = elementInputUploadImage.files[0];

         if(uploadedFile) {
            elementPreviewUploadImage.src = URL.createObjectURL(uploadedFile);
         }
      }
   );
}
// ----- End preview image


// ----- Recover record
const listButtonRecovery = document.querySelectorAll("[button-recover]");

if(listButtonRecovery.length > 0)
{
   listButtonRecovery.forEach((eachButton) => {
      eachButton.addEventListener("click", () => 
         {
            const link = eachButton.getAttribute("button-recover");

            fetch(link, {
               method: "PATCH"
            })
               .then(responseFromController => responseFromController.json())
               .then(dataFromController => {
                  if(dataFromController.code == 200) {
                     window.location.reload();
                  }
               })
         }
      );
   });
}
// ----- End recover record


// ----- Soft delete record
const listButtonDeleteSoft = document.querySelectorAll("[button-delete-soft]");

if(listButtonDeleteSoft.length > 0)
{
   listButtonDeleteSoft.forEach((eachButton) => {
      eachButton.addEventListener("click", () => 
         {  
            const link = eachButton.getAttribute("button-delete-soft");
            
            fetch(link, {
               method: "PATCH"
            })
               .then(responseFromController => responseFromController.json())
               .then(dataFromController => {
                  if(dataFromController.code == 200) {
                     window.location.reload();
                  }
               })
         }
      );
   });
}
// ----- End soft delete record


// ----- Show notification BE
const notification = document.querySelector("[show-notification]");

if(notification)
{
   let timeExpiredNotification = notification.getAttribute("show-notification") || 3000;
   timeExpiredNotification = parseInt(timeExpiredNotification);

   fadeInFE(notification);
   
   fadeOutBE(notification, timeExpiredNotification);
}
// ----- End show notification BE