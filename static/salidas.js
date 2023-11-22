////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////SALIDAS////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", inicioSalidas)
function inicioSalidas(){
    cargarFuncionesRanking()
    inicioTablasSalidas()
    btnSalidasP = 1;
};
async function cargarFuncionesRanking(){
    await cargarTopCincoCategoriaSucursal();
    await cargarTopCincoCodigoSucursal();
}
async function inicioTablasSalidas(){
    await conteoSalidas(document.getElementById("filtro-tabla-salidas-sucursal").value, 
                        document.getElementById("filtro-tabla-salidas-categoria").value, 
                        document.getElementById("filtro-tabla-salidas-codigo").value, 
                        document.getElementById("filtro-tabla-salidas-operacion").value,
                        '2000-01-01',
                        new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate())
    await searchSalidas(document.getElementById("numeracionTablaSalidas").value - 1, "", "", "", "",
                        '2000-01-01', new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate())
    avanzarTablaSalidas()
    atajoTablaSalidas()
    filtroSalidas()
};

let sucursal_id_salidas = 0;
let numeronIncrementoSalidasTabla = 1;
let sumaSalidasTabla = 0;
let inicio = 0;
let fin = 0;
async function conteoSalidas(sucursal,categoria,codigo,comprobante,inicio,fin){
    let url = URL_API_almacen_central + `salidas_conteo?`+
                                        `sucursal_salidas=${sucursal}&`+
                                        `categoria_salidas=${categoria}&`+
                                        `codigo_salidas=${codigo}&`+
                                        `comprobante_salidas=${comprobante}&`+
                                        `fecha_inicio_salidas=${inicio}&`+
                                        `fecha_fin_salidas=${fin}`
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
    document.querySelector("#numeracionTablaSalidas").innerHTML = html
};
async function searchSalidas(num,sucursal,categoria,codigo,comprobante,inicio,fin) {
    let url = URL_API_almacen_central + `salidas_tabla/${num}?`+
                                        `sucursal_salidas=${sucursal}&`+
                                        `categoria_salidas=${categoria}&`+
                                        `codigo_salidas=${codigo}&`+
                                        `comprobante_salidas=${comprobante}&`+
                                        `fecha_inicio_salidas=${inicio}&`+
                                        `fecha_fin_salidas=${fin}`
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    salidasAlmacenCentral = await respuesta.json();
    let html = ''
    if(salidasAlmacenCentral.length > 0){
        for(sal of salidasAlmacenCentral){
            let filaSalidas = `
                    <tr class="busqueda-salidas">
                        <td class="invisible">${sal.idSal}</td>
                        <td>${sal.sucursal_nombre}</td>
                        <td>${sal.categoria_nombre}</td>
                        <td>${sal.codigo}</td>
                        <td style="text-align: end;">${sal.existencias_salidas}</td>
                        <td style="text-align: end;">${sal.existencias_devueltas}</td>
                        <td style="text-align: end;">${sal.precio_venta_salidas.toFixed(2)}</td>
                        <td style="text-align: end;">${((sal.existencias_salidas - sal.existencias_devueltas) * sal.precio_venta_salidas).toFixed(2)}</td>
                        <td>${sal.comprobante}</td>
                        <td>${sal.fecha}</td>
                        <td style="text-align: center;">
                            <span onclick="editSalidas(${sal.idSal})" style="font-size:18px;" class="material-symbols-outlined myButtonEditar">assignment_return</span>
                        </td>
                    </tr>`
            html = html + filaSalidas;
        };
        document.querySelector("#tabla-salidas > tbody").outerHTML = html;
    }else{
        alert("No se encontraron resultados.")
        document.querySelector("#tabla-salidas > tbody").outerHTML = html;
        document.querySelector("#tabla-salidas").createTBody()
    };
};

