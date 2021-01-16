/**
 * ～*～♡～*～♥～*～♡～*～♥～*～♡～*～♥～*～♡～*～
 *         VARIABLES GLOBALES Y CONFIGURACION
 * ～*～♡～*～♥～*～♡～*～♥～*～♡～*～♥～*～♡～*～
 */

const grillaHTML = document.querySelector(".grilla");

const frutas = ['🍉', '🥝', '🍌', '🍇', '🍋', '🥥'];


let columnas = 9;
let anchoDeDiv = 0;
let ajustarGrillaResponsive = 0;

const ajustarGrilla = () => {
  
    if (window.matchMedia("(max-width: 575.98px)").matches) {
        ajustarGrillaResponsive = 270;
    }
    else if (window.matchMedia("(max-width: 767.98px)").matches){
        ajustarGrillaResponsive = 290;
    }
    else {
        ajustarGrillaResponsive = 440;
    }

    return ajustarGrillaResponsive
} 

let anchoDeGrilla = ajustarGrilla();

let dificultad = ""
let grillaJS = [];

const obtenerNumeroAlAzar = (array) => {
    return Math.floor((Math.random() * array.length))
}

const obtenerItemAlAzar = (array) => {
    return array[obtenerNumeroAlAzar(array)]
}


const borrarGrilla = () => {
    grillaHTML.innerHTML = "";
    grillaJS = [];
}

const obtenerCuadrado = (x, y) => {
    return document.querySelector(`.cuadrado[data-x="${x}"][data-y="${y}"]`)
}

/**
 * ～*～♡～*～♥～*～♡～*～♥～*～♡～*～♥～*～♡～*～
 *               CREAR GRILLA 
 * ～*～♡～*～♥～*～♡～*～♥～*～♡～*～♥～*～♡～*～
 */

const dibujarAnchoDeGrilla = () => {
    grillaHTML.style.width = `${anchoDeGrilla}px`
}

const redimensionarAnchoDeDiv = () => {
    anchoDeDiv = anchoDeGrilla / columnas
}

const creargrillaJS = (columnas, array) => {
    for (let i = 0; i < columnas; i++) {
        grillaJS[i] = []
        for (let j = 0; j < columnas; j++) {
            grillaJS[i][j] = obtenerItemAlAzar(array)
        }
    }
}

const dibujarGrillaHTML = () => {
    // Vacio la grilla para el responsive
    grillaHTML.innerHTML = '';

    for (let i = 0; i < grillaJS.length; i++) {
        for (let j = 0; j < grillaJS[i].length; j++) {
            let cuadrado = generarCuadrado(j, i)
            grillaHTML.appendChild(cuadrado)

        }
    }
}

const generarCuadrado = (x, y) => {

    const cuadrado = document.createElement('div')
    cuadrado.classList.add("item")
    cuadrado.dataset.x = y
    cuadrado.dataset.y = x

    cuadrado.innerHTML = grillaJS[y][x]
    cuadrado.addEventListener('click', seleccionarItem)

    cuadrado.style.top = `${y * anchoDeDiv}px`
    cuadrado.style.left = `${x * anchoDeDiv}px`
    cuadrado.style.width = `${anchoDeDiv}px`
    cuadrado.style.height = `${anchoDeDiv}px`

    return cuadrado
}


const crearGrilla = (items) => {

    dibujarAnchoDeGrilla()
    redimensionarAnchoDeDiv()
    creargrillaJS(columnas, items)
    dibujarGrillaHTML()

}


/**
 * ～*～♡～*～♥～*～♡～*～♥～*～♡～*～♥～*～♡～*～
 *              MOVER ELEMENTOS
 * ～*～♡～*～♥～*～♡～*～♥～*～♡～*～♥～*～♡～*～
 */

