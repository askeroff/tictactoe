"use strict";
/* global $, console */
$(document).ready(function() {

  let state = {
    result: "initial",
    playerIs: undefined,
    AIplayer: undefined,
    turn: "initial",
    board: []
  };


  function initBoard() {
    for (let i = 0; i < 9; i++) {
      state.board[i] = "E";
    }
    $("#chooseModal").modal("show");
    $(".info").html("");
    drawBoard();
  }

  function makeMove(index) {
    state.board[index] = state.AIplayer;
    drawBoard();
  }

  function minimaxMove(board) {

    let nextMove = null;

    const mmRecurse = function(board, lastPlayer, depth) {
      let winner = checkGameState(board);

      if (winner == state.AIplayer) {
        return 10 - depth;
      } else if (winner == state.playerIs) {
        return depth - 10;
      } else if (winner === 0) {
        return 0;
      }

      let nextPlayer = lastPlayer == state.playerIs ? state.AIplayer : state.playerIs;


      let moves = [],
        scores = [];

      for (let i = 0; i < state.board.length; i++) {
        let boardCopy = board.slice();
        if (boardCopy[i] == "E") {
          boardCopy[i] = nextPlayer;
          moves.push(i);
          scores.push(mmRecurse(boardCopy, nextPlayer, depth + 1));
        }
      }

      if (depth === 0) {
        nextMove = moves[scores.indexOf(Math.max.apply(null, scores))];
        console.log(moves, scores, nextMove);
      } else {
        if (depth == 9) {
          return 0;
        }
        if (nextPlayer == state.AIplayer) {
          return Math.max.apply(null, scores);
        } else if (nextPlayer == state.playerIs) {
          return Math.min.apply(null, scores)
        }
      }

    }

    mmRecurse(board, state.playerIs, 0);

    state.turn = state.playerIs;
    return nextMove;
  }

  function checkForEmptyCells(board) {
    for (let i = 0; i < board.length; i++) {
      if (board[i] == "E") {
        return false;
      }
    }
    return true;
  }


  function checkGameState(board) {
    // check for horizontal 
    if (board[0] == board[1] && board[1] == board[2] && board[0] != "E") {
      return whoWon(board[0]);
    }
    if (board[3] == board[4] && board[4] == board[5] && board[3] != "E") {
      return whoWon(board[3]);
    }
    if (board[6] == board[7] && board[7] == board[8] && board[6] != "E") {
      return whoWon(board[6]);
    }
    // check for vertical
    if (board[0] == board[3] && board[3] == board[6] && board[0] != "E") {
      return whoWon(board[0]);
    }
    if (board[1] == board[4] && board[4] == board[7] && board[1] != "E") {
      return whoWon(board[1]);
    }
    if (board[2] == board[5] && board[5] == board[8] && board[2] != "E") {
      return whoWon(board[2]);
    }
    // check for diagonal
    if (board[0] == board[4] && board[4] == board[8] && board[0] != "E") {
      return whoWon(board[0]);
    }
    if (board[6] == board[4] && board[4] == board[2] && board[6] != "E") {
      return whoWon(board[6]);
    }
    if (checkForEmptyCells(board)) {
      return 0;
    }
    return false;
  }

  function whoWon(a) {
    if (a == state.playerIs) {
      return state.playerIs;
    } else if (a == state.AIplayer) {
      return state.AIplayer;
    }
  }

  function renderState(board) {
    let result = checkGameState(board);
    if (result == state.playerIs) {
      state.result = "finished";
      $(".info").html(`${state.playerIs} has won`);
    } else if (result == state.AIplayer) {
      state.result = "finished";
      $(".info").html(`${state.AIplayer} has won`);
    } else if (result === 0) {
      $(".info").html(`A draw, well played!`);
    } else {
      return;
    }
  }

  function drawBoard() {
    renderState(state.board);
    for (let i = 0; i < 9; i++) {
      if (state.board[i] == "E") {
        $(".game-col:eq(" + i + ")").html("");
      } else {
        $(".game-col:eq(" + i + ")").html(state.board[i]);
      }
    }
  }



  function handleChoose(e) {
    state.playerIs = $(e.target).text();
    state.result = "running";
    state.AIplayer = state.playerIs == "X" ? "O" : "X";
    state.turn = state.playerIs;

    if (state.playerIs === "") {
      $(".text-info").html("You need to choose one of two choices");
    } else {
      $("#chooseModal").modal("hide");
    }
  }

  function handleColumnClick(e) {
    let clickedIndex = $(e.target).index(".game-col");
    if (state.result != "finished" && state.turn == state.playerIs && state.board[clickedIndex] == "E") {

      state.board[clickedIndex] = state.playerIs;
      let indexForNextMove = minimaxMove(state.board);
      makeMove(indexForNextMove);
      drawBoard();
    }

  }

  function handleRestart() {
    let state = {
      result: "initial",
      playerIs: undefined,
      AIplayer: undefined,
      turn: "initial",
      board: []
    };


    initBoard();

  }



  $(".choose").on("click", handleChoose);
  $(".game-col").on("click", handleColumnClick);
  $(".btn-restart").on("click", handleRestart);


  initBoard();


});