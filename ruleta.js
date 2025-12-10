// --- CONFIGURACIÓN RUEDA AMERICANA ---
const canvas = document.getElementById("wheelCanvas");
if(canvas) var ctx = canvas.getContext("2d");

const mainBettingGrid = document.getElementById("mainBettingGrid");
let currentBalance = parseInt(document.getElementById("balance").innerText) || 10000;
let currentChipValue = 100;
let currentRotation = 0;
let bets = [];

const numbers = [0,28,9,26,30,11,7,20,32,17,5,22,34,15,3,24,36,13,1,'00',27,10,25,29,12,8,19,31,18,6,21,33,16,4,23,35,14,2];

// --- JSON ESTADÍSTICAS ---
let rouletteData = JSON.parse(localStorage.getItem("rouletteStats")) || {
    numbers: numbers.map(n => ({ num:n, count:0 })),
    stats: { hotNumbers: [], coldNumbers: [] }
};

// --- HELPERS ---
function getNumberColor(num){
    if(num===0||num==='00') return "#00cc66";
    const redNums=[1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
    const n=parseInt(num);
    return redNums.includes(n)?"#d32f2f":"#222";
}

// --- DIBUJAR RUEDA ---
function drawWheel(){
    if(!canvas||!ctx) return;
    const arcSize=(2*Math.PI)/numbers.length;
    const cx=canvas.width/2, cy=canvas.height/2, r=canvas.width/2-10;

    for(let i=0;i<numbers.length;i++){
        const angle=i*arcSize;
        ctx.beginPath();
        ctx.fillStyle=getNumberColor(numbers[i]);
        ctx.moveTo(cx,cy);
        ctx.arc(cx,cy,r,angle,angle+arcSize);
        ctx.fill();

        ctx.save();
        ctx.translate(cx,cy);
        ctx.rotate(angle+arcSize/2);
        ctx.textAlign="right";
        ctx.fillStyle="#fff";
        ctx.font="bold 14px sans-serif";
        ctx.fillText(numbers[i],r-10,5);
        ctx.restore();
    }
}

// --- TABLERO DINÁMICO ---
function generateBoardLayout(){
    if(!mainBettingGrid) return;
    const columnNumbers=[];
    for(let i=1;i<=36;i++) columnNumbers.push(i);
    let gridHTML='';
    for(let row=0;row<12;row++){
        const num1=columnNumbers[row];
        const num2=columnNumbers[row+12];
        const num3=columnNumbers[row+24];
        gridHTML+=`
            <div class="bet-spot ${getNumberColor(num1)==='#d32f2f'?'bg-red':'bg-black'}" data-bet="${num1}" id="spot-${num1}" onclick="placeBet('${num1}')">${num1}<div class="chip-stack" id="bet-${num1}"></div></div>
            <div class="bet-spot ${getNumberColor(num2)==='#d32f2f'?'bg-red':'bg-black'}" data-bet="${num2}" id="spot-${num2}" onclick="placeBet('${num2}')">${num2}<div class="chip-stack" id="bet-${num2}"></div></div>
            <div class="bet-spot ${getNumberColor(num3)==='#d32f2f'?'bg-red':'bg-black'}" data-bet="${num3}" id="spot-${num3}" onclick="placeBet('${num3}')">${num3}<div class="chip-stack" id="bet-${num3}"></div></div>
            <div class="bet-spot column-bet" data-bet="col${row%3+1}" id="spot-col${row%3+1}-${row}" onclick="placeBet('col${row%3+1}')">2-1<div class="chip-stack" id="bet-col${row%3+1}"></div></div>
        `;
    }
    mainBettingGrid.innerHTML=gridHTML;
}

// --- SELECCIONAR FICHA ---
function selectChip(value){
    currentChipValue=value;
    document.querySelectorAll(".chip-btn").forEach(btn=>btn.classList.remove("active"));
    const activeBtn=[...document.querySelectorAll(".chip-btn")].find(b=>(b.textContent==value)||(value>=1000&&b.textContent.includes(value/1000+'K')));
    if(activeBtn) activeBtn.classList.add("active");
    document.getElementById("msg-area").innerText=`Ficha seleccionada: ${value}€`;
}

// --- COLOCAR APUESTA ---
function placeBet(spot){
    if(!bets[spot]) bets[spot]=0;
    bets[spot]+=currentChipValue;
    currentBalance-=currentChipValue;
    document.getElementById("balance").innerText=currentBalance;
    document.getElementById("msg-area").innerText=`Apostando ${currentChipValue}€ en ${spot}...`;
    const chipEl=document.getElementById(`bet-${spot}`);
    if(chipEl){
        chipEl.className='chip-stack';
        chipEl.classList.add(`chip-visual-${currentChipValue}`);
        chipEl.innerText=currentChipValue>=1000?currentChipValue/1000+'K':currentChipValue;
        chipEl.classList.add("active");
    }
}

// --- BORRAR APUESTAS ---
function clearBets(){
    for(let spot in bets){
        const chipEl=document.getElementById(`bet-${spot}`);
        if(chipEl){ chipEl.innerText=''; chipEl.className='chip-stack'; }
    }
    currentBalance+=Object.values(bets).reduce((a,b)=>a+b,0);
    bets={};
    document.getElementById("balance").innerText=currentBalance;
    document.getElementById("msg-area").innerText="Apuestas borradas (UNDO)";
}

// --- ESTADÍSTICAS ---
function updateNumberStats(winningNum){
    if(winningNum !== -1){
        const numberObj=rouletteData.numbers.find(n=>n.num==winningNum);
        if(numberObj) numberObj.count++;
    }
    
    const sorted=[...rouletteData.numbers].sort((a,b)=>b.count-a.count);
    rouletteData.stats.hotNumbers=sorted.slice(0,5);
    rouletteData.stats.coldNumbers=sorted.slice(-5);

    localStorage.setItem("rouletteStats",JSON.stringify(rouletteData));

    const hotDiv=document.getElementById("hotNumbers");
    const coldDiv=document.getElementById("coldNumbers");

    // Limpiar antes
    hotDiv.innerHTML='';
    coldDiv.innerHTML='';

    rouletteData.stats.hotNumbers.forEach(n=>{
        const div=document.createElement("div");
        div.className="stats-item "+(getNumberColor(n.num)==="#d32f2f"?"red":(n.num===0||n.num==='00'?"green":"black"));
        div.textContent=`${n.num} (${n.count})`;
        hotDiv.appendChild(div);
    });

    rouletteData.stats.coldNumbers.forEach(n=>{
        const div=document.createElement("div");
        div.className="stats-item "+(getNumberColor(n.num)==="#d32f2f"?"red":(n.num===0||n.num==='00'?"green":"black"));
        div.textContent=`${n.num} (${n.count})`;
        coldDiv.appendChild(div);
    });
}


// --- GIRAR ---
const spinBtn=document.getElementById("spinBtn");
if(spinBtn){
    spinBtn.addEventListener("click",()=>{
        if(Object.keys(bets).length===0){ document.getElementById("msg-area").innerText="¡Pon una ficha primero!"; return; }
        spinBtn.disabled=true;
        const extraSpins=5;
        const randomDeg=Math.floor(Math.random()*360);
        const totalDeg=(extraSpins*360)+randomDeg;
        currentRotation+=totalDeg;
        if(canvas) canvas.style.transform=`rotate(-${currentRotation}deg)`;
        setTimeout(()=>{
            calculateResult(currentRotation%360);
            spinBtn.disabled=false;
        },4000);
    });
}

// --- CALCULAR RESULTADO ---
function calculateResult(actualDeg){
    const sliceAngle=360/numbers.length;
    const index=Math.floor(((360-actualDeg+270)%360)/sliceAngle)%numbers.length;
    const winningNum=numbers[index];
    const winningColor=getNumberColor(winningNum)==="#d32f2f"?"red":(winningNum===0||winningNum==='00'?"green":"black");
    let winnings=0;
    const getBet=key=>bets[key]||0;
    winnings+=getBet(winningNum)*36;
    winnings+=getBet(''+winningNum)*36;
    const n=parseInt(winningNum);
    if(winningNum!==0 && winningNum!=='00'){
        if(winningColor==="red") winnings+=getBet("red")*2;
        if(winningColor==="black") winnings+=getBet("black")*2;
    }
    if(n>0){ const isEven=n%2===0; if(isEven) winnings+=getBet("even")*2; else winnings+=getBet("odd")*2; }
    if(n>=1 && n<=12) winnings+=getBet("1st12")*3;
    if(n>=13 && n<=24) winnings+=getBet("2nd12")*3;
    if(n>=25 && n<=36) winnings+=getBet("3rd12")*3;
    if(n>0 && n%3===1) winnings+=getBet("col1")*3;
    if(n>0 && n%3===2) winnings+=getBet("col2")*3;
    if(n>0 && n%3===0) winnings+=getBet("col3")*3;
    if(n>=1 && n<=18) winnings+=getBet("1-18")*2;
    if(n>=19 && n<=36) winnings+=getBet("19-36")*2;

    currentBalance+=winnings;
    document.getElementById("balance").innerText=currentBalance;
    const msgArea=document.getElementById("msg-area");
    if(msgArea){ 
        if(winnings>0){ msgArea.innerHTML=`¡GANASTE! Sale el <b>${winningNum}</b><br>Premio: ${winnings}€`; msgArea.style.color="#00cc66"; } 
        else { msgArea.innerHTML=`Sale el <b>${winningNum}</b>. Suerte la próxima.`; msgArea.style.color="#fff"; } 
    }

    updateNumberStats(winningNum);

    // Limpiar apuestas
    bets={};
    document.querySelectorAll(".chip-stack").forEach(el=>{ el.classList.remove("active"); el.className='chip-stack'; el.innerText=''; });
}

// --- INICIALIZAR ---
document.addEventListener("DOMContentLoaded",()=>{
    document.getElementById("balance").innerText=currentBalance;
    if(canvas) drawWheel();
    generateBoardLayout();
    const undoButton=document.querySelector(".btn-clear");
    if(undoButton) undoButton.addEventListener("click",clearBets);
    document.querySelectorAll(".chip-btn").forEach(btn=>{
        let value=parseInt(btn.textContent.replace('K','000'));
        if(!isNaN(value)) btn.addEventListener("click",()=>selectChip(value));
    });
    selectChip(100);
    // Mostrar estadísticas iniciales
    updateNumberStats(-1); // Solo para mostrar hot/cold al inicio
});
