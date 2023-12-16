let blockGame = false;
let play = false;

let playerScore = 0

let scoresArray = []
let intervalsArray = []

function game(username) {
    // Reinitialize the variable in case of game restart
    play = false
    blockGame = false
    playerScore = 0
    scoresArray = []
    displaySavedScores()
    // generate game decor, dino and play button
    decor()
    dino()
    
    createPlayerScore()
    updatePlayerScore(username)

    moveDino()
    moveObstacles()
    
    createObstacles(1)

    stopGame(username)

}

function decor() {
    // main container for the game
    let decorContainer = document.createElement('div')
    decorContainer.classList.add('decor-container')
    document.body.append(decorContainer)

    let obstacleContainer = document.createElement('div')
    obstacleContainer.classList.add('obstacle-container')

    let obstacleLayer = document.createElement('div')
    obstacleLayer.classList.add('obstacle-layer')


    let decorContainerHTML = document.getElementsByClassName('decor-container').item(0)

    obstacleContainer.append(obstacleLayer)
    decorContainerHTML.append(obstacleContainer)
}

function dino() {
    let decorContainer = document.getElementsByClassName('decor-container').item(0)
    let dino = document.createElement('div')
    dino.classList.add('dino')
    decorContainer.append(dino)
}

function moveDino() {
    let dino = document.getElementsByClassName('dino').item(0)
    document.addEventListener('keydown', function(e) {

        if (blockGame != true) {
            dino.classList.remove('ground')
            dino.classList.remove('up')
            dino.classList.remove('down')

            switch (e.key) {
                case 'ArrowUp':
                    dino.classList.add('up')
                    setTimeout(() => {
                        dino.classList.add('ground')
                    }, 350)
                    break;
                case 'ArrowDown':
                    dino.classList.add('down')
                    break;
            }
        }
    })

    document.addEventListener('keyup', function(e) {
        if(e.key == 'ArrowDown') {
            dino.classList.remove('down')
            dino.classList.add('ground')
        }
    })
}

function createObstacles(number) {
    let obstacleLayer = document.getElementsByClassName('obstacle-layer').item(0)
    let obstacleType = [
        'regular', 'large', 'bird'
    ]

    let createObstacleInterval = setInterval(() => {
        let randomObstacle = obstacleType[Math.floor(Math.random() * obstacleType.length)]
        if (blockGame != true) {
            for (let i = 0; i < number; i++) {
                switch (randomObstacle) {
                    case 'regular':
                        let obstacleRegular = document.createElement('div')
                        obstacleRegular.classList.add('obstacle')
                        obstacleRegular.classList.add('obstacle-regular')
                        obstacleLayer.append(obstacleRegular) 
                        break;
                    case 'large':
                        let obstacleLarge = document.createElement('div')
                        obstacleLarge.classList.add('obstacle')
                        obstacleLarge.classList.add('obstacle-large')
                        obstacleLayer.append(obstacleLarge) 
                        break;
                    case 'bird':
                        let obstacleBird = document.createElement('div')
                        obstacleBird.classList.add('obstacle')
                        obstacleBird.classList.add('obstacle-bird')
                        obstacleLayer.append(obstacleBird) 
                        break;
                }
            }
        }
    }, 500);
intervalsArray.push(createObstacleInterval)
}

function moveObstacles() {
    let i = 0
    
    let obstacleLayer = document.getElementsByClassName('obstacle-layer').item(0)
        let moveObstacleInterval = setInterval(function() {
            if (blockGame != true) {
                if (playerScore < 200) {
                    i+= 5     
                } else if (playerScore > 200 && playerScore < 300) {
                    i+= 5.5
                } else if (playerScore > 300 && playerScore < 400) {
                    i+= 6
                } else if (playerScore > 400 && playerScore < 500) {
                    i+= 6.5
                } else if (playerScore > 500 && playerScore < 800) {
                    i+= 7                   
                } else {
                    i+= 8.5
                }
                obstacleLayer.style.marginLeft = `-${i}px`
            }
        }, 10)
        intervalsArray.push(moveObstacleInterval)
}

