清除会话缓存
window.addEventListener('unload', function (event) {
    localStorage.clear();
});