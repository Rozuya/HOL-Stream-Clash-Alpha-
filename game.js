// ==========================================
// 1. BASE DE DONNÉES DES CARTES (LES 6 JOUEURS)
// ==========================================
const HEROES_DECK = [
    {
        id: 0,
        name: "House of Laura",
        img: "assets/house of laura photo jeux de carte.png",
        hp: 120,
        maxHp: 120,
        energy: 0,
        skills: [
            { name: "Coup de Rapière", dmg: 20, cost: 0 },
            { name: "Égide Sacrée", dmg: -25, cost: 1 }, // Soin / Bouclier
            { name: "Live Ultime", dmg: 55, cost: 3 }
        ]
    },
    {
        id: 1,
        name: "Cyber Guerrier",
        img: "assets/cyber_guerrier.png",
        hp: 140,
        maxHp: 140,
        energy: 0,
        skills: [
            { name: "Sabre Laser", dmg: 18, cost: 0 },
            { name: "Posture Défensive", dmg: -15, cost: 1 },
            { name: "Surcharge Alpha", dmg: 50, cost: 3 }
        ]
    },
    {
        id: 2,
        name: "Mage Tempête",
        img: "assets/mage_tempete.png",
        hp: 90,
        maxHp: 90,
        energy: 0,
        skills: [
            { name: "Éclair", dmg: 25, cost: 0 },
            { name: "Canalisation", dmg: -20, cost: 1 },
            { name: "Foudre Divine", dmg: 65, cost: 3 }
        ]
    },
    {
        id: 3,
        name: "Ombre Noire",
        img: "assets/ombre_noire.png",
        hp: 100,
        maxHp: 100,
        energy: 0,
        skills: [
            { name: "Dague Empoisonnée", dmg: 22, cost: 0 },
            { name: "Furtivité", dmg: -10, cost: 1 },
            { name: "Exécution", dmg: 60, cost: 3 }
        ]
    },
    {
        id: 4,
        name: "Paladin Gardien",
        img: "assets/paladin_gardien.png",
        hp: 150,
        maxHp: 150,
        energy: 0,
        skills: [
            { name: "Marteau", dmg: 15, cost: 0 },
            { name: "Soin Lumineux", dmg: -35, cost: 1 },
            { name: "Justice Céleste", dmg: 40, cost: 3 }
        ]
    },
    {
        id: 5,
        name: "Alchimiste",
        img: "assets/alchimiste.png",
        hp: 95,
        maxHp: 95,
        energy: 0,
        skills: [
            { name: "Potion Acide", dmg: 20, cost: 0 },
            { name: "Élixir de Vie", dmg: -30, cost: 1 },
            { name: "Explosion Volatile", dmg: 55, cost: 3 }
        ]
    }
];

// ==========================================
// 2. ÉTAT INITIAL DU JEU
// ==========================================
let gameState = {
    playerTeam: [],
    enemyTeam: [],
    turn: 'player',
    selectedHeroIdx: null,
    difficulty: 'Normale'
};

// ==========================================
// 3. MOTEUR ET LOGIQUE DE COMBAT
// ==========================================

// Initialisation de la partie
function initGame(chosenDifficulty) {
    gameState.difficulty = chosenDifficulty;
    
    // On clone les données des héros pour pouvoir modifier leurs PV en jeu sans toucher au Deck original
    gameState.playerTeam = JSON.parse(JSON.stringify(HEROES_DECK));
    
    // Création de l'équipe adverse (l'IA possède une version miroir ou surpuissante)
    gameState.enemyTeam = [
        { name: `Boss IA (${gameState.difficulty})`, hp: 350, maxHp: 350, energy: 0 }
    ];
    
    gameState.turn = 'player';
    gameState.selectedHeroIdx = null;
    
    logMessage(`La partie commence en mode ${gameState.difficulty} ! Sélectionnez un héros.`);
    render();
}

// Sélection manuelle du personnage avec lequel attaquer
function selectHero(index) {
    if (gameState.turn !== 'player') return;
    if (gameState.playerTeam[index].hp <= 0) {
        logMessage(`${gameState.playerTeam[index].name} est K.O., choisissez un autre combattant !`);
        return;
    }
    
    gameState.selectedHeroIdx = index;
    updateSkillsUI();
    render();
}

