// ==========================================
// 1. BASE DE DONNÉES DES CARTES
// ==========================================
const HEROES_DECK = [
    {
        id: 0,
        name: "House of Laura",
        img: "house of laura photo jeux de carte.png",
        hp: 120,
        maxHp: 120,
        energy: 2,
        skills: [
            { name: "Coup de Rapière", dmg: 20, cost: 0 },
            { name: "Égide Sacrée", dmg: -25, cost: 1 },
            { name: "Live Ultime", dmg: 55, cost: 3 }
        ]
    },
    // Les autres héros n'ont pas encore d'image, le code gérera cela automatiquement
    { id: 1, name: "Cyber Guerrier", img: "", hp: 140, maxHp: 140, energy: 2, skills: [{ name: "Sabre", dmg: 18, cost: 0 }, { name: "Posture", dmg: -15, cost: 1 }, { name: "Surcharge", dmg: 50, cost: 3 }] },
    { id: 2, name: "Mage Tempête", img: "", hp: 90, maxHp: 90, energy: 2, skills: [{ name: "Éclair", dmg: 25, cost: 0 }, { name: "Canalisation", dmg: -20, cost: 1 }, { name: "Foudre", dmg: 65, cost: 3 }] },
    { id: 3, name: "Ombre Noire", img: "", hp: 100, maxHp: 100, energy: 2, skills: [{ name: "Dague", dmg: 22, cost: 0 }, { name: "Furtivité", dmg: -10, cost: 1 }, { name: "Exécution", dmg: 60, cost: 3 }] },
    { id: 4, name: "Paladin Gardien", img: "", hp: 150, maxHp: 150, energy: 2, skills: [{ name: "Marteau", dmg: 15, cost: 0 }, { name: "Soin", dmg: -35, cost: 1 }, { name: "Justice", dmg: 40, cost: 3 }] },
    { id: 5, name: "Alchimiste", img: "", hp: 95, maxHp: 95, energy: 2, skills: [{ name: "Acide", dmg: 20, cost: 0 }, { name: "Élixir", dmg: -30, cost: 1 }, { name: "Explosion", dmg: 55, cost: 3 }] }
];

// ==========================================
// 2. CLASSE DU MOTEUR DE JEU
// ==========================================
class GameEngine {
    constructor() {
        this.state = { playerTeam: [], enemy: null, turn: 'player', selectedIdx: null, difficulty: 'Normale' };
    }

    init(difficulty) {
        this.state.difficulty = difficulty;
        this.state.playerTeam = JSON.parse(JSON.stringify(HEROES_DECK));
        this.state.enemy = { name: "Boss IA", hp: 350, maxHp: 350 };
        this.render();
        this.log(`Partie lancée : Mode ${difficulty}.`);
    }

    log(msg) {
        const logBox = document.getElementById('log');
        if (logBox) logBox.innerHTML = `<div>> ${msg}</div>`;
    }

    // Utilisation d'une compétence
    useSkill(skillIdx) {
        if (this.state.selectedIdx === null || this.state.turn !== 'player') return;
        
        const hero = this.state.playerTeam[this.state.selectedIdx];
        const skill = hero.skills[skillIdx];
        
        if (hero.energy < skill.cost) return this.log("Pas assez d'énergie !");
        
        hero.energy -= skill.cost;
        if (skill.dmg > 0) this.state.enemy.hp -= skill.dmg;
        else hero.hp = Math.min(hero.maxHp, hero.hp + Math.abs(skill.dmg));
        
        this.log(`${hero.name} utilise ${skill.name} !`);
        this.executeAITurn();
    }

    executeAITurn() {
        this.state.turn = 'enemy';
        this.render();
        setTimeout(() => {
            const dmg = this.state.difficulty === 'Difficile' ? 30 : 15;
            const target = this.state.playerTeam.find(h => h.hp > 0);
            if(target) target.hp -= dmg;
            this.state.turn = 'player';
            this.render();
        }, 1000);
    }

    render() {
        // Cette fonction sera appelée par jeu.html
        if (typeof window.renderUI === 'function') window.renderUI();
    }
}

const game = new GameEngine();