const intercambiarCuadrados = (elem1, elem2) => {
    const datax1 = Number(elem1.dataset.x)
    const datax2 = Number(elem2.dataset.x)
    const datay1 = Number(elem1.dataset.y)
    const datay2 = Number(elem2.dataset.y)

    // aquí modifico grilla JS
    let variableTemporal = grillaJS[datax1][datay1]
    grillaJS[datax1][datay1] = grillaJS[datax2][datay2]
    grillaJS[datax2][datay2] = variableTemporal

    // acá modifico grilla HTML
    if (datax1 === datax2 && (datay1 === datay2 + 1 || datay1 === datay2 - 1)) {
        elem1.style.left = `${datay2 * anchoDeDiv}px`
        elem2.style.left = `${datay1 * anchoDeDiv}px`
        elem1.dataset.y = datay2
        elem2.dataset.y = datay1
    } else if (datay1 === datay2 && (datax1 === datax2 + 1 || datax1 === datax2 - 1)) {
        elem1.style.top = `${datax2 * anchoDeDiv}px`
        elem2.style.top = `${datax1 * anchoDeDiv}px`
        elem1.dataset.x = datax2
        elem2.dataset.x = datax1
    }

}


const sonAdyacentes = (elem1, elem2) => {
    const datax1 = Number(elem1.dataset.x)
    const datax2 = Number(elem2.dataset.x)
    const datay1 = Number(elem1.dataset.y)
    const datay2 = Number(elem2.dataset.y)

    if ((datax1 === datax2 && datay1 === datay2 + 1) || (datax1 === datax2 && datay1 === datay2 - 1) ||
        (datay1 === datay2 && datax1 === datax2 + 1) || (datay1 === datay2 && datax1 === datax2 - 1)) {
        return true
    } else {
        return false
    }
}


const seleccionarItem = (e) => {
    let primerCuadrado = document.querySelector(".seleccionado")

    if (primerCuadrado != null) {
        if (sonAdyacentes(primerCuadrado, e.target)) {

            intercambiarCuadrados(primerCuadrado, e.target)

            if (hayMatch()) {
                 
                buscarMatches()//busca y borra matches

            } else {
                setTimeout(() => intercambiarCuadrados(primerCuadrado, e.target), 500)               
            }

        } else {
            primerCuadrado.classList.remove("seleccionado")
            e.target.classList.add("seleccionado")
        }
    } else(
        e.target.classList.add("seleccionado")
    )
}


/**
 * ～*～♡～*～♥～*～♡～*～♥～*～♡～*～♥～*～♡～*～
 *              BUSCAR y BORRAR MATCHES
 * ～*～♡～*～♥～*～♡～*～♥～*～♡～*～♥～*～♡～*～
 */


const borrarMatches = () => {

    const matches = document.querySelectorAll(".is-match")

    for (let div of matches) {
        //borrar grillaJS
        const datax = Number(div.dataset.x)
        const datay = Number(div.dataset.y)  

        grillaJS[datax][datay] = null
       
        // borrar grillaHTML
        div.innerHTML = ""
        div.classList.add('desaparecer-item')
    }
    
    // resetear los div que hicieron matches
    for (let div of matches){
        div.classList.remove("is-match")
    }

    
}


const hayMatch = () => {
    for (let i = 0; i < grillaJS.length; i++) {
        for (let j = 0; j < grillaJS[i].length; j++) {
            if (grillaJS[i][j] === grillaJS[i][j + 1] &&
                grillaJS[i][j + 1] === grillaJS[i][j + 2]) {
                return true
            }
            if (grillaJS[i + 1] && grillaJS[i + 2] &&
                grillaJS[i][j] === grillaJS[i + 1][j] &&
                grillaJS[i + 1][j] === grillaJS[i + 2][j]) {
                return true
            }
        }
    }
    return false
}

const hayCuadradosVacios = () => {

    const cuadradosDeGrillaHTML = document.querySelectorAll(".grilla > div");

    for (let cuadrado of cuadradosDeGrillaHTML) {
        if (cuadrado.innerHTML === "") {
            return true
        }
    }
}

const reacomodarFrutas = () => {

    const cuadradosDeGrillaHTML = document.querySelectorAll(".grilla > div");

    if (hayCuadradosVacios()) {
        for (let cuadrado of cuadradosDeGrillaHTML) {

            let dataX = Number(cuadrado.dataset.x)
            let dataY = Number(cuadrado.dataset.y)

            if (cuadrado.innerHTML === "") {
                grillaJS[dataX][dataY] = obtenerItemAlAzar(frutas)
                cuadrado.innerHTML = grillaJS[dataX][dataY]
                cuadrado.classList.toggle("desaparecer-item")
            }

        }
    }

    if (hayMatch()){
        combo++
        mostrarCombo()
        setTimeout(() => buscarMatches(), 700) 
    }
    else {
        combo = 1
        mostrarCombo()
    }

}


