// ==========================================
// BASE DE DONNÉES DES CARTES
// ==========================================
const HEROES_DECK = [
    { id: 0, name: "House of Laura", img: "house of laura photo jeux de carte.png", hp: 120, maxHp: 120, energy: 5, skills: [ { name: "Coup Rapière", dmg: 20, cost: 0 }, { name: "Égide", dmg: -25, cost: 1 }, { name: "Ultime", dmg: 55, cost: 3 } ] },
    { id: 1, name: "Cyber Guerrier", img: "", hp: 140, maxHp: 140, energy: 5, skills: [ { name: "Sabre", dmg: 18, cost: 0 }, { name: "Posture", dmg: -15, cost: 1 }, { name: "Surcharge", dmg: 50, cost: 3 } ] },
    { id: 2, name: "Mage Tempête", img: "", hp: 90, maxHp: 90, energy: 5, skills: [ { name: "Éclair", dmg: 25, cost: 0 }, { name: "Canalisation", dmg: -20, cost: 1 }, { name: "Foudre", dmg: 65, cost: 3 } ] },
    { id: 3, name: "Ombre Noire", img: "", hp: 100, maxHp: 100, energy: 5, skills: [ { name: "Dague", dmg: 22, cost: 0 }, { name: "Furtivité", dmg: -10, cost: 1 }, { name: "Exécution", dmg: 60, cost: 3 } ] },
    { id: 4, name: "Paladin Gardien", img: "", hp: 150, maxHp: 150, energy: 5, skills: [ { name: "Marteau", dmg: 15, cost: 0 }, { name: "Soin", dmg: -35, cost: 1 }, { name: "Justice", dmg: 40, cost: 3 } ] },
    { id: 5, name: "Alchimiste", img: "", hp: 95, maxHp: 95, energy: 5, skills: [ { name: "Acide", dmg: 20, cost: 0 }, { name: "Élixir", dmg: -30, cost: 1 }, { name: "Explosion", dmg: 55, cost: 3 } ] }
];

// ==========================================
// MOTEUR DE JEU
// ==========================================
class GameEngine {
    constructor() {
        this.state = { playerTeam: [], enemy: null, turn: 'player', selectedIdx: null, difficulty: 'Normale' };
    }

    init(difficulty) {
        this.state.difficulty = difficulty;
        this.state.playerTeam = JSON.parse(JSON.stringify(HEROES_DECK));
        this.state.enemy = { name: "Boss IA Ultime", hp: 350, maxHp: 350 };
        this.log(`Partie lancée. À vous de jouer !`);
        if(typeof window.renderUI === 'function') window.renderUI();
    }

    log(msg) {
        const logBox = document.getElementById('log');
        if (logBox) {
            logBox.innerHTML = `<div>> ${msg}</div>`;
        }
    }

    useSkill(skillIdx) {
        if (this.state.selectedIdx === null || this.state.turn !== 'player') return;
        
        const hero = this.state.playerTeam[this.state.selectedIdx];
        const skill = hero.skills[skillIdx];
        
        // Appliquer dégâts ou soins
        if (skill.dmg > 0) {
            this.state.enemy.hp -= skill.dmg;
            this.log(`${hero.name} attaque avec ${skill.name} et inflige ${skill.dmg} dégâts !`);
        } else {
            hero.hp = Math.min(hero.maxHp, hero.hp + Math.abs(skill.dmg));
            this.log(`${hero.name} utilise ${skill.name} et récupère des PV.`);
        }
        
        // Vider la barre d'actions pour éviter le spam
        document.getElementById('actions').innerHTML = "";
        
        // Vérification de victoire
        if(this.state.enemy.hp <= 0) {
            this.state.enemy.hp = 0;
            this.log("🏆 VICTOIRE ! Le Boss est vaincu !");
            this.state.turn = 'ended';
            document.getElementById('actions').innerHTML = `<button onclick="location.reload()">REJOUER</button>`;
            if(typeof window.renderUI === 'function') window.renderUI();
            return;
        }

        this.executeAITurn();
    }

    executeAITurn() {
        this.state.turn = 'enemy';
        if(typeof window.renderUI === 'function') window.renderUI();
        
        // Délai pour simuler la réflexion de l'IA
        setTimeout(() => {
            const dmg = 25; // Dégâts de l'IA
            const aliveHeroes = this.state.playerTeam.filter(h => h.hp > 0);
            
            if(aliveHeroes.length > 0) {
                // Attaque un héros au hasard
                const target = aliveHeroes[Math.floor(Math.random() * aliveHeroes.length)];
                target.hp -= dmg;
                if(target.hp <= 0) target.hp = 0;
                this.log(`🤖 Le Boss frappe ${target.name} et inflige ${dmg} dégâts !`);
            }
            
            // Vérification de défaite
            const stillAlive = this.state.playerTeam.filter(h => h.hp > 0);
            if(stillAlive.length === 0) {
                this.log("💀 DÉFAITE... Toute l'équipe est K.O.");
                this.state.turn = 'ended';
                document.getElementById('actions').innerHTML = `<button onclick="location.reload()">REJOUER</button>`;
                if(typeof window.renderUI === 'function') window.renderUI();
                return;
            }
            
            this.state.turn = 'player';
            this.state.selectedIdx = null; // Désélectionner le héros
            this.log("À votre tour. Choisissez un héros pour attaquer.");
            if(typeof window.renderUI === 'function') window.renderUI();
        }, 1500);
    }
}

const game = new GameEngine();
