function showGuestTab(tabName) {
    document.querySelectorAll('.guest-panel').forEach(function (panel) {
        panel.classList.remove('active');
    });
    document.querySelectorAll('.guest-tabs .portal-tab').forEach(function (btn) {
        btn.classList.remove('active');
        if (btn.getAttribute('data-guest-tab') === tabName) {
            btn.classList.add('active');
        }
    });
    var panel = document.getElementById('guest-' + tabName);
    if (panel) {
        panel.classList.add('active');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    var initialTab = document.body.getAttribute('data-guest-tab');
    if (initialTab === 'admin') {
        showGuestTab('admin');
    }
});