const buscarYborrarMatches = () => {

   const todosLosDivs = document.querySelectorAll(".grilla > div")
 
   // busca matches horizontales
   for (let i = 0; i < grillaJS.length; i++) {
       for (let j = 0; j < grillaJS[i].length; j++) {

           if (grillaJS[i][j] === grillaJS[i][j + 1] && grillaJS[i][j] === grillaJS[i][j + 2]) {            

               for (let div of todosLosDivs) {

                   if (div.dataset.x === `${i}` && div.dataset.y === `${j}`) {
                       div.classList.add('is-match')
                   }
                   if (div.dataset.x === `${i}` && div.dataset.y === `${j + 1}`) {
                       div.classList.add('is-match')
                   }
                   if (div.dataset.x === `${i}` && div.dataset.y === `${j + 2}`) {
                       div.classList.add('is-match')
                   }
               }

           }
       }
   }
   
   //busca matches verticales
   for (let i = 0; i < grillaJS.length; i++) {
     
       for (let j = 0; j < grillaJS[i].length; j++) {
           
           if (grillaJS[i + 1] && grillaJS[i + 2] && grillaJS[i][j] === grillaJS[i + 1][j] && grillaJS[i + 2][j] === grillaJS[i][j]) {
               

               for (let div of todosLosDivs) {
                   if (div.dataset.x === `${i}` && div.dataset.y === `${j}`) {
                       div.classList.add('is-match')
                   }
                   if (div.dataset.x === `${i + 1}` && div.dataset.y === `${j}`) {
                       div.classList.add('is-match')
                   }
                   if (div.dataset.x === `${i + 2}` && div.dataset.y === `${j}`) {
                       div.classList.add('is-match')
                   }
               }
           }

       }
   }
  
setTimeout(() => borrarMatches(), 300)
   
}

const buscarMatches = () => {

    buscarYborrarMatches()
    setTimeout(() => reacomodarFrutas(), 600) 
    sumarPuntos()
    mostrarPuntajeParcial()

}


const crearGrillaSinMatches = (frutas) => {
    do {
        borrarGrilla()
        crearGrilla(frutas)
    }
    while (hayMatch() === true)

//    reinciarTiempo()
    reinciarPuntaje()
    mostrarPuntajeParcial()
}



/**
 * ～*～♡～*～♥～*～♡～*～♥～*～♡～*～♥～*～♡～*～
 *                MODALES
 * ～*～♡～*～♥～*～♡～*～♥～*～♡～*～♥～*～♡～*～
 */

const modalBienvenida = document.getElementById('modal-bienvenida');
const modalDificultad = document.getElementById('modal-dificultad');
const modalGameOver = document.getElementById('modal-gameover');
const modalReiniciarJuego = document.getElementById('modal-reiniciar');
const botonAyuda = document.getElementById('boton-ayuda');
const botonReiniciar = document.getElementById('boton-reiniciar');
const botonAJugar = document.getElementById('inicio-juego');
const cancelarReiniciar = document.getElementById('cancelar');
const nuevoJuegoReiniciar = document.getElementById('nuevo-juego-reiniciar');
const dificultadFacil = document.getElementById('facil');
const dificultadMediano = document.getElementById('mediano');
const dificultadDificil = document.getElementById('dificil');

const darBienvenida = () => {
    modalBienvenida.classList.remove('hidden')

    botonAJugar.onclick = () => {
        modalBienvenida.classList.add('hidden');
        elegirDificultad()
    }

}

const iniciarModales = () => {
    darBienvenida()

}



