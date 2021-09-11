const apiKey = "BLGvAn7JO1dxMb7GRWTLG00RNEZOGQMC";
const googleKey = "AIzaSyD10gq8yqLKQYK-Oz7ei1Iv6Ty10DDMgxU";
// MULTIPLE GOOGLE API KEYS
// const makiGoogleApi = 'AIzaSyCx8NiDI6Ge2sYcKzVC2o3wYYzOESQGHKs';
// const philipGoogleApi = 'AIzaSyAEI0gVqwCMa6e3jFyLmnNGsPC3cjXCrdc'
// const guilGoogleApi = 'AIzaSyD10gq8yqLKQYK-Oz7ei1Iv6Ty10DDMgxU'
var arr = [];
let bookType = document.getElementById("bookType");
var selectionContainer = document.querySelector("#viewSelection");

// COLLECTS INFORMATION FROM NEW YORK TIMES BEST SELLERS LIST TO CREATE A SELECTION FOR THE USER
fetch(`https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=${apiKey}`)
  .then((response) => {
    return response.json();
  })
  .then((response) => {
    for (i = 0; i < response.results.length; i++) {
      // pushing the name and the code
      arr.push({
        name: response.results[i].display_name,
        code: response.results[i].list_name_encoded,
      });
    }
  })
  .then(() => {
    // FILTER LIST AND LEAVE GENRES ONLY
    for (i = 0; i < arr.length; i++) {
      if (
        !arr[i].name.includes("Fiction") &&
        !arr[i].name.includes("Nonfiction") &&
        !arr[i].name.includes("Hardcover") &&
        !arr[i].name.includes("Paperback") &&
        !arr[i].name.includes("E-book") &&
        !arr[i].name.includes("Children’s") &&
        !arr[i].name.includes("Young") &&
        !arr[i].name.includes("Books")
      ) {
        let createdOption = document.createElement("option");
        createdOption.setAttribute("value", arr[i].code);
        createdOption.textContent = arr[i].name;
        bookType.appendChild(createdOption);
      }
    }
  })
  .catch((error) => console.log(error));

// WHEN USER SUBMITS A SELECTION, THIS FETCHES INFORMATION FROM NEW_YORK_TIMES AND GOOGLE TO GIVE THE USER A GOOD SELECTION OF BOOKS TO CHOOSE FROM
typeSubmit.addEventListener("click", function (event) {
  event.preventDefault();
  selectionContainer.innerHTML = "";
  bookInfo = [];
  let userSelection = document.querySelector("#bookType").value;

  fetch(
    `https://api.nytimes.com/svc/books/v3/lists/current/${userSelection}.json?api-key=${apiKey}`
  )
    .then((secondResponse) => {
      return secondResponse.json();
    })
    .then((secondResponse) => {
      // forloop takes information collected and places it on the page with a save option
      for (i = 0; i < secondResponse.results.books.length; i++) {
        let isbn = secondResponse.results.books[i].primary_isbn13;
        let author = secondResponse.results.books[i].author;
        let title = secondResponse.results.books[i].title;
        let cover = secondResponse.results.books[i].book_image;
        fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${author}+isbn:${isbn}&key=${googleKey}`
        )
          .then((googleResponse) => {
            return googleResponse.json();
          })
          .then((googleResponse) => {
            // IF THE GOOGLE FETCH WAS SUCCESSFUL THE INFORMATION WILL BE APPENDED TO THE PAGE 
            let snippet = googleResponse.items[0].searchInfo.textSnippet;

            let bookContainer = document.createElement("div");
            bookContainer.classList =
              "book-container is-flex is-flex-direction-row m-5 is-align-content-baseline is-justify-content-center is-flex-wrap-wrap column has-text-dark";
            bookContainer.setAttribute("isbn-code", `${isbn}`);
            let bookCover = document.createElement("img");
            bookCover.classList = "book-cover is-text-align-center";
            bookCover.setAttribute("src", cover);
            bookCover.setAttribute("alt", `${title}'s cover`);
            bookContainer.appendChild(bookCover);
            let bookTitle = document.createElement("div");
            bookTitle.className =
              "p-3 title is-full has-text-centered is-capitalized";
            bookTitle.innerHTML = `<h2 class='is-full'>${title}</h2>`;
            bookContainer.appendChild(bookTitle);
            let bookAuthor = document.createElement("div");
            bookAuthor.className =
              "p-3 author is-full has-text-centered is-capitalized";
            bookAuthor.innerHTML = `<h3>${author}</h3>`;
            bookContainer.appendChild(bookAuthor);
            let bookDescription = document.createElement("div");
            bookDescription.innerHTML = `<p>${snippet}</p>`;
            bookDescription.classList = "snippet my-5 has-text-centered";
            bookContainer.appendChild(bookDescription);
            let saveButton = document.createElement("button");
            saveButton.classList = "saveBook p-1 mt-5 heart-red";
            saveButton.setAttribute("title", "Add to Reading List");
            bookContainer.appendChild(saveButton);
            selectionContainer.appendChild(bookContainer);
          })
          .then((ok) => {})
          // IF GOOGLE DOESN'T HAVE INFORMATION ABOUT THE BOOK THE BOOK WILL THEN BE DISPLAYED WITHOUT ANY DESCRIPTION (SNIPPET)
          .catch((err) => {
            snippet = "Description not available";

            let bookContainer = document.createElement("div");
            bookContainer.classList =
              "book-container is-flex is-flex-direction-row m-5 is-align-content-baseline is-justify-content-center is-flex-wrap-wrap column has-text-dark";
            bookContainer.setAttribute("isbn-code", `${isbn}`);
            let bookCover = document.createElement("img");
            bookCover.classList = "book-cover is-text-align-center";
            bookCover.setAttribute("src", cover);
            bookCover.setAttribute("alt", `${title}'s cover`);
            bookContainer.appendChild(bookCover);
            let bookTitle = document.createElement("div");
            bookTitle.className =
              "p-3 title is-full has-text-centered is-capitalized";
            bookTitle.innerHTML = `<h2 class='column'>${title}</h2>`;
            bookContainer.appendChild(bookTitle);
            let bookAuthor = document.createElement("div");
            bookAuthor.className =
              "p-3 author is-full has-text-centered is-capitalized";
            bookAuthor.innerHTML = `<h3>${author}</h3>`;
            bookContainer.appendChild(bookAuthor);
            let bookDescription = document.createElement("div");
            bookDescription.innerHTML = `<p>${snippet}</p>`;
            bookDescription.classList = "snippet my-5 has-text-centered";
            bookContainer.appendChild(bookDescription);
            let saveButton = document.createElement("button");
            saveButton.classList = "saveBook p-1 mt-5 heart-red";
            saveButton.setAttribute("title", "Add to Reading List");
            bookContainer.appendChild(saveButton);
            selectionContainer.appendChild(bookContainer);
          });
      }
    });
});