function avanzarTablaSalidas() {
    document.getElementById("avanzarSalidas").addEventListener("click", () =>{
        if(sumaSalidasTabla + 20 < cantidadFilas){
            numeronIncrementoSalidasTabla += 1
            sumaSalidasTabla += 20
            document.getElementById("numeracionTablaSalidas").value = numeronIncrementoSalidasTabla
            manejoDeFechasSalidas()
            searchSalidas(sumaSalidasTabla,
                        document.getElementById("filtro-tabla-salidas-sucursal").value, 
                        document.getElementById("filtro-tabla-salidas-categoria").value, 
                        document.getElementById("filtro-tabla-salidas-codigo").value, 
                        document.getElementById("filtro-tabla-salidas-operacion").value,
                        inicio,
                        fin)
        };
    });
    document.getElementById("retrocederSalidas").addEventListener("click", () =>{
        if(numeronIncrementoSalidasTabla > 1){
            numeronIncrementoSalidasTabla -= 1
            sumaSalidasTabla -= 20
            document.getElementById("numeracionTablaSalidas").value = numeronIncrementoSalidasTabla
            manejoDeFechasSalidas()
            searchSalidas(sumaSalidasTabla,
                        document.getElementById("filtro-tabla-salidas-sucursal").value, 
                        document.getElementById("filtro-tabla-salidas-categoria").value, 
                        document.getElementById("filtro-tabla-salidas-codigo").value, 
                        document.getElementById("filtro-tabla-salidas-operacion").value,
                        inicio,
                        fin)
        };
    });
};
function atajoTablaSalidas(){
    document.getElementById("numeracionTablaSalidas").addEventListener("change", ()=>{
        manejoDeFechasSalidas()
        searchSalidas((document.getElementById("numeracionTablaSalidas").value - 1) * 20,
                    document.getElementById("filtro-tabla-salidas-sucursal").value, 
                    document.getElementById("filtro-tabla-salidas-categoria").value, 
                    document.getElementById("filtro-tabla-salidas-codigo").value, 
                    document.getElementById("filtro-tabla-salidas-operacion").value,
                    inicio,
                    fin)
        numeronIncrementoSalidasTabla = Number(document.getElementById("numeracionTablaSalidas").value);
        sumaSalidasTabla = (document.getElementById("numeracionTablaSalidas").value - 1) * 20;
    });
};
document.getElementById("restablecerSalidas").addEventListener("click", async () =>{
    document.getElementById("filtro-tabla-salidas-sucursal").value = ""
    document.getElementById("filtro-tabla-salidas-categoria").value = ""
    document.getElementById("filtro-tabla-salidas-codigo").value = ""
    document.getElementById("filtro-tabla-salidas-operacion").value = ""
    document.getElementById("filtro-tabla-salidas-fecha-inicio").value = ""
    document.getElementById("filtro-tabla-salidas-fecha-fin").value = ""

    await conteoSalidas(document.getElementById("filtro-tabla-salidas-sucursal").value, 
                document.getElementById("filtro-tabla-salidas-categoria").value, 
                document.getElementById("filtro-tabla-salidas-codigo").value, 
                document.getElementById("filtro-tabla-salidas-operacion").value,
                '2000-01-01',
                new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate())
    await searchSalidas(0,
                document.getElementById("filtro-tabla-salidas-sucursal").value,
                document.getElementById("filtro-tabla-salidas-categoria").value,
                document.getElementById("filtro-tabla-salidas-codigo").value,
                document.getElementById("filtro-tabla-salidas-operacion").value,
                '2000-01-01', 
                new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate())
    numeronIncrementoSalidasTabla = 1;
    sumaSalidasTabla = 0;
});
function manejoDeFechasSalidas(){
    inicio = document.getElementById("filtro-tabla-salidas-fecha-inicio").value;
    fin = document.getElementById("filtro-tabla-salidas-fecha-fin").value;
    if(inicio == "" && fin == ""){
        inicio = '2000-01-01';
        fin = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate()
    }else if(inicio == "" && fin != ""){
        inicio = '2000-01-01';
    }else if(inicio != "" && fin == ""){
        fin = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate();
    };
};
function filtroSalidas(){
    document.getElementById("buscarFiltrosSalidas").addEventListener("click", async (e)=>{
        e.preventDefault();
        manejoDeFechasSalidas()
        await conteoSalidas(document.getElementById("filtro-tabla-salidas-sucursal").value, 
                    document.getElementById("filtro-tabla-salidas-categoria").value, 
                    document.getElementById("filtro-tabla-salidas-codigo").value, 
                    document.getElementById("filtro-tabla-salidas-operacion").value,
                    inicio,
                    fin)
        await searchSalidas(0,
                    document.getElementById("filtro-tabla-salidas-sucursal").value, 
                    document.getElementById("filtro-tabla-salidas-categoria").value, 
                    document.getElementById("filtro-tabla-salidas-codigo").value, 
                    document.getElementById("filtro-tabla-salidas-operacion").value,
                    inicio,
                    fin)
        numeronIncrementoSalidasTabla = 1;
        sumaSalidasTabla = 0;
        alert(`Se obtuvieron ${cantidadFilas} registros.`)
    });
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let salidas_Id = "";
let producto_Id_salidas = "";
let indice_sucursal_salidas = 0;
function editSalidas(id) {
    let salidas = salidasAlmacenCentral.find(x => x.idSal == id)
    if(salidas.comprobante.startsWith("Venta")){
        accionDevolucionSalidas();
        if(salidas.sucursal_nombre == document.querySelector("#sucursal-principal").children[0].textContent){
            indice_sucursal_salidas = 0
            sucursal_id_salidas = document.querySelector("#sucursal-principal")[0].value
        }else if(salidas.sucursal_nombre == document.querySelector("#sucursal-principal").children[1].textContent){
            indice_sucursal_salidas = 1
            sucursal_id_salidas = document.querySelector("#sucursal-principal")[1].value
        }else if(salidas.sucursal_nombre == document.querySelector("#sucursal-principal").children[2].textContent){
            indice_sucursal_salidas = 2
            sucursal_id_salidas = document.querySelector("#sucursal-principal")[2].value
        }else if(salidas.sucursal_nombre == document.querySelector("#sucursal-principal").children[3].textContent){
            indice_sucursal_salidas = 3
            sucursal_id_salidas = document.querySelector("#sucursal-principal")[3].value
        };
        document.getElementById('accion_id_salidas').value = salidas.idSal
        document.getElementById('accion_comprobante_salidas').value = salidas.comprobante
        document.getElementById('accion_sucursal_salidas').value = salidas.sucursal_nombre
        document.getElementById('accion_codigo').textContent = "Devolución: " + salidas.codigo;
        document.getElementById('accion_existencias_salidas').value = salidas.existencias_salidas
        document.getElementById('accion_existencias_devueltas_salidas').value = salidas.existencias_devueltas
        document.getElementById('accion_precio_venta_salidas').value = salidas.precio_venta_salidas
        cargarDatosSalidasId(salidas.idSal)
        document.getElementById("accion_editar_salidas").focus()
        document.getElementById("acciones_rapidas_salidas").classList.add("modal-show-salida")
    }else{
        alert("No es una venta.")
    };
    
};
function accionDevolucionSalidas(){
    let formularioDevolucionesSalidas = `
                                        <div id="form_accion_rapida_salidas" class="nuevo-contenedor-box">
                                            <form action="" class="formulario-general fondo">
                                                <h2 id="accion_codigo"></h2>
                                                <input id="accion_id_salidas" class="input-general fondo invisible" type="text" disabled>
                                                <input id="accion_id_productos" class="input-general fondo invisible" type="text" disabled>
                                                <label class="label-general">Comprobante<input id="accion_comprobante_salidas" class="input-general fondo" type="text" disabled></label>
                                                <label class="label-general">Sucursal de Origen<input id="accion_sucursal_salidas" class="input-general fondo" type="text" disabled></label>
                                                <label class="label-general">Unidades Adquiridas<input id="accion_existencias_salidas" class="input-general fondo" type="text" disabled></label>
                                                <label class="label-general">Unidades Devueltas<input id="accion_existencias_devueltas_salidas" class="input-general fondo" type="text" disabled></label>
                                                <label class="label-general">Existencias en Stock<input id="accion_existencias_productos_salidas" class="input-general fondo" type="text" disabled></label>
                                                <label class="label-general">Unidades a Devolver<input id="accion_editar_salidas" class="input-general-importante fondo-importante" type="text"></label>
                                                <label class="label-general">Saldo en Devoluciones<input id="accion_saldo_devolucion_salidas" class="input-general fondo" type="text" disabled></label>
                                                <label class="label-general">Saldo en Productos<input id="accion_saldo_productos_salidas" class="input-general fondo" type="text" disabled></label>
                                                <label class="label-general">Causa de Devolución
                                                    <select id="accion_causa_devolucion_salidas" class="input-general-importante fondo-importante">
                                                        <option value = "1">Producto defectuoso</option>
                                                        <option value = "2">Producto dañado durante el envío</option>
                                                        <option value = "3">Producto incorrecto o equivocado</option>
                                                        <option value = "4">Talla o ajuste incorrecto</option>
                                                        <option value = "5">Insatisfacción con el producto</option>
                                                        <option value = "6">Cambio por otro producto</option>
                                                        <option value = "7">Cancelación del pedido</option>
                                                        <option value = "8">Entrega retrasada</option>
                                                    </select>
                                                </label>
                                                <input id="accion_existencias_ac_productos" class="input-general fondo invisible" type="text" disabled>
                                                <input id="accion_existencias_su_productos" class="input-general fondo invisible" type="text" disabled>
                                                <input id="accion_existencias_sd_productos" class="input-general fondo invisible" type="text" disabled>
                                                <input id="accion_existencias_st_productos" class="input-general fondo invisible" type="text" disabled>
                                                <input id="accion_precio_venta_salidas" class="input-general fondo invisible" type="text" disabled>
                                                <button id="accion_procesar_devolucion_salidas" class="myButtonAgregar">Procesar Devolución</button>
                                                <button id="remover_accion_rapida_salidas" class="myButtonEliminar">Cancelar</button>
                                            </form>
                                        </div>
                                        `;
    document.getElementById("acciones_rapidas_salidas").innerHTML = formularioDevolucionesSalidas;
    removerAccionRapidaSalidas()
    let editar = document.getElementById("accion_editar_salidas");
    editar.addEventListener("keyup", (event)=>{
        document.getElementById("accion_saldo_devolucion_salidas").value = Number(event.target.value) + Number(document.getElementById("accion_existencias_devueltas_salidas").value)
        document.getElementById("accion_saldo_productos_salidas").value = Number(document.getElementById("accion_existencias_productos_salidas").value) + Number(event.target.value)
    });
    const procesarDevolucionesSalidasUno = document.getElementById("accion_procesar_devolucion_salidas");
    procesarDevolucionesSalidasUno.addEventListener("click", procesamientoSalidasDevoluciones)
};
async function cargarDatosSalidasId(id){
    let url = URL_API_almacen_central + 'salidas/' + id
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    salidas_Id = await respuesta.json();
    cargarDatosProductosIdSalidas(salidas_Id.idProd)
};
async function cargarDatosProductosIdSalidas(id){
    let url = URL_API_almacen_central + 'almacen_central/' + id
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    producto_Id_salidas = await respuesta.json();
    document.getElementById('accion_id_productos').value = producto_Id_salidas.idProd
    if(document.getElementById('accion_sucursal_salidas').value === "Almacén Central"){
        document.getElementById('accion_existencias_productos_salidas').value = producto_Id_salidas.existencias_ac
    }else if(document.getElementById('accion_sucursal_salidas').value === "Sucursal Uno"){
        document.getElementById('accion_existencias_productos_salidas').value = producto_Id_salidas.existencias_su
    }else if(document.getElementById('accion_sucursal_salidas').value === "Sucursal Dos"){
        document.getElementById('accion_existencias_productos_salidas').value = producto_Id_salidas.existencias_sd
    }else if(document.getElementById('accion_sucursal_salidas').value === "Sucursal Tres"){
        document.getElementById('accion_existencias_productos_salidas').value = producto_Id_salidas.existencias_st
    };
    document.getElementById('accion_existencias_ac_productos').value = producto_Id_salidas.existencias_ac
    document.getElementById('accion_existencias_su_productos').value = producto_Id_salidas.existencias_su
    document.getElementById('accion_existencias_sd_productos').value = producto_Id_salidas.existencias_sd
    document.getElementById('accion_existencias_st_productos').value = producto_Id_salidas.existencias_st
    
}
function removerAccionRapidaSalidas(){
    let remover = document.getElementById("remover_accion_rapida_salidas");
    remover.addEventListener("click", (e)=>{
        e.preventDefault();
        document.getElementById("form_accion_rapida_salidas").remove()
        document.getElementById("acciones_rapidas_salidas").classList.remove("modal-show-salida")
    });
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


async function procesamientoSalidasDevoluciones(e){
    e.preventDefault();
    manejoDeFechasSalidas()
    if(Number(document.getElementById("accion_editar_salidas").value) > 0 && 
    (Number(document.getElementById("accion_existencias_salidas").value) >= Number(document.getElementById("accion_saldo_devolucion_salidas").value))/*  &&
    Number(document.getElementById("accion_existencias_productos_salidas").value) > 0 */){
        try{
            await funcionAccionDevolucionProductosS()
            await searchSalidas((document.getElementById("numeracionTablaSalidas").value - 1) * 20,
                                document.getElementById("filtro-tabla-salidas-sucursal").value, 
                                document.getElementById("filtro-tabla-salidas-categoria").value, 
                                document.getElementById("filtro-tabla-salidas-codigo").value, 
                                document.getElementById("filtro-tabla-salidas-operacion").value,
                                inicio,
                                fin)
        }catch(error){
            alert("Ocurrió un error. " + error);
            console.error("Ocurrió un error. ", error)
        };
    }else if(Number(document.getElementById("accion_editar_salidas").value) <= 0){
        alert("Las unidades a devolver deben ser mayores a cero.")
    }else if(Number(document.getElementById("accion_existencias_salidas").value) < Number(document.getElementById("accion_saldo_devolucion_salidas").value)){
        alert("Las unidades a devolver no deben ser mayores a las unidades en existencia.")
    }/* else if(Number(document.getElementById("accion_existencias_productos_salidas").value) <= 0){
        alert("El stock en inventario es cero.")
    } */
    
};
async function funcionAccionDevolucionProductosS(){
    function EnviarDevolucionAProductos(){
        this.idProd = document.getElementById("accion_id_productos").value;
        this.sucursal_post = sucursales_activas[indice_sucursal_salidas];
        this.existencias_post = document.getElementById("accion_saldo_productos_salidas").value;
    };
    let filaProducto = new EnviarDevolucionAProductos();
    let url = URL_API_almacen_central + 'almacen_central_operacion'
    let response = await funcionFetch(url, filaProducto)
    console.log("Respuesta Productos "+response.status)
    if(response.status === 200){
        await funcionAccionDevolucionSalidasUno()
    }else{
        alert(`Ocurrió un problema Productos`)
    };
};
async function funcionAccionDevolucionSalidasUno(){
    function EnviarASalidas(){
        this.idSal = document.getElementById('accion_id_salidas').value;
        this.precio_venta_salidas = document.getElementById('accion_precio_venta_salidas').value;
        this.existencias_salidas = document.getElementById('accion_existencias_salidas').value;
        this.existencias_devueltas = document.getElementById("accion_saldo_devolucion_salidas").value;
    };
    let filaUnoSalidas = new EnviarASalidas();
    let urlSalidas = URL_API_almacen_central + 'salidas'
    let response = await funcionFetch(urlSalidas, filaUnoSalidas)
    console.log("Respuesta Salidas Uno "+response.status)
    if(response.status === 200){
        await funcionAccionDevolucionSalidasDos()
    }else{
        alert(`Ocurrió un problema Salidas Uno`)
    };
};
async function funcionAccionDevolucionSalidasDos(){
    function EnviarASalidasNuevaFila(){
        this.idProd = document.getElementById("accion_id_productos").value;
        this.cliente = 1;
        this.comprobante = "Dev-" + document.getElementById("accion_comprobante_salidas").value;
        this.causa_devolucion = document.getElementById("accion_causa_devolucion_salidas").value;
        this.fecha = fechaPrincipal;
        this.precio_venta_salidas = document.getElementById("accion_precio_venta_salidas").value;
        this.sucursal = sucursal_id_salidas;
        this.existencias_salidas = 0;
        this.existencias_devueltas = document.getElementById("accion_editar_salidas").value;
        this.usuario = document.getElementById("identificacion_usuario_id").textContent;
    };
    let filaDosSalidas = new EnviarASalidasNuevaFila();
    let urlSalidasdos = URL_API_almacen_central + 'salidas'
    let response = await funcionFetch(urlSalidasdos, filaDosSalidas)
    console.log("Respuesta Salidas Dos "+response.status)
    if(response.status === 200){
        await obteniendoDatosDeVentaUno()
    }else{
        alert(`Ocurrió un problema Salidas Dos`)
    };
};
async function obteniendoDatosDeVentaUno(){
    let comprobacionIdDetalleVentas = 0;
    let modoEfectivo = 0;
    let modoTarjeta = 0;
    let modoECredito = 0;
    let modoPerdidaS = 0;
    await cargarDetalleVentasComprobanteUno(document.getElementById("accion_comprobante_salidas").value)
    detVentasComprobante.forEach((event) =>{
            comprobacionIdDetalleVentas = event.id_det_ventas;
            modoEfectivo = event.modo_efectivo
            modoTarjeta = event.modo_tarjeta
            modoECredito = event.modo_credito
            modoPerdidaS = event.modo_perdida
    });
    
    modoPerdidaS = modoPerdidaS + (Number(document.getElementById("accion_editar_salidas").value) * 
                    Number(document.getElementById("accion_precio_venta_salidas").value))
    let metodoPago = {
        "id_det_ventas": comprobacionIdDetalleVentas,
        "modo_efectivo": Number(modoEfectivo),
        "modo_credito": Number(modoECredito),
        "modo_tarjeta": Number(modoTarjeta),
        "modo_perdida": Number(modoPerdidaS),
        "total_venta": (Number(modoEfectivo) + Number(modoTarjeta) + Number(modoECredito)) - Number(modoPerdidaS)
    };
    let urlMetodoDePago = URL_API_almacen_central + 'ventas'
    let response = await funcionFetch(urlMetodoDePago, metodoPago);
    console.log("Respuesta Obtención datos "+response.status)
    if(response.status === 200){
        await funcionAccionGastosVariosS()
    }else{
        alert(`Ocurrió un problema Obtención datos`)
    };
};
async function funcionAccionGastosVariosS(){
    let dataGastosVarios = {
        "sucursal_gastos": sucursal_id_salidas,
        "concepto": "Devolución",
        "comprobante": document.getElementById("accion_comprobante_salidas").value,
        "monto": Number(document.getElementById("accion_editar_salidas").value) * 
                Number(document.getElementById("accion_precio_venta_salidas").value),  
        "usuario_gastos": document.getElementById("identificacion_usuario_id").textContent,   
        "fecha_gastos": fechaPrincipal
    };
    let urlGastosVarios = URL_API_almacen_central + 'gastos_varios'
    let response = await funcionFetch(urlGastosVarios, dataGastosVarios)
    console.log("Respuesta Gastos "+response.status)
    if(response.status === 200){
        alert("Operación completada exitosamente.")
        document.getElementById("acciones_rapidas_salidas").classList.remove("modal-show-salida")
    }else{
        alert(`Ocurrió un problema Gastos`)
    };
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////GRÁFICOS/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let colorFondoBarra = ["#E6CA7B","#91E69C","#6380E6","#E66E8D"];


function GraficoRankingCategoria(numSucural, colorRanking, columnaRanking, fechaRanking){
    
    let categoria_datos = [];
    let categoria_nombres = [];
    let array_datos = [];
    let array_nombres = [];
    let alto = 0;
    let coloresRanking = ["#E6CA7B","#91E69C","#428499","#6380E6","#E66E8D"]
    
    document.querySelectorAll(colorRanking).forEach((event, i)=>{
        event.style.width = "20px"
        event.style.height = "10px"
        event.style.background = coloresRanking[i]
    });
    for(let i = 0; i < 12; i++){
        let conteo = 0;
        array_datos = [0,0,0,0,0]
        array_nombres = ["","","","",""]
        categoria_datos.push(0)
        categoria_nombres.push(0)
        cincoCategorias.forEach((event, j)=>{
            if(event.mes == i + 1 && event.sucursal == numSucural && conteo < 5){
                array_datos[conteo] = event.suma_ventas;
                array_nombres[conteo] = event.categoria_nombre;
                conteo +=1;
            };
        });
        categoria_datos[i]=array_datos
        categoria_nombres[i]=array_nombres
        categoria_datos.forEach((event)=>{
            let suma = 0;
            event.forEach((e)=>{
                suma +=e
            });
            if(alto < suma){
                alto = suma
            };
            
        });
        array_datos = []
        array_nombres = []
    };
    rankingColumna(categoria_datos, categoria_nombres, alto, columnaRanking, fechaRanking, arregloMeses, coloresRanking)
};
function GraficoRankingCodigo(numSucural, colorRanking, columnaRanking, fechaRanking){
    
    let codigo_datos = [];
    let codigo_nombres = [];
    let array_datos = [];
    let array_nombres = [];
    let alto = 0;
    let coloresRanking = ["#E6CA7B","#91E69C","#428499","#6380E6","#E66E8D"]
    
    document.querySelectorAll(colorRanking).forEach((event, i)=>{
        event.style.width = "20px"
        event.style.height = "10px"
        event.style.background = coloresRanking[i]
    });
    for(let i = 0; i < 12; i++){
        let conteo = 0;
        array_datos = [0,0,0,0,0]
        array_nombres = ["","","","",""]
        codigo_datos.push(0)
        codigo_nombres.push(0)
        cincoCodigos.forEach((event, j)=>{
            if(event.mes == i + 1 && event.sucursal == numSucural && conteo < 5){
                array_datos[conteo] = event.suma_ventas;
                array_nombres[conteo] = event.codigo;
                conteo +=1;
            };
        });
        codigo_datos[i]=array_datos
        codigo_nombres[i]=array_nombres
        codigo_datos.forEach((event)=>{
            let suma = 0;
            event.forEach((e)=>{
                suma +=e
            });
            if(alto < suma){
                alto = suma
            };
            
        });
        array_datos = []
        array_nombres = []
    };
    rankingColumna(codigo_datos, codigo_nombres, alto,columnaRanking, fechaRanking, arregloMeses, coloresRanking)
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function cargarTopCincoCategoriaSucursal(){
    let url = URL_API_almacen_central + 'salidas_top_cinco_categorias_sucursal'
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    cincoCategorias = await respuesta.json();
};
async function cargarTopCincoCodigoSucursal(){
    let url = URL_API_almacen_central + 'salidas_top_cinco_codigos_sucursal'
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    cincoCodigos = await respuesta.json();
};
async function cargarDetalleVentasComprobanteUno(comprobante){
    let url = URL_API_almacen_central + `ventas_comprobante/${comprobante}`
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    detVentasComprobante = await respuesta.json();
};
//////////////BOTONES//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

document.querySelectorAll(".b_g_s_r").forEach((event, i)=>{
    event.addEventListener("click", (e)=>{
        document.querySelectorAll(".b_g_s_r")[0].classList.remove("marcaBoton")
        document.querySelectorAll(".b_g_s_r")[1].classList.remove("marcaBoton")
        document.querySelectorAll(".b_g_s_r")[2].classList.remove("marcaBoton")
        document.querySelectorAll(".b_g_s_r")[3].classList.remove("marcaBoton")
        let valor_sucursal_principal = document.getElementById("sucursal-principal").children
        if(i === 0){
            componenteGraficoRankingSalidas("color_ranking_categoria_uno", "columna_ranking_categoria_uno", "ranking_fecha_categoria_uno", "color_ranking_codigo_uno", "columna_ranking_codigo_uno", "ranking_fecha_codigo_uno")
            document.querySelector(".contenedor_ranking").classList.add("alta_opacidad")
            event.classList.add("marcaBoton")
            GraficoRankingCategoria(valor_sucursal_principal[0].value, ".color_ranking_categoria_uno", ".columna_ranking_categoria_uno", ".ranking_fecha_categoria_uno")
            GraficoRankingCodigo(valor_sucursal_principal[0].value, ".color_ranking_codigo_uno", ".columna_ranking_codigo_uno", ".ranking_fecha_codigo_uno")
        }else if(i === 1){
            componenteGraficoRankingSalidas("color_ranking_categoria_dos", "columna_ranking_categoria_dos", "ranking_fecha_categoria_dos", "color_ranking_codigo_dos", "columna_ranking_codigo_dos", "ranking_fecha_codigo_dos")
            document.querySelector(".contenedor_ranking").classList.add("alta_opacidad")
            event.classList.add("marcaBoton")
            GraficoRankingCategoria(valor_sucursal_principal[1].value, ".color_ranking_categoria_dos", ".columna_ranking_categoria_dos", ".ranking_fecha_categoria_dos")
            GraficoRankingCodigo(valor_sucursal_principal[1].value, ".color_ranking_codigo_dos", ".columna_ranking_codigo_dos", ".ranking_fecha_codigo_dos")

        }else if(i === 2){
            componenteGraficoRankingSalidas("color_ranking_categoria_tres", "columna_ranking_categoria_tres", "ranking_fecha_categoria_tres", "color_ranking_codigo_tres", "columna_ranking_codigo_tres", "ranking_fecha_codigo_tres")
            document.querySelector(".contenedor_ranking").classList.add("alta_opacidad")
            event.classList.add("marcaBoton")
            GraficoRankingCategoria(valor_sucursal_principal[2].value, ".color_ranking_categoria_tres", ".columna_ranking_categoria_tres", ".ranking_fecha_categoria_tres")
            GraficoRankingCodigo(valor_sucursal_principal[2].value, ".color_ranking_codigo_tres", ".columna_ranking_codigo_tres", ".ranking_fecha_codigo_tres")

        }else if(i === 3){
            componenteGraficoRankingSalidas("color_ranking_categoria_cuatro", "columna_ranking_categoria_cuatro", "ranking_fecha_categoria_cuatro", "color_ranking_codigo_cuatro", "columna_ranking_codigo_cuatro", "ranking_fecha_codigo_cuatro")
            document.querySelector(".contenedor_ranking").classList.add("alta_opacidad")
            event.classList.add("marcaBoton")
            GraficoRankingCategoria(valor_sucursal_principal[3].value, ".color_ranking_categoria_cuatro", ".columna_ranking_categoria_cuatro", ".ranking_fecha_categoria_cuatro")
            GraficoRankingCodigo(valor_sucursal_principal[3].value, ".color_ranking_codigo_cuatro", ".columna_ranking_codigo_cuatro", ".ranking_fecha_codigo_cuatro")

        };
    })
});
function componenteGraficoRankingSalidas(leyenda_cat, columna_cat, fecha_cat, leyenda_cod, columna_cod, fecha_cod){
    let comp_graf_ran_sal = `<div class="contenedor_ranking baja_opacidad">
                                <div>
                                    <h4>Ranking Cinco Categorías con Mayores Ventas</h4>
                                    <div class="leyenda_ranking">
                                        <div><div class=${leyenda_cat}></div><span>1° Puesto</span></div>
                                        <div><div class=${leyenda_cat}></div><span>2° Puesto</span></div>
                                        <div><div class=${leyenda_cat}></div><span>3° Puesto</span></div>
                                        <div><div class=${leyenda_cat}></div><span>4° Puesto</span></div>
                                        <div><div class=${leyenda_cat}></div><span>5° Puesto</span></div>
                                    </div>
                                    <div class="grafico_ranking">
                                            <columna-ranking f_r=${fecha_cat} r_c=${columna_cat}></columna-ranking>
                                            <columna-ranking f_r=${fecha_cat} r_c=${columna_cat}></columna-ranking>
                                            <columna-ranking f_r=${fecha_cat} r_c=${columna_cat}></columna-ranking>
                                            <columna-ranking f_r=${fecha_cat} r_c=${columna_cat}></columna-ranking>
                                            <columna-ranking f_r=${fecha_cat} r_c=${columna_cat}></columna-ranking>
                                            <columna-ranking f_r=${fecha_cat} r_c=${columna_cat}></columna-ranking>
                                            <columna-ranking f_r=${fecha_cat} r_c=${columna_cat}></columna-ranking>
                                            <columna-ranking f_r=${fecha_cat} r_c=${columna_cat}></columna-ranking>
                                            <columna-ranking f_r=${fecha_cat} r_c=${columna_cat}></columna-ranking>
                                            <columna-ranking f_r=${fecha_cat} r_c=${columna_cat}></columna-ranking>
                                            <columna-ranking f_r=${fecha_cat} r_c=${columna_cat}></columna-ranking>
                                            <columna-ranking f_r=${fecha_cat} r_c=${columna_cat}></columna-ranking>
                                    </div>
                                </div>
                                <div>
                                    <h4>Ranking Cinco Códigos con Mayores Ventas</h4>
                                    <div class="leyenda_ranking">
                                        <div><div class=${leyenda_cod}></div><span>1° Puesto</span></div>
                                        <div><div class=${leyenda_cod}></div><span>2° Puesto</span></div>
                                        <div><div class=${leyenda_cod}></div><span>3° Puesto</span></div>
                                        <div><div class=${leyenda_cod}></div><span>4° Puesto</span></div>
                                        <div><div class=${leyenda_cod}></div><span>5° Puesto</span></div>
                                    </div>
                                    <div class="grafico_ranking">
                                            <columna-ranking f_r=${fecha_cod} r_c=${columna_cod}></columna-ranking>
                                            <columna-ranking f_r=${fecha_cod} r_c=${columna_cod}></columna-ranking>
                                            <columna-ranking f_r=${fecha_cod} r_c=${columna_cod}></columna-ranking>
                                            <columna-ranking f_r=${fecha_cod} r_c=${columna_cod}></columna-ranking>
                                            <columna-ranking f_r=${fecha_cod} r_c=${columna_cod}></columna-ranking>
                                            <columna-ranking f_r=${fecha_cod} r_c=${columna_cod}></columna-ranking>
                                            <columna-ranking f_r=${fecha_cod} r_c=${columna_cod}></columna-ranking>
                                            <columna-ranking f_r=${fecha_cod} r_c=${columna_cod}></columna-ranking>
                                            <columna-ranking f_r=${fecha_cod} r_c=${columna_cod}></columna-ranking>
                                            <columna-ranking f_r=${fecha_cod} r_c=${columna_cod}></columna-ranking>
                                            <columna-ranking f_r=${fecha_cod} r_c=${columna_cod}></columna-ranking>
                                            <columna-ranking f_r=${fecha_cod} r_c=${columna_cod}></columna-ranking>
                                    </div>
                                </div>
                            </div>`;
    document.querySelector(".contenedor_graficos_sucursales").innerHTML = comp_graf_ran_sal;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////REPORTES////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
document.getElementById("reporte_ventas").addEventListener("click", async ()=>{
    manejoDeFechasSalidas()
    let sum_ef = 0;
    let sum_ta = 0;
    let sum_cr = 0;
    let sum_de = 0;
    let sum_to = 0;
    let sum_canal = 0;
    let url = URL_API_almacen_central + `ventas_tabla_reporte?`+
                                        `fecha_inicio_det_venta=${inicio}&`+
                                        `fecha_fin_det_venta=${fin}`
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    let reporte_detalle_ventas = await respuesta.json();

    let url_dos = URL_API_almacen_central + `salidas_tabla_reporte?`+
                                        `comprobante_salidas=Venta&`+
                                        `fecha_inicio_salidas=${inicio}&`+
                                        `fecha_fin_salidas=${fin}`
    let respuesta_dos  = await fetch(url_dos, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    let reporte_salidas = await respuesta_dos.json();

    let reporteHTML = `<style>
                            body{
                                display: grid;
                                align-items: center;
                                align-content: space-between;
                                justify-content: center;
                                gap: 20px;
                            }
                            td, th{
                                border: 1px solid black;
                            }
                            .titulo_resporte{
                                display: grid;
                                justify-items: center;
                            }
                        </style>
                        <div class="titulo_resporte">
                            <h2>Reporte de Ventas</h2>
                            <h3>Fecha de reporte: ${inicio} a ${fin}</h3>
                        </div>
                        <table id="tabla_reportes">
                            <thead>
                                <tr>
                                    <th scope="row" colspan="16"><h2>Consolidado modo de pago</h2></th>
                                </tr>
                                <tr>
                                    <th>Sucursal</th>
                                    <th>Efectivo</th>
                                    <th>Tárjeta</th>
                                    <th>Crédito</th>
                                    <th>Devoluciones</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>`

    for(repor of reporte_detalle_ventas){
        let row = `
                <tr>
                    <td>${repor.sucursal_nombre}</td>
                    <td style="text-align: end;">${repor.suma_efectivo.toFixed(2)}</td>
                    <td style="text-align: end;">${repor.suma_tarjeta.toFixed(2)}</td>
                    <td style="text-align: end;">${repor.suma_credito.toFixed(2)}</td>
                    <td style="text-align: end;">${repor.suma_perdida.toFixed(2)}</td>
                    <td style="text-align: end;">${(repor.suma_credito+
                                                    repor.suma_efectivo-
                                                    repor.suma_perdida+
                                                    repor.suma_tarjeta).toFixed(2)}</td>
                </tr>`
        reporteHTML = reporteHTML + row;
        sum_ef += repor.suma_efectivo
        sum_ta += repor.suma_credito
        sum_cr += repor.suma_tarjeta
        sum_de += repor.suma_perdida
    };                    
    sum_to = sum_ef + sum_ta + sum_cr - sum_de         
    reporteHTML += `
                            
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th style="text-align: end;"></th>
                                    <th style="text-align: end;"></th>
                                    <th style="text-align: end;"></th>
                                    <th style="text-align: end;"></th>
                                    <th style="text-align: end;"></th>
                                    <th style="text-align: end;"></th>
                                </tr>
                            </tfoot>
                        </table>

                        <table id="tabla_salidas">
                            <thead>
                                <tr>
                                    <th scope="row" colspan="16"><h2>Detalle de operaciones</h2></th>
                                </tr>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Sucursal</th>
                                    <th>Código</th>
                                    <th>Descripción</th>
                                    <th>Comprobantes</th>
                                    <th>Unidades</th>
                                    <th>Monto</th>
                                </tr>
                            </thead>
                            <tbody>`
    for(sal of reporte_salidas){
        let fila = `
                    <tr>
                        <td>${sal.fecha}</td>
                        <td>${sal.sucursal_nombre}</td>
                        <td>${sal.codigo}</td>
                        <td>${sal.descripcion}</td>
                        <td>${sal.comprobante}</td>
                        <td style="text-align: end;">${sal.existencias_salidas}</td>
                        <td style="text-align: end;">${(sal.existencias_salidas * sal.precio_venta_salidas).toFixed(2)}</td>
                    </tr>`
        reporteHTML = reporteHTML + fila; 
    }                        
                            
    reporteHTML += `
                            </tbody>
                        </table>
                        <div>
                            <button class="imprimir_reporte_salidas">Imprimir</button>
                        </div>
                        <script>
                            document.querySelector("#tabla_reportes > tfoot").children[0].children[0].textContent = "Total";
                            document.querySelector("#tabla_reportes > tfoot").children[0].children[1].textContent = ${sum_ef.toFixed(2)};
                            document.querySelector("#tabla_reportes > tfoot").children[0].children[2].textContent = ${sum_ta.toFixed(2)};
                            document.querySelector("#tabla_reportes > tfoot").children[0].children[3].textContent = ${sum_cr.toFixed(2)};
                            document.querySelector("#tabla_reportes > tfoot").children[0].children[4].textContent = ${sum_de.toFixed(2)};
                            document.querySelector("#tabla_reportes > tfoot").children[0].children[5].textContent = ${sum_to.toFixed(2)};

                            document.querySelector(".imprimir_reporte_salidas").addEventListener("click", (event) => {
                                event.preventDefault()
                                window.print()
                            });
                        </script>`
    

    let nuevaVentana = window.open('');
    nuevaVentana.document.write(reporteHTML);
});
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////

