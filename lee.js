window.onload = main;

const KEY_CODES = {
  SPACE: 32,
  ENTER: 13
}

const matrix = [];
const M = 15;
const N = 20;
let endPointI;
let endPointJ;
let count = 0;
let lastLayer = 1;

function main() {
  createMatrix();

  document.addEventListener('keypress', onKeyPress);
}

function onKeyPress(event) {
  const code = event.keyCode;

  switch (code) {
    case KEY_CODES.SPACE: {
      startAlgorithm();
      break;
    } 
    case KEY_CODES.ENTER: {
      showWay();
      break;
    }
  }
}


function createMatrix() {
  const tBody = document.getElementById('bodyId');
 
  for (let i = 0; i < M; i++) {
    matrix[i] = [];
    const row = document.createElement('tr');
    for (let j = 0; j < N; j++) {
      matrix[i][j] = 0;
      const box = document.createElement('td');
      box.setAttribute('id', `${i}_${j}`);
      box.addEventListener('click', onBoxClick)
      row.appendChild(box);
    }
    tBody.appendChild(row);
  }
}

function onBoxClick(event) {
  const box = event.target;
  const id = box.getAttribute('id');

  let [i, j] = id.split('_').map(el => +el);

  console.log(i, j);

  if (matrix[i][j] !== 0) {
    return;
  }

  switch(count) {
    case 0: {
      setStartPoint(i, j);
      break;
    }
    case 1: {
      setEndPoint(i, j);
      break;
    }
    default: {
      setWalls(i ,j);
      break;
    }
  }
  count++;
}

function setStartPoint(i, j) {
  matrix[i][j] = 1;
  const box = document.getElementById(`${i}_${j}`);
  box.classList.add('red');
}

function setEndPoint(i, j) {
  matrix[i][j] = M * N;
  endPointI = i;
  endPointJ = j;
  const box = document.getElementById(`${i}_${j}`);
  box.classList.add('green');
}

function setWalls(i, j) {
  matrix[i][j] = -1
  const box = document.getElementById(`${i}_${j}`);
  box.classList.add('black');
 }



 function startAlgorithm() {
   if (count < 2) {
     alert('Please select start and end points!');
     return;
   }
    const intervaiId = setInterval(() => {

      if (isFinished()) {
        clearInterval(intervaiId);
        return;
      }

      const lastLayerBoxes = getLastLayerBoxes();
      lastLayerBoxes.forEach(({i, j}) => {
        const freeNeighbours = getFreeNeighbours(i, j);
        freeNeighbours.forEach(({i, j}) => {
          setNeighbour(i, j, lastLayer + 1);
        });
      });
      lastLayer++;
    }, 300);

 }

 function isFinished() {
   return hasReached() || isBloked();
 }

 function hasReached() {
    if (endPointI + 1 < M && matrix[endPointI + 1][endPointJ] > 0) {
      return true;
    }
    if (endPointI - 1 >= 0 && matrix[endPointI - 1][endPointJ] > 0) {
      return true;
    }
    if (endPointJ + 1 < N && matrix[endPointI][endPointJ + 1] > 0) {
      return true;
    }
    if (endPointJ - 1 >= 0 && matrix[endPointI][endPointJ - 1] > 0) {
    return true;
  }
  return false;
 }

 function isBloked() {
  const lastLayerBoxes = getLastLayerBoxes();

  for (const {i, j} of lastLayerBoxes) {
    const freeNeighbours = getFreeNeighbours(i, j);
    if (freeNeighbours.length > 0) {
      return false;
    }
  }
  return true;
 }

 function getLastLayerBoxes() {
   const lastLayerBoxes = [];

   for (let i = 0; i < M; i++) {
     for (let j = 0; j < N; j++) {
       if (matrix[i][j] === lastLayer) {
         lastLayerBoxes.push({i, j})
       }
     }
   }
   return lastLayerBoxes;
 }
 

 function getFreeNeighbours(i, j) {
   const freeNeighbours = [];

   if (i + 1 < M && matrix[i + 1][j] === 0) {
     freeNeighbours.push({i: i + 1, j})
   }
   if (i - 1 >= 0 && matrix[i - 1][j] === 0) {
    freeNeighbours.push({i: i - 1, j})
  }
  if (j + 1 < N && matrix[i][j + 1] === 0) {
    freeNeighbours.push({i, j:j + 1})
  }
  if (j - 1 >= 0 && matrix[i][j - 1] === 0) {
   freeNeighbours.push({i, j:j - 1})
 }
   return freeNeighbours;
 }


 function setNeighbour(i, j, number) {
  matrix[i][j] = number;
  const box = document.getElementById(`${i}_${j}`);
  box.classList.add('blue');
}


 function showWay() {
  if (count < 2) {
    alert('Please select start and end points!');
    return;
  }
   if (hasReached()) {
    const intervaiId = setInterval(() => {
      if (lastLayer === 1) {
        clearInterval(intervaiId);
        return;
      }

      const {i, j} = getNextBox();
      endPointI = i;
      endPointJ = j;
      const box = document.getElementById(`${i}_${j}`);
      box.classList.add('pink');
      lastLayer--;
    }, 300);
  } else {
    alert('No way to end point!!!!');
  }
 }

 function getNextBox() {
    if (endPointI + 1 < M && matrix[endPointI + 1][endPointJ] === lastLayer) {
      return {i: endPointI + 1, j: endPointJ};
    }
    if (endPointI - 1 >= 0 && matrix[endPointI - 1][endPointJ] === lastLayer) {
      return {i: endPointI - 1, j: endPointJ};
    }
    if (endPointJ + 1 < N && matrix[endPointI][endPointJ + 1] === lastLayer) {
      return {i: endPointI, j: endPointJ + 1};
    }
    if (endPointJ - 1 >= 0 && matrix[endPointI][endPointJ - 1] === lastLayer) {
    return {i: endPointI, j: endPointJ - 1};
  }
 }