function stopGame(username) {
    let dino = document.getElementsByClassName('dino').item(0)

    let stopGameInterval = setInterval(() => {
        let obstacles = document.getElementsByClassName('obstacle')
        let rectDino = dino.getBoundingClientRect();
        
        for (let obstacle of obstacles) {
            let rectObstacle = obstacle.getBoundingClientRect();
            // Check first if the obstacle has already passed the dino, then check if the obstacle touches the dino only if the dino is not jumping
            if ((obstacle.classList.contains('obstacle-regular') || obstacle.classList.contains('obstacle-large')) && !(rectObstacle.right < rectDino.left) && rectObstacle.x < rectDino.right && !(rectDino.bottom < rectObstacle.top)) {
                blockGame = true
                startAgain(username)
            } else if (obstacle.classList.contains('obstacle-bird') && !(rectObstacle.right < rectDino.left) && rectObstacle.x < rectDino.right && !(rectDino.top > rectObstacle.bottom)) {
                blockGame = true
                startAgain(username)
            }
        }
    }, 1)
    intervalsArray.push(stopGameInterval)
}

function createPlayerScore() {
    let decorContainer = document.getElementsByClassName('decor-container').item(0)
    let p = document.createElement('p')
    p.classList.add('score')
    decorContainer.append(p)
}

function updatePlayerScore(username) {
    let isScoreSaved = false  
    let score = document.getElementsByClassName('score').item(0)
    
    let updatePlayerScoreInterval = setInterval(function() {
        if (blockGame != true) {
            playerScore++
            score.innerText = `${username}: ${playerScore}`
        } else {
            if (isScoreSaved != true) {
                let savedScore = score.cloneNode(true)
                savedScore.classList.remove('score')
                
                
                let scoreObject = {
                    score: playerScore,
                    scoreHTML: savedScore.outerHTML
                }

                scoresArray.push(scoreObject)
                localStorage.setItem('scores', JSON.stringify(scoresArray))


                isScoreSaved = true
            } 
        }
    }, 50)
    intervalsArray.push(updatePlayerScoreInterval)
}

function displaySavedScores() {
    let savedScoresContainer = document.createElement('div')
    savedScoresContainer.classList.add('saved-scores-container')
    savedScoresContainer.innerHTML = `
    <h1>Best scores</h1>
    <div class='saved-scores-content'></div>
    `
    document.body.appendChild(savedScoresContainer)

    let savedScoresContent = document.getElementsByClassName('saved-scores-content').item(0)
    let savedScores = localStorage.getItem('scores')
    if (savedScores != []) {
        scoresArray = JSON.parse(savedScores)
        scoresArray.sort((a, b) => b.score - a.score);
        scoresArray = scoresArray.slice(0, 5)
        scoresArray.forEach((item) => {
            savedScoresContent.insertAdjacentHTML('beforeend', item.scoreHTML)
        })
    }


}

function startAgain(username) {
    if (play != true) {
        play = true
        let decorContainer = document.getElementsByClassName('decor-container').item(0)
        let div = document.createElement('div')
        div.classList.add('start-again')
        div.innerHTML = `
            <p>Start again</p>
            <div><img src='./public/assets/img/reset.png' alt='restart'></div>
        `
        decorContainer.appendChild(div)
        let divInHTML = document.getElementsByClassName('start-again').item(0)

        divInHTML.addEventListener('click', function() {
            document.body.innerHTML = '';
            intervalsArray.forEach((interval) => {
                clearInterval(interval)
            })
            game(username)
        })
    }

}



let buttonPlay = document.getElementById('button-play');
let getUsernameContainer = document.getElementsByClassName('get-username').item(0)
buttonPlay.addEventListener('click', function() {
    let usernameInputValue = document.getElementById('username').value
    if (usernameInputValue != '') {
        getUsernameContainer.remove()
        game(usernameInputValue)
    } else {
        alert('Username cannot be empty')
    }
})