// // SCANS FOR CLICK EVENTS
searchClick = (event) => {
  let targetEl = event.target;
  // IF THE ADD TO FAVORITES BUTTON (HEART) IS PRESSED
  if (targetEl.matches(".saveBook")) {
    let child = targetEl;
    let parent = child.parentNode;
    addToFav(parent);
  }
};

// // SAVE TO LOCAL STORAGE
addToFav = (parent) => {
  let cover = parent.childNodes[0].getAttribute("src");
  let title = parent.childNodes[1].firstChild.textContent;
  let author = parent.childNodes[2].firstChild.textContent;
  let description = parent.childNodes[3].firstChild.textContent;
  let isbnCode = parent.getAttribute("isbn-code");
  let newItem = {
    cover: `${cover}`,
    author: `${author}`,
    title: `${title}`,
    description: `${description}`,
    isbn: `${isbnCode}`,
  };
  let retrievedData = JSON.parse(localStorage.getItem("savedBooks")) || [];
  // CHECKING TO SEE IF THE BOOK IS ALREADY ADDED TO LOCAL STORAGE 
  if (localStorage.length > 0) {
    for (i = 0; i < retrievedData.length; i++) {
      if (retrievedData[i].isbn === newItem.isbn) {
        break;
      } else {
        if (retrievedData.length - 1 === i) {
          retrievedData.push(newItem);
          localStorage.setItem("savedBooks", JSON.stringify(retrievedData));
          loadSaveList();
        }
      }
    }
  } else {
    retrievedData.push(newItem);
    localStorage.setItem("savedBooks", JSON.stringify(retrievedData));
    loadSaveList();
  }
};

// FUNCTION FOR LOADING SAVE iTEMS LIST FROM LOCAL STORAGE
let loadSaveList = () => {
  let savedItemsList = document.getElementById("savedItemsList");
  savedItemsList.classList =
    "is-flex is-justify-content-center is-flex-direction-row is-flex-wrap-wrap";
  savedItemsList.innerHTML = "";
  let retrievedData = JSON.parse(localStorage.getItem("savedBooks")) || [];
  // IF THERE'S ITEMS IN LOCAL STORAGE ADD THAT TO SAVE LIST 
  if (localStorage.length > 0) {
    for (i = 0; i < retrievedData.length; i++) {
      let listItem = document.createElement("li");
      listItem.classList = `bookItem is-flex is-flex-direction-column m-5 p-1 is-justify-content-start is-flex-wrap-wrap column`;
      let bookCoverDiv = document.createElement("div");
      bookCoverDiv.classList = "m-1 p-1 is-flex is-justify-content-center";
      let bookCover = document.createElement("img");
      bookCover.setAttribute("src", `${retrievedData[i].cover}`);
      bookCover.setAttribute('alt', `${retrievedData[i].title}'s cover`);
      bookCoverDiv.appendChild(bookCover);
      listItem.appendChild(bookCoverDiv);
      let titleAuthorDiv = document.createElement("div");
      titleAuthorDiv.classList =
        "is-flex is-flex-direction-column is-justify-content-space-between my-5 has-text-centered";
      let title = document.createElement("h3");
      title.classList = "m-1 is-capitalized is-justify-content-start is-2";
      title.textContent = `${retrievedData[i].title}`;
      titleAuthorDiv.appendChild(title);
      let author = document.createElement("p");
      author.classList = `m-1 is-capitalized is-align-items-start is-italic`;
      author.textContent = `${retrievedData[i].author}`;
      titleAuthorDiv.appendChild(author);
      listItem.appendChild(titleAuthorDiv);
        savedItemsList.appendChild(listItem);
    }
  } else {
    let placeHolder = document.createElement("p");
    placeHolder.textContent = "Your list is Empty.";
      savedItemsList.appendChild(placeHolder);
  }
};

// LOAD SAVED LIST
loadSaveList();

// IF SUBMIT BUTTON IS CLICKED 
selectionContainer.addEventListener("click", searchClick);

// BULMA's PRE-CODED FOR NAVBAR FUNCTIONALITY
document.addEventListener("DOMContentLoaded", () => {
  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(
    document.querySelectorAll(".navbar-burger"),
    0
  );
  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {
    // Add a click event on each of them
    $navbarBurgers.forEach((el) => {
      el.addEventListener("click", () => {
        // Get the target from the "data-target" attribute
        const target = el.dataset.target;
        const $target = document.getElementById(target);
        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        el.classList.toggle("is-active");
        $target.classList.toggle("is-active");
      });
    });
  }
});
