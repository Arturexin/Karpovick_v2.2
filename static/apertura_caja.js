document.addEventListener("DOMContentLoaded", inicioAperturaCaja)
function inicioAperturaCaja(){
    inicioTablasCaja()
    btnVentas = 1;
};
let fecha_hoy = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate();
async function inicioTablasCaja(){
    await conteoCaja(document.getElementById("filtro-tabla-caja-sucursal").value,
                    '2000-01-01',
                    fecha_hoy)
    
    await cargarVentasHoy()
    await cargarGastosHoy()
    await cargarAperturaHoy()
    saldoCierre()
    sucursalesCajaApertura()

    avanzarTablaCaja()
    atajoTablaCaja()
    filtroCaja()
    await tablaCaja(document.getElementById("numeracionTablaCaja").value - 1, "",
                    '2000-01-01', fecha_hoy)
};

const btnCaja = document.getElementById("apertura-caja");
btnCaja.addEventListener("click", (e) => {
    e.preventDefault();
    location.href = "/apertura_caja";
    document.getElementById("apertura-caja").classList.add("marcaBoton")
});
const btnEntradas = document.getElementById("entradas-caja");
btnEntradas.addEventListener("click", (e) => {
    e.preventDefault();
    location.href = "/ventas";
    document.getElementById("buscador-productos-ventas").focus()
});
const btnSalidas = document.getElementById("salidas-caja");
btnSalidas.addEventListener("click", (e) => {
    e.preventDefault();
    location.href = "/salidas_caja";
});

