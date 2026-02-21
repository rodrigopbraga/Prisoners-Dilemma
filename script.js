
let sliderRound = document.getElementById("roundcounter");
let sliderMistake = document.getElementById("mistakecounter");
let selectAElement = document.getElementById("playerA");
let selectBElement = document.getElementById("playerB");

let nRounds = document.getElementById("roundvalue");
let nMistake = document.getElementById("mistakevalue");
let aName = document.getElementById("aname");
let bName = document.getElementById("bname");
let roundA = document.getElementById("Aplays");
let roundB = document.getElementById("Bplays");
let statsbar = document.getElementById("stats-bar");



nRounds.innerHTML = sliderRound.value;
nMistake.innerHTML = sliderMistake.value;
aName.innerHTML = selectAElement.options[selectAElement.selectedIndex].value;
bName.innerHTML = selectBElement.options[selectBElement.selectedIndex].value;

sliderRound.oninput = function() {
  nRounds.innerHTML = this.value;
}
sliderMistake.oninput = function() {
  nMistake.innerHTML = this.value;
}
selectAElement.onchange = function() {
  aName.innerHTML = this.options[this.selectedIndex].value;
  A.playername = aName.innerHTML;
}
selectBElement.onchange = function() {
  bName.innerHTML = this.options[this.selectedIndex].value;
  B.playername = bName.innerHTML;
}



function Player (playername, cpoints, lplay, atpoints, atroundsplayed) {
  this.playername=playername;
  this.cpoints=cpoints;
  this.lplay=lplay;
  this.atpoints=atpoints;
  this.atroundsplayed=atroundsplayed;
}

function Player (playername, cpoints, lplay) {
  this.playername=playername;
  this.cpoints=cpoints;
  this.lplay=lplay;
  this.atpoints=0;
  this.atroundsplayed=0;
}

function Player (playername) {
  this.playername=playername;
  this.cpoints=0;
  this.lplay=null;
  this.atpoints=0;
  this.atroundsplayed=0;
}

let A = new Player(aName.innerHTML, 0, 0, 0, 0);
let B = new Player(bName.innerHTML, 0, 0, 0, 0);
let defectcountera=0;
let defectcounterb=0;



const DisplayToggle = () => {
  var element = document.body;
  element.classList.toggle("dark-mode");
}

const openModal = document.getElementById("knowplayersbutton");
const modal = document.getElementById("knowplayersdialog");
const closeModal = document.getElementById("close-modal");

openModal.addEventListener("click", () => {
  modal.showModal();
});

closeModal.addEventListener("click", () => {
  modal.close();
});



const StartGame = (A, B) =>{
  ClearGame(A, B);
  
  for(let round=0; round<nRounds.innerHTML; round++){
    Duel(A, B, round);
    AddRound(A.lplay, B.lplay);
  }
  
  SetStats(A);
  SetStats(B);
  defectcountera=0;
  defectcounterb=0;
}

const Duel = (A, B, round) => {
  SetPlay(A, B, round); 

  ItHappens(A);
  ItHappens(B);

  if(A.lplay && B.lplay) { // both cooperate
    A.cpoints+=3;
    B.cpoints+=3;
  }
  else if(A.lplay || B.lplay){ // different choices
    if(A.lplay){ // B defected
      B.cpoints+=5;
    }
    else{ // A defected
      A.cpoints+=5;
    }
  }
  else{ // both defected
    A.cpoints++;
    B.cpoints++;
  }
}

const SetPlay = (A, B, r) => {
  let ap=null;
  let bp=null;

  if(A.playername=="Random"){
    ap = Math.random()<0.5; //randomly cooperates or defects with equal probability
  }
  if(B.playername=="Random"){
    bp = Math.random()<0.5; //randomly cooperates or defects with equal probability
  }


  if(A.playername=="TitForTat"){
    if(r===0){ //always cooperate in the first round
      ap = true;
    }
    else{
      ap = B.lplay; //copies the opponent's last move
    }
  }
  if(B.playername=="TitForTat"){
    if(r===0){ //always cooperate in the first round
      bp = true;
    }
    else{
      bp = A.lplay; //copies the opponent's last move
    }
  }


  if(A.playername=="Cooperate"){
    ap = true; //always cooperates no matter what
  }
  if(B.playername=="Cooperate"){
    bp = true; //always cooperates no matter what
  }


  if(A.playername=="Defect"){
    ap = false; //always defects no matter what
  }
  if(B.playername=="Defect"){
    bp = false; //always defects no matter what
  }


  if(A.playername=="Detective"){
    if(r===0){ //always cooperate in the first round
      ap = true;
    }
    else if(r===1){ //always defect in the second round
      ap = false;
    }
    else{
      ap = B.lplay; //copies the opponent's last move
    }
  }
  if(B.playername=="Detective"){
    if(r===0){ //always cooperate in the first round
      bp = true;
    }
    else if(r===1){ //always defect in the second round
      bp = false;
    }
    else{
      bp = A.lplay; //copies the opponent's last move
    }
  }


  if(A.playername=="ParForTat"){
    if(B.lplay===false){defectcountera++;}
    if(defectcountera===2){ //if A gets defected twice, retaliates once
      ap = false;
      defectcountera=0;
    }
    else{
      ap = true;
    }
  }
  if(B.playername=="ParForTat"){
    if(A.lplay===false){defectcounterb++;}
    if(defectcounterb===2){ //if B gets defected twice, retaliates once
      bp = false;
      defectcounterb=0;
    }
    else{
      bp = true;
    }
  }


  A.lplay=ap;
  B.lplay=bp;
}

const ItHappens = (P) => {
  if(Math.random()<parseInt(nMistake.innerHTML)/100){ //with a certain probability, a player's intended move is flipped
    P.lplay = !P.lplay;
  }
}

const AddRound = (alplay, blplay) => {
  document.getElementById("Aplays").appendChild(AddPlay(alplay));
  document.getElementById("Bplays").appendChild(AddPlay(blplay));
}

function AddPlay(play){
  const newPlay = document.createElement("span");
  newPlay.innerHTML = play ? "[✔]" : "[✖]";
  newPlay.className = play ? "tplay" : "fplay";
  newPlay.id = 'cplay';
  return newPlay;
}



const SetStats = (P) => {
  P.atpoints+=P.cpoints;
  P.atroundsplayed+=parseInt(nRounds.innerHTML);

  statsbar.textContent+='\n'+P.playername
    +'\n current points: '+P.cpoints
    +'\n last play: '+P.lplay
    +'\n all time points: '+P.atpoints
    +'\n all time rounds played: '+P.atroundsplayed;
}

const ClearGame = (A, B) => {
  statsbar.textContent="";
  while(roundA.firstChild) {
    roundA.removeChild(roundA.firstChild);
  }
  while(roundB.firstChild) {
    roundB.removeChild(roundB.firstChild);
  }
  SetPlayer(A);
  SetPlayer(B);
}

const SetPlayer = (P) => {
  P.cpoints=0;
  P.lplay=null;
}
