////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////PRODUCTOS///////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", inicioProductos)
function inicioProductos(){
    inicioTablasProductos()
    btnProductos = 1;
    cambioSucursalProductos()
};
async function inicioTablasProductos(){
    /* await conteoProductos() */
    await conteoProductos(document.getElementById("filtro-tabla-productos-categoria").value, 
                        document.getElementById("filtro-tabla-productos-codigo").value, 
                        document.getElementById("filtro-tabla-productos-descripcion").value, 
                        document.getElementById("filtro-tabla-productos-proveedor").value)
    await searchAlmacenCentral(document.getElementById("numeracionTabla").value - 1, "", "", "", "")
    avanzarTablaProductos()
    atajoTablaProductos()
    filtroProductos()
};
/* function setAttributeDisableEnFormDeIngreso(){
    document.querySelectorAll("#formPaginaProductos .contenedor-label-input-compras input").forEach((event) =>{
        event.setAttribute("disabled", "true")
    });
}; */
let sucursal_id_productos = 0;
let sucursal_indice_productos = 0;
let cantidadFilas = 0;
let numeronIncremento = 1;
let suma = 0;
async function conteoProductos(categoria, codigo, descripcion, proveedor){
    let url = URL_API_almacen_central + `almacen_central_conteo?`+
                                        `categoria_producto=${categoria}&`+
                                        `codigo_producto=${codigo}&`+
                                        `descripcion_producto=${descripcion}&`+
                                        `proveedor_producto=${proveedor}`
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
    document.querySelector("#numeracionTabla").innerHTML = html
};
async function searchAlmacenCentral(num, categoria, codigo, descripcion, proveedor) {
    let url = URL_API_almacen_central + `almacen_central_tabla/${num}?`+
                                        `categoria_producto=${categoria}&`+
                                        `codigo_producto=${codigo}&`+
                                        `descripcion_producto=${descripcion}&`+
                                        `proveedor_producto=${proveedor}`
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    });
    productosAlmacenCentral = await respuesta.json();
    let html = ''
    if(productosAlmacenCentral.length > 0){
        for (almacenCentral of productosAlmacenCentral) {
            let row = `
                    <tr class="busqueda-producto">
                        <td class="invisible">${almacenCentral.idProd}</td>
                        <td>${almacenCentral.categoria_nombre}</td>
                        <td>${almacenCentral.codigo}</td>
                        <td>${almacenCentral.descripcion}</td>
                        <td>${almacenCentral.talla}</td>
                        <td style="text-align: end;">${almacenCentral.existencias_ac}</td>
                        <td style="text-align: end;">${almacenCentral.existencias_su}</td>
                        <td style="text-align: end;">${almacenCentral.existencias_sd}</td>
                        <td style="text-align: end;">${almacenCentral.existencias_st}</td>
                        <td style="text-align: end;">${almacenCentral.costo_unitario.toFixed(2)}</td>
                        <td style="text-align: end;">${((almacenCentral.existencias_ac + 
                                                        almacenCentral.existencias_su + almacenCentral.existencias_sd + 
                                                        almacenCentral.existencias_st)*almacenCentral.costo_unitario).toFixed(2)}</td>
                        <td style="text-align: end;">${almacenCentral.precio_venta.toFixed(2)}</td>
                        <td style="text-align: end;">${almacenCentral.lote}</td>
                        <td style="width: 100px;">${almacenCentral.nombre_cli}</td>
                        <td style="width: 160px;">
                            <span onclick="editAlmacenCentral(${almacenCentral.idProd})" style="font-size:18px;" class="material-symbols-outlined myButtonEditar">print</span>
                            <span onclick="accion_recompras(${almacenCentral.idProd})" style="font-size:18px;" class="material-symbols-outlined myButtonEditar">shopping_cart</span>
                            <span onclick="accion_transferencias(${almacenCentral.idProd})" style="font-size:18px;" class="material-symbols-outlined myButtonEditar">move_up</span>
                            <span onclick="removeAlmacenCentral(${almacenCentral.idProd})" style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila">delete</span>
                        </td>
                    </tr>`
            html = html + row;
        };
        document.querySelector("#tabla-productos > tbody").outerHTML = html;
    }else{
        alert("No se encontraron resultados.")
        document.querySelector("#tabla-productos > tbody").outerHTML = html;
        document.querySelector("#tabla-productos").createTBody()
    };
};
function avanzarTablaProductos() {
    document.getElementById("avanzar").addEventListener("click", () =>{
        if(suma + 20 < cantidadFilas){
            numeronIncremento += 1
            suma += 20
            document.getElementById("numeracionTabla").value = numeronIncremento
            searchAlmacenCentral(suma, 
                                document.getElementById("filtro-tabla-productos-categoria").value, 
                                document.getElementById("filtro-tabla-productos-codigo").value, 
                                document.getElementById("filtro-tabla-productos-descripcion").value, 
                                document.getElementById("filtro-tabla-productos-proveedor").value);
        };
    });
    document.getElementById("retroceder").addEventListener("click", () =>{
        if(numeronIncremento > 1){
            numeronIncremento -= 1
            suma -= 20
            document.getElementById("numeracionTabla").value = numeronIncremento
            searchAlmacenCentral(suma, 
                                document.getElementById("filtro-tabla-productos-categoria").value, 
                                document.getElementById("filtro-tabla-productos-codigo").value, 
                                document.getElementById("filtro-tabla-productos-descripcion").value, 
                                document.getElementById("filtro-tabla-productos-proveedor").value);
        };
    });
};

