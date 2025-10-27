
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Game Engine class defined within the component file as it's tightly coupled.
class GameEngine {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private level: any;
    private onStateChange: (newState: any) => void;
    private animationFrameId: number | null = null;
    isInitialized: boolean;

    private lanes: number[];
    private state: any;
    private touchStartX = 0;
    private touchStartY = 0;
    private bgOffset = 0;

    private handleKeyDown: (e: KeyboardEvent) => void = () => {};
    private handleTouchStart: (e: TouchEvent) => void = () => {};
    private handleTouchEnd: (e: TouchEvent) => void = () => {};
    private handleClick: (e: MouseEvent) => void = () => {};

    constructor(canvas: HTMLCanvasElement, levelConfig: any, onStateChange: (newState: any) => void) {
        this.canvas = canvas;
        const context = canvas.getContext('2d');
        if (!context) {
            console.error("Could not get 2D context from canvas");
            this.isInitialized = false;
            this.ctx = null as any; // To satisfy typescript, but it won't be used
            this.level = {};
            this.onStateChange = () => {};
            this.lanes = [];
            return;
        }
        this.ctx = context;
        this.level = levelConfig;
        this.onStateChange = onStateChange;
        this.isInitialized = true;

        this.lanes = [this.canvas.width * 0.25, this.canvas.width * 0.5, this.canvas.width * 0.75];
        this.state = {
            player: {
                lane: 1, y: this.canvas.height - 70, targetY: this.canvas.height - 70,
                width: 40, height: 40,
                isJumping: false, jumpVelocity: 0, jumpHeight: -10, gravity: 0.4
            },
            items: [], score: 0, health: 100, coins: 0, frameCount: 0, powerUp: null,
        };
    }
    
    bindControls() {
        this.handleKeyDown = (e) => this.onKeyDown(e);
        this.handleTouchStart = (e) => this.onTouchStart(e);
        this.handleTouchEnd = (e) => this.onTouchEnd(e);
        this.handleClick = (e) => this.onClick(e);

        window.addEventListener('keydown', this.handleKeyDown);
        this.canvas.addEventListener('touchstart', this.handleTouchStart);
        this.canvas.addEventListener('touchend', this.handleTouchEnd);
        this.canvas.addEventListener('click', this.handleClick);
    }

    unbindControls() {
        window.removeEventListener('keydown', this.handleKeyDown);
        this.canvas.removeEventListener('touchstart', this.handleTouchStart);
        this.canvas.removeEventListener('touchend', this.handleTouchEnd);
        this.canvas.removeEventListener('click', this.handleClick);
    }
    
    onClick(e?: MouseEvent) {
         if(e) e.preventDefault();
        if (!this.state.player.isJumping) {
            this.state.player.isJumping = true;
            this.state.player.jumpVelocity = this.state.player.jumpHeight;
        }
    }
    
    onKeyDown(e: KeyboardEvent) {
        if (e.code === 'ArrowLeft') this.state.player.lane = Math.max(0, this.state.player.lane - 1);
        if (e.code === 'ArrowRight') this.state.player.lane = Math.min(2, this.state.player.lane + 1);
        if (e.code === 'Space' || e.code === 'ArrowUp') this.onClick();
    }

     onTouchStart(e: TouchEvent) {
        e.preventDefault();
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
    }

