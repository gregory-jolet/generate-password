function getRandomNumber(min, max) {
  // obtenir une valeur aléatoire de manière plus sécurisée que Math.random
  let randomNumber = crypto.getRandomValues(new Uint32Array(1))[0];

  // 32 bits = max de 0 à 4 294 967 295
  randomNumber = randomNumber / 4294967296;

  // retour d'un nombre entier
  return Math.trunc(randomNumber * (max - min + 1)) + min;
}

function addASet(fromCode, toCode) {
  let charactersList = "";
  for (let i = fromCode; i <= toCode; i++) {
    // retour sous forme de chaine de caractères avec les codes de caractères : https://www.w3schools.com/charsets/ref_html_ascii.asp
    charactersList += String.fromCharCode(i);
  }
  return charactersList;
}

const charactersSet = {
  // minuscules
  lowerCaseChars: addASet(97, 122),
  // majuscules
  upperCaseChars: addASet(65, 90),
  // nombres
  numbers: addASet(48, 57),
  // symbols
  symbols:
    addASet(33, 47) + addASet(58, 64) + addASet(91, 96) + addASet(123, 126),
};

const range = document.querySelector("input[type='range']");
const rangeLabel = document.querySelector(".range-group label");

rangeLabel.textContent = `Taille du mot de passe : ${range.value}`;
// valeur de la range
let passwordLength = range.value;

const passwordContent = document.querySelector(".password-content");
const errorMsg = document.querySelector(".error-message");
const generateBtn = document.querySelector(".generate-password");
const checkboxes = document.querySelectorAll("input[type='checkbox']");

generateBtn.addEventListener("click", createPassword);

function createPassword() {
  // ensemble des cases cochées
  const checkedDataSets = checkedSets();

  if (!checkedDataSets.length) {
    errorMsg.textContent = "Au moins une case doit être cochée !";
    return;
  } else errorMsg.textContent = "";

  // on introduit tous les caractères dans un tableau
  const concatenatedDataSets = checkedDataSets.reduce((acc, cur) => acc + cur);
  console.log(concatenatedDataSets);

  let password = "";

  // caractères de base
  let passwordBase = [];
  for (let i = 0; i < checkedDataSets.length; i++) {
    passwordBase.push(
      checkedDataSets[i][getRandomNumber(0, checkedDataSets[i].length - 1)]
    );
  }

  // reste du mdp
  for (let i = checkedDataSets.length; i < passwordLength; i++) {
    password +=
      concatenatedDataSets[getRandomNumber(0, concatenatedDataSets.length - 1)];
  }

  // mélange des caractères
  passwordBase.forEach((item, index) => {
    //
    const randomIndex = getRandomNumber(0, password.length);
    password =
      password.slice(0, randomIndex) +
      passwordBase[index] +
      password.slice(randomIndex);
  });

  passwordContent.textContent = password;
}
createPassword();

// on vérifie les cases cochées
function checkedSets() {
  let checkedSets = [];
  checkboxes.forEach(
    (checkbox) =>
      // push des caractères dans un tableau
      checkbox.checked && checkedSets.push(charactersSet[checkbox.id])
  );

  return checkedSets;
}

range.addEventListener("input", handleRange);

// taille du mdp
function handleRange(e) {
  passwordLength = e.target.value;
  rangeLabel.textContent = `Taille du mot de passe : ${passwordLength}`;
}

const copyBtn = document.querySelector(".copy-btn");

copyBtn.addEventListener("click", copyPassword);

let locked = false;

function copyPassword() {
  // introduction dans le presse papier
  navigator.clipboard.writeText(passwordContent.textContent);

  
  if (!locked) {
    copyBtn.classList.add("active");
    locked = true;

    // limite du temps d'affichage
    setTimeout(() => {
      copyBtn.classList.remove("active");
      locked = false;
    }, 1000);
  }
}
