document.addEventListener('DOMContentLoaded', () => {

  const size = 5
  let baseGrid = []
  let level = Number(localStorage.getItem('level') || 0)
  
  if (level === 0) {
    localStorage.setItem('balance', 0)
  }

  let balance = Number(localStorage.getItem('balance') || 0)
  const balanceEl = document.getElementById('balance')

  const levels = [
    [[0,1,0,0,0],[1,1,1,0,0],[0,1,0,1,0],[0,0,1,1,1],[0,0,0,1,0]],
    [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,1,1,1],[0,1,0,1,0]],
    [[0,0,0,0,0],[0,0,0,0,0],[1,0,1,0,1],[0,0,0,0,0],[0,0,0,0,0]],
    [[1,0,1,0,1],[1,0,1,0,1],[0,0,0,0,0],[1,0,1,0,1],[1,0,1,0,1]],
    [[0,1,0,1,0],[1,1,0,1,1],[1,1,0,1,1],[1,1,0,1,1],[0,1,0,1,0]]
  ]

  const gridEl = document.getElementById('grid')
  const levelText = document.getElementById('levelText')

  let grid = []

  const resetBtn = document.getElementById('resetBtn')

  function resetLevel() {
    grid = JSON.parse(JSON.stringify(baseGrid))
    render()
  }

  resetBtn.addEventListener('click', resetLevel)

  function loadLevel() {
    baseGrid = JSON.parse(JSON.stringify(levels[level])) // зберігаємо старт
    grid = JSON.parse(JSON.stringify(baseGrid))

    render()
    updateBalance()
    levelText.innerText = `Рівень ${level + 1} / 5`
  }

  function render() {
    gridEl.innerHTML = ''

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const cell = document.createElement('div')
        cell.className = `cell ${grid[y][x] ? 'on' : 'off'}`
        cell.onclick = () => toggle(x, y)
        gridEl.appendChild(cell)
      }
    }
  }

  function toggle(x, y) {
    const dirs = [[0,0],[1,0],[-1,0],[0,1],[0,-1]]

    dirs.forEach(([dx, dy]) => {
      const nx = x + dx
      const ny = y + dy

      if (nx >= 0 && nx < size && ny >= 0 && ny < size) {
        grid[ny][nx] ^= 1
      }
    })

    render()
    checkWin()
  }

  function checkWin() {
    const win = grid.flat().every(c => c === 0)

    if (win) {
      level++
      localStorage.setItem('level', level)

      balance += 20
      updateBalance()

      if (level >= levels.length) {
        showFinalPopup()
      } else {
        loadLevel()
      }
    }
  }

  loadLevel()

  function updateBalance() {
    balanceEl.innerText = `Поточний баланс: ${balance} 💰`
    localStorage.setItem('balance', balance)
  }

  function showFinalPopup() {
    const popup = document.getElementById('finalPopup')
    popup.classList.remove('hidden')
    popup.classList.add('flex')
  }
})

function goNext() {
  window.location.href = '../2-breaklock/quest-video-2.html'
}