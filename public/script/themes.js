const themeLight = document.getElementById('theme-light');
const themeDark = document.getElementById('theme-dark');
const style = document.getElementById('style');

function getTheme() {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; theme=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

const theme = getTheme();

if(theme === 'light') {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = '/style/style-light.css';
  link.id = 'light-theme';
  document.head.insertBefore(link, style);
  themeLight.classList.add('hidden');
  themeDark.classList.remove('hidden');
};

document.getElementById('theme-light').addEventListener('click', function() {
  const d = new Date();
  d.setTime(d.getTime() + (3600000 * 24 * 5));
  const expires = "expires=" + d.toUTCString();
  document.cookie = "theme" + "=" + "light" + ";" + expires + ";path=/" + ";Secure" + ";SameSite=Strict";
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = '/style/style-light.css';
  link.id = 'light-theme';
  document.head.insertBefore(link, style);
  themeLight.classList.add('hidden');
  themeDark.classList.remove('hidden');
});

document.getElementById('theme-dark').addEventListener('click', function() {
  document.cookie = "theme" + "=" + "dark" + ";" + "expires=0" + ";path=/" + ";Secure" + ";SameSite=Strict";
  document.getElementById('light-theme').remove()
  themeDark.classList.add('hidden');
  themeLight.classList.remove('hidden');
});