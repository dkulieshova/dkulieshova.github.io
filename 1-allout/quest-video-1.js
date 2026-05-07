function correct() {
  window.location.href = 'all-out.html'
}

function wrong() {
  error.classList.remove('hidden')
}

document.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('video1')
  const popup = document.getElementById('popup')
  error = document.getElementById('error')

  localStorage.setItem('level', 0)

  video.onended = () => {
    popup.classList.remove('hidden')
    popup.classList.add('flex')
  }
})