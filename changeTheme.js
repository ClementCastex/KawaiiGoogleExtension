// Ajoute un écouteur d'événements au bouton pour basculer entre les thèmes lorsqu'il est cliqué
document.getElementById('toggle-theme').addEventListener('click', () => {
    // Récupère le thème actuel appliqué au body
    const currentTheme = document.body.getAttribute('data-theme');

    // Si le thème actuel est "sunset", change-le en "kawaii"
    if (currentTheme === 'sunset') {
        document.body.setAttribute('data-theme', 'kawaii');
        // Sauvegarde le nouveau thème dans chrome.storage pour qu'il persiste entre les sessions
        chrome.storage.sync.set({ theme: 'kawaii' });
    } else {
        // Si le thème actuel n'est pas "sunset", applique "sunset"
        document.body.setAttribute('data-theme', 'sunset');
        // Sauvegarde le nouveau thème dans chrome.storage
        chrome.storage.sync.set({ theme: 'sunset' });
    }
});

// Lorsque l'extension est chargée, applique le thème sauvegardé ou, par défaut, le thème "kawaii"
chrome.storage.sync.get('theme', (data) => {
    // Récupère le thème sauvegardé, ou utilise "kawaii" comme thème par défaut s'il n'y en a pas
    const savedTheme = data.theme || 'kawaii';
    // Applique le thème sauvegardé ou par défaut au body de la page
    document.body.setAttribute('data-theme', savedTheme);
});