     onTouchEnd(e: TouchEvent) {
        e.preventDefault();
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const dx = touchEndX - this.touchStartX;
        const dy = touchEndY - this.touchStartY;
        const swipeThreshold = 30;

        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > swipeThreshold) {
            if (dx > 0) this.state.player.lane = Math.min(2, this.state.player.lane + 1);
            else this.state.player.lane = Math.max(0, this.state.player.lane - 1);
        } else if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > swipeThreshold) {
            if (dy < 0) this.onClick();
        } else if (Math.abs(dx) < swipeThreshold && Math.abs(dy) < swipeThreshold) {
             this.onClick();
        }
    }

    start() {
        if (!this.isInitialized) return;
        this.bindControls();
        this.loop();
    }
    
    stop() {
         if (!this.isInitialized) return;
         this.unbindControls();
         if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    }

    loop() {
        this.update();
        this.draw();
        this.animationFrameId = requestAnimationFrame(() => this.loop());
    }

    update() {
        this.state.frameCount++;
        this.bgOffset = (this.bgOffset + this.level.speed * 0.5) % this.canvas.height;

        if (this.state.powerUp) {
            this.state.powerUp.duration--;
            if (this.state.powerUp.duration <= 0) this.state.powerUp = null;
        }
        
        if(this.state.player.isJumping) {
            this.state.player.y += this.state.player.jumpVelocity;
            this.state.player.jumpVelocity += this.state.player.gravity;
            if (this.state.player.y >= this.state.player.targetY) {
                this.state.player.y = this.state.player.targetY;
                this.state.player.isJumping = false;
                this.state.player.jumpVelocity = 0;
            }
        }

        const spawnInterval = Math.max(30, Math.floor(70 / this.level.speed));
        if (this.state.frameCount % spawnInterval === 0) {
            const rand = Math.random();
            let item;
            if (rand < 0.6) {
                const isGood = Math.random() > 0.45;
                const itemSet = isGood ? this.level.good : this.level.bad;
                item = { type: isGood ? 'good' : 'bad', emoji: itemSet[Math.floor(Math.random() * itemSet.length)] };
            } else if (rand < 0.85) {
                 item = { type: 'coin', emoji: '🪙' };
            } else {
                 item = { type: 'powerup', emoji: '🛡️' };
            }
            this.state.items.push({ ...item, lane: Math.floor(Math.random() * 3), y: -30 });
        }
        
        this.state.items.forEach((item: any, index: number) => {
            item.y += this.level.speed;
            const collision = item.lane === this.state.player.lane && item.y > this.state.player.y - 30 && item.y < this.state.player.y + this.state.player.height;

            if (collision) {
                 switch (item.type) {
                    case 'good':
                        this.state.health = Math.min(100, this.state.health + 10);
                        this.state.score += 1;
                        break;
                    case 'bad':
                        if (!this.state.powerUp) this.state.health -= 15;
                        break;
                    case 'coin':
                        this.state.coins += 1;
                        break;
                    case 'powerup':
                         this.state.powerUp = { type: 'shield', duration: 300 };
                         break;
                }
                this.state.items.splice(index, 1);
                this.onStateChange({ health: this.state.health, score: this.state.score, coins: this.state.coins });
            }
        });

        this.state.items = this.state.items.filter((item: any) => item.y < this.canvas.height + 50);

        if (this.state.health <= 0) {
            this.stop();
            this.onStateChange({ status: 'gameOver', health: 0 });
        }
        if (this.state.score >= this.level.goal) {
            this.stop();
            this.onStateChange({ status: 'levelComplete' });
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const healthPercent = this.state.health / 100;
        const green = Math.floor(150 + 105 * healthPercent);
        const red = Math.floor(100 * (1 - healthPercent));
        this.ctx.fillStyle = `rgb(${red}, ${green}, 100)`;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.lineWidth = 2;
        for (let i = 0; i < 10; i++) {
            const y = (this.bgOffset + i * (this.canvas.height / 5)) % this.canvas.height;
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.lanes.forEach(laneX => this.ctx.fillRect(laneX - 30, 0, 60, this.canvas.height));
        
        this.ctx.font = '30px sans-serif';
        this.state.items.forEach((item: any) => this.ctx.fillText(item.emoji, this.lanes[item.lane] - 15, item.y));

        const playerX = this.lanes[this.state.player.lane];
        this.ctx.font = '36px sans-serif';
        let playerEmoji = '🏃';
        if (this.state.player.isJumping) playerEmoji = '🤸';
        if (this.state.health < 30) playerEmoji = '🥵';
        this.ctx.fillText(playerEmoji, playerX - 18, this.state.player.y + 30);

        if (this.state.powerUp && this.state.powerUp.type === 'shield') {
            this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.7)';
            this.ctx.lineWidth = 4;
            this.ctx.beginPath();
            this.ctx.arc(playerX, this.state.player.y + this.state.player.height / 2, 30, 0, Math.PI * 2);
            this.ctx.stroke();
        }
    }
}


interface KidneyRunnerGameProps {
    t: any;
    setView: (view: string) => void;
}

