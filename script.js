let sliderRound = document.getElementById("roundcounter");
let sliderMistake = document.getElementById("mistakeratio");
let selectAElement = document.getElementById("playerA");
let selectBElement = document.getElementById("playerB");

let nRounds = document.getElementById("roundvalue");
let nMistake = document.getElementById("mistakevalue");
let aName = document.getElementById("aname");
let bName = document.getElementById("bname");
let roundA = document.getElementById("Aplays");
let roundB = document.getElementById("Bplays");

// Stats elements for Player A
let statNameA = document.getElementById("stats-name-a");
let statCpointsA = document.getElementById("stat-cpoints-a");
let statLplayA = document.getElementById("stat-lplay-a");
let statAtpointsA = document.getElementById("stat-atpoints-a");
let statAtroundsA = document.getElementById("stat-atrounds-a");

// Stats elements for Player B
let statNameB = document.getElementById("stats-name-b");
let statCpointsB = document.getElementById("stat-cpoints-b");
let statLplayB = document.getElementById("stat-lplay-b");
let statAtpointsB = document.getElementById("stat-atpoints-b");
let statAtroundsB = document.getElementById("stat-atrounds-b");



nRounds.innerHTML = sliderRound.value;
nMistake.innerHTML = sliderMistake.value;
aName.innerHTML = selectAElement.options[selectAElement.selectedIndex].value;
bName.innerHTML = selectBElement.options[selectBElement.selectedIndex].value;

sliderRound.oninput = function() {
  nRounds.innerHTML = this.value;
}
sliderMistake.oninput = function() {
  nMistake.innerHTML = this.value;
  Check50();
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
  
  var statsContainer = document.querySelector(".stats-container");
  if(statsContainer) statsContainer.classList.toggle("dark-mode");
  
  var dialog = document.getElementById("knowplayersdialog");
  if(dialog) dialog.classList.toggle("dark-mode");
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

const Check50 = () => {
  if(parseInt(nMistake.innerHTML)===50){
    document.getElementById("mistake50").hidden=false;
  }
  else{
    document.getElementById("mistake50").hidden=true;
  }
}

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

  if(P === A) {
    statNameA.textContent = P.playername;
    statCpointsA.textContent = P.cpoints;
    statLplayA.textContent = P.lplay ? "✔" : "✖";
    statAtpointsA.textContent = P.atpoints;
    statAtroundsA.textContent = P.atroundsplayed;
  } else if(P === B) {
    statNameB.textContent = P.playername;
    statCpointsB.textContent = P.cpoints;
    statLplayB.textContent = P.lplay ? "✔" : "✖";
    statAtpointsB.textContent = P.atpoints;
    statAtroundsB.textContent = P.atroundsplayed;
  }
}

const ClearGame = (A, B) => {
  // Reset stat displays
  statCpointsA.textContent = '0';
  statLplayA.textContent = '-';
  statCpointsB.textContent = '0';
  statLplayB.textContent = '-';
  
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
