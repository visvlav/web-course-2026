(() => {
  'use strict';


  const CONFIG = Object.freeze({
    GRID_SIZE: 20,        
    CELL_SIZE: 20,       
    INITIAL_LENGTH: 3,    
    MOVE_INTERVAL: 150,   
    MAX_INPUT_QUEUE: 2,   
    COLORS: Object.freeze({
      FIELD: '#181825',
      GRID: '#222236',
      SNAKE_HEAD: '#a6e3a1',
      SNAKE_BODY: '#40a02b',
      APPLE: '#f38ba8',
      TEXT: '#ffffff',
      OVERLAY: 'rgba(0, 0, 0, 0.65)',
    }),
  });

  const DIRECTIONS = Object.freeze({
    UP: Object.freeze({ x: 0, y: -1 }),
    DOWN: Object.freeze({ x: 0, y: 1 }),
    LEFT: Object.freeze({ x: -1, y: 0 }),
    RIGHT: Object.freeze({ x: 1, y: 0 }),
  });

  const KEY_TO_DIRECTION = Object.freeze({
    ArrowUp: DIRECTIONS.UP,
    ArrowDown: DIRECTIONS.DOWN,
    ArrowLeft: DIRECTIONS.LEFT,
    ArrowRight: DIRECTIONS.RIGHT,
  });

  const isSameCell = (a, b) => a.x === b.x && a.y === b.y;

  const isOppositeDirection = (a, b) => a.x + b.x === 0 && a.y + b.y === 0;

  const isSameDirection = (a, b) => a.x === b.x && a.y === b.y;

  class SnakeModel {
    #gridSize;
    #initialLength;
    #snake = [];
    #direction = DIRECTIONS.RIGHT;
    #inputQueue = [];
    #apple = null;
    #score = 0;
    #gameOver = false;
    #won = false;

    constructor(gridSize, initialLength) {
      this.#gridSize = gridSize;
      this.#initialLength = initialLength;
      this.reset();
    }
    reset() {
      const middle = Math.floor(this.#gridSize / 2);
      this.#snake = [];
      for (let i = 0; i < this.#initialLength; i++) {
        this.#snake.push({ x: middle - i, y: middle });
      }
      this.#direction = DIRECTIONS.RIGHT;
      this.#inputQueue = [];
      this.#score = 0;
      this.#gameOver = false;
      this.#won = false;
      this.#spawnApple();
    }
    setDirection(newDirection) {
      if (this.#gameOver) return;

      const lastPlanned = this.#inputQueue.length > 0
        ? this.#inputQueue[this.#inputQueue.length - 1]
        : this.#direction;

      if (isSameDirection(newDirection, lastPlanned)) return;
      if (isOppositeDirection(newDirection, lastPlanned)) return;
      if (this.#inputQueue.length >= CONFIG.MAX_INPUT_QUEUE) return;

      this.#inputQueue.push(newDirection);
    }

    update() {
      if (this.#gameOver) return;

      this.#applyQueuedDirection();

      const newHead = this.#getNextHead();
      const willGrow = this.#apple !== null && isSameCell(newHead, this.#apple);

      if (this.#checkCollision(newHead, willGrow)) {
        this.#gameOver = true;
        return;
      }

      this.#moveSnake(newHead, willGrow);

      if (willGrow) {
        this.#score += 1;
        this.#spawnApple();
      }
    }

    isGameOver() {
      return this.#gameOver;
    }
    getState() {
      return {
        gridSize: this.#gridSize,
        snake: this.#snake.map((segment) => ({ ...segment })),
        apple: this.#apple ? { ...this.#apple } : null,
        score: this.#score,
        gameOver: this.#gameOver,
        won: this.#won,
      };
    }
    #applyQueuedDirection() {
      if (this.#inputQueue.length > 0) {
        this.#direction = this.#inputQueue.shift();
      }
    }

    #getNextHead() {
      const head = this.#snake[0];
      return { x: head.x + this.#direction.x, y: head.y + this.#direction.y };
    }

    #checkCollision(cell, willGrow) {
      const hitsWall =
        cell.x < 0 || cell.y < 0 ||
        cell.x >= this.#gridSize || cell.y >= this.#gridSize;
      if (hitsWall) return true;
      const bodyToCheck = willGrow ? this.#snake : this.#snake.slice(0, -1);
      return bodyToCheck.some((segment) => isSameCell(segment, cell));
    }

    #moveSnake(newHead, willGrow) {
      this.#snake.unshift(newHead);
      if (!willGrow) {
        this.#snake.pop();
      }
    }

    #spawnApple() {
      const freeCells = [];
      for (let y = 0; y < this.#gridSize; y++) {
        for (let x = 0; x < this.#gridSize; x++) {
          const cell = { x, y };
          if (!this.#snake.some((segment) => isSameCell(segment, cell))) {
            freeCells.push(cell);
          }
        }
      }

      if (freeCells.length === 0) {
        this.#apple = null;
        this.#won = true;
        this.#gameOver = true;
        return;
      }

      const index = Math.floor(Math.random() * freeCells.length);
      this.#apple = freeCells[index];
    }
  }

  class CanvasView {
    #canvas;
    #ctx;
    #scoreElement;
    #restartButton;
    #cellSize;
    #colors;

    constructor({ canvas, scoreElement, restartButton }, config) {
      this.#canvas = canvas;
      this.#ctx = canvas.getContext('2d');
      this.#scoreElement = scoreElement;
      this.#restartButton = restartButton;
      this.#cellSize = config.CELL_SIZE;
      this.#colors = config.COLORS;

      this.#canvas.width = config.GRID_SIZE * config.CELL_SIZE;
      this.#canvas.height = config.GRID_SIZE * config.CELL_SIZE;
    }
    bindDirectionInput(handler) {
      document.addEventListener('keydown', (event) => {
        const direction = KEY_TO_DIRECTION[event.key];
        if (!direction) return;
        event.preventDefault(); 
        handler(direction);
      });
    }

    bindRestart(handler) {
      this.#restartButton.addEventListener('click', () => {
        this.#restartButton.blur(); 
        handler();
      });
    }

    render(state) {
      this.#drawField(state.gridSize);
      this.#drawApple(state.apple);
      this.#drawSnake(state.snake);
      this.#drawScore(state.score);

      if (state.gameOver) {
        this.#drawGameOver(state);
      }
      this.#restartButton.hidden = !state.gameOver;
    }
    #drawField(gridSize) {
      const ctx = this.#ctx;
      const size = this.#cellSize;

      ctx.fillStyle = this.#colors.FIELD;
      ctx.fillRect(0, 0, this.#canvas.width, this.#canvas.height);

      ctx.strokeStyle = this.#colors.GRID;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 1; i < gridSize; i++) {
        ctx.moveTo(i * size, 0);
        ctx.lineTo(i * size, this.#canvas.height);
        ctx.moveTo(0, i * size);
        ctx.lineTo(this.#canvas.width, i * size);
      }
      ctx.stroke();
    }

    #drawApple(apple) {
      if (!apple) return;
      const ctx = this.#ctx;
      const size = this.#cellSize;

      ctx.fillStyle = this.#colors.APPLE;
      ctx.beginPath();
      ctx.arc(
        apple.x * size + size / 2,
        apple.y * size + size / 2,
        size / 2 - 2,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    #drawSnake(snake) {
      const ctx = this.#ctx;
      const size = this.#cellSize;

      snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? this.#colors.SNAKE_HEAD : this.#colors.SNAKE_BODY;
        ctx.fillRect(segment.x * size + 1, segment.y * size + 1, size - 2, size - 2);
      });
    }

    #drawScore(score) {
      this.#scoreElement.textContent = String(score);
    }

    #drawGameOver(state) {
      const ctx = this.#ctx;
      const centerX = this.#canvas.width / 2;
      const centerY = this.#canvas.height / 2;

      ctx.fillStyle = this.#colors.OVERLAY;
      ctx.fillRect(0, 0, this.#canvas.width, this.#canvas.height);

      ctx.fillStyle = this.#colors.TEXT;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.font = 'bold 32px Arial';
      ctx.fillText(state.won ? 'Победа!' : 'Игра окончена', centerX, centerY - 20);

      ctx.font = '22px Arial';
      ctx.fillText(`Счёт: ${state.score}`, centerX, centerY + 22);
    }
  }

  class GameController {
    #model;
    #view;
    #moveInterval;
    #animationFrameId = null;
    #lastMoveTime = null;

    constructor(model, view, moveInterval) {
      this.#model = model;
      this.#view = view;
      this.#moveInterval = moveInterval;

      this.#view.bindDirectionInput((direction) => this.#model.setDirection(direction));
      this.#view.bindRestart(() => this.start());
    }
    start() {
      this.#stopLoop();
      this.#model.reset();
      this.#lastMoveTime = null;
      this.#view.render(this.#model.getState());
      this.#animationFrameId = requestAnimationFrame(this.#tick);
    }

    #stopLoop() {
      if (this.#animationFrameId !== null) {
        cancelAnimationFrame(this.#animationFrameId);
        this.#animationFrameId = null;
      }
    }
    #tick = (currentTime) => {
      if (this.#lastMoveTime === null) {
        this.#lastMoveTime = currentTime;
      }
      let steps = 0;
      while (
        currentTime - this.#lastMoveTime >= this.#moveInterval &&
        !this.#model.isGameOver() &&
        steps < 5
      ) {
        this.#model.update();
        this.#lastMoveTime += this.#moveInterval;
        steps += 1;
      }
      if (currentTime - this.#lastMoveTime >= this.#moveInterval) {
        this.#lastMoveTime = currentTime; 
      }

      this.#view.render(this.#model.getState());

      if (this.#model.isGameOver()) {
        this.#animationFrameId = null; 
        return;
      }
      this.#animationFrameId = requestAnimationFrame(this.#tick);
    };
  }
  const model = new SnakeModel(CONFIG.GRID_SIZE, CONFIG.INITIAL_LENGTH);

  const view = new CanvasView(
    {
      canvas: document.getElementById('game-canvas'),
      scoreElement: document.getElementById('score'),
      restartButton: document.getElementById('restart-btn'),
    },
    CONFIG
  );

  const controller = new GameController(model, view, CONFIG.MOVE_INTERVAL);
  controller.start();
})();