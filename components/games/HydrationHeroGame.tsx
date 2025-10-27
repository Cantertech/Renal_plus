
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Game engine defined in the component file
class HydrationHeroEngine {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private onStateChange: (newState: any) => void;
    private animationFrameId: number | null = null;
    isInitialized: boolean;
    private state: any;

    private handleClickBound: (e: MouseEvent) => void;

    constructor(canvas: HTMLCanvasElement, onStateChange: (newState: any) => void) {
        this.canvas = canvas;
        const context = canvas.getContext('2d');
        if (!context) {
            this.isInitialized = false;
            this.ctx = null as any;
            this.onStateChange = () => {};
            this.state = {};
            this.handleClickBound = () => {};
            return;
        }
        this.ctx = context;
        this.onStateChange = onStateChange;
        this.isInitialized = true;
        this.handleClickBound = this.handleClick.bind(this);

        this.state = {
            drops: [],
            toxins: ['🧂', '🥤', '🍟', '🚬', '🍾'],
            negativeItems: ['🥤','🍟'],
            toxinBuildup: 0,
            score: 0,
            coins: 0,
            frameCount: 0,
            dropSpeed: 2,
            spawnRate: 60,
        };
    }
    
    start() {
        if (!this.isInitialized) return;
        this.canvas.addEventListener('click', this.handleClickBound);
        this.loop();
    }
    
    stop() {
        if (!this.isInitialized) return;
        this.canvas.removeEventListener('click', this.handleClickBound);
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    }

    private handleClick(e: MouseEvent) {
        e.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        for (let i = this.state.drops.length - 1; i >= 0; i--) {
            const drop = this.state.drops[i];
            const distance = Math.sqrt(Math.pow(x - drop.x, 2) + Math.pow(y - drop.y, 2));
            const tapRadius = drop.radius * 1.5;

            if (distance < tapRadius) {
                if (drop.isNegative) {
                    this.state.toxinBuildup = Math.min(100, this.state.toxinBuildup + 25);
                } else {
                    this.state.toxinBuildup = Math.max(0, this.state.toxinBuildup - 15);
                    this.state.score++;
                    if(Math.random() < 0.2) this.state.coins++;
                }
                this.state.drops.splice(i, 1);
                this.onStateChange({ toxinLevel: this.state.toxinBuildup, score: this.state.score, coins: this.state.coins });
                break;
            }
        }
    }

    private loop() {
        this.update();
        this.draw();
        this.animationFrameId = requestAnimationFrame(() => this.loop());
    }

    private update() {
        this.state.frameCount++;
        if (this.state.frameCount % 300 === 0) {
            this.state.dropSpeed = Math.min(6, this.state.dropSpeed + 0.2);
            this.state.spawnRate = Math.max(20, this.state.spawnRate - 3);
        }

        if (this.state.frameCount % Math.floor(this.state.spawnRate) === 0) {
            const isNegative = Math.random() < 0.25;
            const emoji = isNegative ? this.state.negativeItems[Math.floor(Math.random() * this.state.negativeItems.length)] : '💧';
            this.state.drops.push({
                x: Math.random() * this.canvas.width * 0.8 + this.canvas.width * 0.1,
                y: -20, radius: isNegative ? 18 : 15,
                speed: this.state.dropSpeed + (Math.random() * 1 - 0.5),
                isNegative, emoji
            });
        }
        
        this.state.drops.forEach((drop: any) => drop.y += drop.speed);
        
        let missedDrops = 0;
        this.state.drops = this.state.drops.filter((drop: any) => {
             if(drop.y > this.canvas.height + 20) {
                 if (!drop.isNegative) missedDrops++;
                 return false;
             }
             return true;
        });
        
        if(missedDrops > 0) {
           this.state.toxinBuildup = Math.min(100, this.state.toxinBuildup + missedDrops * 5);
        }
        this.state.toxinBuildup = Math.min(100, this.state.toxinBuildup + 0.05 + (this.state.frameCount / 5000));
        this.onStateChange({ toxinLevel: this.state.toxinBuildup });

        if (this.state.toxinBuildup >= 100) {
            this.stop();
            this.onStateChange({ status: 'gameOver' });
        }
    }

