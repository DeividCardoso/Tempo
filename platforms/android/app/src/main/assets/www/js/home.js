const token = '13e80c2f15a95ed0205283e0658d0703';

let dadosMomento;
let dados15;

// Efeito do aumentar e diminuir do text-search
document.getElementById('search-text').addEventListener('focus', e => {
    const logo = document.getElementsByClassName('logo')[0];
    logo.style.display = 'none';
    e.target.style.width = '70vw';
});

document.getElementById('search-text').addEventListener('blur', e => {
    const logo = document.getElementsByClassName('logo')[0];
    e.target.style.width = '25vw';
    setTimeout(e => {
        logo.style.display = 'block';
    }, 500);    
});


// Muda a cor do botão ativo
window.onhashchange = function(e) {
    const oldURL = e.oldURL.split('#')[1] || 'home';
    const newURL = e.newURL.split('#')[1] || 'home';

    window.location.href = `#${newURL}`;
    
    const btnAtivo = document.querySelector(`#btn-${newURL}`);
    const btnInativo = document.querySelector(`#btn-${oldURL}`);

    btnInativo.style.color = 'gray';
    btnAtivo.style.color = '#2F80ED';
};

document.querySelector('form').addEventListener('submit', e => {
    e.preventDefault();
    document.getElementById('search-submit').focus();
    const cidade = document.querySelector('#search-text').value;
    pegaDados(cidade);
});


function pegaDados(cidade) {
    // alert(`cidade ${cidade}`);
    fetch(`http://apiadvisor.climatempo.com.br/api/v1/locale/city?name=${cidade}&token=${token}`).then(response => response.json()).then(data => {
        const cidadeId = data[0].id;
        console.log(cidadeId);

        fetch(`http://apiadvisor.climatempo.com.br/api/v1/weather/locale/${cidadeId}/current?token=${token}`).then(response => response.json()).then(data => {
            dadosMomento = data;
            console.log(dadosMomento);

           fetch(`http://apiadvisor.climatempo.com.br/api/v1/forecast/locale/${cidadeId}/days/15?token=${token}`).then(response => response.json()).then(data => {
                dados15 = data;
                console.log(dados15);
                mostraDados();
           });
        });
    }).catch(e => {
        alert(`erro pra pegar ID: ${e}`);
    });
}

function $(id) {
    return document.getElementById(id);
}

function mostraDados(){
    // Dados Slide Home
    $('dt-home-temp').innerHTML = `${dadosMomento.data.temperature}°`;
    $('dt-home-cidade').innerHTML = `<b>${dadosMomento.name}, ${dadosMomento.state}</b>`;
    $('dt-home-cond').innerHTML = `${dadosMomento.data.condition}`;
    $('dt-home-sens').innerHTML = `Sensação ${dadosMomento.data.sensation}°`;
    // $('dt-home-data').innerHTML = 

    // Dados Slide Info
    $('dt-info-dir').innerHTML = `<b>${dadosMomento.data.wind_direction}</b>`;
    $('dt-info-vel').innerHTML = `<b>${dadosMomento.data.wind_velocity} km/h</b>`;
    $('dt-info-hum').innerHTML = `<b>${dadosMomento.data.humidity}%</b>`;
    $('dt-info-pres').innerHTML = `<b>${dadosMomento.data.pressure} hpa</b>`;


    const diasSemana = {
        0: 'Dom',
        1: 'Seg',
        2: 'Ter',
        3: 'Qua',
        4: 'Qui',
        5: 'Sex',
        6: 'Sab'
    }

    // Dados Slide Clima
    for(let i = 0; i < 5; i ++){        
        let date = new Date(`${dados15.data[i].date.replace('-', ',')}`);

        $(`dt-clima-sem-${i}`).innerHTML = diasSemana[date.getDay()];
        $(`dt-clima-dia-${i}`).innerHTML = `${date.getDate()}/${date.getMonth() + 1}`;
        $(`dt-clima-porc-${i}`).innerHTML = `${dados15.data[i].rain.probability}`;
        $(`dt-clima-max-${i}`).innerHTML = `<i class="fa fa-arrow-up"></i> ${dados15.data[i].temperature.max}`;
        $(`dt-clima-min-${i}`).innerHTML = `<i class="fa fa-arrow-down"></i> ${dados15.data[i].temperature.min}`;
    }
}