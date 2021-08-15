import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Square = (props) => {
  // passed a prop from a parent(Board) component to a child(Square) component.
  return (
    <button
      className="square"
      onClick={() => props.onClick()}
    >
      {props.value}
    </button>
  );
}


const Board = (props) => {
  // Lifting State Up 
  // To collect data from multiple children, or to have two child components communicate with each other, we need to declare the shared state in their parent component instead. The parent component can pass the state back down to the children by using props; this keeps the child components in sync with each other and with the parent component.

  // When the Board’s state changes, the Square components re-render automatically. Keeping the state of all squares in the Board component will allow it to determine the winner in the future.



  const renderSquare = (i) => {
    // Each Square will now receive a value prop that will either be 'X', 'O', or null for empty squares.
    return (
      <Square
        value={props.squares[i]}
        onClick={() => props.onClick(i)}
      />
    )
  }

  const renderBoard = (row, col) => {
    let count = 0;
    let content = []
    for (let i = 0; i < row; i++) {
      content.push(<div className="board-row"></div>)
      for (let j = 0; j < col; j++) {
        count++;
        content.push(renderSquare(count))
      }
      count++;
    }
    return content
  }
  
  return (
    <div>
      {renderBoard(3, 3)}
    </div>
  );
}

const Game = () => {
  // determine turn ('X' or 'O')
  const [xIsNext, setXIsNext] = useState(true);
  // track board history to visit past moves
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // track step count
  const [stepNumber, setStepNumber] = useState(0);
  const [location, setLocation] = useState([Array(2).fill(null)])
  const [activeMove, setActiveMove] = useState(0);
  const current = history[stepNumber];
  const winner = calculateWinner(current);
  const moves = history.map((step, move) => {
    const desc = move ?
      'Go to move #' + move :
      'Go to game start';
    return (
        <li className={`${activeMove === move ? 'active-move' : null}`} key={move}>
          <button className={`${activeMove === move ? 'active-move' : null}`} onClick={() => jumpTo(move)}>{desc}</button>
          <p>{(move && location[move]) ? `(${location[move][0]}, ${location[move][1]})` : ''}</p>
        </li>
    );
  });

  const handleClick = (i) => {
    const historyNew = history.slice(0, stepNumber + 1);
    const current = historyNew[historyNew.length - 1];
    const squares = [...current]
    if (calculateWinner(squares) || squares[i])
      return;
    squares[i] = xIsNext ? 'X' : 'O';
    setHistory([...historyNew, squares]);
    setStepNumber(historyNew.length);
    setXIsNext(!xIsNext);
    setLocation([...location, calculateLocation(i)])
    setActiveMove(historyNew.length);
  };

  const jumpTo = (step) => {
    setStepNumber(step);
    setActiveMove(step);
    setXIsNext((step % 2) === 0);
  };

  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }


  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={current}
          onClick={(i) => handleClick(i)} />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}


// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

const calculateLocation = (i) => {
  let row, col;
  col = (i % 3) + 1

  if (i < 3)
    row = 1;
  else if (i < 6)
    row = 2;
  else
    row = 3;
  
  return [row, col]
}