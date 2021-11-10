window.addEventListener("load", function () {
  const playButton = document.querySelector("#play");
  const startButton = document.querySelector("#start");
  const playAgainButton = document.querySelector("#play-again");
  const splashScreen = document.querySelector("#splash-screen");
  const gameScreen = document.querySelector("#game-screen");
  const gameOverScreen = document.querySelector("#gameover");
  const winScreen = document.querySelector("#win-screen");

  // Create cards - card name = image name (line 56)
  const sylvester = generateCard (1, "sylvester");
  const tweety = generateCard (1, "tweety");
  const minnie = generateCard (2, "minnie");
  const mickey = generateCard (2, "mickey");

  // Create game instance
  const game = new Game([sylvester, tweety, minnie, mickey]);
  
  // Switch among different screens
  playButton.addEventListener("click", function () {
    splashScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
  // Start GAME 
    game.prepareCards();
  });

  startButton.addEventListener("click", function () {
    startButton.classList.add("hidden");
    gameScreen.classList.remove("hidden");
  });

  playAgainButton.addEventListener("click", function () {
    winScreen.classList.add("hidden"); 
//  HOW TO RESET THE CARDS ??
//  HOW TO RESET THE TIME ??     
    gameScreen.classList.remove("hidden");
    startButton.classList.remove("hidden");
  });
});

function generateCard(partnerId, name) {
  return {
    partnerId: partnerId,
    name: name,
    image: `../img/${name}.png`
  }; 
}

class Game {
  constructor(cards = [], counter = 60, score = 0) {
    this.cards = cards;
    this.counter = counter;
    this.selectedCard = null;
    this.solvedPairs = [];
    this.startCountDown();
    this._shuffle();
  }
  
  prepareCards(){
    this.cards.forEach((item) => {  
      const parent = document.querySelector("#cards");
      const cardHTML = document.createElement("div");
      
      cardHTML.id = item.name;
      cardHTML.classList.add("card");
      cardHTML.innerHTML = `
        <div class="flip-card-inner" >
          <div class="card-front card-look hidden">
            <img src="${item.image}" />
          </div>
          <div class="card-back card-look ">
            <img src="../img/back.png" />
          </div>
        </div>
        `;

      cardHTML.addEventListener('click', () => {
        const frontCard = cardHTML.querySelector(".card-front");
        const backCard = cardHTML.querySelector(".card-back");
        frontCard.classList.remove("hidden");
        backCard.classList.add("hidden");
         
        if (this.solvedPairs.includes(item.partnerId)){
          console.log("CARD ALREADY SOLVED");
          return;
        }
        console.log(item.partnerId);

        if (!!this.selectedCard){
        const selectedCardDOM = document.querySelector(`#${this.selectedCard.name}`);
        const frontSelectedCard = selectedCardDOM.querySelector(".card-front");
        const backCSelectedCard = selectedCardDOM.querySelector(".card-back");
        
          if(item.partnerId === this.selectedCard.partnerId){ 
            console.log("YOU FOUND THE PAIR");
            this.solvedPairs.push(item.partnerId);

            setTimeout(function(){
              frontCard.classList.add("solved");   
              frontSelectedCard.classList.add("solved");
            }, 1000);
            this.selectedCard = null; 

            // MOVE TO THE WIN SCREEN
            if (this.solvedPairs.length == (this.cards.length/2)) {
              const gameScreen = document.querySelector("#game-screen");
              const winScreen = document.querySelector("#win-screen");
              setTimeout(function(){
                winScreen.classList.remove("hidden");
                gameScreen.classList.add("hidden");
                this.solvedPairs = null;
              }, 2000);
              console.log("WINNER");
            }

          } else {
            console.log("YOU FAILED");

            this.selectedCard = null;
            setTimeout(function(){
              frontCard.classList.add("hidden");
              backCard.classList.remove("hidden");
              frontSelectedCard.classList.add("hidden");
              backCSelectedCard.classList.remove("hidden");
            }, 1000);
          }

        } else {
          this.selectedCard = item;
        }
      });
      parent.appendChild(cardHTML);
    });
  }

  _shuffle() {
    let currentIndex = this.cards.length,  randomIndex;
  
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [this.cards[currentIndex], this.cards[randomIndex]] = [
       this.cards[randomIndex], this.cards[currentIndex]];
    }
  }
  
  startCountDown(){
    // when click on start button --> start counting the Time down, starting at 60 seconds.
    let counter = 60;
    const startButton = document.querySelector("#start");
    
    setInterval(function() {
      this.solvedPairs = null;
      startButton.addEventListener('click', () => {
        if (counter >= 0){
        const id = document.querySelector("#countdown");
        id.innerHTML = counter;
        counter-= 1;
        console.log(counter);
        return counter;
        
        }
    });
    }, 1000);

    if (counter === 0){
      const gameScreen = document.querySelector("#game-screen");
      const gameOverScreen = document.querySelector("#gameover");
      gameOverScreen.classList.remove("hidden");
      gameScreen.classList.add("hidden");
    }

    if(counter < 10){
      return "0" + counter;
    }
  }

}