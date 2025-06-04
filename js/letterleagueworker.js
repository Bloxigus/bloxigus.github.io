import LetterLeagueBoard from "./letterleagueboard.js"

globalThis.onmessage = function(message) {
  if (message.data?.type == "solveAsync") {
    let board = LetterLeagueBoard.fromJSON(message.data?.board)
    board.findBestMove().then(()=>{
      globalThis.postMessage({
        type: "solvedAsync",
        solutions: board.topScoringPredictions
      })
    })
  }
}