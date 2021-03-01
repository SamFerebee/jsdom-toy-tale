let addToy = false;

function createCard(theToy){
  const div = document.createElement("div");
  div.classList.add("card");
  div.innerHTML = ` 
    <div class = "card">
      <h2> ${theToy.name} </h2>
      <img src="${theToy.image}" alt="title" class ="toy-avatar" />
      <p class = "like-count">${theToy.likes} likes</p>
      <button class="like-btn">♥️ Like</button>
    </div>`

  const theCollection = document.querySelector("div#toy-collection");
  theCollection.append(div);
}

function renderAllCards(){
  fetch("http://localhost:3000/toys")
  .then(response => response.json())
  .then(data => {
    data.forEach(eachToy =>{
      createCard(eachToy);
    })
  })
}



document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  renderAllCards();

  const submitToyButton = document.querySelector("form.add-toy-form");
  submitToyButton.addEventListener("submit", function(event){
    event.preventDefault();
    const name = event.target[0].value;
    const image = event.target[1].value; 
    const toyObject = {
      "name": name,
      "image": image,
      "likes": 0
    }
    console.table(toyObject);
    fetch("http://localhost:3000/toys",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(toyObject),
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      createCard(data);
    })
    .catch((error) =>{
      console.error("Error:", error);
    })

    event.target.reset();
  })

  const theCollection = document.querySelector("div#toy-collection");
  theCollection.addEventListener("click", function(event){
    if(event.target.className === "like-btn"){
      const toyDiv = event.target.closest("div.card");
      const pTag = toyDiv.querySelector("p.like-count");
      const currentLikes = parseInt(pTag.textContent);
      pTag.textContent = `${currentLikes + 1} likes`;
      const newLikes = {likes: currentLikes + 1};

      fetch(`http://localhost:3000/toys/${toyDiv.dataset.id}`, {
        method: "PATCH",
        headers:{
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(newLikes)
      })
        .then(response => {
           if(response.ok){
             return response.json();
           }
           throw Error(`The status text is ${repsonse.statusText}`);
      })
        .then(data => {
          pTag.textContent = `${data.likes} likes`
        })
        .catch(error => {
          alert(error);
        })
    }
  })

});
