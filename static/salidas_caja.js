document.addEventListener("DOMContentLoaded", inicioGastosVarios)
function inicioGastosVarios(){
    inicioTablasGastos()
    btnVentas = 1;

};
let sucursal_id_dastos = 0;
const btnCaja = document.getElementById("apertura-caja");
btnCaja.addEventListener("click", (e) => {
    e.preventDefault();
    location.href = "/apertura_caja";
});
const btnEntradas = document.getElementById("entradas-caja");
btnEntradas.addEventListener("click", (e) => {
    e.preventDefault();
    location.href = "/ventas";
});
const btnSalidas = document.getElementById("salidas-caja");
btnSalidas.addEventListener("click", (e) => {
    e.preventDefault();
    location.href = "/salidas_caja";
    document.getElementById("salidas-caja").classList.add("marcaBoton")
});
async function inicioTablasGastos(){
    await conteoGastos(document.getElementById("filtro-tabla-gastosVarios-sucursal").value, 
                        document.getElementById("filtro-tabla-gastosVarios-concepto").value, 
                        document.getElementById("filtro-tabla-gastosVarios-comprobante").value, 
                        document.getElementById("filtro-tabla-gastosVarios-usuario").value,
                        '2000-01-01',
                        new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate())
    await tablaGastosVarios(document.getElementById("numeracionTablaGastosVarios").value - 1, "", "", "", "",
                            '2000-01-01', new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate())
    avanzarTablaGastosVarios()
    atajoTablaGastos()
    filtroGastos()
};
let numeronIncrementoGastosVarios = 1;
let sumaEntradasGastosVarios = 0;
let inicio = 0;
let fin = 0;
async function conteoGastos(sucursal,concepto,comprobante,usuario,inicio,fin){
    let url = URL_API_almacen_central + `gastos_varios_conteo?`+
                                        `sucursal_gastos_varios=${sucursal}&`+
                                        `concepto_gastos_varios=${concepto}&`+
                                        `comprobante_gastos_varios=${comprobante}&`+
                                        `usuario_gastos_varios=${usuario}&`+
                                        `fecha_inicio_gastos_varios=${inicio}&`+
                                        `fecha_fin_gastos_varios=${fin}`
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
    document.querySelector("#numeracionTablaGastosVarios").innerHTML = html
};
async function tablaGastosVarios(num,sucursal,concepto,comprobante,usuario,inicio,fin){
    let url = URL_API_almacen_central + `gastos_varios_tabla/${num}?`+
                                        `sucursal_gastos_varios=${sucursal}&`+
                                        `concepto_gastos_varios=${concepto}&`+
                                        `comprobante_gastos_varios=${comprobante}&`+
                                        `usuario_gastos_varios=${usuario}&`+
                                        `fecha_inicio_gastos_varios=${inicio}&`+
                                        `fecha_fin_gastos_varios=${fin}`
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    gastosVarios = await respuesta.json();
    let html = ''
    if(gastosVarios.length > 0){
        for(gastos of gastosVarios){
            let row = `
                    <tr class="fila-gastos-varios">
                        <td class="invisible">${gastos.id_gastos }</td>
                        <td>${gastos.sucursal_nombre}</td>
                        <td>${gastos.concepto}</td>
                        <td>${gastos.comprobante}</td>
                        <td>${gastos.monto.toFixed(2)}</td>
                        <td>${gastos.nombres}</td>
                        <td>${gastos.fecha_gastos}</td>
                    </tr>`
            html = html + row;
        };
        document.querySelector("#tabla-gastos-varios > tbody").outerHTML = html;
    }else{
        alert("No se encontraron resultados.")
        document.querySelector("#tabla-gastos-varios > tbody").outerHTML = html;
        document.querySelector("#tabla-gastos-varios").createTBody()
    };
};
function avanzarTablaGastosVarios(){
    document.getElementById("avanzarGastosVarios").addEventListener("click", () =>{
        if(sumaEntradasGastosVarios + 20 < cantidadFilas){
            numeronIncrementoGastosVarios += 1
            sumaEntradasGastosVarios += 20
            document.getElementById("numeracionTablaGastosVarios").value = numeronIncrementoGastosVarios
            manejoDeFechasGastos()
            tablaGastosVarios(sumaEntradasGastosVarios,
                            document.getElementById("filtro-tabla-gastosVarios-sucursal").value, 
                            document.getElementById("filtro-tabla-gastosVarios-concepto").value, 
                            document.getElementById("filtro-tabla-gastosVarios-comprobante").value, 
                            document.getElementById("filtro-tabla-gastosVarios-usuario").value,
                            inicio,
                            fin)
        };
    });
    document.getElementById("retrocederGastosVarios").addEventListener("click", () =>{
        if(sumaEntradasGastosVarios > 1){
            numeronIncrementoGastosVarios -= 1
            sumaEntradasGastosVarios -= 20
            document.getElementById("numeracionTablaGastosVarios").value = numeronIncrementoGastosVarios
            manejoDeFechasGastos()
            tablaGastosVarios(sumaEntradasGastosVarios,
                            document.getElementById("filtro-tabla-gastosVarios-sucursal").value, 
                            document.getElementById("filtro-tabla-gastosVarios-concepto").value, 
                            document.getElementById("filtro-tabla-gastosVarios-comprobante").value, 
                            document.getElementById("filtro-tabla-gastosVarios-usuario").value,
                            inicio,
                            fin)
        };
    });
};
function atajoTablaGastos(){
    document.getElementById("numeracionTablaGastosVarios").addEventListener("change", ()=>{
        manejoDeFechasGastos()
        tablaGastosVarios((document.getElementById("numeracionTablaGastosVarios").value - 1) * 20,
                        document.getElementById("filtro-tabla-gastosVarios-sucursal").value, 
                        document.getElementById("filtro-tabla-gastosVarios-concepto").value, 
                        document.getElementById("filtro-tabla-gastosVarios-comprobante").value, 
                        document.getElementById("filtro-tabla-gastosVarios-usuario").value,
                        inicio,
                        fin)
        numeronIncrementoGastosVarios = Number(document.getElementById("numeracionTablaGastosVarios").value);
        sumaEntradasGastosVarios = (document.getElementById("numeracionTablaGastosVarios").value - 1) * 20;
    });
};
document.getElementById("restablecerGastosVarios").addEventListener("click", async () => {
    document.getElementById("filtro-tabla-gastosVarios-concepto").value = ""
    document.getElementById("filtro-tabla-gastosVarios-comprobante").value = ""
    document.getElementById("filtro-tabla-gastosVarios-usuario").value = ""
    document.getElementById("filtro-tabla-gastosVarios-fecha-inicio").value = ""
    document.getElementById("filtro-tabla-gastosVarios-fecha-fin").value = ""
    document.getElementById("filtro-tabla-gastosVarios-sucursal").value = ""

    await conteoGastos(document.getElementById("filtro-tabla-gastosVarios-sucursal").value, 
                document.getElementById("filtro-tabla-gastosVarios-concepto").value, 
                document.getElementById("filtro-tabla-gastosVarios-comprobante").value, 
                document.getElementById("filtro-tabla-gastosVarios-usuario").value,
                '2000-01-01',
                new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate())
    await tablaGastosVarios(0,
                document.getElementById("filtro-tabla-gastosVarios-sucursal").value, 
                document.getElementById("filtro-tabla-gastosVarios-concepto").value, 
                document.getElementById("filtro-tabla-gastosVarios-comprobante").value, 
                document.getElementById("filtro-tabla-gastosVarios-usuario").value,
                '2000-01-01',
                new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate())
    numeronIncrementoGastosVarios = 1;
    sumaEntradasGastosVarios = 0;
});
function manejoDeFechasGastos(){
    inicio = document.getElementById("filtro-tabla-gastosVarios-fecha-inicio").value;
    fin = document.getElementById("filtro-tabla-gastosVarios-fecha-fin").value;
    if(inicio == "" && fin == ""){
        inicio = '2000-01-01';
        fin = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate()
    }else if(inicio == "" && fin != ""){
        inicio = '2000-01-01';
    }else if(inicio != "" && fin == ""){
        fin = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate();
    };
};
function filtroGastos(){
    document.getElementById("buscarFiltrosGastosVarios").addEventListener("click", async (e)=>{
        e.preventDefault();
        manejoDeFechasGastos()
        await conteoGastos(document.getElementById("filtro-tabla-gastosVarios-sucursal").value, 
                            document.getElementById("filtro-tabla-gastosVarios-concepto").value, 
                            document.getElementById("filtro-tabla-gastosVarios-comprobante").value, 
                            document.getElementById("filtro-tabla-gastosVarios-usuario").value,
                            inicio,
                            fin)
        await tablaGastosVarios(0,
                                document.getElementById("filtro-tabla-gastosVarios-sucursal").value, 
                                document.getElementById("filtro-tabla-gastosVarios-concepto").value, 
                                document.getElementById("filtro-tabla-gastosVarios-comprobante").value, 
                                document.getElementById("filtro-tabla-gastosVarios-usuario").value,
                                inicio,
                                fin)
        numeronIncrementoGastosVarios = 1;
        sumaEntradasGastosVarios = 0;
        alert(`Se obtuvieron ${cantidadFilas} registros.`)
    });
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const procesarGastos = document.getElementById("procesar-gastos");
procesarGastos.addEventListener("click", async (e) => {
    e.preventDefault();
    manejoDeFechasGastos()
    let data = {
        "sucursal_gastos": document.getElementById("sucursal-principal").value,
        "concepto": document.getElementById("concepto-gastos").value,
        "comprobante": document.getElementById("comprobante-gastos").value,
        "monto": document.getElementById("monto-gastos").value,  
        "usuario_gastos": document.getElementById("identificacion_usuario_id").textContent,   
        "fecha_gastos": fechaPrincipal
    };
    
    if(document.getElementById("concepto-gastos").value != "" &&
        document.getElementById("monto-gastos").value > 0 &&
        expregul.descripcion.test(document.getElementById("concepto-gastos").value) &&
        expregul.descripcion.test(document.getElementById("comprobante-gastos").value) &&
        expregul.precios.test(document.getElementById("monto-gastos").value)){
        let urlComprobante = URL_API_almacen_central + 'gastos_varios'
        await fetch(urlComprobante,{
            "method": 'POST',
            "body": JSON.stringify(data),
            "headers": {
                "Content-Type": 'application/json'
            }
        });
        
        document.getElementById("formulario-gastos-varios").reset()
        document.getElementById("concepto-gastos").style.background = ""
        document.getElementById("comprobante-gastos").style.background = ""
        document.getElementById("monto-gastos").style.background = ""
        
        alert("Transacción procesada.")
        if(document.querySelector("#tabla-gastos-varios > tbody").children.length === 0){
            location.reload();
        };
    }else if(document.getElementById("concepto-gastos").value == ""){
        alert("Ingrese algun concepto de gasto.")
        document.getElementById("concepto-gastos").style.background = "#b36659"
    }else if(document.getElementById("monto-gastos").value <= 0){
        alert("Ingrese un monto mayor a cero.")
        document.getElementById("monto-gastos").style.background = "#b36659"
    }else if(expregul.descripcion.test(document.getElementById("concepto-gastos").value) == false){
        document.getElementById("concepto-gastos").style.background = "#b36659"
    }else if(expregul.descripcion.test(document.getElementById("comprobante-gastos").value) == false){
        document.getElementById("comprobante-gastos").style.background = "#b36659"
    }else if(expregul.direccion.test(document.getElementById("monto-gastos").value) == false){
        alert("Ingrese datos numéricos.")
        document.getElementById("monto-gastos").style.background = "#b36659"
    };
    tablaGastosVarios((document.getElementById("numeracionTablaGastosVarios").value - 1) * 20,
                        document.getElementById("filtro-tabla-gastosVarios-sucursal").value, 
                        document.getElementById("filtro-tabla-gastosVarios-concepto").value, 
                        document.getElementById("filtro-tabla-gastosVarios-comprobante").value, 
                        document.getElementById("filtro-tabla-gastosVarios-usuario").value,
                        inicio,
                        fin)
});
