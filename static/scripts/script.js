let counts = {
    Nai: 0,
    Bau: 0,
    Ca: 0,
    Ga: 0,
    Cua: 0,
    Tom: 0
};

let balance = 10;

function incrementCounter(buttonId) {
    if (balance > 0) {
        counts[buttonId]++;
        balance--;
        document.getElementById(`bet${buttonId}`).innerText = `$${counts[buttonId]} ${getViet(buttonId)}`;
        updateBalance();
    }
}

function getViet(buttonId) {
    switch (buttonId) {
        case 'Nai': return 'Nai';
        case 'Bau': return 'Bầu';
        case 'Ca': return 'Cá';
        case 'Ga': return 'Gà';
        case 'Cua': return 'Cua';
        case 'Tom': return 'Tôm';
        default: return '';
    }
}

function resetBet() {
    let totalBet = Object.values(counts).reduce((a, b) => a + b, 0);
    balance += totalBet;
    
    for (let buttonId in counts) {
        counts[buttonId] = 0;
        document.getElementById(`bet${buttonId}`).innerText = `$0 ${getViet(buttonId)}`;
    }
    
    updateBalance();
}

function updateBalance() {
    document.getElementById('balance').innerHTML = `<p><b>Balance: $${balance}</b></p>`;
}

function placeBetAndRoll() {
    fetch('/place_bet', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bets: Object.values(counts), balance: balance })
    })
    .then(response => response.json())
    .then(data => {
        resetBet();
        balance = data.balance;
        updateBalance();
        showDiceResults(data.dice_results);

        if (data.win_amount > 0)
        {
            document.getElementById('winSound').play();
        }
    });
}

function showDiceResults(results) {
    for (let i = 1; i <= 3; i++) {
        while (document.getElementById(`dice${i}`).firstChild) {
            document.getElementById(`dice${i}`).removeChild(document.getElementById(`dice${i}`).firstChild);
        }
        let imgNum = results[i - 1];
        let img = document.createElement('img');
        img.src = `/static/styles/images/${imgNum}.png`
        img.width = 100;
        img.height = 100;
        document.getElementById(`dice${i}`).appendChild(img);
    }
}

document.querySelector('button[onclick="placeBetAndRoll()"]').addEventListener('click', placeBetAndRoll);
