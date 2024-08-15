from flask import Flask, render_template, jsonify, request
import random

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/play')
def play():
    return render_template('game.html')

@app.route('/place_bet', methods=['POST'])
def place_bet():
    data = request.json
    bet_amounts = data['bets']
    balance = data['balance']

    dice_results = [random.randint(1, 6) for _ in range(3)]
    win_amount = calculate_win(bet_amounts, dice_results)
    balance += win_amount

    response = {
        'dice_results': dice_results,
        'balance': balance,
        'win_amount': win_amount
    }
    return jsonify(response)

def calculate_win(bet_amounts, dice_results):
    win_amount = 0
    amtOfDicePerChoice = [0] * 6

    for dice in dice_results:
        amtOfDicePerChoice[dice - 1] += 1

    for diceNum, bet in enumerate(bet_amounts):
        if bet > 0 and amtOfDicePerChoice[diceNum] > 0:
            win_amount += bet
            win_amount += (bet * amtOfDicePerChoice[diceNum])

    return win_amount

if __name__ == '__main__':
    app.run(debug=True)
