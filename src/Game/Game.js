import React, { useEffect } from "react";
import cloud from "../img/cloud.png";
import dinosaur from "../img/dinosaur.png";
import ground from "../img/ground.png";
import dinosaur_left from "../img/dinosaur_left.png";
import dinosaur_right from "../img/dinosaur_right.png";
import dinosaur_die from "../img/banana.png";
import obstacle from "../img/obstacle.png";

const STATUS = {
    STOP: "STOP",
    START: "START",
    PAUSE: "PAUSE",
    OVER: "OVER"
};

const JUMP_DELTA = 5;
const JUMP_MAX_HEIGHT = 53;

function App(props) {
    // props.
    const { isMine, obstacles_p, overridedObstacles, sendObstacles } = props

    let canvas;
    let status;
    let options;
    let timer = null;
    let score = 0;
    let highScore = 0;
    let jumpHeight = 0;
    let jumpDelta = 0;
    let obstaclesBase = 1;
    let currentDistance = 0;
    let playerStatus = 0;
    let obstacles;

    let imageLoadCount = 0;

    let skyImage = new Image();
    let groundImage = new Image();
    let playerImage = new Image();
    let playerLeftImage = new Image();
    let playerRightImage = new Image();
    let playerDieImage = new Image();
    let obstacleImage = new Image();

    const onImageLoaded = () => {
        imageLoadCount++;
        if (imageLoadCount === 3) {
            drawCanvas();
        }
    };

    skyImage.onload = onImageLoaded;
    groundImage.onload = onImageLoaded;
    playerImage.onload = onImageLoaded;

    skyImage.src = cloud;
    groundImage.src = ground;
    playerImage.src = dinosaur;
    playerLeftImage.src = dinosaur_left;
    playerRightImage.src = dinosaur_right;
    playerDieImage.src = dinosaur_die;
    obstacleImage.src = obstacle;

    options = {
        fps: 60,
        skySpeed: 80,
        groundSpeed: 200,
        skyImage: skyImage,
        groundImage: groundImage,
        playerImage: [
            playerImage,
            playerLeftImage,
            playerRightImage,
            playerDieImage
        ],
        obstacleImage: obstacleImage,
        skyOffset: 0,
        groundOffset: 0
    };

    status = STATUS.STOP;
    highScore = window.localStorage ? window.localStorage["highScore"] || 0 : 0;

    const generateObstacles = () => {
        let res = [];
        for (let i = 0; i < 10; ++i) {
            let random = Math.floor(Math.random() * 100) % 60;
            random = ((Math.random() * 10) % 2 === 0 ? 1 : -1) * random;
            res.push({
                distance: random + obstaclesBase * 200
            });
            obstaclesBase++;
        }
        return res;
    };

    if (isMine) {
        obstacles = generateObstacles();
        if (sendObstacles && sendObstacles.length) {
            sendObstacles(obstacles)
        }
    } else if (obstacles_p && Array.isArray(obstacles_p) && obstacles_p.length) {
        obstacles = obstacles_p;
        onSpacePress();
    }


    useEffect(() => {
        const onSpacePress = () => {
            switch (status) {
                case STATUS.STOP:
                    start();
                    break;
                case STATUS.START:
                    jump();
                    break;
                case STATUS.OVER:
                    restart();
                    break;
            }
        };

        if (isMine) {
            window.onkeypress = e => {
                if (e.key === " ") {
                    onSpacePress();
                }
            };

            canvas.parentNode.onclick = onSpacePress;
        }

        window.onblur = pause;
        window.onfocus = goOn;

        return () => {
            window.onblur = null;
            window.onfocus = null;
        };
    }, [status]);

    const pause = () => {
        if (status === STATUS.START) {
            status = STATUS.PAUSE;
            clearTimer();
        }
    };

    const goOn = () => {
        if (status === STATUS.PAUSE) {
            status = STATUS.START;
            startTimer();
        }
    };

    const start = () => {
        status = STATUS.START;
        startTimer();
        jump();
    };

    const jump = () => {
        if (jumpHeight > 2) {
            return;
        }
        jumpDelta = JUMP_DELTA;
        jumpHeight = JUMP_DELTA;
    };

    const stop = () => {
        if (status === STATUS.OVER) {
            return;
        }
        status = STATUS.OVER;
        playerStatus = 3;
        clearTimer();
        drawCanvas();
        clear();
    };

    const restart = () => {
        obstacles = obstaclesGenerate();
        start();
    };

    const startTimer = () => {
        timer = setInterval(() => drawCanvas(), 1000 / options.fps);
    };

    const clearTimer = () => {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    };

    const clear = () => {
        score = 0;
        jumpHeight = 0;
        currentDistance = 0;
        obstacles = [];
        obstaclesBase = 1;
        playerStatus = 0;
    };

    const obstaclesGenerate = () => {
        let res = [];
        for (let i = 0; i < 10; ++i) {
            let random = Math.floor(Math.random() * 100) % 60;
            random = ((Math.random() * 10) % 2 === 0 ? 1 : -1) * random;
            res.push({
                distance: random + obstaclesBase * 200
            });
            obstaclesBase++;
        }
        return res;
    };

    const drawCanvas = () => {
        let level = Math.min(200, Math.floor(score / 100));
        let groundSpeed = (options.groundSpeed + level) / options.fps;
        let skySpeed = options.skySpeed / options.fps;
        let obstacleWidth = options.obstacleImage.width;
        let playerWidth = options.playerImage[0].width;
        let playerHeight = options.playerImage[0].height;

        const ctx = canvas.getContext("2d");
        const { width, height } = canvas;

        ctx.clearRect(0, 0, width, height);
        ctx.save();

        options.skyOffset =
            options.skyOffset < width
                ? options.skyOffset + skySpeed
                : options.skyOffset - width;
        ctx.translate(-options.skyOffset, 0);
        ctx.drawImage(options.skyImage, 0, 0);
        ctx.drawImage(options.skyImage, options.skyImage.width, 0);

        options.groundOffset =
            options.groundOffset < width
                ? options.groundOffset + groundSpeed
                : options.groundOffset - width;
        ctx.translate(options.skyOffset - options.groundOffset, 0);
        ctx.drawImage(options.groundImage, 0, 76);
        ctx.drawImage(options.groundImage, options.groundImage.width, 76);

        ctx.translate(options.groundOffset, 0);
        ctx.drawImage(options.playerImage[playerStatus], 80, 64 - jumpHeight);

        jumpHeight = jumpHeight + jumpDelta;
        if (jumpHeight <= 1) {
            jumpHeight = 0;
            jumpDelta = 0;
        } else if (jumpHeight < JUMP_MAX_HEIGHT && jumpDelta > 0) {
            jumpDelta =
                jumpHeight * jumpHeight * 0.001033 - jumpHeight * 0.137 + 5;
        } else if (jumpHeight < JUMP_MAX_HEIGHT && jumpDelta < 0) {
            jumpDelta =
                jumpHeight * jumpHeight * 0.00023 - jumpHeight * 0.03 - 4;
        } else if (jumpHeight >= JUMP_MAX_HEIGHT) {
            jumpDelta = -JUMP_DELTA / 2.7;
        }

        // 分数
        let scoreText =
            (status === STATUS.OVER ? "GAME OVER  " : "") + Math.floor(score);
        ctx.font = "Bold 18px Arial";
        ctx.textAlign = "right";
        ctx.fillStyle = "#595959";
        ctx.fillText(scoreText, width - 30, 23);
        if (status === STATUS.START) {
            score += 0.5;
            if (score > highScore) {
                highScore = score;
                window.localStorage["highScore"] = score;
            }
            currentDistance += groundSpeed;
            if (score % 4 === 0) {
                playerStatus = (playerStatus + 1) % 3;
            }
        }
        if (highScore) {
            ctx.textAlign = "left";
            ctx.fillText("HIGH  " + Math.floor(highScore), 30, 23);
        }

        // 障碍
        let pop = 0;
        if (obstacles) {
            for (let i = 0; i < obstacles.length; ++i) {
                if (currentDistance >= obstacles[i].distance) {
                    let offset =
                        width -
                        (currentDistance - obstacles[i].distance + groundSpeed);
                    if (offset > 0) {
                        ctx.drawImage(options.obstacleImage, offset, 84);
                    } else {
                        ++pop;
                    }
                } else {
                    break;
                }
            }
            for (let i = 0; i < pop; ++i) {
                obstacles.shift();
            }
            if (obstacles.length < 5) {
                obstacles = obstacles.concat(obstaclesGenerate());
            }

            // 碰撞检测
            let firstOffset =
                width - (currentDistance - obstacles[0].distance + groundSpeed);

            if (
                90 - obstacleWidth < firstOffset &&
                firstOffset < 60 + playerWidth &&
                64 - jumpHeight + playerHeight > 84
            ) {
                stop();
            }
        }

        ctx.restore();
    };

    return (
        <canvas
            id="canvas"
            style={{ paddingTop: "57px" }}
            ref={ref => (canvas = ref)}
            height={180}
            width={1150}
        />
    );
}

export default App;
