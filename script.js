function login() {
  const pass = document.getElementById('password').value;

  if (pass === 'вуса в зумі') {
    localStorage.setItem('auth', 'true');
    localStorage.setItem('level', '0');
    window.location.href = '/1-allout/quest-video-1.html';
  } else {
    alert('Крім права на помилку, у кожного ще є право цим правом не користуватися 😏');
  }
}

function togglePassword() {
  const input = document.getElementById('password')
  input.type = input.type === 'password' ? 'text' : 'password'
}

let error