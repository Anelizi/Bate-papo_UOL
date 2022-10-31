let user = {name: null};
let userN = "";
let type = "menssage";
let contato = "Todos";
let publico = "Público";

//tela de entrada
function entrarBotao(){
    document.querySelector(".enter button").removeAttribute("disabled");
}

function entrar() {
    user.name = document.getElementById("nome").value;
    
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

        carregar();
        setInterval(carregarPagina,3000);
    },5000)
}

function erroNome(erro){
    alert('Nome já até sendo utilizado!');
}

function carregar(){
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(atualizar)
}

function atualizar(mensagens){
    document.querySelector(".main ul").innerHTML="";
    
    mensagens.data.forEach(adicionar);
    let adicionarElemento = document.querySelector(".main ul").lastElementChild;
    adicionarElemento.scrollIntoView();
}

function adicionarMensagem(msg){
    switch(msg.type){
        case "status":
            document.querySelector(".main ul").innerHTML+= `
            <li data-identifier="menssage" class=${msg.type}><p><span>(${msg.tempo})</span><b>${msg.use}</b> para <b>${msg.texto}</p></li>`
                break;
        case "menssage":
            document.querySelector(".main ul").innerHTML+=`
            <li data-identifier="menssage" class=${msg.type}><p><span>(${msg.tempo})</span><b>${msg.use}</b> reservadamante para <b>${msg.tudo}</b>: ${msg.texto}</p></li>`
                break;
        case "menssagemPrivata":
            if(msg.tudo === user.name || msg.use === user.name){
                document.querySelector(".main ul").innerHTML+=`
                <li data-identifier="menssage" class=${msg.type}><p><span>(${msg.tempo})</span><b>${msg.use}</b> reservadamente para <b>${msg.tudo}</b>: ${msg.texto}</p></li>`
                    break;
            }
            default:
    }
}

function participa(){
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    promise.then(atualizarParticipantes)
}

function atualizarParticipantes(participantes){
    document.querySelector(".participantes__menu_li ul").innerHTML=`
    <li onclick="destinodaMsg(this)" data-identifier="participantes_li"> <ion-icon name="people"></in-icon><p>Todos</p> <ion-icon class"checkmark_icone" name="checkmark-sharp"></ion-icon></li>`

    participantes.data.forEach(adicionarParticipante);

    let contatoOn = false;

    for(participante of document.querySelector(".participantes__menu_li ul").children){
       if(participante.querySelector("p").innerHTML===contato){
        participante.classList.add("selecione");
        contatoOn=true;
       }
    }
    if(!contatoOn){
        contato="Todos"
        document.querySelector(".participantes__menu_l ul").children[0].classList.add("selecione");
        const cont = document.querySelector(".footer_msgText p");
        cont.innerHTML=`Enviando para ${contato} (${publico})`
    }
}

function carregarPagina(){
    carregar();
    participa();
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", user);
    promise.then()
}

function adicionarParticipante(participante){
    if(participante.name!==user.name){
        document.querySelector(".participantes__menu_li ul").innerHTML+=`
        <li onclick="escolherUser(this)" data-identifier="participantes_li" <ion-icon name="person-circle"></ion-icon><p>&nbsp${participante.name}</p> <ion-icon class="checkmark_icone" name="checkmark-sharp"></ion-icon></li>`
    }
}

function escolherUser(elemento){
    contato=elemento.getElementByTagName("p")[0].innerHTML
    const escolido = elemento.querySelector(".selecione");
    if(escolido !== null){
        escolido.classList.remove("selecione");
    }
    elemento.classList.add("selecione");
    const resudado = document.querySelector(".footer_msgText p");
    resudado.innerHTML=`Enviando para ${contato} (${publico})`
}

function enviarMsg(){
    let mensagem = document.querySelector(".footer_msgText textarea").value
    if(mensagem){
        let obj ={
            use: user.name,
            tudo: contato,
            texto: mensagem,
            type: type
        }
        const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", obj)
        promise.then(mensagemEnviada)
        promise.catch(mensagemNaoEnviada)
    }
}

function mensagemNaoEnviada(){
    window.location.reload()
}

function mensagemEnviada(){
    document.querySelector(".footer_msgText textarea").value=""
    carregar()
}

document.getElementById("msgText").addEventListener('keyup', function(i){
    let key = i.keyCode;
    if (key == 13) {
    enviarMsg();
    } 
});

document.getElementById("nome").addEventListener('keyup', function(i){
    let key = e.keyCode;
    if (key == 13) { 
    entrar();
}
})