const elegirDificultad = () => {

    modalDificultad.classList.remove('hidden');

    dificultadFacil.onclick = () => {
        modalDificultad.classList.add('hidden');
        columnas = 9;
        crearGrillaSinMatches(frutas)
    }

    dificultadMediano.onclick = () => {
        modalDificultad.classList.add('hidden');
        columnas = 8;
        crearGrillaSinMatches(frutas)
    }

    dificultadDificil.onclick = () => {
        modalDificultad.classList.add('hidden');
        columnas = 7;
        crearGrillaSinMatches(frutas)
    }

}

const pedirAyuda = () => {
    modalBienvenida.classList.remove('hidden')
    botonAJugar.onclick = () => {
        modalBienvenida.classList.add('hidden')
    }
}

botonAyuda.onclick = () => {
    pedirAyuda()

}



// Male: dejamos comentada la función del tiempo para que no moleste.
// // Reloj - CountDown
// const tiempoHTML = document.getElementById('tiempo-de-juego');
// const botonReiniciarEnGameOver = document.querySelector('#reiniciar');
// const botonNuevoJuegoEnGameOver = document.querySelector('#nuevo-juego');

// let tiempoJS = 10
// let reloj = null;

// const comenzarTiempo = () => {

//     if (tiempoJS >= 10) {
//         tiempoHTML.textContent = `0:${tiempoJS}`;
//         tiempoJS--
//     }
//     else if (tiempoJS <= 10 && tiempoJS >= 1) { 
//         tiempoHTML.textContent = `0:0${tiempoJS}`;
//         tiempoJS--
//     } else {
//         tiempoHTML.textContent = `0:00`;
//         finalizarJuego()
//     }
        
//     if (tiempoJS !== -1) {
//         reloj = setTimeout(comenzarTiempo, 1000);
//     }

// }

// const reinciarTiempo = () => {
//     clearTimeout(reloj)
//     tiempoJS = 30
//     comenzarTiempo()
// }

// const jugarDeNuevo = () => {
//     clearTimeout(reloj)
//     modalGameOver.classList.add('hidden');
//     elegirDificultad()     
// }

// const reinciarJuegoEnGameOver = (frutas) => {
//     clearTimeout(reloj)
//     modalGameOver.classList.add('hidden');
//     crearGrillaSinMatches(frutas)
// }

// const finalizarJuego = () => {  
      
//     modalGameOver.classList.remove('hidden');
//     mostrarPuntajeFinal()
//     botonReiniciarEnGameOver.onclick = () => {
//         reinciarJuegoEnGameOver(frutas)
//     }

//     botonNuevoJuegoEnGameOver.onclick = () => {
//         jugarDeNuevo()
//     }

// }


// PUNTAJE
let puntos = 0
let combo = 1
const puntajeFinal = document.querySelector('#puntaje-final')
const puntajeParcial = document.querySelector('#puntaje-parcial')
const comboHTML = document.querySelector('#combo')

const sumarPuntos = () => {
    const matches = document.querySelectorAll(".is-match")
    let sumItem = 100 * matches.length
    sumItem = sumItem * combo  
    return puntos += sumItem
}

const reinciarPuntaje = () => {
    puntos = 0
}

const mostrarPuntajeParcial = () => {
    puntajeParcial.textContent = puntos    
}

const mostrarPuntajeFinal = () => {
    puntajeFinal.textContent = puntos
}

const mostrarCombo = () => {
    comboHTML.textContent = `x${combo}`
}

/**
 * ～*～♡～*～♥～*～♡～*～♥～*～♡～*～♥～*～♡～*～
 *        INICIALIZAR JUEGO
 * ～*～♡～*～♥～*～♡～*～♥～*～♡～*～♥～*～♡～*～
 */


const reiniciarJuego = () => {
    borrarGrilla()
    elegirDificultad()
}

botonReiniciar.onclick = () => {

    modalReiniciarJuego.classList.remove('hidden')

    nuevoJuegoReiniciar.onclick = () => {
        modalReiniciarJuego.classList.add('hidden')
        elegirDificultad()
    }

    cancelarReiniciar.onclick = () => {
        modalReiniciarJuego.classList.add('hidden')
    }

}


window.onload = () => {
    iniciarModales()
}

window.onresize = () => {
    anchoDeGrilla = ajustarGrilla();
    dibujarAnchoDeGrilla();
    redimensionarAnchoDeDiv();
    dibujarGrillaHTML();    
}