function atajoTablaProductos(){
    document.getElementById("numeracionTabla").addEventListener("change", ()=>{
        searchAlmacenCentral((document.getElementById("numeracionTabla").value - 1) * 20, 
                            document.getElementById("filtro-tabla-productos-categoria").value, 
                            document.getElementById("filtro-tabla-productos-codigo").value, 
                            document.getElementById("filtro-tabla-productos-descripcion").value, 
                            document.getElementById("filtro-tabla-productos-proveedor").value);
        numeronIncremento = Number(document.getElementById("numeracionTabla").value);
        suma = (document.getElementById("numeracionTabla").value - 1) * 20;
    });
};
document.getElementById("restablecerProductos").addEventListener("click", async () =>{
    document.getElementById("filtro-tabla-productos-categoria").value = ""
    document.getElementById("filtro-tabla-productos-codigo").value = ""
    document.getElementById("filtro-tabla-productos-descripcion").value = ""
    document.getElementById("filtro-tabla-productos-proveedor").value = ""

    await conteoProductos(document.getElementById("filtro-tabla-productos-categoria").value, 
                    document.getElementById("filtro-tabla-productos-codigo").value, 
                    document.getElementById("filtro-tabla-productos-descripcion").value, 
                    document.getElementById("filtro-tabla-productos-proveedor").value)

    await searchAlmacenCentral(0, 
                        document.getElementById("filtro-tabla-productos-categoria").value, 
                        document.getElementById("filtro-tabla-productos-codigo").value, 
                        document.getElementById("filtro-tabla-productos-descripcion").value, 
                        document.getElementById("filtro-tabla-productos-proveedor").value)
    numeronIncremento = 1;
    suma = 0;
});
function filtroProductos(){
    document.getElementById("buscarFiltrosProductos").addEventListener("click", async (e)=>{
        e.preventDefault();
        await conteoProductos(document.getElementById("filtro-tabla-productos-categoria").value, 
                        document.getElementById("filtro-tabla-productos-codigo").value, 
                        document.getElementById("filtro-tabla-productos-descripcion").value, 
                        document.getElementById("filtro-tabla-productos-proveedor").value)
        await searchAlmacenCentral(0, 
                            document.getElementById("filtro-tabla-productos-categoria").value, 
                            document.getElementById("filtro-tabla-productos-codigo").value, 
                            document.getElementById("filtro-tabla-productos-descripcion").value, 
                            document.getElementById("filtro-tabla-productos-proveedor").value);
        numeronIncremento = 1;
        suma = 0;
        alert(`Se obtuvieron ${cantidadFilas} registros.`)
    });
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function editAlmacenCentral(id) {
    let almacenCentral = productosAlmacenCentral.find(y => y.idProd == id)

    sucursal_indice_productos = document.getElementById("sucursal-principal").selectedIndex

    document.getElementById('id-productos').value = almacenCentral.idProd;
    document.getElementById('sucursal-productos').value = document.getElementById("sucursal-principal")[sucursal_indice_productos].textContent;
    document.getElementById('codigo-productos').value = almacenCentral.codigo;
    document.getElementById('descripcion-productos').value = almacenCentral.descripcion;
    if(sucursal_indice_productos == 0){
        document.getElementById('existencias-productos').value = almacenCentral.existencias_ac;
    }else if(sucursal_indice_productos == 1){
        document.getElementById('existencias-productos').value = almacenCentral.existencias_su;
    }else if(sucursal_indice_productos == 2){
        document.getElementById('existencias-productos').value = almacenCentral.existencias_sd;
    }else if(sucursal_indice_productos == 3){
        document.getElementById('existencias-productos').value = almacenCentral.existencias_st;
    };
    document.getElementById('precio-venta-productos').value = almacenCentral.precio_venta;
};
function accion_recompras(id){
    accionCantidadARecomprar()
    let almacenCentral = productosAlmacenCentral.find(y => y.idProd == id)
    document.getElementById('accion_id').value = almacenCentral.idProd;
    document.getElementById('accion_codigo').textContent = "Recompra: " + almacenCentral.codigo;

    sucursal_id_productos = document.getElementById("sucursal-principal").value
    sucursal_indice_productos = document.getElementById("sucursal-principal").selectedIndex

    document.getElementById('accion_sucursal').value = document.getElementById("sucursal-principal")[sucursal_indice_productos].textContent;
    if(document.getElementById('accion_sucursal').value === document.getElementById("sucursal-principal")[0].textContent){
        document.getElementById('accion_existencias').value = almacenCentral.existencias_ac;
    }else if(document.getElementById('accion_sucursal').value === document.getElementById("sucursal-principal")[1].textContent){
        document.getElementById('accion_existencias').value = almacenCentral.existencias_su;
    }else if(document.getElementById('accion_sucursal').value === document.getElementById("sucursal-principal")[2].textContent){
        document.getElementById('accion_existencias').value = almacenCentral.existencias_sd;
    }else if(document.getElementById('accion_sucursal').value === document.getElementById("sucursal-principal")[3].textContent){
        document.getElementById('accion_existencias').value = almacenCentral.existencias_st;
    };
    document.getElementById('accion_existencias_ac').value = almacenCentral.existencias_ac;
    document.getElementById('accion_existencias_su').value = almacenCentral.existencias_su;
    document.getElementById('accion_existencias_sd').value = almacenCentral.existencias_sd;
    document.getElementById('accion_existencias_st').value = almacenCentral.existencias_st;

    document.getElementById("accion_editar").focus()
    document.getElementById("acciones_rapidas").classList.add("modal-show-producto")
};

async function removeAlmacenCentral(idProd) {
    respuestaAlmacen = confirm('¿Estás seguro de eliminarlo?')
    if (respuestaAlmacen) {
        let url = URL_API_almacen_central + 'almacen_central/' + idProd
            await fetch(url, {
            "method": 'DELETE',
            "headers": {
                "Content-Type": 'application/json'
                }
            })
        await searchAlmacenCentral(document.getElementById("numeracionTabla").value - 1, "", "", "", "")
        await cargarDatosProductosCCD();
        localStorage.setItem("base_datos_consulta", JSON.stringify(productosCCD))
    };
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function formulario_recompras_productos(){
    let formularioRecomprasInventario = `
                                        <div id="form_accion_rapida" class="nuevo-contenedor-box">
                                            <form action="" class="formulario-general fondo">
                                                <h2 id="accion_codigo"></h2>
                                                <input id="accion_id" class="input-general fondo invisible" type="text" disabled>
                                                <label class="label-general">Sucursal de Origen<input id="accion_sucursal" class="input-general fondo" type="text" disabled></label>
                                                <label class="label-general">Existencias<input id="accion_existencias" class="input-general fondo" type="text" disabled></label>
                                                <label class="label-general">Unidades a Recomprar<input id="accion_editar" class="input-general-importante fondo-importante" type="text"></label>
                                                <label class="label-general">Saldo en Origen<input id="accion_saldo" class="input-general fondo" type="text" disabled></label>
                                                <input id="accion_existencias_ac" class="input-general fondo invisible" type="text" disabled>
                                                <input id="accion_existencias_su" class="input-general fondo invisible" type="text" disabled>
                                                <input id="accion_existencias_sd" class="input-general fondo invisible" type="text" disabled>
                                                <input id="accion_existencias_st" class="input-general fondo invisible" type="text" disabled>
                                                <button id="accion_procesar_recompra" class="myButtonAgregar">Procesar Recompra</button>
                                                <button id="remover_accion_rapida" class="myButtonEliminar">Cancelar</button>
                                            </form>
                                        </div>
                                        `;
    document.getElementById("acciones_rapidas").innerHTML = formularioRecomprasInventario;
}
function accionCantidadARecomprar(){
    formulario_recompras_productos()
    removerAccionRapida();
    let editar = document.getElementById("accion_editar");
    editar.addEventListener("keyup", (event)=>{
        document.getElementById("accion_saldo").value = Number(event.target.value) +
                                                        Number(document.getElementById("accion_existencias").value)
    });
    const accionProcesarRecompra = document.getElementById("accion_procesar_recompra");
    accionProcesarRecompra.addEventListener("click", procesamientoInventarioRecompras)
};
async function procesamientoInventarioRecompras(e){
    e.preventDefault();
    if(Number(document.getElementById("accion_editar").value) > 0){
        try{
            let respuesta_numeracion = await cargarNumeracionComprobante();
            if(respuesta_numeracion.ok){
                await funcionAccionRecompraProductos()
                await searchAlmacenCentral(suma, 
                                        document.getElementById("filtro-tabla-productos-categoria").value, 
                                        document.getElementById("filtro-tabla-productos-codigo").value, 
                                        document.getElementById("filtro-tabla-productos-descripcion").value, 
                                        document.getElementById("filtro-tabla-productos-proveedor").value);
            }else{
                alert("La conexión con el servidor no es buena.")
            };
        }catch(error){
            alert("Ocurrió un error. " + error);
            console.error("Ocurrió un error. ", error)
        };
    }else{
        alert("Unidades a recomprar insuficientes.")
    }
};
async function funcionAccionRecompraProductos(){
    function IngresoAProductos(){
        this.idProd = document.getElementById("accion_id").value;
        this.sucursal_post = sucursales_activas[sucursal_indice_productos];
        this.existencias_post = document.getElementById("accion_saldo").value;
    };
    let filaProductos = new IngresoAProductos();
    let url = URL_API_almacen_central + 'almacen_central_operacion';
    let response = await funcionFetch(url, filaProductos)
    console.log("Respuesta Productos "+response.status)
    if(response.status === 200){
        await funcionAccionRecompraEntradas()
    }else{
        alert(`Ocurrió un problema Productos`)
    };
};
async function funcionAccionRecompraEntradas(){
    function IngresoAEntradas(){
        this.idProd = document.getElementById("accion_id").value;
        this.comprobante = "Recompra-" + (Number(numeracion[0].recompras) + 1);
        this.causa_devolucion = 0;
        this.fecha = fechaPrincipal;
        this.existencias_entradas = document.getElementById("accion_editar").value;
        this.sucursal = sucursal_id_productos;
        this.usuario = document.getElementById("identificacion_usuario_id").textContent;
        this.existencias_devueltas = 0;
    };
    let filaEntradas = new IngresoAEntradas();
    let urlEntradas = URL_API_almacen_central + 'entradas';
    let response = await funcionFetch(urlEntradas, filaEntradas);
    console.log("Respuesta Entradas "+response.status)
    if(response.status === 200){
        await funcionAccionRecompraNumeracion()
    }else{
        alert(`Ocurrió un problema Entradas`)
    };
};
async function funcionAccionRecompraNumeracion(){
    let dataComprobante = {
        "id": numeracion[0].id,
        "compras": numeracion[0].compras,
        "recompras": Number(numeracion[0].recompras) + 1,
        "transferencias": numeracion[0].transferencias,
        "ventas": numeracion[0].ventas,
        "nota_venta": numeracion[0].nota_venta,   
        "boleta_venta": numeracion[0].boleta_venta,   
        "factura": numeracion[0].factura
    };  
    let urlNumeracion = URL_API_almacen_central + 'numeracion_comprobante'
    let response = await funcionFetch(urlNumeracion, dataComprobante)
    console.log("Respuesta Entradas "+response.status)
    if(response.status === 200){
        document.getElementById("form_accion_rapida").remove()
        alert("Operación completada exitosamente.")
        document.getElementById("acciones_rapidas").classList.remove("modal-show-producto")
    }else{
        alert(`Ocurrió un problema Numeración`)
    };
    
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////TRANSFERENCIAS////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function accion_transferencias(id) {
    accionCantidadATransferir()
    let almacenCentral = productosAlmacenCentral.find(y => y.idProd == id)
    document.getElementById('accion_id').value = almacenCentral.idProd;
    document.getElementById('accion_codigo').textContent = "Transferencia: " + almacenCentral.codigo;

    sucursal_id_productos = document.getElementById("sucursal-principal").value
    sucursal_indice_productos = document.getElementById("sucursal-principal").selectedIndex

    document.getElementById('accion_sucursal').value = document.getElementById("sucursal-principal")[sucursal_indice_productos].textContent;
    if(document.getElementById('accion_sucursal').value === document.getElementById("sucursal-principal")[0].textContent){
        document.getElementById('accion_existencias').value = almacenCentral.existencias_ac;
    }else if(document.getElementById('accion_sucursal').value === document.getElementById("sucursal-principal")[1].textContent){
        document.getElementById('accion_existencias').value = almacenCentral.existencias_su;
    }else if(document.getElementById('accion_sucursal').value === document.getElementById("sucursal-principal")[2].textContent){
        document.getElementById('accion_existencias').value = almacenCentral.existencias_sd;
    }else if(document.getElementById('accion_sucursal').value === document.getElementById("sucursal-principal")[3].textContent){
        document.getElementById('accion_existencias').value = almacenCentral.existencias_st;
    };
    document.getElementById("accion_existencias_destino").value = almacenCentral.existencias_ac;
    document.getElementById('accion_existencias_ac').value = almacenCentral.existencias_ac;
    document.getElementById('accion_existencias_su').value = almacenCentral.existencias_su;
    document.getElementById('accion_existencias_sd').value = almacenCentral.existencias_sd;
    document.getElementById('accion_existencias_st').value = almacenCentral.existencias_st;

    document.getElementById("accion_editar").focus()
    document.getElementById("acciones_rapidas").classList.add("modal-show-producto")
    cargarSucursales("#accion_sucursal_destino")
    accionCambioSucursal()
    
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function llenarSucursalDestino(){
    suc_tra = JSON.parse(localStorage.getItem("sucursal_encabezado"))
    let html = ''
    for(sucursal of suc_tra) {
        let fila = `<option value="${sucursal.id_sucursales }">${sucursal.sucursal_nombre}</option>`
        html = html + fila;
    };
    document.querySelector("#accion_sucursal_destino").innerHTML = html
};
function formulario_transferencias_productos(){
    let formularioRecomprasInventario = `
                                        <div id="form_accion_rapida" class="nuevo-contenedor-box">
                                            <form action="" class="formulario-general fondo">
                                                <h2 id="accion_codigo"></h2>
                                                <input id="accion_id" class="input-general fondo invisible" type="text" disabled>
                                                <label class="label-general">Sucursal de Origen<input id="accion_sucursal" class="input-general fondo" type="text" disabled></label>
                                                <label class="label-general">Sucursal de Destino
                                                    <select id="accion_sucursal_destino" class="input-select fondo-importante">
                                                        
                                                    </select>
                                                </label>
                                                <label class="label-general">Existencias<input id="accion_existencias" class="input-general fondo" type="text" disabled></label>
                                                <label class="label-general">Unidades a Transferir<input id="accion_editar" class="input-general-importante fondo-importante" type="text"></label>
                                                <label class="label-general">Saldo en Origen<input id="accion_saldo" class="input-general fondo" type="text" disabled></label>
                                                <label class="label-general">Existencias Destino<input id="accion_existencias_destino" class="input-general fondo" type="text" disabled></label>
                                                <label class="label-general">Saldo en Destino<input id="accion_saldo_dos" class="input-general fondo" type="text" disabled></label>
                                                <input id="accion_existencias_ac" class="input-general fondo invisible" type="text" disabled>
                                                <input id="accion_existencias_su" class="input-general fondo invisible" type="text" disabled>
                                                <input id="accion_existencias_sd" class="input-general fondo invisible" type="text" disabled>
                                                <input id="accion_existencias_st" class="input-general fondo invisible" type="text" disabled>
                                                <button id="accion_procesar_transferencia" class="myButtonAgregar">Procesar Transferencia</button>
                                                <button id="remover_accion_rapida" class="myButtonEliminar">Cancelar</button>
                                            </form>
                                        </div>
                                        `;
    document.getElementById("acciones_rapidas").innerHTML = formularioRecomprasInventario;
};
function accionCantidadATransferir(){
    formulario_transferencias_productos()
    llenarSucursalDestino()
    removerAccionRapida();
    let editar = document.getElementById("accion_editar");
    editar.addEventListener("keyup", (event)=>{
        document.getElementById("accion_saldo").value = Number(document.getElementById("accion_existencias").value) - 
                                                        Number(event.target.value)
        document.getElementById("accion_saldo_dos").value = Number(event.target.value) +
                                                            Number(document.getElementById("accion_existencias_destino").value)                                                
    });
    const agregarAtablaProductoTres = document.getElementById("accion_procesar_transferencia");
    agregarAtablaProductoTres.addEventListener("click", procesamientoInventarioTransferencias)
};
let sucursal_indice_productos_destino = 0;
function accionCambioSucursal(){
    let accionSucursalDestino = document.getElementById("accion_sucursal_destino");
    accionSucursalDestino.addEventListener("change", (event)=>{
        if(event.target.selectedIndex == "0"){
            sucursal_indice_productos_destino = event.target.selectedIndex
            document.getElementById("accion_existencias_destino").value = document.getElementById("accion_existencias_ac").value
        }else if(event.target.selectedIndex == "1"){
            sucursal_indice_productos_destino = event.target.selectedIndex
            document.getElementById("accion_existencias_destino").value = document.getElementById("accion_existencias_su").value
        }else if(event.target.selectedIndex == "2"){
            sucursal_indice_productos_destino = event.target.selectedIndex
            document.getElementById("accion_existencias_destino").value = document.getElementById("accion_existencias_sd").value
        }else if(event.target.selectedIndex == "3"){
            sucursal_indice_productos_destino = event.target.selectedIndex
            document.getElementById("accion_existencias_destino").value = document.getElementById("accion_existencias_st").value
        };
        document.getElementById("accion_saldo").value = Number(document.getElementById("accion_existencias").value) - 
                                                        Number(document.getElementById("accion_editar").value)
        document.getElementById("accion_saldo_dos").value = Number(document.getElementById("accion_editar").value) +
                                                            Number(document.getElementById("accion_existencias_destino").value)
    });
};

async function procesamientoInventarioTransferencias(e){
    e.preventDefault();
    if(Number(document.getElementById("accion_editar").value) > 0 && 
    document.getElementById("sucursal-principal").value !== document.getElementById("accion_sucursal_destino").value &&
    document.getElementById("accion_existencias").value >= 0){
        try{
            let respuesta_numeracion = await cargarNumeracionComprobante();
            if(respuesta_numeracion.ok){
                await funcionAccionTransferenciaProductos()
                await searchAlmacenCentral(suma, 
                                        document.getElementById("filtro-tabla-productos-categoria").value, 
                                        document.getElementById("filtro-tabla-productos-codigo").value, 
                                        document.getElementById("filtro-tabla-productos-descripcion").value, 
                                        document.getElementById("filtro-tabla-productos-proveedor").value);
            };
        }catch(error){
            alert("Ocurrió un error. " + error);
            console.error("Ocurrió un error. ", error)
        };
    }else if(document.getElementById("sucursal-principal").value === document.getElementById("accion_sucursal_destino").value){
        alert("Seleccione una sucursal de destino diferente a la de origen.")
    }else if(Number(document.getElementById("accion_editar").value) <= 0){
        alert("Unidades a transferir insuficientes.")
    }else if(Number(document.getElementById("accion_existencias").value) < 0){
        alert("No hay suficientes existencias en sucursal de origen.")
    };
};
async function funcionAccionTransferenciaProductos(){
    function IngresoAProductos(){
        this.idProd = document.getElementById("accion_id").value;
        this.sucursal_post = sucursales_activas[sucursal_indice_productos]
        this.existencias_post = document.getElementById("accion_saldo").value;
        this.sucursal_post_dos = sucursales_activas[sucursal_indice_productos_destino]
        this.existencias_post_dos = document.getElementById("accion_saldo_dos").value;
    };
    let filaProductos = new IngresoAProductos();
    let url = URL_API_almacen_central + 'almacen_central_doble_operacion'
    let response = await funcionFetch(url, filaProductos)
    console.log("Respuesta Productos "+response.status)
    if(response.status === 200){
        await funcionAccionTransferenciaEntradas()
    }else{
        alert(`Ocurrió un problema Productos`)
    };
};
async function funcionAccionTransferenciaEntradas(){
    function IngresoAEntradasTt(){
        this.idProd = document.getElementById("accion_id").value;
        this.comprobante = "Transferencia-" + (Number(numeracion[0].transferencias) + 1);
        this.causa_devolucion = 0;
        this.fecha = fechaPrincipal;
        this.existencias_entradas = document.getElementById("accion_editar").value;
        this.sucursal = document.getElementById("accion_sucursal_destino").value;
        this.usuario = document.getElementById("identificacion_usuario_id").textContent;
        this.existencias_devueltas = 0;
    };
    let filaEntradas = new IngresoAEntradasTt();
    let urlEntradas = URL_API_almacen_central + 'entradas'
    let response = await funcionFetch(urlEntradas, filaEntradas)
    console.log("Respuesta Entradas "+response.status)
    if(response.status === 200){
        await funcionAccionTransferenciaSalidas()
    }else{
        alert(`Ocurrió un problema Entradas`)
    };
};
async function funcionAccionTransferenciaSalidas(){
    function IngresoASalidas(){
        this.idProd = document.getElementById("accion_id").value;
        this.cliente = 1;
        this.comprobante = "Transferencia-" + (Number(numeracion[0].transferencias) + 1);
        this.causa_devolucion = 0;
        this.fecha = fechaPrincipal;
        this.precio_venta_salidas = 0;
        this.sucursal = document.getElementById("sucursal-principal").value;
        this.existencias_salidas = document.getElementById("accion_editar").value;
        this.existencias_devueltas = 0;
        this.usuario = document.getElementById("identificacion_usuario_id").textContent;
    };
    let filaSalidas = new IngresoASalidas();
    let urlSalidas = URL_API_almacen_central + 'salidas'
    let response = await funcionFetch(urlSalidas, filaSalidas)
    console.log("Respuesta Salidas "+response.status)
    if(response.status === 200){
        await funcionAccionTransferenciaNumeracion()
    }else{
        alert(`Ocurrió un problema Salidas`)
    };
};
async function funcionAccionTransferenciaNumeracion(){
    let dataComprobante = {
        "id": numeracion[0].id,
        "compras": numeracion[0].compras,
        "recompras": numeracion[0].recompras,
        "transferencias": Number(numeracion[0].transferencias) + 1,
        "ventas": numeracion[0].ventas,
        "nota_venta": numeracion[0].nota_venta,   
        "boleta_venta": numeracion[0].boleta_venta,   
        "factura": numeracion[0].factura
    };    
    let urlNumeracion = URL_API_almacen_central + 'numeracion_comprobante'
    let response = await funcionFetch(urlNumeracion, dataComprobante)
    console.log("Respuesta Numeración "+response.status)
    if(response.status === 200){
        alert("Operación completada exitosamente.")
        document.getElementById("acciones_rapidas").classList.remove("modal-show-producto")
        document.getElementById("form_accion_rapida").remove()
    }else{
        alert(`Ocurrió un problema Numeración`)
    };
};
/////////////////////////////////////////////////////////////////////////////////////////////

function removerAccionRapida(){
    let remover = document.getElementById("remover_accion_rapida");
    remover.addEventListener("click", (e)=>{
        e.preventDefault();
        document.getElementById("form_accion_rapida").remove()
        document.getElementById("acciones_rapidas").classList.remove("modal-show-producto")
    });
};
let idSucursalBuscado = 0;
let indiceSucursalBusacador = 0;    
///////////////////////////////////BUSCADOR PRODUCTOS ///////////////////////////////////////
document.addEventListener("keyup", (e) =>{
    let almacenCentral = productosAlmacenCentral.find(y => y.codigo.toLowerCase().startsWith(document.getElementById('buscador-producto').value.toLocaleLowerCase()))
    if(productosAlmacenCentral.find(y => y.codigo.toLowerCase().startsWith(document.getElementById('buscador-producto').value.toLocaleLowerCase()))){
        document.getElementById('id-productos').value = almacenCentral.id

        idSucursalBuscado = document.getElementById("sucursal-principal").value
        indiceSucursalBusacador = document.getElementById("sucursal-principal").selectedIndex
        document.getElementById('sucursal-productos').value = document.getElementById("sucursal-principal")[indiceSucursalBusacador].textContent
        document.getElementById('codigo-productos').value = almacenCentral.codigo
        document.getElementById('descripcion-productos').value = almacenCentral.descripcion
        document.getElementById('precio-venta-productos').value = almacenCentral.precio_venta
        if(document.getElementById('sucursal-productos').value === document.getElementById("sucursal-principal")[0].textContent){
            document.getElementById('existencias-productos').value = almacenCentral.existencias_ac
        }else if(document.getElementById('sucursal-productos').value === document.getElementById("sucursal-principal")[1].textContent){
            document.getElementById('existencias-productos').value = almacenCentral.existencias_su
        }else if(document.getElementById('sucursal-productos').value === document.getElementById("sucursal-principal")[2].textContent){
            document.getElementById('existencias-productos').value = almacenCentral.existencias_sd
        }else if(document.getElementById('sucursal-productos').value === document.getElementById("sucursal-principal")[3].textContent){
            document.getElementById('existencias-productos').value = almacenCentral.existencias_st
        }
    };
    if(document.getElementById('buscador-producto').value > 0 || document.getElementById('buscador-producto').value == ""){
        formPaginaProductos.reset();
    }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////
const agregarAListaCodigoBarras = document.getElementById("agregar-tabla-codigo-barras");
agregarAListaCodigoBarras.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelectorAll(".codigo-codigo-barras").forEach((event) => {
        
        if(document.getElementById("codigo-productos").value == event.textContent){
            alert("El código ya fue ingresado a cola de impresión.")
            event.parentNode.remove()
        }
    });
    if(document.getElementById("id-productos").value != ""){
        let tablaCodigoBarras = document.querySelector("#tabla-codigo-barras > tbody");
        let nuevaFilaTablaCodigoBarras = tablaCodigoBarras.insertRow(-1);

        let nuevaCeldaTablaCodigoBarras = nuevaFilaTablaCodigoBarras.insertCell(0);
        nuevaCeldaTablaCodigoBarras.classList.add("codigo-codigo-barras")
        nuevaCeldaTablaCodigoBarras.textContent = document.getElementById("codigo-productos").value

        nuevaCeldaTablaCodigoBarras = nuevaFilaTablaCodigoBarras.insertCell(1);
        nuevaCeldaTablaCodigoBarras.textContent = document.getElementById("descripcion-productos").value

        nuevaCeldaTablaCodigoBarras = nuevaFilaTablaCodigoBarras.insertCell(2);
        nuevaCeldaTablaCodigoBarras.textContent = document.getElementById("precio-venta-productos").value

        nuevaCeldaTablaCodigoBarras = nuevaFilaTablaCodigoBarras.insertCell(3);
        let nuevoInput = document.createElement("input");
        nuevaCeldaTablaCodigoBarras.appendChild(nuevoInput)
        nuevaCeldaTablaCodigoBarras.children[0].classList.add("input-cantidad-codigo-barras")
        nuevaCeldaTablaCodigoBarras.children[0].value = document.getElementById("existencias-productos").value

        nuevaCeldaTablaCodigoBarras = nuevaFilaTablaCodigoBarras.insertCell(4);
        let nuevoIMG = document.createElement("img");
        nuevaCeldaTablaCodigoBarras.appendChild(nuevoIMG)
        nuevaCeldaTablaCodigoBarras.children[0].classList.add("inputCodigoBarras")

        let eliminarFila = nuevaFilaTablaCodigoBarras.insertCell(5);
            let botonEliminar = document.createElement("a");
            botonEliminar.classList.add("eliminarTablaFila")
            botonEliminar.textContent = "X";
            eliminarFila.appendChild(botonEliminar)
            botonEliminar.addEventListener("click", (event) => {
                event.target.parentNode.parentNode.remove()
        });
    };
    generarCodigoBarras()
});
function generarCodigoBarras(){
   document.querySelectorAll(".codigo-codigo-barras").forEach((event) => {
        JsBarcode(event.parentNode.children[4].children[0], event.textContent, {
            format: "CODE128",
            displayValue: false
        });
    }); 
}
const mandarATaBlaCodigoDeBarras = document.getElementById("crear-codigo-barras");
mandarATaBlaCodigoDeBarras.addEventListener("click", (e) =>{
    e.preventDefault();
    let html = `
                <style>
                    body{
                        display: grid;
                        align-items: center;
                        align-content: space-between;
                        justify-content: center;
                    }
                    .codBarras{
                        width: 180px;
                        display: grid;
                        margin: 1px;
                    }
                    .contenedor-nuevo-codigo-barras{
                        display: flex;
                        flex-wrap: wrap;
                        margin: auto;
                        width: 100%;
                    }
                    .inputCodigoBarras{
                        height: 40px;
                        width: 100%;
                        margin: 0px 2px;
                    }
                    .contenedor_etiquetas{
                        display: flex;
                        flex-wrap: wrap;
                    }
                    .labelCodigoBarras{
                        padding: 0;
                        margin: 0;
                        width: 100%;
                        border: 1px solid #bbbbbb
                    }
                    .labelDescripcion{
                        padding: 0;
                        margin: 0;
                        width: 100%;
                        border: 1px solid #bbbbbb
                    }
                </style>
                <div class="contenedor_etiquetas">`;
    let sumaEtiquetas = 0;
    let cuenta = 0
    document.querySelectorAll(".input-cantidad-codigo-barras").forEach((element) => {
        sumaEtiquetas += Number(element.value);
        for (let i = cuenta; i < sumaEtiquetas; i++) {
            let contenidoHTML = `
                <div class="codBarras">
                    <p class="labelDescripcion">${element.parentNode.parentNode.children[1].textContent} S/${Number(element.parentNode.parentNode.children[2].textContent).toFixed(2)}</p>
                    <img class="imagenCodigoBarras inputCodigoBarras" src=${element.parentNode.parentNode.children[4].children[0].src}>
                    <p class="labelCodigoBarras">${element.parentNode.parentNode.children[0].textContent}</p>
                </div>
            `;
            html = html + contenidoHTML;
        }
        cuenta = element.value;
    })
    
    html += `</div>
            <div>
                <button class="imprimir-modal-codigo-barras">Imprimir</button>
                <button class="cerrar-modal-codigo-barras">Cerrar</button>
            </div>
            <script>
                document.querySelector(".imprimir-modal-codigo-barras").addEventListener("click", (event) => {
                    event.preventDefault()
                    window.print()
                });
            </script>
            `
    let nuevaVentana = window.open('');
    nuevaVentana.document.write(html);
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function cambioSucursalProductos(){
    document.getElementById("sucursal-principal").addEventListener("change", ()=>{
        formPaginaProductos.reset();
    });
}