let comprobacionIdCaja = 0;
let variableSituacion = 0;
let numeronIncrementoCaja = 1;
let sumaCaja = 0;
let inicio = 0;
let fin = 0;
async function conteoCaja(sucursal,inicio,fin){
    let url = URL_API_almacen_central + `caja_conteo?`+
                                        `sucursal_aper_caja=${sucursal}&`+
                                        `fecha_inicio_aper_caja=${inicio}&`+
                                        `fecha_fin_aper_caja=${fin}`
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    });
    cantidadFilas = await respuesta.json();
    let html = "";
    for(let i = 1; i <= Math.ceil(cantidadFilas/20); i++) {
        let fila = `<option value="${i}">${i}</option>`
        html = html + fila;
    };
    document.querySelector("#numeracionTablaCaja").innerHTML = html
};
async function tablaCaja(num,sucursal,inicio,fin){
    let url = URL_API_almacen_central + `caja_tabla/${num}?`+
                                        `sucursal_aper_caja=${sucursal}&`+
                                        `fecha_inicio_aper_caja=${inicio}&`+
                                        `fecha_fin_aper_caja=${fin}`
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    });
    cajaTotal = await respuesta.json();
    let html = ''
    if(cajaTotal.length > 0){
        for(caj of cajaTotal){
            let row = `
                    <tr class="fila-caja">
                        <td class="invisible">${caj.id_caja}</td>
                        <td>${caj.sucursal_nombre}</td>
                        <td>${caj.saldo_apertura.toFixed(2)}</td>
                        <td>${caj.ingresos.toFixed(2)}</td>
                        <td>${caj.egresos.toFixed(2)}</td>
                        <td>${caj.saldo_cierre.toFixed(2)}</td>
                        <td>${caj.fecha_caja}</td>
                        <td class="invisible">${caj.llave_caja}</td>
                        <td class="situacion_caja"></td>
                        <td style="display: flex; justify-content: center;">
                            <button class="acciones_caja">Cerrar</button>
                        </td>
                        <td class="invisible">${caj.sucursal_caja}</td>
                    </tr>`
            html = html + row;
        };
        document.querySelector("#tabla-caja > tbody").outerHTML = html;
    }else{
        alert("No se encontraron resultados.")
        document.querySelector("#tabla-caja > tbody").outerHTML = html;
        document.querySelector("#tabla-caja").createTBody()
    };
    situacionCaja()
    accionesTablaCaja()
};
function avanzarTablaCaja(){
    document.getElementById("avanzarCaja").addEventListener("click", () =>{
        if(sumaCaja + 20 < cantidadFilas){
            numeronIncrementoCaja += 1
            sumaCaja += 20
            document.getElementById("numeracionTablaCaja").value = numeronIncrementoCaja
            manejoDeFechasCaja()
            tablaCaja(sumaCaja,
                    document.getElementById("filtro-tabla-caja-sucursal").value,
                    inicio,
                    fin)
        };
    });
    document.getElementById("retrocederCaja").addEventListener("click", () =>{
        if(numeronIncrementoCaja > 1){
            numeronIncrementoCaja -= 1
            sumaCaja -= 20
            document.getElementById("numeracionTablaCaja").value = numeronIncrementoCaja
            manejoDeFechasCaja()
            tablaCaja(sumaCaja,
                    document.getElementById("filtro-tabla-caja-sucursal").value,
                    inicio,
                    fin)
        };
    });
};
function atajoTablaCaja(){
    document.getElementById("numeracionTablaCaja").addEventListener("change", ()=>{
        manejoDeFechasCaja()
        tablaCaja((document.getElementById("numeracionTablaCaja").value - 1) * 20,
                document.getElementById("filtro-tabla-caja-sucursal").value,
                inicio,
                fin)
        numeronIncrementoCaja = Number(document.getElementById("numeracionTablaCaja").value);
        sumaCaja = (document.getElementById("numeracionTablaCaja").value - 1) * 20;
    });
};
document.getElementById("restablecerCaja").addEventListener("click", async () =>{
    document.getElementById("filtro-tabla-caja-fecha-inicio").value = ""
    document.getElementById("filtro-tabla-caja-fecha-fin").value = ""
    document.getElementById("filtro-tabla-caja-sucursal").value = ""

    await conteoCaja(document.getElementById("filtro-tabla-caja-sucursal").value,
                '2000-01-01',
                fecha_hoy)
    await tablaCaja(0,
                document.getElementById("filtro-tabla-caja-sucursal").value,
                '2000-01-01',
                fecha_hoy)
    numeronIncrementoCaja = 1;
    sumaCaja = 0;
});
function manejoDeFechasCaja(){
    inicio = document.getElementById("filtro-tabla-caja-fecha-inicio").value;
    fin = document.getElementById("filtro-tabla-caja-fecha-fin").value;
    if(inicio == "" && fin == ""){
        inicio = '2000-01-01';
        fin = fecha_hoy
    }else if(inicio == "" && fin != ""){
        inicio = '2000-01-01';
    }else if(inicio != "" && fin == ""){
        fin = fecha_hoy;
    };
};
function filtroCaja(){
    document.getElementById("buscarFiltrosCaja").addEventListener("click", async (e)=>{
        e.preventDefault();
        manejoDeFechasCaja()
        await conteoCaja(document.getElementById("filtro-tabla-caja-sucursal").value,
                    inicio,
                    fin)
        await tablaCaja(0,
                    document.getElementById("filtro-tabla-caja-sucursal").value,
                    inicio,
                    fin)
        numeronIncrementoCaja = 1;
        sumaCaja = 0;
        alert(`Se obtuvieron ${cantidadFilas} registros.`)
    });
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
let venta_hoy = []
let gasto_hoy = []
let apertura_hoy = []

async function cargarVentasHoy(){
    let url = URL_API_almacen_central + `ventas_avance_diario?`+
                                        `fecha_inicio_det_venta=${fecha_hoy}&`+
                                        `fecha_fin_det_venta=${fecha_hoy}`
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    venta_hoy = await respuesta.json();
    let valor_sucursal_principal = document.getElementById("sucursal-principal").children
    document.querySelectorAll(".ingresos_caja_ventas").forEach((event, i)=>{
        venta_hoy.forEach((e)=>{
            if(e.sucursal === Number(valor_sucursal_principal[i].value)){
                
                event.value = e.suma_ventas_hoy.toFixed(2)
            }
        });
    });
};
async function cargarGastosHoy(){
    let url = URL_API_almacen_central + `gastos_varios_diario?`+
                                        `fecha_inicio_gastos_varios=${fecha_hoy}&`+
                                        `fecha_fin_gastos_varios=${fecha_hoy}`
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    gasto_hoy = await respuesta.json();
    let valor_sucursal_principal = document.getElementById("sucursal-principal").children
    document.querySelectorAll(".egresos_caja_gastos").forEach((event, i)=>{
        gasto_hoy.forEach((e)=>{
            if(e.sucursal_gastos === Number(valor_sucursal_principal[i].value)){
                event.value = e.suma_gastos_hoy.toFixed(2)
            }
        });
    });
};

async function cargarAperturaHoy(){
    let url = URL_API_almacen_central + `caja_tabla_diario`
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    apertura_hoy = await respuesta.json();
    let valor_sucursal_principal = document.getElementById("sucursal-principal").children
    document.querySelectorAll(".saldo_apertura_caja").forEach((event, i)=>{
        apertura_hoy.forEach((e)=>{
            if(e.sucursal_caja === Number(valor_sucursal_principal[i].value)){
                event.value = e.saldo_apertura.toFixed(2)
                if(e.llave_caja === 0){
                    document.querySelectorAll(".flecha_apertura_caja")[i].style.transform = "rotate(270deg)"
                    document.querySelectorAll(".flecha_apertura_caja")[i].style.color = "#77E578"
                }else if(e.llave_caja === 1){
                    document.querySelectorAll(".flecha_apertura_caja")[i].style.transform = "rotate(90deg)"
                    document.querySelectorAll(".flecha_apertura_caja")[i].style.color = "#994d40"
                };
            };
        });
    });
};
function saldoCierre(){
    document.querySelectorAll(".saldo_cierre_caja").forEach((event, i)=>{
        event.value = (Number(document.querySelectorAll(".saldo_apertura_caja")[i].value) + 
                        Number(document.querySelectorAll(".ingresos_caja_ventas")[i].value) - 
                        Number(document.querySelectorAll(".egresos_caja_gastos")[i].value)).toFixed(2)
    });
    document.querySelectorAll(".saldo_apertura_caja").forEach((event, i)=>{
        event.addEventListener("keyup", ()=>{
            document.querySelectorAll(".saldo_cierre_caja")[i].value = (Number(event.value) + 
                                                                        Number(document.querySelectorAll(".ingresos_caja_ventas")[i].value) - 
                                                                        Number(document.querySelectorAll(".egresos_caja_gastos")[i].value)).toFixed(2)
        });
    });
};
let sucursal_caja_apertura = []
function sucursalesCajaApertura(){
    sucursal_caja_apertura = JSON.parse(localStorage.getItem("sucursal_encabezado"))
    document.querySelectorAll(".titulo_apertura_caja").forEach((event, i)=>{
        event.textContent = sucursal_caja_apertura[i].sucursal_nombre
    });
};
let btn_aperturar = document.querySelectorAll(".btn_apertura_caja")
btn_aperturar.forEach((event, i)=>{
    event.addEventListener("click", async (e)=>{
        e.preventDefault()
        
        let apertura = apertura_hoy.find(x => x.sucursal_caja === sucursal_caja_apertura[i].id_sucursales)
        if(apertura === undefined || apertura.llave_caja === 1){
            let data = {
                "sucursal_caja": sucursal_caja_apertura[i].id_sucursales,
                "saldo_apertura": document.querySelectorAll(".saldo_apertura_caja")[i].value,
                "ingresos": document.querySelectorAll(".ingresos_caja_ventas")[i].value,
                "egresos": document.querySelectorAll(".egresos_caja_gastos")[i].value,
                "saldo_cierre": document.querySelectorAll(".saldo_cierre_caja")[i].value,
                "fecha_caja": fechaPrincipal,
                "llave_caja": 0
            };
            if (apertura !== undefined) {
                data.id_caja = apertura.id_caja
            };

            let url = URL_API_almacen_central + 'caja'
            let response = await funcionFetch(url, data)
            if(response.status === 200){
                alert("Caja aperturada.")
                tablaCaja(document.getElementById("numeracionTablaCaja").value - 1, "",
                    '2000-01-01', fecha_hoy);
                await cargarAperturaHoy()
            };
            if(document.querySelector("#tabla-caja > tbody").children.length === 0){
                location.reload();
            };
        }else{
            alert(`Esta caja ya fue aperturada.`)
        };
    });
});
let btn_cerrar = document.querySelectorAll(".btn_cerrar_caja")
btn_cerrar.forEach((event, i)=>{
    event.addEventListener("click", async (e)=>{
        e.preventDefault();
        let cerrar = apertura_hoy.find(x => x.sucursal_caja === sucursal_caja_apertura[i].id_sucursales)
        if(cerrar !== undefined){
            let data = {
                "id_caja": cerrar.id_caja,
                "sucursal_caja": cerrar.sucursal_caja,
                "saldo_apertura": document.querySelectorAll(".saldo_apertura_caja")[i].value,
                "ingresos": document.querySelectorAll(".ingresos_caja_ventas")[i].value,
                "egresos": document.querySelectorAll(".egresos_caja_gastos")[i].value,
                "saldo_cierre": document.querySelectorAll(".saldo_cierre_caja")[i].value,
                "llave_caja": 1
            };
            let url = URL_API_almacen_central + 'caja'
            let response = await funcionFetch(url,data)
            if(response.status === 200){
                tablaCaja(document.getElementById("numeracionTablaCaja").value - 1, "",
                    '2000-01-01', fecha_hoy);
                await cargarAperturaHoy()
                alert("Caja cerrada.")
            };
        }else{
            alert(`Esta acción no se puede realizar debido a que esta caja no está aperturada.`)
        };
    });
});
////////////////////////////////////////////////////////////////////////////////////////////////
function situacionCaja(){
    document.querySelectorAll(".situacion_caja").forEach((event)=>{
        if(event.parentNode.children[7].textContent == 0){
            event.textContent = "Aperturado"
            event.style.background = "var(--boton-uno)"
        }else{
            event.textContent = "Cerrado"
            event.style.background = "var(--boton-dos)"
        };
    });
};
/////////////////////////////////////////////////////////////////////////////
function accionesTablaCaja(){
    document.querySelectorAll(".acciones_caja").forEach((event)=>{
        event.addEventListener("click", async ()=>{
            if(event.parentNode.parentNode.children[7].textContent == 0){
                let fila_caja = cajaTotal.find(x => x.id_caja == event.parentNode.parentNode.children[0].textContent)

                let partesFecha = fila_caja.fecha_caja.split("-")
                let dia = partesFecha[0];
                let mes = partesFecha[1];
                let año = partesFecha[2];
                
                let url_venta = URL_API_almacen_central + `ventas_avance_diario?`+
                                                    `fecha_inicio_det_venta=${año}-${mes}-${dia}&`+
                                                    `fecha_fin_det_venta=${año}-${mes}-${dia}`
                let respuesta_venta  = await fetch(url_venta, {
                    "method": 'GET',
                    "headers": {
                        "Content-Type": 'application/json'
                    }
                })
                let venta_caja_no_cerrada = await respuesta_venta.json();
                let venta_caja_no_cerrada_sucursal = venta_caja_no_cerrada.find(y => y.sucursal == fila_caja.sucursal_caja)

                let url_gasto = URL_API_almacen_central + `gastos_varios_diario?`+
                                        `fecha_inicio_gastos_varios=${fecha_hoy}&`+
                                        `fecha_fin_gastos_varios=${fecha_hoy}`
                let respuesta_gasto  = await fetch(url_gasto, {
                    "method": 'GET',
                    "headers": {
                        "Content-Type": 'application/json'
                    }
                })
                let gasto_caja_no_cerrada = await respuesta_gasto.json();
                let gasto_caja_no_cerrada_sucursal = gasto_caja_no_cerrada.find(z => z.sucursal_gastos == fila_caja.sucursal_caja)

                function DataCaja(){
                    this.id_caja = fila_caja.id_caja;
                    this.sucursal_caja = fila_caja.sucursal_caja;
                    this.saldo_apertura = fila_caja.saldo_apertura;
                    if(venta_caja_no_cerrada_sucursal == undefined){
                        this.ingresos = 0;
                    }else{
                        this.ingresos = venta_caja_no_cerrada_sucursal.suma_ventas_hoy;
                    }
                    if(gasto_caja_no_cerrada_sucursal == undefined){
                        this.egresos = 0;
                    }else{
                        this.egresos = gasto_caja_no_cerrada_sucursal.suma_gastos_hoy;
                    }
                    this.saldo_cierre = this.saldo_apertura + 
                                        this.ingresos -
                                        this.egresos;
                    this.llave_caja = 1
                }
                let data_caja = new DataCaja()
                let url = URL_API_almacen_central + 'caja'
                let response = await funcionFetch(url, data_caja)
                if(response.status === 200){
                    tablaCaja(document.getElementById("numeracionTablaCaja").value - 1, "",
                            '2000-01-01', fecha_hoy);
                    await cargarAperturaHoy()
                    alert("Caja cerrada.")
                }else{
                    alert("Operacion no realizada.")
                };
            }else{
                alert("Esta acción no se puede efectuar sobre una caja cerrada.")
            }
        });
    });
};
