// Recolección de datos del formulario:
let jus = 6854 // Dato estático

const getDataJuicio = () => {
  let enJuicio = new Object ()
  enJuicio.certificado = Number(document.getElementById("certificado").value)
  enJuicio.sentencia = document.getElementById("sentencia").checked
  return enJuicio
}


const getDataDeuda = () => {
  let enDeuda = new Object()
  enDeuda.capital = Number(document.getElementById("capital").value)
  enDeuda.intereses = Number(document.getElementById("intereses").value)
  enDeuda.multa = Number(document.getElementById("multa").value)
  enDeuda.accesorios = enDeuda.intereses + enDeuda.multa
  enDeuda.actualizada = enDeuda.capital + enDeuda.accesorios
  return enDeuda
}

const ivaInscripto = () => document.getElementById("iva").checked
const porecentajeHon = () => (document.getElementById("porcentajeHon").value)/100
const cuotas = () => Number(document.getElementById("plan").value)



//FUNC PLANES DE PAGO
const moneda = (a) => {
   return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(a)
}


const planContado = () => getDataDeuda().accesorios * 0.6 + getDataDeuda().capital
const planTresSeis = () => getDataDeuda().accesorios * 0.75 + getDataDeuda().capital
const planDoce = () => {
  let interesPlan = cuotas()*0.015
  let a = getDataDeuda().accesorios * 0.85 + getDataDeuda().capital
  return (a * interesPlan) + a
}

const plan = () => {
  let a = cuotas()
  if (getDataJuicio().sentencia || a > 12 || a <= 0) {
    return getDataDeuda().actualizada
  } else if (a <= 3 ) {
    return planContado()
  } else if ( a > 3 && a <= 6) {
    return planTresSeis()
  } else {
    return planDoce()
  }
}

// FUNC CALCULO DE HONORARIOS Y COSTAS
const hon = () => plan() * porecentajeHon() < jus * 3 ? jus * 3 : plan() * porecentajeHon()
const aportes = () => hon() * 0.1
const iva = () => ivaInscripto() === true ? hon() * 0.21 : 0
const tasa = () => plan() < getDataJuicio().certificado ? getDataJuicio().certificado * 0.022 : plan() * 0.022
const sobreTasa = () => tasa() * 0.1

// Funciones creadoras
const totalCostas = () => hon() + aportes() + iva() + tasa() + sobreTasa()
const getDatosDefinitivos = () => {
  let obj = new Object()
  obj.certificado = moneda(getDataJuicio().certificado)
  obj.deuda = moneda(getDataDeuda().actualizada)
  obj.plan = moneda(plan())
  obj.hon = moneda(hon())
  obj.aportes = moneda(aportes())
  obj.iva = moneda(iva())
  obj.tasa = moneda(tasa())
  obj.stasa = moneda(sobreTasa())
  obj.totalCostas = moneda(totalCostas())
  return obj
}


const pCreator = () => { 
  let contador = document.getElementsByClassName("dato")
  let obj = Object.values(getDatosDefinitivos())
  for (let i = 0; i < contador.length; i++) {
    let p = document.createElement("p")
    p.textContent = obj[i]
    p.setAttribute ("id", `idp${[i]}`)
    contador[i].appendChild(p)
  } 
  }

  const pDelete = () => {
    let acc = document.getElementsByClassName("dato")
     for ( let i = 0; i < acc.length; i++) {
      let a = document.getElementById(`idp${[i]}`)
      a.remove()
     }
    }

  const funcionImprimir = (a) => {
    let ficha = document.getElementById(a);
    let ventimp = window.open(' ', 'popimpr');
    ventimp.document.write( ficha.innerHTML );
    ventimp.document.close();
    ventimp.print( );
    ventimp.close();
  }

// Construcción del DOM-Liquidacion **eventos**
const botonCalcular = document.querySelector("#botonCalcular")
const botonModificar = document.querySelector("#botonModificar")
const botonImprimir = document.querySelector("#botonImprimir")
const resultados = document.querySelector("#resultadoLiquidacion")
const formLiquidacion = document.querySelector("#formLiquidacion")

const body = document.querySelector(".modoClaro")
const textBotonDark = document.querySelector(".textBotonDark")
const imgModoDark = document.querySelector(".imgModoDark")
const bDark = document.querySelector(".botonDark")

bDark.onclick = () => {
  body.classList.toggle("modoDARK")
  if (body.className === "modoClaro modoDARK") {
    textBotonDark.textContent = "Aclarar"
    imgModoDark.className = "imgModoClaro"
    localStorage.setItem("darkModo", "si")
  } else {
    textBotonDark.textContent = "Oscurecer"
    imgModoDark.className = "imgModoDark"
    localStorage.setItem("darkModo", "no")
  }
}

botonCalcular.onclick = () => {
  pCreator()
  botonCalcular.style.display = "none"
  formLiquidacion.style.display = "none"
  resultados.style.display = "block"
}

botonModificar.onclick = () => {  
  pDelete()
  botonCalcular.style.display = "block"
  formLiquidacion.style.display = "block"
  resultados.style.display = "none"
}

botonImprimir.onclick = () => {
  funcionImprimir("resultadoLiquidacion")
}

// Verifica en LocalStorage si el usuario seleccionó modo oscuro
if (localStorage.getItem("darkModo") === "si") {
    body.className = "modoClaro modoDARK"
    textBotonDark.textContent = "Aclarar"
    imgModoDark.className = "imgModoClaro"
} else {
    textBotonDark.textContent = "Oscurecer"
    imgModoDark.className = "imgModoDark"
}