// Utilisation d'une compétence
function useSkill(skillIndex) {
    if (gameState.selectedHeroIdx === null || gameState.turn !== 'player') return;
    
    const hero = gameState.playerTeam[gameState.selectedHeroIdx];
    const skill = hero.skills[skillIndex];
    const targetEnemy = gameState.enemyTeam[0];
    
    // Vérification de l'énergie
    if (hero.energy < skill.cost) {
        logMessage(`Pas assez d'énergie pour lancer ${skill.name} !`);
        return;
    }
    
    // Consommation de l'énergie
    hero.energy -= skill.cost;
    
    // Application des effets (Dégâts ou Soins)
    if (skill.dmg > 0) {
        targetEnemy.hp = Math.max(0, targetEnemy.hp - skill.dmg);
        logMessage(`🔥 ${hero.name} utilise ${skill.name} et inflige ${skill.dmg} points de dégâts à l'IA !`);
    } else {
        // Si les dégâts sont négatifs, c'est un sort de soin
        const healAmount = Math.abs(skill.dmg);
        hero.hp = Math.min(hero.maxHp, hero.hp + healAmount);
        logMessage(`💚 ${hero.name} utilise ${skill.name} et se soigne de ${healAmount} PV.`);
    }
    
    // Vérification de victoire
    if (targetEnemy.hp <= 0) {
        logMessage("🏆 VICTOIRE ! L'IA a été terrassée en direct !");
        endGame();
        return;
    }
    
    // Fin du tour du joueur -> Passage à l'IA
    gameState.turn = 'enemy';
    gameState.selectedHeroIdx = null;
    clearSkillsUI();
    render();
    
    setTimeout(aiTurn, 1200); // Petit délai pour laisser respirer le live
}

// Cerveau décisionnel de l'IA (Facile, Normale, Difficile)
function aiTurn() {
    const ai = gameState.enemyTeam[0];
    const livingHeroes = gameState.playerTeam.filter(h => h.hp > 0);
    
    if (livingHeroes.length === 0) return;
    
    // L'IA cible en priorité le premier héros vivant, ou le plus faible si elle est difficile
    let targetPlayer = livingHeroes[0];
    let aiActionMessage = "";
    
    if (gameState.difficulty === "Facile") {
        // IA Facile : Dégâts légers et pas de stratégie
        const dmg = 15;
        targetPlayer.hp = Math.max(0, targetPlayer.hp - dmg);
        aiActionMessage = `🤖 L'IA Facile lance une attaque maladroite sur ${targetPlayer.name} (-${dmg} PV).`;
    } 
    else if (gameState.difficulty === "Normale") {
        // IA Normale : Se soigne si ses PV tombent en dessous de 35%, sinon attaque moyennement
        if (ai.hp < (ai.maxHp * 0.35)) {
            ai.hp = Math.min(ai.maxHp, ai.hp + 40);
            aiActionMessage = `🛡️ L'IA Normale se barricade et récupère 40 PV.`;
        } else {
            const dmg = 25;
            targetPlayer.hp = Math.max(0, targetPlayer.hp - dmg);
            aiActionMessage = `⚔️ L'IA Normale frappe ${targetPlayer.name} (-${dmg} PV).`;
        }
    } 
    else if (gameState.difficulty === "Difficile") {
        // IA Difficile : Cible le joueur qui a le moins de PV restants pour l'éliminer
        livingHeroes.sort((a, b) => a.hp - b.hp);
        targetPlayer = livingHeroes[0];
        
        // Se soigne agressivement si nécessaire, sinon inflige de lourds dégâts
        if (ai.hp < (ai.maxHp * 0.50)) {
            ai.hp = Math.min(ai.maxHp, ai.hp + 60);
            aiActionMessage = `🔥 L'IA Difficile utilise un Sort de Régénération Majeur (+60 PV) !`;
        } else {
            const dmg = 35;
            targetPlayer.hp = Math.max(0, targetPlayer.hp - dmg);
            aiActionMessage = `💥 L'IA Difficile exécute un combo dévastateur sur ${targetPlayer.name} (-${dmg} PV) !`;
        }
    }
    
    logMessage(aiActionMessage);
    
    // Vérification de défaite
    const checksAlive = gameState.playerTeam.filter(h => h.hp > 0);
    if (checksAlive.length === 0) {
        logMessage("💀 GAME OVER... L'IA a décimé votre équipe !");
        endGame();
        return;
    }
    
    // Retour au joueur + Gain d'énergie passif pour le nouveau tour
    gameState.turn = 'player';
    gameState.playerTeam.forEach(hero => {
        if (hero.hp > 0) hero.energy = Math.min(5, hero.energy + 1); // Max 5 d'énergie
    });
    
    logMessage("À votre tour ! Choisissez un héros pour agir.");
    render();
}

// ==========================================
// 4. FONCTIONS SÉCURITÉ / AFFICHAGE INTERFACE
// ==========================================
function logMessage(msg) {
    const logBox = document.getElementById('log');
    if (logBox) {
        logBox.innerHTML = `<div>> ${msg}</div>`;
        logBox.scrollTop = logBox.scrollHeight;
    }
}

function endGame() {
    gameState.turn = 'ended';
    const actionsArea = document.getElementById('actions');
    if (actionsArea) actionsArea.innerHTML = `<button onclick="window.location.reload()">REJOUER</button>`;
}

function clearSkillsUI() {
    const container = document.getElementById('actions');
    if (container) container.innerHTML = "";
}

// Note : Les fonctions globales `render()` et `updateSkillsUI()` feront le pont entre ce fichier et l'HTML de ton fichier `jeu.html`.
