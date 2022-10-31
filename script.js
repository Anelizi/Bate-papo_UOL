let user = {name: null};

//tela de entrada
function entrarBotao(){
    document.querySelector(".enter enter_button").removeAttribute("disabled");
}

function entrar() {
    user.name = document.getElementById("nome").value;
    console.log(user)
    if(user.name !== null){
        const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", user)
        promise.then(validarNome)
        promise.catch(erroNome)
    }
}

function validarNome(userNome){
    document.querySelector(".enter-input").classList.add("escondido");
    document.querySelector(".enter_button").classList.add("escondido");
    document.querySelector(".carregando").classList.remove("escondido");

    setTimeout(function(){
        let enterUser = document.querySelector(".enter");
        enterUser.classList.add("escondido");

        let mensagem = document.querySelector(".mensagem");
        mensagem.classList.remove("escondido");

    })
}
