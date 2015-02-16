'''
    Tic-Tac-Toe web browser game
    Copyright (C) 2015 David Goffredo

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
'''
import pickle
from pprint import pprint

ex = 'X'
oh = 'O'
tie = 'tie'
dim = 3
whoStarts = ex

def printBoard(board):
    for j in range(dim):
        print(' '.join(board[i,j] for i in range(dim)))
    print('')

def keyChar(ch):
    if ch == ex or ch == oh:
        return ch
    else:
        return '.'

def boardKey(board):
    return ''.join(keyChar(board[i, j]) for j in range(dim) for i in range(dim))

def fromKey(key):
    return { (i % dim, i // dim): key[i] for i in range(dim*dim) }

def moveTotals(board):
    exes, ohs = 0, 0
    for i in range(dim):
        for j in range(dim):
            ch = board[i, j]
            if ch == ex:
                exes += 1
            elif ch == oh:
                ohs += 1
    return exes, ohs

def invalid(board):
    # How can a board be invalid? Any of the following:
    # 1. ohs > exes + 1 or exes > ohs + 1
    # 2. There are two winners (special case of 3).
    # 3. There were moves made after a win. 
    # I'll just check for 1 for now.
    # TODO: Is there any cheap way to check (3)?
    exes, ohs = moveTotals(board)
    return ohs > exes + 1 or exes > ohs + 1

def triples(board):
    return [[board[i, j] for i in range(dim)] for j in range(dim)] + \
           [[board[i, j] for j in range(dim)] for i in range(dim)] + \
           [[board[i, i] for i in range(dim)], 
            [board[i, 2-i] for i in range(dim)]]

def samePlayer(values):
    if len(set(values)) != 1:
        return False
    return values[0] in (ex, oh)

def win(board):
    for values in triples(board):
        if samePlayer(values):
            return values[0]
    return False

def full(board):
    return sum(moveTotals(board)) == dim**2

def finished(board):
    winner = win(board)
    if winner:
        return winner
    elif full(board):
        return tie
    else:
        return False

def copyBoard(board):
    return dict(((i, j), board[i,j]) for i in range(dim) for j in range(dim))

def boardMove(board, place, player):
    assert player in (ex, oh)
    newBoard = copyBoard(board)
    newBoard[place] = player
    return newBoard

def emptyPlaces(board):
    return [(i, j) for i in range(dim) for j in range(dim) \
                 if board[i, j] not in (ex, oh)]

def otherPlayer(player):
    if player == ex:
        return oh
    else:
        assert player == oh
        return ex

def whoMoves(board, starter=whoStarts):
    exes, ohs = moveTotals(board)
    if exes == ohs:
        return starter
    else:
        return otherPlayer(starter)

def whoMoved(board, starter=whoStarts):
    return otherPlayer(whoMoves(board, starter))

def possibleMoves(board):
    assert not invalid(board)

    if finished(board):
        return []

    player = whoMoves(board)
    return [boardMove(board, place, player) for place in emptyPlaces(board)]

def keyIndexToZeroBasedCoordinates(i):
    return (i % dim, i // dim) # x, y

def zeroBasedCoordinatesToKeyIndex(x, y):
    return dim * y + x

# 90 degree left turn
def boardRotate(key):
    # abcdefghi --> cfibehadg
    result = ''
    for i, c in enumerate(key):
        x, y = keyIndexToZeroBasedCoordinates(i)
        oldX = 2 - y # which is -(y-1) + 1
        oldY = x # which is x-1 + 1
        result += key[zeroBasedCoordinatesToKeyIndex(oldX, oldY)]
    return result

# Mirror about the center column
def boardFlip(key):
    return ''.join(key[(i // dim) * dim + (dim - i % dim) - 1] for i in range(len(key)))

allSymmetries = [ lambda s: s, # identity 
                  boardRotate, # 90 degrees
                  lambda s: boardRotate(boardRotate(s)), # 180 degrees
                  lambda s: boardRotate(boardRotate(boardRotate(s))), # 270 degrees
                  boardFlip, # Flip about middle column
                  lambda s: boardFlip(boardRotate(s)), # 90 degrees then flip
                  lambda s: boardFlip(boardRotate(boardRotate(s))), # 180 degrees then flip
                  lambda s: boardFlip(boardRotate(boardRotate(boardRotate(s)))) ] # 270 degrees then flip

inverseSymmetries = [ allSymmetries[0], # identity (self inverse)
                      allSymmetries[3], # 270 degrees 
                      allSymmetries[2], # 180 degrees (self inverse)
                      allSymmetries[1], # 90 degrees
                      allSymmetries[4], # Flip about middle column (self inverse)
                      allSymmetries[5], # 90 degrees then flip (self inverse)
                      allSymmetries[6], # 180 degrees then flip (self inverse)
                      allSymmetries[7] ]# 270 degrees then flip (self inverse)

def inverse(symmetry):
    return inverseSymmetries[allSymmetries.index(symmetry)]

def BookSuggestor():
    def loadBookSuggestionsByKey():
        f = open('ai.txt', 'rb')
        ai = pickle.load(f)
        suggestionsByKey = ai['suggestionKeys']
        f.close()
        return suggestionsByKey
    
    def loadBookSuggestions():
        f = open('ai.txt', 'rb')
        ai = pickle.load(f)
        suggestions = ai['suggestions']
        f.close()
        return suggestions

    suggestionsByKey = loadBookSuggestionsByKey()
    suggestions = loadBookSuggestions()
    def suggestWithSymmetry(board, debug=True):
        key = boardKey(board)
        for sym, perm in ((sym, sym(key)) for sym in allSymmetries):
            move = suggestionsByKey.get(perm)
            if move is not None: # Found it
                return fromKey(inverse(sym)(move))
        raise Exception("Shouldn't be able to get here. key={0}".format(key))

    def suggest(board, debug=True):
        return suggestions[boardKey(board)]

    return suggest

bookSuggestMove = BookSuggestor()

# I define ex as the maximizing player. Thus a win for ex
# has value 1, a tie 0, and a win for oh has value -1.

def minimaxEndgameScore(board):
    endStatus = finished(board) # either ex, oh, tie, or False.
    assert endStatus != False # Game should be over.

    if endStatus == ex:
        return 1
    elif endStatus == tie:
        return 0
    elif endStatus == oh:
        return -1

def MinimaxScorer():
    kindergarten = dict()
    lowestDepthReached = [0] # Array for mutability of closure
    def score(board, depth=0):
        if depth > lowestDepthReached[0]:
            lowestDepthReached[0] = depth
            print('I am {0} layers deep.'.format(depth))

        me = whoMoves(board)

        key = boardKey(board)
        if key in kindergarten:
            moves = kindergarten[key]
        else:
            moves = possibleMoves(board)
            kindergarten[key] = moves

        if len(moves) == 0:
            return minimaxEndgameScore(board)

        if me == ex: # Maximizing player
            return max([-1] + [score(move, depth + 1) for move in moves])
        else:        # Minimizing player
            assert me == oh
            return min([1] + [score(move, depth + 1) for move in moves])
    return score

minimaxScore = MinimaxScorer()

class Suggestor:
    def __init__(self):
        self.suggestions = dict()

    def suggest(self, board, debug=False):
        key = boardKey(board)
        cached = self.suggestions.get(key)
        if cached is not None:
            return cached
        else:
            cached = minimaxSuggestMove(board, debug)
            self.suggestions[key] = cached
            return cached

suggestor = Suggestor()

def minimaxSuggestMove(board, debug):    
    moves = possibleMoves(board)
    if len(moves) == 0:
        return None

    me = whoMoves(board)
    if not debug:
        scores = [(move, minimaxScore(move)) for move in moves]
        if me == ex:
            return max(scores, key=lambda pair: pair[1])[0]
        else:
            assert me == oh
            return min(scores, key=lambda pair: pair[1])[0]

    # Otherwise we say a bunch
    print('The current game has the following children:')
    scores = [(move, minimaxScore(move)) for move in moves]
    for move, score in scores:
        print('score={0} for the move below:'.format(score))
        print('By the way; for this move, finished={0}'.format(finished(move)))
        printBoard(move)
    if me == ex:
        print("Since I'm the maximizing player, I pick the max:")
        best = max(scores, key=lambda pair: pair[1])
        print('By the way; for this move, finished={0}'.format(finished(best[0])))
        print(best[0])
        return best[0]
    else:
        assert me == oh
        print("Since I'm the minimizing player, I pick the min:")
        best = min(scores, key=lambda pair: pair[1])
        print('By the way; for this move, finished={0}'.format(finished(best[0])))
        print(best[0])
        return best[0]

# Play all possible games against the AI, 
# and raise an exception if the AI ever loses.
# The "non-AI" opponent will move first.
def tryToDefeatAiAiSecond(board, suggestMove):
    if board is None:
        return
    whoseTurn = whoMoves(board)
    print("It is now {0}'s turn to move.".format(whoseTurn))
    for move in possibleMoves(board):
        print("My ({0}'s) move:".format(whoseTurn))
        printBoard(move)
        gameDone = finished(move)
        if gameDone == whoseTurn:
            raise Exception('AI lost: {0}'.format(boardKey(move)))
        elif gameDone == tie:
            # print('Tie game!')
            continue
   
        aiMove = suggestMove(move)
        if aiMove is None:
            print('No move to be made by AI.')
            pass
        else:
            print("AI ({0}'s) move:".format(otherPlayer(whoseTurn)))
            printBoard(aiMove)
            tryToDefeatAiAiSecond(aiMove, suggestMove)

# Let the AI move first.
def tryToDefeatAiAiFirst(board, suggestMove):
    aiMove = suggestMove(board)
    print("AI ({0}'s) move:".format(whoMoves(board)))
    printBoard(aiMove)
    tryToDefeatAiAiSecond(aiMove, suggestMove)

def assertAiNeverLoses(board, suggestMove):
    tryToDefeatAiAiSecond(board, suggestMove)
    tryToDefeatAiAiFirst(board, suggestMove)
    print('Congratulations! The AI can never lose.')

def play(board, suggestMove):
    while not finished(board):
        printBoard(board)
        whoseTurn = whoMoves(board)
        move = input('{0} moves: '.format(whoseTurn))
        if move == 'ai':
            board = suggestMove(board)
        else:
            iStr, jStr = tuple(move.split())
            i, j = int(iStr), int(jStr)
            if not 0 <= i <= 2 or \
               not 0 <= j <= 2 or \
               board[i,j] in (ex, oh):
                print('Invalid move.')
            else:
                board = boardMove(board, (i, j), whoseTurn)
    printBoard(board)
    print('Game over. Winner: {0}'.format(finished(board)))

def withoutDegeneracy(states):
    uniqueStates = set(states)
    transformations = allSymmetries[1:] # Ignore identity
    for s in states:
        for image in (tran(s) for tran in transformations):
            uniqueStates.discard(image)
    return uniqueStates

def createBookPickle(board):
    assertAiNeverLoses(board, suggestor.suggest)
    states = set(suggestor.suggestions.keys())
    print('len(suggestor.suggestions)={0}'.format(len(states)))

    # I decided to forego the consideration of symmetries, since there
    # are only 546 entires in the book anyway.
    # uniqueStates = withoutDegeneracy(states)

    statesToSerialize = states
    suggs = { key: boardKey(suggestor.suggestions[key]) for key in statesToSerialize }
    print('And here they are with suggestions:')
    pprint(suggs)
    
    print('Serializing results.')
    out = open('ai.txt', 'wb')
    pickle.dump({
        'suggestions': suggestor.suggestions,
        'suggestionKeys': suggs
        }, out)

def createBookJs(board, outName='minimax-book.js'):
    assertAiNeverLoses(board, suggestor.suggest)
    suggs = suggestor.suggestions
    out = open(outName, 'w')
    out.write('''
var MinimaxBook = (function() {
    var pub = {}
    var book = {
''')
    for key, board in sorted(suggs.items()):
        out.write('        "{0}": "{1}",\n'.format(key, boardKey(board)))
    out.write('''    };
    pub.book = book;
    return pub;
})();

''')
    out.close()

if __name__ == '__main__':
    board = dict(((i, j), '_') for i in range(dim) for j in range(dim))
    createBookJs(board)

    