    private draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const healthRatio = 1 - (this.state.toxinBuildup / 100);
        const redValue = 150 + (105 * (1 - healthRatio));
        const greenBlueValue = 100 + (155 * healthRatio);
        this.ctx.fillStyle = `rgb(${redValue}, ${greenBlueValue}, ${greenBlueValue})`;
        const scale = 1 + (this.state.toxinBuildup > 70 ? Math.sin(this.state.frameCount * 0.1) * 0.05 : 0);
        const kidneyWidth = 60 * scale;
        const kidneyHeight = 40 * scale;
        this.ctx.beginPath();
        this.ctx.ellipse(this.canvas.width / 2, this.canvas.height - 50, kidneyWidth, kidneyHeight, 0, 0, 2 * Math.PI);
        this.ctx.fill();

        this.ctx.font = '20px sans-serif';
        const toxinCount = Math.min(5, Math.floor(this.state.toxinBuildup / 20));
        for(let i = 0; i < toxinCount; i++) {
            const wobbleX = Math.sin(this.state.frameCount * 0.05 + i) * 3;
            this.ctx.fillText(this.state.toxins[i % this.state.toxins.length], this.canvas.width / 2 - 60 + (i * 25) + wobbleX, this.canvas.height - 45 + (i % 2 * 10));
        }

        this.state.drops.forEach((drop: any) => {
            this.ctx.font = `${drop.radius * 1.8}px sans-serif`;
            this.ctx.fillText(drop.emoji, drop.x - drop.radius, drop.y + drop.radius * 0.6);
        });
    }
}

interface HydrationHeroGameProps {
    t: any;
    setView: (view: string) => void;
}

const HydrationHeroGame: React.FC<HydrationHeroGameProps> = ({ t, setView }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [gameState, setGameState] = useState({ status: 'start', score: 0, toxinLevel: 0, coins: 0 });
    const gameInstance = useRef<HydrationHeroEngine | null>(null);
    
    const startGame = useCallback(() => {
        if (!canvasRef.current) return;
        gameInstance.current?.stop();
        gameInstance.current = new HydrationHeroEngine(canvasRef.current, (newState) => {
             setGameState(prevState => ({...prevState, ...newState}));
        });
        setGameState(prevState => ({...prevState, status: 'playing', score: 0, toxinLevel: 0 }));
        gameInstance.current.start();
    }, []);
    
    const restartGame = () => {
        setGameState({ status: 'start', score: 0, toxinLevel: 0, coins: 0 });
    };

    useEffect(() => {
        return () => {
            gameInstance.current?.stop();
        };
    }, []);

    return (
        <div className="bg-gray-800 flex flex-col items-center h-full justify-center relative text-white">
             <div className="w-full max-w-sm p-2 flex justify-between items-center z-10">
                <div className="font-bold">{t.toxinLevel}</div>
                <div className="w-full bg-gray-500 rounded-full h-4 border-2 border-gray-900 mx-2">
                    <div className="bg-red-500 h-full rounded-full transition-all duration-300" style={{width: `${gameState.toxinLevel}%`}}></div>
                </div>
            </div>
            <div className="w-full max-w-sm p-2 flex justify-between z-10 font-bold">
                 <span>{t.score}: {gameState.score}</span>
                 <span>🪙 {gameState.coins}</span>
            </div>
            <canvas ref={canvasRef} width="350" height="450" className="bg-blue-900/50 rounded-lg z-0 cursor-pointer"></canvas>
            
            {gameState.status === 'start' && (
                 <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center p-4">
                     <h2 className="text-3xl font-bold">{t.hydrationHeroGameTitle}</h2>
                     <p className="my-4">{t.hydrationHeroGameDesc}</p>
                     <button onClick={startGame} className="mt-6 bg-blue-500 font-bold py-3 px-8 rounded-lg text-xl hover:bg-blue-600 transition-colors">{t.startGame}</button>
                 </div>
            )}
            
            {gameState.status === 'gameOver' && (
                 <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center p-4">
                     <h2 className="text-4xl font-bold text-red-500">{t.kidneysOverwhelmed}</h2>
                     <p className="text-xl my-2">{t.finalScore}: {gameState.score}</p>
                      <p className="text-lg my-2">Coins Collected: 🪙 {gameState.coins}</p>
                     <button onClick={restartGame} className="mt-4 bg-blue-500 font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors">{t.playAgain}</button>
                     <button onClick={() => setView('games')} className="mt-4 text-gray-400 font-semibold hover:text-white transition-colors">Back to Games</button>
                 </div>
            )}
        </div>
    );
};

export default HydrationHeroGame;