const KidneyRunnerGame: React.FC<KidneyRunnerGameProps> = ({ t, setView }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [gameState, setGameState] = useState({
        status: 'start',
        level: 1,
        health: 100,
        score: 0,
        coins: 0,
    });
    const [currentFact, setCurrentFact] = useState('');

    const gameInstance = useRef<GameEngine | null>(null);

    const levelConfig = {
        1: { title: "The Hydration Path", good: ['💧'], bad: ['🥤'], goal: 10, speed: 2.5 },
        2: { title: "The Nutrition Challenge", good: ['🍎', '🥦', '🐟'], bad: ['🍟', '🍕'], goal: 25, speed: 3 },
        3: { title: "The Toxic Rush", good: ['👟'], bad: ['🚬', '🍾', '🧂'], goal: 40, speed: 3.5 }
    };
    const kidneyFacts = [t.fact1, t.fact2, t.fact3];

    const startGame = useCallback(() => {
        if (!canvasRef.current) return;
        gameInstance.current?.stop();
        
        const onStateUpdate = (newState: any) => {
            if (newState.status === 'levelComplete') {
                setCurrentFact(kidneyFacts[gameState.level - 1] || kidneyFacts[0]);
            }
            setGameState(prevState => ({...prevState, ...newState}));
        };

        gameInstance.current = new GameEngine(canvasRef.current, levelConfig[gameState.level], onStateUpdate);
        setGameState(prevState => ({...prevState, status: 'playing', health: 100, score: 0 }));
        gameInstance.current.start();
    }, [gameState.level, kidneyFacts]);
    
    const nextLevel = () => {
        const next = gameState.level + 1;
        if (levelConfig[next]) {
            setGameState(prevState => ({...prevState, level: next, status: 'start'}));
        } else {
            setView('games');
        }
    };
    
    const restartGame = () => {
        setGameState({ status: 'start', level: 1, health: 100, score: 0, coins: 0 });
    };

    useEffect(() => {
        return () => {
            gameInstance.current?.stop();
            gameInstance.current = null;
        };
    }, []);

    const currentLevel = levelConfig[gameState.level];

    return (
        <div className="bg-gray-800 flex flex-col items-center h-full justify-center relative text-white">
            <div className="w-full max-w-sm p-2 flex justify-between items-center z-10">
                <div className="w-full bg-gray-500 rounded-full h-4 border-2 border-gray-900">
                    <div className={`h-full rounded-full transition-all duration-300 ${gameState.health > 30 ? 'bg-green-500' : 'bg-red-500'}`} style={{width: `${gameState.health}%`}}></div>
                </div>
                <div className="ml-4 text-lg font-bold">❤️ {gameState.health}</div>
            </div>
            <div className="w-full max-w-sm p-2 flex justify-between items-center z-10">
                <div className="font-bold">{t.level} {gameState.level}: {currentLevel.title}</div>
                <div className="font-bold">{t.score}: {gameState.score} / {currentLevel.goal}</div>
                <div className="font-bold">🪙 {gameState.coins}</div>
            </div>
            <canvas ref={canvasRef} width="350" height="450" className="bg-gray-700 rounded-lg z-0 cursor-pointer"></canvas>
            
            {gameState.status === 'start' && (
                 <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center p-4">
                     <h2 className="text-3xl font-bold">{t.level} {gameState.level}</h2>
                     <h3 className="text-xl mb-4">{currentLevel.title}</h3>
                     <p className="mb-2">{t.kidneyRunnerGameDesc}</p>
                     <p>Collect: {currentLevel.good.join(' ')} Avoid: {currentLevel.bad.join(' ')}</p>
                     <button onClick={startGame} className="mt-6 bg-blue-500 font-bold py-3 px-8 rounded-lg text-xl hover:bg-blue-600 transition-colors">{t.startGame}</button>
                 </div>
            )}
            
            {gameState.status === 'gameOver' && (
                 <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center p-4">
                     <h2 className="text-4xl font-bold text-red-500">{t.kidneyFailure}</h2>
                     <p className="text-xl my-2">{t.finalScore}: {gameState.score}</p>
                     <p className="text-lg my-2">Coins Collected: 🪙 {gameState.coins}</p>
                     <button onClick={restartGame} className="mt-4 bg-blue-500 font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors">{t.playAgain}</button>
                     <button onClick={() => setView('games')} className="mt-4 text-gray-400 font-semibold hover:text-white transition-colors">Back to Games</button>
                 </div>
            )}

            {gameState.status === 'levelComplete' && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center p-4">
                     <h2 className="text-4xl font-bold text-green-400">{t.levelComplete}</h2>
                     <div className="bg-blue-100 text-blue-800 p-4 rounded-lg my-4 max-w-xs">
                        <h3 className="font-bold text-lg">{t.kidneyFact}</h3>
                        <p>{currentFact}</p>
                     </div>
                     <p className="text-lg my-2">Coins Collected: 🪙 {gameState.coins}</p>
                     <button onClick={nextLevel} className="mt-4 bg-green-500 font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors">{levelConfig[gameState.level + 1] ? t.nextLevel : 'Finish Game'}</button>
                </div>
            )}
        </div>
    );
};

export default KidneyRunnerGame;
