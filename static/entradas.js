////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////ENTRADAS///////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", inicioEntradas)
function inicioEntradas(){
    inicioTablasEntradas()
    btnEntradasP = 1;
};
async function inicioTablasEntradas(){
    await conteoEntradas(document.getElementById("filtro-tabla-entradas-sucursal").value, 
                        document.getElementById("filtro-tabla-entradas-categoria").value, 
                        document.getElementById("filtro-tabla-entradas-codigo").value, 
                        document.getElementById("filtro-tabla-entradas-operacion").value,
                        '2000-01-01',
                        new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate())
    await searchEntradas(document.getElementById("numeracionTablaEntradas").value - 1, "", "", "", "",
                        '2000-01-01', new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate())
    avanzarTablaEntradas()
    atajoTablaEntradas()
    filtroEntradas()
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let sucursal_id_entradas = 0;
let cantidadFilas = 0;
let numeronIncrementoEntradasTabla = 1;
let sumaEntradasTabla = 0;
let inicio = 0;
let fin = 0;
async function conteoEntradas(sucursal,categoria,codigo,comprobante,inicio,fin){
    let url = URL_API_almacen_central + `entradas_conteo?`+
                                        `sucursal_entradas=${sucursal}&`+
                                        `categoria_entradas=${categoria}&`+
                                        `codigo_entradas=${codigo}&`+
                                        `comprobante_entradas=${comprobante}&`+
                                        `fecha_inicio_entradas=${inicio}&`+
                                        `fecha_fin_entradas=${fin}`
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
    document.querySelector("#numeracionTablaEntradas").innerHTML = html
};
async function searchEntradas(num,sucursal,categoria,codigo,comprobante,inicio,fin) {
    let url = URL_API_almacen_central + `entradas_tabla/${num}?`+
                                        `sucursal_entradas=${sucursal}&`+
                                        `categoria_entradas=${categoria}&`+
                                        `codigo_entradas=${codigo}&`+
                                        `comprobante_entradas=${comprobante}&`+
                                        `fecha_inicio_entradas=${inicio}&`+
                                        `fecha_fin_entradas=${fin}`
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    entradasAlmacenCentral = await respuesta.json();
    let html = ''
    if(entradasAlmacenCentral.length > 0){
        for(entra of entradasAlmacenCentral){
            let filaEntradas = `
                            <tr class="busqueda-entradas">
                                <td class="invisible">${entra.idEntr}</td>
                                <td>${entra.sucursal_nombre}</td>
                                <td>${entra.categoria_nombre}</td>
                                <td>${entra.codigo}</td>
                                <td style="text-align: end;">${entra.existencias_entradas}</td>
                                <td style="text-align: end;">${entra.existencias_devueltas}</td>
                                <td style="text-align: end;">${entra.costo_unitario.toFixed(2)}</td>
                                <td style="text-align: end;">${((entra.existencias_entradas - entra.existencias_devueltas) * entra.costo_unitario).toFixed(2)}</td>
                                <td>${entra.comprobante}</td>
                                <td>${entra.fecha}</td>
                                <td style="text-align: center;">
                                    <span onclick="editEntradas(${entra.idEntr})" style="font-size:18px;" class="material-symbols-outlined myButtonEditar">assignment_return</span>
                                </td>
                            </tr>`
            html = html + filaEntradas;
        };
        document.querySelector("#tabla-entradas > tbody").outerHTML = html;
    }else{
        alert("No se encontraron resultados.")
        document.querySelector("#tabla-entradas > tbody").outerHTML = html;
        document.querySelector("#tabla-entradas").createTBody()
    };
};
function avanzarTablaEntradas() {
    document.getElementById("avanzarEntradas").addEventListener("click", () =>{
        if(sumaEntradasTabla + 20 < cantidadFilas){
            numeronIncrementoEntradasTabla += 1
            sumaEntradasTabla += 20
            document.getElementById("numeracionTablaEntradas").value = numeronIncrementoEntradasTabla
            manejoDeFechasEntradas()
            searchEntradas(sumaEntradasTabla,
                        document.getElementById("filtro-tabla-entradas-sucursal").value, 
                        document.getElementById("filtro-tabla-entradas-categoria").value, 
                        document.getElementById("filtro-tabla-entradas-codigo").value, 
                        document.getElementById("filtro-tabla-entradas-operacion").value,
                        inicio,
                        fin)
        };
    });
    document.getElementById("retrocederEntradas").addEventListener("click", () =>{
        if(numeronIncrementoEntradasTabla > 1){
            numeronIncrementoEntradasTabla -= 1
            sumaEntradasTabla -= 20
            document.getElementById("numeracionTablaEntradas").value = numeronIncrementoEntradasTabla
            manejoDeFechasEntradas()
            searchEntradas(sumaEntradasTabla,
                        document.getElementById("filtro-tabla-entradas-sucursal").value, 
                        document.getElementById("filtro-tabla-entradas-categoria").value, 
                        document.getElementById("filtro-tabla-entradas-codigo").value, 
                        document.getElementById("filtro-tabla-entradas-operacion").value,
                        inicio,
                        fin)
        };
    });
};
function atajoTablaEntradas(){
    document.getElementById("numeracionTablaEntradas").addEventListener("change", ()=>{
        manejoDeFechasEntradas()
        searchEntradas((document.getElementById("numeracionTablaEntradas").value - 1) * 20,
                    document.getElementById("filtro-tabla-entradas-sucursal").value, 
                    document.getElementById("filtro-tabla-entradas-categoria").value, 
                    document.getElementById("filtro-tabla-entradas-codigo").value, 
                    document.getElementById("filtro-tabla-entradas-operacion").value,
                    inicio,
                    fin)
        numeronIncrementoEntradasTabla = Number(document.getElementById("numeracionTablaEntradas").value);
        sumaEntradasTabla = (document.getElementById("numeracionTablaEntradas").value - 1) * 20;
    });
};
document.getElementById("restablecerEntradas").addEventListener("click", async () =>{
    document.getElementById("filtro-tabla-entradas-sucursal").value = ""
    document.getElementById("filtro-tabla-entradas-categoria").value = ""
    document.getElementById("filtro-tabla-entradas-codigo").value = ""
    document.getElementById("filtro-tabla-entradas-operacion").value = ""
    document.getElementById("filtro-tabla-entradas-fecha-inicio").value = ""
    document.getElementById("filtro-tabla-entradas-fecha-fin").value = ""

    await conteoEntradas(document.getElementById("filtro-tabla-entradas-sucursal").value, 
                    document.getElementById("filtro-tabla-entradas-categoria").value, 
                    document.getElementById("filtro-tabla-entradas-codigo").value, 
                    document.getElementById("filtro-tabla-entradas-operacion").value,
                    '2000-01-01',
                    new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate())
    await searchEntradas(0,
                    document.getElementById("filtro-tabla-entradas-sucursal").value, 
                    document.getElementById("filtro-tabla-entradas-categoria").value, 
                    document.getElementById("filtro-tabla-entradas-codigo").value, 
                    document.getElementById("filtro-tabla-entradas-operacion").value,
                    '2000-01-01',
                    new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate())
    numeronIncrementoEntradasTabla = 1;
    sumaEntradasTabla = 0;
});
function manejoDeFechasEntradas(){
    inicio = document.getElementById("filtro-tabla-entradas-fecha-inicio").value;
    fin = document.getElementById("filtro-tabla-entradas-fecha-fin").value;
    if(inicio == "" && fin == ""){
        inicio = '2000-01-01';
        fin = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate()
    }else if(inicio == "" && fin != ""){
        inicio = '2000-01-01';
    }else if(inicio != "" && fin == ""){
        fin = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate();
    };
};
function filtroEntradas(){
    document.getElementById("buscarFiltrosEntradas").addEventListener("click", async (e)=>{
        e.preventDefault();
        manejoDeFechasEntradas()
        await conteoEntradas(document.getElementById("filtro-tabla-entradas-sucursal").value, 
                        document.getElementById("filtro-tabla-entradas-categoria").value, 
                        document.getElementById("filtro-tabla-entradas-codigo").value, 
                        document.getElementById("filtro-tabla-entradas-operacion").value,
                        inicio,
                        fin)
        await searchEntradas(0,
                        document.getElementById("filtro-tabla-entradas-sucursal").value, 
                        document.getElementById("filtro-tabla-entradas-categoria").value, 
                        document.getElementById("filtro-tabla-entradas-codigo").value, 
                        document.getElementById("filtro-tabla-entradas-operacion").value,
                        inicio,
                        fin)
        numeronIncrementoEntradasTabla = 1;
        sumaEntradasTabla = 0;
        alert(`Se obtuvieron ${cantidadFilas} registros.`)
    });
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let entradas_Id = "";
let producto_Id_entradas = "";
let indice_sucursal_entradas = 0;
function editEntradas(id) {
    let entradas = entradasAlmacenCentral.find(x => x.idEntr == id)
    if(entradas.comprobante.startsWith("Compra") || entradas.comprobante.startsWith("Recompra")){
        accionDevolucionEntradas();
        if(entradas.sucursal_nombre == document.querySelector("#sucursal-principal").children[0].textContent){
            sucursal_id_entradas = document.querySelector("#sucursal-principal")[0].value
        }else if(entradas.sucursal_nombre == document.querySelector("#sucursal-principal").children[1].textContent){
            sucursal_id_entradas = document.querySelector("#sucursal-principal")[1].value
        }else if(entradas.sucursal_nombre == document.querySelector("#sucursal-principal").children[2].textContent){
            sucursal_id_entradas = document.querySelector("#sucursal-principal")[2].value
        }else if(entradas.sucursal_nombre == document.querySelector("#sucursal-principal").children[3].textContent){
            sucursal_id_entradas = document.querySelector("#sucursal-principal")[3].value
        };
        document.getElementById('accion_id_entradas').value = entradas.idEntr
        document.getElementById('accion_codigo').textContent = "Devolución: " + entradas.codigo;
        document.getElementById('accion_comprobante_entradas').value = entradas.comprobante
        document.getElementById('accion_sucursal_entradas').value = entradas.sucursal_nombre
        document.getElementById('accion_existencias_entradas').value = entradas.existencias_entradas
        document.getElementById('accion_existencias_devueltas_entradas').value = entradas.existencias_devueltas
        cargarDatosEntradasId(entradas.idEntr)
        document.getElementById("accion_editar_entradas").focus()
        document.getElementById("acciones_rapidas_entradas").classList.add("modal-show-entrada")
    }else{
        alert("No es una Compra o Recompra.")
    };
};
function accionDevolucionEntradas(){
    let formularioDevolucionesEntradas = `
                                        <div id="form_accion_rapida_entradas" class="nuevo-contenedor-box">
                                            <form action="" class="formulario-general fondo">
                                                <h2 id="accion_codigo"></h2>
                                                <input id="accion_id_entradas" class="input-general fondo invisible" type="text" disabled>
                                                <input id="accion_id_productos" class="input-general fondo invisible" type="text" disabled>
                                                <label class="label-general">Comprobante<input id="accion_comprobante_entradas" class="input-general fondo" type="text" disabled></label>
                                                <label class="label-general">Sucursal de Origen<input id="accion_sucursal_entradas" class="input-general fondo" type="text" disabled></label>
                                                <label class="label-general">Unidades Adquiridas<input id="accion_existencias_entradas" class="input-general fondo" type="text" disabled></label>
                                                <label class="label-general">Unidades Devueltas<input id="accion_existencias_devueltas_entradas" class="input-general fondo" type="text" disabled></label>
                                                <label class="label-general">Existencias en Stock<input id="accion_existencias_productos_entradas" class="input-general fondo" type="text" disabled></label>
                                                <label class="label-general">Unidades a Devolver<input id="accion_editar_entradas" class="input-general-importante fondo-importante" type="text"></label>
                                                <label class="label-general">Saldo en Devoluciones<input id="accion_saldo_devolucion_entradas" class="input-general fondo" type="text" disabled></label>
                                                <label class="label-general">Saldo en Productos<input id="accion_saldo_productos_entradas" class="input-general fondo" type="text" disabled></label>
                                                <label class="label-general">Causa de Devolución
                                                    <select id="accion_causa_devolucion_entradas" class="input-general-importante fondo-importante">
                                                        <option value= "1">Producto defectuoso</option>
                                                        <option value= "2">Producto dañado durante el envío</option>
                                                        <option value= "3">Producto incorrecto o equivocado</option>
                                                        <option value= "4">Talla o ajuste incorrecto</option>
                                                        <option value= "5">Insatisfacción con el producto</option>
                                                        <option value= "6">Cambio por otro producto</option>
                                                        <option value= "7">Cancelación del pedido</option>
                                                        <option value= "8">Entrega retrasada</option>
                                                    </select>
                                                </label>
                                                <input id="accion_existencias_ac_productos" class="input-general fondo invisible" type="text" disabled>
                                                <input id="accion_existencias_su_productos" class="input-general fondo invisible" type="text" disabled>
                                                <input id="accion_existencias_sd_productos" class="input-general fondo invisible" type="text" disabled>
                                                <input id="accion_existencias_st_productos" class="input-general fondo invisible" type="text" disabled>
                                                <button id="accion_procesar_devolucion_entradas" class="myButtonAgregar">Procesar Devolución</button>
                                                <button id="remover_accion_rapida_entradas" class="myButtonEliminar">Cancelar</button>
                                            </form>
                                        </div>
                                        `;
    document.getElementById("acciones_rapidas_entradas").innerHTML = formularioDevolucionesEntradas;
    removerAccionRapidaEntradas();
    let editar = document.getElementById("accion_editar_entradas");
    editar.addEventListener("keyup", (event)=>{
        document.getElementById("accion_saldo_devolucion_entradas").value = Number(event.target.value) + Number(document.getElementById("accion_existencias_devueltas_entradas").value)
        document.getElementById("accion_saldo_productos_entradas").value = Number(document.getElementById("accion_existencias_productos_entradas").value) - Number(event.target.value)
    });
    const procesarDevolucionesEntradas = document.getElementById("accion_procesar_devolucion_entradas");
    procesarDevolucionesEntradas.addEventListener("click", procesamientoEntradasDevoluciones)
};

async function cargarDatosEntradasId(id){
    let url = URL_API_almacen_central + 'entradas/'+ id
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    entradas_Id = await respuesta.json();
    cargarDatosProductosIdEntradas(entradas_Id.idProd)
}
async function cargarDatosProductosIdEntradas(id){
    let url = URL_API_almacen_central + 'almacen_central/' + id
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    producto_Id_entradas = await respuesta.json();
    document.getElementById('accion_id_productos').value = producto_Id_entradas.idProd
    if(document.getElementById('accion_sucursal_entradas').value === document.getElementById("sucursal-principal")[0].textContent){
        indice_sucursal_entradas = 0
        document.getElementById('accion_existencias_productos_entradas').value = producto_Id_entradas.existencias_ac
    }else if(document.getElementById('accion_sucursal_entradas').value === document.getElementById("sucursal-principal")[1].textContent){
        indice_sucursal_entradas = 1
        document.getElementById('accion_existencias_productos_entradas').value = producto_Id_entradas.existencias_su
    }else if(document.getElementById('accion_sucursal_entradas').value === document.getElementById("sucursal-principal")[2].textContent){
        indice_sucursal_entradas = 2
        document.getElementById('accion_existencias_productos_entradas').value = producto_Id_entradas.existencias_sd
    }else if(document.getElementById('accion_sucursal_entradas').value === document.getElementById("sucursal-principal")[3].textContent){
        indice_sucursal_entradas = 3
        document.getElementById('accion_existencias_productos_entradas').value = producto_Id_entradas.existencias_st
    };
    document.getElementById('accion_existencias_ac_productos').value = producto_Id_entradas.existencias_ac
    document.getElementById('accion_existencias_su_productos').value = producto_Id_entradas.existencias_su
    document.getElementById('accion_existencias_sd_productos').value = producto_Id_entradas.existencias_sd
    document.getElementById('accion_existencias_st_productos').value = producto_Id_entradas.existencias_st
}
function removerAccionRapidaEntradas(){
    let remover = document.getElementById("remover_accion_rapida_entradas");
    remover.addEventListener("click", (e)=>{
        e.preventDefault();
        document.getElementById("form_accion_rapida_entradas").remove()
        document.getElementById("acciones_rapidas_entradas").classList.remove("modal-show-entrada")
    });
};
//////////////////BUSCA PRODUCTOS EN TABLA ALMACÉN CENTRAL////////////////////////////////////////////

async function procesamientoEntradasDevoluciones(e){
    e.preventDefault();
    manejoDeFechasEntradas()
    if(Number(document.getElementById("accion_editar_entradas").value) > 0 && 
    (Number(document.getElementById("accion_existencias_entradas").value) >= Number(document.getElementById("accion_saldo_devolucion_entradas").value)) &&
    Number(document.getElementById("accion_existencias_productos_entradas").value) > 0){
        try{
            modal_proceso_abrir("Procesando la devolución de la compra!!!.", "")
            await realizarDevolucionComprasEntradas()
            await searchEntradas((document.getElementById("numeracionTablaEntradas").value - 1) * 20,
                                document.getElementById("filtro-tabla-entradas-sucursal").value, 
                                document.getElementById("filtro-tabla-entradas-categoria").value, 
                                document.getElementById("filtro-tabla-entradas-codigo").value, 
                                document.getElementById("filtro-tabla-entradas-operacion").value,
                                inicio,
                                fin);
        }catch(error){
            modal_proceso_abrir("Ocurrió un error. " + error, "")
            console.error("Ocurrió un error. ", error)
            modal_proceso_salir_botones()
        };
    }else if(Number(document.getElementById("accion_editar_entradas").value) <= 0){
        modal_proceso_abrir("Las unidades a devolver deben ser mayores a cero.", "")
        modal_proceso_salir_botones()
    }else if(Number(document.getElementById("accion_existencias_entradas").value) < Number(document.getElementById("accion_saldo_devolucion_entradas").value)){
        modal_proceso_abrir("Las unidades a devolver no deben ser mayores a las unidades en existencia.", "")
        modal_proceso_salir_botones()
    }else if(Number(document.getElementById("accion_existencias_productos_entradas").value) <= 0){
        modal_proceso_abrir("El stock en inventario es cero.", "")
        modal_proceso_salir_botones()
    };
};
async function realizarDevolucionComprasEntradas(){
    function DatosDevolucionComprasEntradas(){
        this.idProd = document.getElementById("accion_id_productos").value;
        this.sucursal_post = sucursales_activas[indice_sucursal_entradas];
        this.existencias_post = document.getElementById("accion_saldo_productos_entradas").value;
        this.idEntr = document.getElementById('accion_id_entradas').value;
        this.existencias_entradas_update = document.getElementById('accion_existencias_entradas').value;
        this.existencias_devueltas_update = document.getElementById("accion_saldo_devolucion_entradas").value;
        this.comprobante = "Dev-" + document.getElementById('accion_comprobante_entradas').value;
        this.causa_devolucion = document.getElementById("accion_causa_devolucion_entradas").value;
        this.sucursal = sucursal_id_entradas;
        this.existencias_devueltas_insert = document.getElementById("accion_editar_entradas").value;
    };
    let filaProducto = new DatosDevolucionComprasEntradas();
    let url = URL_API_almacen_central + 'procesar_devolucion_compras'
    let response = await funcionFetch(url, filaProducto)
    console.log("Respuesta Productos "+response.status)
    if(response.status === 200){
        modal_proceso_abrir("Operación completada exitosamente.", "")
        modal_proceso_salir_botones()
        document.getElementById("acciones_rapidas_entradas").classList.remove("modal-show-entrada")
    }else{
        modal_proceso_abrir(`Ocurrió un problema en la devolución`, "")
        modal_proceso_salir_botones()
    };
};
