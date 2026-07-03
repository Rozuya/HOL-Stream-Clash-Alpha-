// ==========================================
// 1. DÉFINITION DES DONNÉES (MODÈLE)
// ==========================================
const HEROES_DECK = [
    { id: 0, name: "House of Laura", img: "assets/house of laura photo jeux de carte.png", hp: 120, maxHp: 120, energy: 2, skills: [ { name: "Rapière", dmg: 20, cost: 0 }, { name: "Égide", dmg: -25, cost: 1 }, { name: "Live Ultime", dmg: 55, cost: 3 } ] },
    { id: 1, name: "Cyber Guerrier", img: "assets/cyber_guerrier.png", hp: 140, maxHp: 140, energy: 2, skills: [ { name: "Sabre", dmg: 18, cost: 0 }, { name: "Posture", dmg: -15, cost: 1 }, { name: "Surcharge", dmg: 50, cost: 3 } ] },
    { id: 2, name: "Mage Tempête", img: "assets/mage_tempete.png", hp: 90, maxHp: 90, energy: 2, skills: [ { name: "Éclair", dmg: 25, cost: 0 }, { name: "Canalisation", dmg: -20, cost: 1 }, { name: "Foudre", dmg: 65, cost: 3 } ] },
    { id: 3, name: "Ombre Noire", img: "assets/ombre_noire.png", hp: 100, maxHp: 100, energy: 2, skills: [ { name: "Dague", dmg: 22, cost: 0 }, { name: "Furtivité", dmg: -10, cost: 1 }, { name: "Exécution", dmg: 60, cost: 3 } ] },
    { id: 4, name: "Paladin Gardien", img: "assets/paladin_gardien.png", hp: 150, maxHp: 150, energy: 2, skills: [ { name: "Marteau", dmg: 15, cost: 0 }, { name: "Soin", dmg: -35, cost: 1 }, { name: "Justice", dmg: 40, cost: 3 } ] },
    { id: 5, name: "Alchimiste", img: "assets/alchimiste.png", hp: 95, maxHp: 95, energy: 2, skills: [ { name: "Acide", dmg: 20, cost: 0 }, { name: "Élixir", dmg: -30, cost: 1 }, { name: "Explosion", dmg: 55, cost: 3 } ] }
];

// ==========================================
// 2. CLASSE DU MOTEUR DE JEU
// ==========================================
class GameEngine {
    constructor() {
        this.state = {
            playerTeam: [],
            enemy: null,
            turn: 'player',
            selectedIdx: null,
            difficulty: 'Normale'
        };
    }

    init(difficulty) {
        this.state.difficulty = difficulty;
        this.state.playerTeam = JSON.parse(JSON.stringify(HEROES_DECK));
        this.state.enemy = { name: "Boss IA", hp: 350, maxHp: 350 };
        this.render();
        this.log(`Partie lancée : Mode ${difficulty}. À vous !`);
    }

    log(msg) {
        const logBox = document.getElementById('log');
        if (logBox) {
            logBox.innerHTML = `<div>> ${msg}</div>`;
        }
    }

    // Gestion du tour IA améliorée
    executeAITurn() {
        this.state.turn = 'enemy';
        const ai = this.state.enemy;
        
        // Logique de difficulté encapsulée
        let dmg = this.state.difficulty === 'Difficile' ? 35 : 15;
        let target = this.state.playerTeam.find(h => h.hp > 0);
        
        if (target) {
            target.hp = Math.max(0, target.hp - dmg);
            this.log(`L'IA inflige ${dmg} pts à ${target.name} !`);
        }

        setTimeout(() => {
            this.state.turn = 'player';
            this.render();
        }, 1000);
    }
}

// Initialisation globale
const game = new GameEngine();

// Fonctions d'interface appelées par le HTML
function initGame(diff) { game.init(diff); }
