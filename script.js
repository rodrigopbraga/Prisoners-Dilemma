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

const login = document.getElementById("login-dialog");
setTimeout(function() {
  login.classList.add("show-dialog");
  login.showModal();
}, 500);

openModal.addEventListener("click", () => {
  modal.classList.add("show-dialog");
  modal.showModal();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    event.preventDefault();
  }
});

const logintb = document.getElementById("login-input");
logintb.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    passwordtb.focus();
  }
});

logintb.onblur = function() {
  validateLogin();
};

const passwordtb = document.getElementById("password-input");
passwordtb.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    loginbtn.click();
  }
});

passwordtb.onblur = function() {
  validatePassword();
};

const loginbtn = document.getElementById("login-button");
loginbtn.addEventListener("click", () => {
  const id = logintb.value;
  const psw = passwordtb.value;
  //validateLogin(); // provisory login validation position
  //validatePassword();
  if(Login(id, psw)){
    login.classList.remove("show-dialog");
    login.classList.add("hide-dialog");
    login.close();
  }
  else{
    alert("Invalid ID or password. Please try again.");
    logintb.getfocus();
  }
});

const loginError = document.getElementById("login-error");
const passwordError = document.getElementById("password-error");

function validateLogin() {
  const id = logintb.value;
  let valid = true;

  if (id.trim() === "") {
    loginError.textContent = "ID cannot be empty.";
    valid = false;
  } else if (id.trim().length < 3) {
    loginError.textContent = "ID must be at least 5 characters long.";
    valid = false;
  } else if (id.trim().length > 15) {
    loginError.textContent = "ID must be at most 15 characters long.";
    valid = false;
  } else {
    loginError.textContent = "";
  }

  return valid;
}

function validatePassword() {
  const psw = passwordtb.value;
  let valid = true;

  if (psw.trim() === "") {
    passwordError.textContent = "Password cannot be empty.";
    valid = false;
  } else if (psw.trim().length < 4) {
    passwordError.textContent = "Password must be at least 4 characters long.";
    valid = false;
  } else if (psw.trim().length > 20) {
    passwordError.textContent = "Password must be at most 20 characters long.";
    valid = false;
  } else {
    passwordError.textContent = "";
  }

  return valid;
}

closeModal.addEventListener("click", () => {
  //modal.classList.add("hide-dialog");
  modal.close();
});

document.addEventListener("click", function(event) {
  if (event.target === modal) {
    modal.close();
  }
});

const Login = (id, psw) => {
  return id==="1" && psw==="1";
}

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
  
  SetStats();
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



const SetStats = () => {
  if(A.cpoints!==0){
    A.atpoints+=A.cpoints;
    A.atroundsplayed+=parseInt(nRounds.innerHTML);
    B.atpoints+=B.cpoints;
    B.atroundsplayed+=parseInt(nRounds.innerHTML);
  }

  statNameA.textContent = A.playername;
  statCpointsA.textContent = A.cpoints;
  statLplayA.textContent = A.lplay ? "✔" : "✖";
  statAtpointsA.textContent = A.atpoints;
  statAtroundsA.textContent = A.atroundsplayed;

  statNameB.textContent = B.playername;
  statCpointsB.textContent = B.cpoints;
  statLplayB.textContent = B.lplay ? "✔" : "✖";
  statAtpointsB.textContent = B.atpoints;
  statAtroundsB.textContent = B.atroundsplayed;
}

const ClearGame = (A, B) => {
  // Reset stats and board displays
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

const ResetGame = () => {
  A = new Player(aName.innerHTML, 0, 0, 0, 0);
  B = new Player(bName.innerHTML, 0, 0, 0, 0);
  ClearGame(A, B);
  SetStats();
}
const SetPlayer = (P) => {
  P.cpoints=0;
  P.lplay=null;
}
