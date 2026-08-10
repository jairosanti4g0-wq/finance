const GameData = {
    enemies: [
        { id:'street_punk',   name:'Street Punk',    hp:35,  atk:8,  def:2,  xp:15,  cr:20,  color:0xff6600 },
        { id:'security_bot',  name:'Sec-Bot MK1',    hp:55,  atk:12, def:5,  xp:25,  cr:35,  color:0x0088ff },
        { id:'corp_agent',    name:'Agente Corp',    hp:50,  atk:15, def:4,  xp:30,  cr:50,  color:0xff00ff },
        { id:'cyber_samurai', name:'Cyber Samurai',  hp:75,  atk:18, def:8,  xp:45,  cr:65,  color:0xff0000 },
        { id:'netrunner',     name:'Netrunner',      hp:45,  atk:22, def:2,  xp:38,  cr:55,  color:0x00ff88 },
        { id:'mega_drone',    name:'MegaDrone X9',   hp:95,  atk:24, def:10, xp:60,  cr:80,  color:0xffff00 },
        { id:'ai_core',       name:'AI CORE NEXUS',  hp:200, atk:30, def:15, xp:200, cr:500, color:0x00ffff }
    ],

    skills: [
        { id:'strike', name:'Golpe',      cost:0,  dmgMul:1.0, heal:0,  desc:'Ataque físico básico',      color:0xffffff },
        { id:'hack',   name:'Hack',       cost:10, dmgMul:1.6, heal:0,  desc:'Ataque cibernético ×1.6',   color:0x00ffff },
        { id:'emp',    name:'Pulso EMP',  cost:20, dmgMul:2.2, heal:0,  desc:'Pulso eletromagnético ×2.2',color:0xffff00 },
        { id:'heal',   name:'Nano-Cura',  cost:15, dmgMul:0,   heal:40, desc:'Nanobots curam 40 HP',      color:0x00ff88 }
    ],

    areas: [
        { id:'neon',   name:'Distrito Neon',  enemies:['street_punk','street_punk','netrunner'],    boss:'netrunner',     color:0xff00ff },
        { id:'corp',   name:'Torre Corp',      enemies:['security_bot','corp_agent','corp_agent'],   boss:'corp_agent',    color:0x0088ff },
        { id:'sewer',  name:'Esgotos',         enemies:['cyber_samurai','street_punk','netrunner'],  boss:'cyber_samurai', color:0xff6600 },
        { id:'market', name:'Mercado Negro',   enemies:['netrunner','corp_agent','mega_drone'],      boss:'mega_drone',    color:0xffff00 },
        { id:'nexus',  name:'NEXUS CORE',      enemies:['mega_drone','cyber_samurai'],               boss:'ai_core',       color:0x00ffff }
    ]
};
