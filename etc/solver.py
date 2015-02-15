
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
    return ''.join(keyChar(board[i, j]) for j in range(dim) \
                                        for i in range(dim))

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
suggestMove = suggestor.suggest

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
def tryToDefeatAiAiSecond(board):
    if board is None:
        return
    whoseTurn = whoMoves(board)
    # print("It is now {0}'s turn to move.".format(whoseTurn))
    for move in possibleMoves(board):
        # print("My ({0}'s) move:".format(whoseTurn))
        # printBoard(move)
        gameDone = finished(move)
        if gameDone == whoseTurn:
            raise Exception('AI lost: {0}'.format(boardKey(move)))
        elif gameDone == tie:
            # print('Tie game!')
            continue
   
        aiMove = suggestMove(move)
        if aiMove is None:
            # print('No move to be made by AI.')
            pass
        else:
            # print("AI ({0}'s) move:".format(otherPlayer(whoseTurn)))
            # printBoard(aiMove)
            tryToDefeatAiAiSecond(aiMove)

# Let the AI move first.
def tryToDefeatAiAiFirst(board):
    aiMove = suggestMove(board)
    # print("AI ({0}'s) move:".format(whoMoves(board)))
    # printBoard(aiMove)
    tryToDefeatAiAiSecond(aiMove)

def assertAiNeverLoses(board):
    tryToDefeatAiAiSecond(board)
    tryToDefeatAiAiFirst(board)
    print('Congratulations! The AI can never lose.')

def play(board):
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

board = dict(((i, j), '_') for i in range(dim) for j in range(dim))

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

symmetries = [ # lambda s: s, # identity (omitted)
               boardRotate, # 90 degrees
               lambda s: boardRotate(boardRotate(s)), # 180 degrees
               lambda s: boardRotate(boardRotate(boardRotate(s))), # 270 degrees
               boardFlip, # Flip about middle column
               lambda s: boardFlip(boardRotate(s)), # 90 degrees then flip
               lambda s: boardFlip(boardRotate(boardRotate(s))), # 180 degrees then flip
               lambda s: boardFlip(boardRotate(boardRotate(boardRotate(s)))) ] # 270 degrees then flip

if __name__ == '__main__':
    assertAiNeverLoses(board)
    states = set(suggestor.suggestions.keys())
    print('len(suggestor.suggestions)={0}'.format(len(states)))

    uniqueStates = set(states)
    for s in states:
        for image in (tran(s) for tran in symmetries):
            uniqueStates.discard(image)

    print('After removing states that are symmetries of each other, there are {0} states.'.format(len(uniqueStates)))
    print('Here they are:')
    for s in uniqueStates:
        print(s)
