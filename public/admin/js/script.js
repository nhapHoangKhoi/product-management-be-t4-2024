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


// ----- Check item

const inputCheckAll = document.querySelector("input[name='checkAll']");

if(inputCheckAll)
{
   const listInputCheckItem = document.querySelectorAll("input[name='checkItem']");

   // when click the checkAll button
   inputCheckAll.addEventListener("click", () => 
      {
         listInputCheckItem.forEach((eachInputItem) => 
            {
               eachInputItem.checked = inputCheckAll.checked; // true, false
            }
         );
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
         }
      );
   });
}

// ----- End check item


// ----- Box updates

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
            alert("Hành động và item phải được chọn!");
         }
      }
   );
}

// ----- End box updates


// ----- Soft delete record

const listButtonDelete = document.querySelectorAll("[button-delete]");

if(listButtonDelete.length > 0)
{
   listButtonDelete.forEach((eachButton) => {
      eachButton.addEventListener("click", () => 
         {  
            const link = eachButton.getAttribute("button-delete");
            
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