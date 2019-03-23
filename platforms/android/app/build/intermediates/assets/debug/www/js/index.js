const version = 1.0;

document.getElementById('copyright').innerHTML = `
<pre>Faculdade de Tecnologia Termomecânica
v 1.0
</pre>`

function carregaHome() {
    setTimeout(e => {
        window.location.href = './html/home.html';
    }, 2000);    
}