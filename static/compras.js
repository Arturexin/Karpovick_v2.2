document.addEventListener("DOMContentLoaded", inicioCompras)
function inicioCompras(){
    iniciarGraficosComprasRecompras()
    indice_base = JSON.parse(localStorage.getItem("base_datos_consulta"))
    btnCompras = 1;
    cambioSucursalCompras()
};
async function iniciarGraficosComprasRecompras(){
    await cargarComprasMes();
    graficoComprasRecomprasMes()
    graficoComprasRecomprasPorcentaje()
}
const formularioComprasUno = document.getElementById("formulario-compras-uno");
const tablaProformaCompras = document.getElementById("tabla_principal");
let comprasNumerador = 0;
let indice_sucursal_compras = 0;
let proveedores_llave;
/////////////////////////////////////////////////////////////////////
///////////////////////////sucursal/////////////////////////////////
function cambioSucursalCompras(){
    document.getElementById("sucursal-principal").addEventListener("change", (event)=>{
        if(document.getElementById("sucursal-compras")){
            formularioComprasUno.reset();
            indice_sucursal_compras = document.getElementById("sucursal-principal").selectedIndex;
            document.getElementById("sucursal-compras").value = event.target[indice_sucursal_compras].textContent
        };
    });
};

function formulario_compras(){
    let formCompras = `
    <div class="into_form baja_opacidad_interior">
                    <h2 class="">Compra</h2>
                    <div class="contenedor-label-input-compras">
                        <div>
                            <input class="input-compras fondo" type="hidden" id="id-compras" name="id-compras" />
                            <label class="label-general">Sucursal<input name="sucursal-compras" id="sucursal-compras" class="input-general fondo" disabled></label>
                            <label class="label-general">Categoría
                                <select name="categoria-compras" id="categoria-compras" class="input-general fondo">
                                </select>
                            </label>
                            <label class="label-general">Código<input class="input-general fondo" type="text" id="codigo-compras" name="codigo-compras" /></label>
                            <label class="label-general">Descripción<input class="input-general fondo" type="text" id="descripcion-compras" name="descripcion-compras" /></label>
                            <label class="label-general">Costo de compra<input class="input-general fondo" type="text" id="costo-compras" name="costo-compras"/></label>
                            <label class="label-general">Precio de venta<input class="input-general fondo" type="text" id="precio-compras" name="precio-compras"/></label>
                            <label class="label-general">Lote<input class="input-general fondo" type="text" id="lote-compras" name="lote-compras" /></label>
                            <label class="label-general">Proveedor
                                <select class="input-general fondo" id="proveedor-compras">
                                </select>
                            </label>
                        </div>
                    </div>
                    <div class="boton-cli">
                        <button id="agregarATablaCompras" class="myButtonAgregar">Agregar a Proforma</button>
                        <input type="reset" class="myButtonEliminar">
                    </div>
    </div>
                    `;
    document.getElementById("formulario-compras-uno").innerHTML = formCompras;
};
function formulario_recompras(){
    let formRecompras = `
    <div class="into_form baja_opacidad_interior">
                    <h2 class="">Recompra</h2>
                    <div>
                    <input id="buscador-productos-compras" type="text" class="input-general-importante fondo-importante" placeholder="Buscar Código"> 
                    </div>

                    <div class="contenedor-label-input-compras">
                        <div class="label">
                            <input class="input-compras fondo" type="hidden" id="id-compras" name="id-compras" />
                            <label class="label-general">Sucursal<input name="sucursal-compras" id="sucursal-compras" class="input-general fondo" disabled></label>
                            <label class="label-general">Categoría
                                <select name="categoria-compras" id="categoria-compras" class="input-general fondo">
                                </select>
                            </label>
                            <label class="label-general">Código<input class="input-general fondo" type="text" id="codigo-compras" name="codigo-compras" /></label>
                            <label class="label-general">Descripción<input class="input-general fondo" type="text" id="descripcion-compras" name="descripcion-compras" /></label>
                        </div>
                    </div>
                    <div class="boton-cli">
                        <button id="agregarATablaComprasPlus" class="myButtonAgregar">Agregar a Proforma</button>
                        <input type="reset" class="myButtonEliminar">
                    </div>
    </div>
                    `;
    document.getElementById("formulario-compras-uno").innerHTML = formRecompras;
};
const nuevoProducto = document.getElementById("nuevo-producto");
nuevoProducto.addEventListener("click", mostrarFormNuevoProducto);
function mostrarFormNuevoProducto(e){
    e.preventDefault();
    formulario_compras()
    llenarCategoriaProductosEjecucion("#categoria-compras")
    baseProv("#proveedor-compras")

    indice_sucursal_compras = document.getElementById("sucursal-principal").selectedIndex;
    document.getElementById("sucursal-compras").value = document.querySelector("#sucursal-principal").children[indice_sucursal_compras].textContent
    document.getElementById("nuevo-producto").classList.add("marcaBoton")
    document.getElementById("recompra-producto-plus").classList.remove("marcaBoton")
    document.getElementById("codigo-compras").focus();
    document.querySelector(".baja_opacidad_interior").classList.add("alta_opacidad_interior")
    document.getElementById("procesar-pre-recompra").classList.add("invisible")
    document.getElementById("procesar-pre-compra").classList.remove("invisible")
    document.getElementById("procesar-compras-plus").classList.add("invisible")
    document.getElementById("procesar-compras").classList.remove("invisible")
    document.getElementById("id-compras").value = ""
    document.querySelector("#tabla_modal > tbody").remove()
    document.querySelector("#tabla_modal").createTBody()
    document.querySelector("#tabla_principal > tbody").remove()
    document.querySelector("#tabla_principal").createTBody()

    document.getElementById("grafico_circular_compras_recompras").classList.add("invisible")

    comprasNumerador = 0;
    const mandarATablaCompras = document.querySelector("#agregarATablaCompras");
    mandarATablaCompras.addEventListener("click", agregarAtablaCompras)
}
const recompraProductoPlus = document.getElementById("recompra-producto-plus");
recompraProductoPlus.addEventListener("click",mostrarFormrecompraProductoPlus);
function mostrarFormrecompraProductoPlus(e){
    e.preventDefault();
    formulario_recompras()
    llenarCategoriaProductosEjecucion("#categoria-compras")

    indice_sucursal_compras = document.getElementById("sucursal-principal").selectedIndex;
    document.getElementById("nuevo-producto").classList.remove("marcaBoton")
    document.getElementById("recompra-producto-plus").classList.add("marcaBoton")
    document.getElementById("buscador-productos-compras").focus();
    document.querySelector(".baja_opacidad_interior").classList.add("alta_opacidad_interior")
    document.getElementById('categoria-compras').setAttribute("disabled", "true")
    document.getElementById('codigo-compras').setAttribute("disabled", "true")
    document.getElementById('descripcion-compras').setAttribute("disabled", "true")
    document.getElementById("procesar-pre-recompra").classList.remove("invisible")
    document.getElementById("procesar-pre-compra").classList.add("invisible")
    document.getElementById("procesar-compras-plus").classList.remove("invisible")
    document.getElementById("procesar-compras").classList.add("invisible")
    document.getElementById("id-compras").value = ""
    document.querySelector("#tabla_modal > tbody").remove()
    document.querySelector("#tabla_modal").createTBody()
    document.querySelector("#tabla_principal > tbody").remove()
    document.querySelector("#tabla_principal").createTBody()

    document.getElementById("grafico_circular_compras_recompras").classList.add("invisible")

    comprasNumerador = 1;
    const mandarATablaRecomprasPlus = document.getElementById("agregarATablaComprasPlus");
    mandarATablaRecomprasPlus.addEventListener("click", agregarATablaPreRecompras)
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////COMPRA NUEVO PRODUCTO///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let codigoComprobacionCompra = ""
function crearHeadCompra(){
    let tablaCompras= document.querySelector("#tabla_modal > thead");
    let nuevaFilaTablaCompras = tablaCompras.insertRow(-1);
    let fila = `
                <tr class="tbody_preproforma">
                    <th style="width: 120px;">Sucursal</th>
                    <th style="width: 120px;">Categoría</th>
                    <th style="width: 120px;">Código</th>
                    <th style="width: 200px;">Descripción</th>
                    <th style="width: 70px;">Talla</th>
                    <th style="width: 70px;">Cantidad a Comprar</th>
                    <th style="width: 70px;">Costo Unitario</th>
                    <th style="width: 70px;">Costo Total</th>
                    <th style="width: 70px;">Precio de Venta</th>
                    <th style="width: 40px;"><span style="font-size:18px;" class="material-symbols-outlined">delete</span></th>
                </tr>
                `
    nuevaFilaTablaCompras.innerHTML = fila;
};
function crearBodyCompras (tallaAComprar, loteAComprar){
    let tablaCompras= document.querySelector("#tabla_modal > tbody");
    let nuevaFilaTablaCompras = tablaCompras.insertRow(-1);
    let fila = `<tr>
                    <td class="id_compras_modal invisible"></td>
                    <td>${document.getElementById("sucursal-compras").value}</td>
                    <td>${document.getElementById("categoria-compras").children[document.getElementById("categoria-compras").selectedIndex].textContent}</td>
                    <td class="codigo_compras_modal input-tablas fondo" style="background: rgb(105, 211, 35)">${document.getElementById("codigo-compras").value}-${tallaAComprar}-${loteAComprar}</td>
                    <td><input class="input-tablas-texto-largo" value="${document.getElementById("descripcion-compras").value}" placeholder="Rellene esta casilla"></td>
                    <td>${tallaAComprar}</td>
                    <td class="invisible"></td>
                    <td><input class="input-tablas-dos-largo insertarNumero" placeholder="Valor > 0"></td>
                    <td><input class="input-tablas-dos-largo insertarCosto" value="${(Number(document.getElementById("costo-compras").value)).toFixed(2)}" placeholder="Valor >= 0"></td>
                    <td style="text-align: right"></td>
                    <td><input class="input-tablas-dos-largo" value="${(Number(document.getElementById("precio-compras").value)).toFixed(2)}" placeholder="Valor >= C"></td>
                    <td class="invisible">${document.getElementById("lote-compras").value}</td>
                    <td class="invisible">${document.getElementById("proveedor-compras").value}</td>
                    <td class="invisible"></td>
                    <td class="invisible">${document.getElementById("sucursal-principal").value}</td>
                    <td class="invisible">${indice_sucursal_compras}</td>
                    <td style="text-align: center">
                        <span style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila eliminar_fila_compras">delete</span>
                    </td>
                    <td class="invisible">${document.getElementById("categoria-compras").value}</td>
                </tr>
                `
    nuevaFilaTablaCompras.innerHTML = fila;
    codigoComprobacionCompra = document.getElementById("codigo-compras").value + "-" + tallaAComprar + "-" + loteAComprar;
    eliminarFilaCompras()
};
function eliminarFilaCompras(){
    document.querySelectorAll(".eliminar_fila_compras").forEach((event)=>{
        event.addEventListener("click", ()=>{
            event.parentNode.parentNode.remove()
        })
    });
};
let arrayCreacionCategoriaTallasCompras = [];

function agregarAtablaCompras(e){
    e.preventDefault();
    ///////////////////////////Para nuevos productos/////////////////////////////////////////////////////////////////
    if(expregul.codigo.test(document.getElementById("codigo-compras").value) &&
    expregul.descripcion.test(document.getElementById("descripcion-compras").value) &&
    expregul.cantidad.test(document.getElementById("lote-compras").value) &&
    expregul.precios.test(document.getElementById("costo-compras").value) &&
    expregul.precios.test(document.getElementById("precio-compras").value)){
        document.querySelector(".contenedor-pre-recompra").classList.add("modal-show")
        categoriaProductosCreacion("categoria-compras", arrayCreacionCategoriaTallasCompras);
        compararCodigosNuevos(".codigo_compras_modal", codigoComprobacionCompra);
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////
        crearHeadCompra()
        arrayCreacionCategoriaTallasCompras.forEach((event) =>{
            crearBodyCompras(event, document.getElementById("lote-compras").value)
        });
        document.getElementById("categoria-compras").style.background = ""
        document.getElementById("codigo-compras").style.background = ""
        document.getElementById("descripcion-compras").style.background = ""
        document.getElementById("lote-compras").style.background = ""
        document.getElementById("costo-compras").style.background = ""
        document.getElementById("precio-compras").style.background = ""
        document.getElementById("proveedor-compras").style.background = ""
        formularioComprasUno.reset();
        document.getElementById("sucursal-compras").value = document.getElementById("sucursal-principal")[indice_sucursal_compras].textContent

        comprobarCodigoProductos(".codigo_compras_modal");//Comprueba códigos repetidos
        operarCantidadAComprar();
        marcarCodigoRepetido(".codigo_compras_modal", ".codigo_compras_proforma", document.querySelector("#tabla_principal > thead > tr:nth-child(1) > th > h2").textContent)
        arrayCreacionCategoriaTallasCompras = [];
        document.querySelector("#tabla_modal > tbody > tr:nth-child(1) > td:nth-child(8) > input").focus()

    }else if(expregul.codigo.test(document.getElementById("codigo-compras").value) == false){
        document.getElementById("codigo-compras").style.background ="#b36659"
    }else if(expregul.descripcion.test(document.getElementById("descripcion-compras").value) == false){
        document.getElementById("descripcion-compras").style.background ="#b36659"
    }else if(expregul.precios.test(document.getElementById("costo-compras").value) == false){
        document.getElementById("costo-compras").style.background ="#b36659"
    }else if(expregul.precios.test(document.getElementById("precio-compras").value) == false){
        document.getElementById("precio-compras").style.background ="#b36659"
    }else if(expregul.cantidad.test(document.getElementById("lote-compras").value) == false){
        document.getElementById("lote-compras").style.background ="#b36659"
    };
};
function operarCantidadAComprar(){
    const cantidadAComprar = document.querySelectorAll(".insertarNumero");
    cantidadAComprar.forEach((e)=>{
        e.addEventListener("keyup",(i)=>{
            i.target.parentNode.parentNode.children[9].textContent = 
                (Number(i.target.value) * Number(i.target.parentNode.parentNode.children[8].children[0].value)).toFixed(2)
        });
    });
    const costoAComprar = document.querySelectorAll(".insertarCosto");
    costoAComprar.forEach((e)=>{
        e.addEventListener("keyup",(i)=>{
            i.target.parentNode.parentNode.children[9].textContent = 
                (Number(i.target.value) * Number(i.target.parentNode.parentNode.children[7].children[0].value)).toFixed(2)
        });
    });
};
const mandarATablaComprasPrincipal = document.getElementById("procesar-pre-compra");
mandarATablaComprasPrincipal.addEventListener("click", mandarATablaPrincipalCompras)
function mandarATablaPrincipalCompras(e){
    e.preventDefault();
    removerCodigoRepetido(".codigo_compras_modal", ".codigo_compras_proforma", 7)
    filaBodyProformaPincipal()
    const borrarNumero = document.querySelectorAll(".codigo_compras_modal");//eliminamos las filas que si pasaron a la tabla principal
    borrarNumero.forEach((event)=>{
        if(event.parentNode.children[4].children[0].value !== "" &&
        Number(event.parentNode.children[7].children[0].value) > 0 &&
        event.parentNode.children[7].children[0].value !== "" &&
        Number(event.parentNode.children[8].children[0].value) >= 0 &&
        event.parentNode.children[8].children[0].value !== "" &&
        Number(event.parentNode.children[10].children[0].value) >= Number(event.parentNode.children[8].children[0].value) &&
        event.parentNode.children[10].children[0].value !== ""){
            event.parentNode.remove()
        }
    });
    if(document.querySelector("#tabla_modal > tbody").children.length == 0){
        document.querySelector(".contenedor-pre-recompra").classList.remove("modal-show")
        document.querySelector("#tabla_modal > thead > tr:nth-child(2)").remove()
    }
    let sumaTotalCantidadComprada= 0;
        let sumaTotalCompra = 0;
        let numeroFilasTablaCompras = document.querySelector("#tabla_principal > tbody").rows.length;
        for(let i = 0; i < numeroFilasTablaCompras; i++){
            sumaTotalCompra += Number(document.querySelector("#tabla_principal > tbody").children[i].children[8].innerHTML) 
            sumaTotalCantidadComprada += Number(document.querySelector("#tabla_principal > tbody").children[i].children[6].innerHTML) 
    }
    document.getElementById("total-importe-tabla-compras").textContent = sumaTotalCompra.toFixed(2);
    document.getElementById("total-cantidad-tabla-compras").textContent = sumaTotalCantidadComprada;
    document.getElementById("formulario-compras-uno").reset()
    document.getElementById("sucursal-compras").value = document.querySelector("#sucursal-principal").children[indice_sucursal_compras].textContent
    document.getElementById("id-compras").value = ""
    document.getElementById("codigo-compras").focus();
};

const procesarCompras = document.querySelector("#procesar-compras");
procesarCompras.addEventListener("click", procesamientoCompras)
async function procesamientoCompras(e){
    e.preventDefault();
    try{
        if(document.querySelector("#tabla_principal > tbody").children.length > 0){
            modal_proceso_abrir("Procesando la compra!!!.", "")
            let obteniendo_numeracion = await cargarNumeracionComprobante();
            if(obteniendo_numeracion.status === 200){
                await realizarCompra()
                document.querySelector("#tabla_principal > tbody").remove();
                document.querySelector("#tabla_principal").createTBody();
            }else{
                modal_proceso_abrir("La conexión con el servidor no es buena.", "")
                modal_proceso_salir_botones()
            };
        };
    }catch(error){
        modal_proceso_abrir("Ocurrió un error. " + error, "")
        console.error("Ocurrió un error. ", error)
        modal_proceso_salir_botones()
    };
};
async function realizarCompra(){
    let suma_productos = 0;
    function DatosCompras(a){
        let array = [0,0,0,0]

        this.categoria = a.children[16].textContent;
        this.codigo = a.children[3].textContent;
        this.costo_unitario = a.children[7].textContent;
        this.descripcion = a.children[4].textContent;
        this.lote = a.children[10].textContent;
        this.precio_venta = a.children[9].textContent;
        this.proveedor = a.children[11].textContent; //llave de vinculación
        this.talla = a.children[5].textContent;

        for(let i = 0; i < array.length; i++){
            if(a.children[14].textContent == i){
                array[i] = a.children[6].textContent
            };
        };
        this.existencias_ac = array[0];
        this.existencias_su = array[1];
        this.existencias_sd = array[2];
        this.existencias_st = array[3];

        this.sucursal = a.children[13].textContent;
        this.comprobante = "Compra-" + (Number(numeracion[0].compras) + 1);
        this.existencias_entradas = a.children[6].textContent;
    };
    let numFilas = document.querySelector("#tabla_principal > tbody").children;
    for(let i = 0 ; i < numFilas.length; i++ ){
        if(numFilas[i]){
            let filaUno = new DatosCompras(numFilas[i]);
            let urlCompraProductos = URL_API_almacen_central + 'procesar_nuevo_producto'
            let response = await funcionFetch(urlCompraProductos, filaUno)
            console.log("Respuesta Productos "+response.status)
            if(response.status === 200){
                suma_productos +=1;
                modal_proceso_abrir("Procesando la compra!!!.", `Producto ejecutado: ${suma_productos} de ${numFilas.length}`)
                console.log(`Producto ejecutado: ${suma_productos} de ${numFilas.length}`)
            }
        };
    };
    if(suma_productos === numFilas.length){
        await funcionComprasNumeracion();
    }else{
        modal_proceso_abrir(`Ocurrió un problema en la fila ${suma_productos + 1}`, `Producto ejecutado: ${suma_productos} de ${numFilas.length}`)
        console.log(`Producto ejecutado: ${suma_productos} de ${numFilas.length}`)
        modal_proceso_salir_botones()
    };
};

async function funcionComprasProductos(){
    let suma_productos = 0;
    function EnviarAProductos(a){
        let array = [0,0,0,0]

        this.categoria = a.children[16].textContent;
        this.codigo = a.children[3].textContent;
        this.costo_unitario = a.children[7].textContent;
        this.descripcion = a.children[4].textContent;
        this.lote = a.children[10].textContent;
        this.precio_venta = a.children[9].textContent;
        this.proveedor = a.children[11].textContent; //llave de vinculación
        this.talla = a.children[5].textContent;

        for(let i = 0; i < array.length; i++){
            if(a.children[14].textContent == i){
                array[i] = a.children[6].textContent
            };
        };
        this.existencias_ac = array[0];
        this.existencias_su = array[1];
        this.existencias_sd = array[2];
        this.existencias_st = array[3];
    };
    let numFilas = document.querySelector("#tabla_principal > tbody").children;
    for(let i = 0 ; i < numFilas.length; i++ ){
        if(numFilas[i]){
            let filaUno = new EnviarAProductos(numFilas[i]);
            let urlCompraProductos = URL_API_almacen_central + 'almacen_central'
            let response = await funcionFetch(urlCompraProductos, filaUno)
            console.log("Respuesta Productos "+response.status)
            if(response.status === 200){
                suma_productos +=1;
                modal_proceso_abrir("Procesando la compra!!!.", `Producto ejecutado: ${suma_productos} de ${numFilas.length}`)
                console.log(`Producto ejecutado: ${suma_productos} de ${numFilas.length}`)
            }
        };
    };
    if(suma_productos === numFilas.length){
        await encontrarIdProductosNuevos();
    }else{
        modal_proceso_abrir(`Ocurrió un problema en la fila ${suma_productos + 1}`, `Producto ejecutado: ${suma_productos} de ${numFilas.length}`)
        console.log(`Producto ejecutado: ${suma_productos} de ${numFilas.length}`)
        modal_proceso_salir_botones()
    };
};

async function encontrarIdProductosNuevos(){//busca el id del nuevo producto el almacén central para grabar la compra en entradas
    let suma_id_productos = 0;
    let codigoNuevo;
    let codigoComparador = document.querySelectorAll(".codigo_compras_proforma")
    for(cod of codigoComparador){
        let url = URL_API_almacen_central + `almacen_central_codigo_sucursal/${cod.textContent}?`+
                                            `sucursal_get=${sucursales_activas[indice_sucursal_compras]}`
        let respuesta  = await fetch(url, {
            "method": 'GET',
            "headers": {
                "Content-Type": 'application/json'
            }
        });
        console.log("Respuesta busqueda id "+respuesta.status)
        if(respuesta.ok){
            codigoNuevo = await respuesta.json();
            cod.parentNode.children[12].textContent = codigoNuevo.idProd
            suma_id_productos +=1;
            modal_proceso_abrir("Procesando la compra!!!.", `Buscando nuevos códigos: ${suma_id_productos} de ${codigoComparador.length}`)
            console.log(`Buscando nuevos códigos: ${suma_id_productos} de ${codigoComparador.length}`)
        };
    };
    if(suma_id_productos === codigoComparador.length){
        await funcionComprasEntradas();
    }else{
        modal_proceso_abrir(`Ocurrió un problema en la fila ${suma_id_productos + 1}`, `Buscando nuevos códigos: ${suma_id_productos} de ${codigoComparador.length}`)
        console.log(`Buscando nuevos códigos: ${suma_id_productos} de ${codigoComparador.length}`)
        modal_proceso_salir_botones()
    };
};
async function funcionComprasEntradas(){
    let suma_entradas = 0;
    function EnviarAEntradas(a){
        this.idProd = a.children[12].textContent;
        this.sucursal = a.children[13].textContent;
        this.causa_devolucion = 0;
        this.fecha = fechaPrincipal;
        this.comprobante = "Compra-" + (Number(numeracion[0].compras) + 1);
        this.existencias_entradas = a.children[6].textContent;
        this.usuario = document.getElementById("identificacion_usuario_id").textContent;
        this.existencias_devueltas = 0;
    };
    let numFilas = document.querySelector("#tabla_principal > tbody").children;
    for(let i = 0 ; i < numFilas.length; i++ ){
        if(Number(numFilas[i].children[12].textContent) > 0){
            let filaUnoEntradas = new EnviarAEntradas(numFilas[i]);
            let urlCompraEntradas = URL_API_almacen_central + 'entradas'
            let response = await funcionFetch(urlCompraEntradas, filaUnoEntradas)
            console.log("Respuesta Entradas "+response.status)
            if(response.status === 200){
                suma_entradas +=1;
                modal_proceso_abrir("Procesando la compra!!!.", `Producto ejecutado en entradas: ${suma_entradas} de ${numFilas.length}`)
                console.log(`Producto ejecutado en entradas: ${suma_entradas} de ${numFilas.length}`)
            }
        };
    };
    if(suma_entradas === numFilas.length){
        await funcionComprasNumeracion();
    }else{
        modal_proceso_abrir(`Ocurrió un problema en la fila ${suma_entradas + 1}`, `Producto ejecutado en entradas: ${suma_entradas} de ${numFilas.length}`)
        console.log(`Producto ejecutado en entradas: ${suma_entradas} de ${numFilas.length}`)
        modal_proceso_salir_botones()
    };
};

async function funcionComprasNumeracion(){
    let dataComprobante = {
        "id": numeracion[0].id,
        "compras": Number(numeracion[0].compras) + 1,
        "recompras": numeracion[0].recompras,
        "transferencias": numeracion[0].transferencias,
        "ventas": numeracion[0].ventas,
        "nota_venta": numeracion[0].nota_venta,   
        "boleta_venta": numeracion[0].boleta_venta,   
        "factura": numeracion[0].factura   
    };    
    let urlCompraComprobante = URL_API_almacen_central + 'numeracion_comprobante'
    let response = await funcionFetch(urlCompraComprobante, dataComprobante)
    console.log("Respuesta Numeración "+response.status)
    if(response.status === 200){
        await cargarDatosProductosCCD();
        localStorage.setItem("base_datos_consulta", JSON.stringify(productosCCD))
        modal_proceso_abrir('Operación completada exitosamente.', "")
        modal_proceso_salir_botones()
    };
};


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////RECOMPRA PLUS/////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////BUSCADOR DE PRODUCTOS EN FORMULARIO COMPRAS/////////////////////////

document.addEventListener("keyup", () =>{
    if(comprasNumerador == 0){
        return;
    }else{
        let almacenCentral = indice_base.find(y => y.codigo.toLowerCase().startsWith(document.getElementById('buscador-productos-compras').value.toLowerCase()))
        if(indice_base.find(y => y.codigo.toLowerCase().startsWith(document.getElementById('buscador-productos-compras').value.toLowerCase()))){
            indice_sucursal_compras = document.getElementById("sucursal-principal").selectedIndex;
            document.getElementById('id-compras').value = almacenCentral.idProd
            document.getElementById("sucursal-compras").value = document.querySelector("#sucursal-principal").children[indice_sucursal_compras].textContent
            document.getElementById('categoria-compras').value = almacenCentral.categoria
            document.getElementById('codigo-compras').value = almacenCentral.codigo
            document.getElementById('descripcion-compras').value = almacenCentral.descripcion
            if((document.getElementById('buscador-productos-compras').value > 0 || document.getElementById('buscador-productos-compras').value == "")){
                formularioComprasUno.reset()
            }
        };
    };
});

function removerProductoRepetido(){//verificamos que el nuevo producto no tenga el mismo código en la tabla compras
    const codigoComprasComparacionProductos = document.querySelectorAll(".id_compras_modal");
    codigoComprasComparacionProductos.forEach((event) => {
        document.querySelectorAll(".id_compras_proforma").forEach((elemento) => {
            if(elemento.textContent === event.textContent &&
                event.parentNode.children[7].children[0].value > 0 && 
                elemento.parentNode.children[1].textContent === event.parentNode.children[1].textContent){
                elemento.parentNode.remove()
            }
        });
    });
};

function crearHeadRecompra(){
    let tablaCompras= document.querySelector("#tabla_modal > thead");
    let nuevaFilaTablaCompras = tablaCompras.insertRow(-1);
    let fila = `
                <tr class="tbody_preproforma">
                    <th style="width: 120px;">Sucursal</th>
                    <th style="width: 120px;">Categoría</th>
                    <th style="width: 120px;">Código</th>
                    <th style="width: 70px;">Existencias</th>
                    <th style="width: 70px;">Cantidad a Comprar</th>
                    <th style="width: 70px;">Total Compra</th>
                    <th style="width: 40px;"><span style="font-size:18px;" class="material-symbols-outlined">delete</span></th>
                </tr>
                `
    nuevaFilaTablaCompras.innerHTML = fila;
};
function crearBodyRecompras (codigoMovimientos){
    let tablaRecompras= document.querySelector("#tabla_modal > tbody");
    let nuevaFilaTablaRecompras = tablaRecompras.insertRow(-1);
    let fila = `<tr>
                    <td class="id_compras_modal invisible"></td>
                    <td>${document.getElementById("sucursal-compras").value}</td>
                    <td>${document.getElementById("categoria-compras").children[document.getElementById("categoria-compras").selectedIndex].textContent}</td>
                    <td class="codigo_compras_modal insertarMovimientos" style="border-radius: 5px">${codigoMovimientos}</td>
                    <td class="invisible"><input class="input-tablas fondo" disabled></td>
                    <td class="invisible"></td>
                    <td style="text-align: right"></td>
                    <td><input class="input-tablas-dos-largo insertarNumero" placeholder="Valor > 0"></td>
                    <td class="invisible"><input class="input-tablas-dos fondo insertarCosto" disabled></td>
                    <td class="invisible"></td>
                    <td class="invisible"><input class="input-tablas-dos fondo" disabled></td>
                    <td class="invisible"></td>
                    <td class="invisible"></td>
                    <td style="text-align: right"></td>
                    <td class="invisible">${document.getElementById("sucursal-principal").value}</td>
                    <td class="invisible">${indice_sucursal_compras}</td>
                    <td style="text-align: center">
                        <span style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila eliminar_fila_compras">delete</span>
                    </td>
                    <td class="invisible"></td>
                </tr>
                `
    nuevaFilaTablaRecompras.innerHTML = fila;
    eliminarFilaCompras()
};
async function agregarATablaPreRecompras(e){
    e.preventDefault();
    if(document.getElementById("id-compras").value > 0){
        crearHeadRecompra()
        categoriaProductosCreacion("categoria-compras", arrayCreacionCategoriaTallasCompras);
        for(let i = 0; i < arrayCreacionCategoriaTallasCompras.length; i++){
            if(document.getElementById("id-compras").value > 0){
                let codigoMovimientos = document.getElementById("codigo-compras").value
                if(codigoMovimientos.includes("-" + arrayCreacionCategoriaTallasCompras[0])){
                    codigoMovimientos = codigoMovimientos.replace("-" + arrayCreacionCategoriaTallasCompras[0], "-" + arrayCreacionCategoriaTallasCompras[i])
                }else if(codigoMovimientos.includes("-" + arrayCreacionCategoriaTallasCompras[1])){
                    codigoMovimientos = codigoMovimientos.replace("-" + arrayCreacionCategoriaTallasCompras[1], "-" + arrayCreacionCategoriaTallasCompras[i])
                }else if(codigoMovimientos.includes("-" + arrayCreacionCategoriaTallasCompras[2])){
                    codigoMovimientos = codigoMovimientos.replace("-" + arrayCreacionCategoriaTallasCompras[2], "-" + arrayCreacionCategoriaTallasCompras[i])
                }else if(codigoMovimientos.includes("-" + arrayCreacionCategoriaTallasCompras[3])){
                    codigoMovimientos = codigoMovimientos.replace("-" + arrayCreacionCategoriaTallasCompras[3], "-" + arrayCreacionCategoriaTallasCompras[i])
                }else if(codigoMovimientos.includes("-" + arrayCreacionCategoriaTallasCompras[4])){
                    codigoMovimientos = codigoMovimientos.replace("-" + arrayCreacionCategoriaTallasCompras[4], "-" + arrayCreacionCategoriaTallasCompras[i])
                }else if(codigoMovimientos.includes("-" + arrayCreacionCategoriaTallasCompras[5])){
                    codigoMovimientos = codigoMovimientos.replace("-" + arrayCreacionCategoriaTallasCompras[5], "-" + arrayCreacionCategoriaTallasCompras[i])
                }else if(codigoMovimientos.includes("-" + arrayCreacionCategoriaTallasCompras[6])){
                    codigoMovimientos = codigoMovimientos.replace("-" + arrayCreacionCategoriaTallasCompras[6], "-" + arrayCreacionCategoriaTallasCompras[i])
                }else if(codigoMovimientos.includes("-" + arrayCreacionCategoriaTallasCompras[7])){
                    codigoMovimientos = codigoMovimientos.replace("-" + arrayCreacionCategoriaTallasCompras[7], "-" + arrayCreacionCategoriaTallasCompras[i])
                }else if(codigoMovimientos.includes("-" + arrayCreacionCategoriaTallasCompras[8])){
                    codigoMovimientos = codigoMovimientos.replace("-" + arrayCreacionCategoriaTallasCompras[8], "-" + arrayCreacionCategoriaTallasCompras[i])
                }else if(codigoMovimientos.includes("-" + arrayCreacionCategoriaTallasCompras[9])){
                    codigoMovimientos = codigoMovimientos.replace("-" + arrayCreacionCategoriaTallasCompras[9], "-" + arrayCreacionCategoriaTallasCompras[i])
                }else if(codigoMovimientos.includes("-" + arrayCreacionCategoriaTallasCompras[10])){
                    codigoMovimientos = codigoMovimientos.replace("-" + arrayCreacionCategoriaTallasCompras[10], "-" + arrayCreacionCategoriaTallasCompras[i])
                }else if(codigoMovimientos.includes("-" + arrayCreacionCategoriaTallasCompras[11])){
                    codigoMovimientos = codigoMovimientos.replace("-" + arrayCreacionCategoriaTallasCompras[11], "-" + arrayCreacionCategoriaTallasCompras[i])
                }
                crearBodyRecompras(codigoMovimientos)
            };
        };
        document.querySelector(".contenedor-pre-recompra").classList.add("modal-show")
        await buscarPorCodidoMovimientosOrigen();
        operarCantidadARecomprar();
        marcarIdRepetido(".id_compras_modal", ".id_compras_proforma", document.querySelector("#tabla_principal > thead > tr:nth-child(1) > th > h2").textContent)
        formularioComprasUno.reset();
        arrayCreacionCategoriaTallasCompras = [];
        document.querySelector("#tabla_modal > tbody > tr > td:nth-child(8) > input").focus();
    };
};
////////////////CON ESTO SE LLENA LA TABLA PREMODIFICACION Y SE FILTRA LAS FILAS CON ID///////////////////////////////////
async function buscarPorCodidoMovimientosOrigen(){
    const codigoComparacion = document.querySelectorAll(".codigo_compras_modal");
    for(codCom of codigoComparacion){
        try{
            let url = URL_API_almacen_central + `almacen_central_codigo_sucursal/${codCom.textContent}?`+
                                            `sucursal_get=${sucursales_activas[indice_sucursal_compras]}`
            let response = await fetch(url,{
                "method": "GET",
                "headers": {
                    "Content-Type": 'application/json'
                }
            });
            if(response.ok){
                const datoCodigoUnitario = await response.json();
                if(datoCodigoUnitario.codigo){
                    codCom.parentNode.children[0].textContent = datoCodigoUnitario.idProd
                    codCom.parentNode.children[1].textContent = document.querySelector("#sucursal-principal").children[indice_sucursal_compras].textContent
                    /* codCom.parentNode.children[2].textContent = datoCodigoUnitario.categoria */
                    codCom.parentNode.children[4].children[0].value = datoCodigoUnitario.descripcion
                    codCom.parentNode.children[5].textContent = datoCodigoUnitario.talla
                    codCom.parentNode.children[6].textContent = datoCodigoUnitario.sucursal_get
                    codCom.parentNode.children[8].children[0].value = datoCodigoUnitario.costo_unitario
                    codCom.parentNode.children[10].children[0].value = datoCodigoUnitario.precio_venta
                    codCom.parentNode.children[11].textContent = datoCodigoUnitario.lote
                    codCom.parentNode.children[12].textContent = datoCodigoUnitario.proveedor
                    codCom.parentNode.children[17].textContent = datoCodigoUnitario.categoria
                    if(codCom.parentNode.children[0].textContent == document.getElementById("id-compras").value){
                        codCom.style.background = "var(--boton-tres)"
                        codCom.style.color = "var(--color-secundario)"
                    };
                };
                if(codCom.parentNode.children[0].textContent  < 1){//OCULTAMOS LAS FILAS QUE NO MUESTRAN ID O NO EXISTEN EL LA TABLA PRODUCTOS
                    codCom.parentNode.remove()
                };
            }else {
                console.error("Error en la solicitud a la API");
            };
        }catch (error) {
            console.error("Error en la solicitud a la API:", error);
        };
    };
};
///////////////////////////////////ARITMETICA///////////////////////////////////////////////////////////
function operarCantidadARecomprar(){
    const cantidadARecomprar = document.querySelectorAll(".insertarNumero");
    cantidadARecomprar.forEach((e)=>{
        e.addEventListener("keyup",(i)=>{
            i.target.parentNode.parentNode.children[9].textContent = 
                (Number(i.target.value) * Number(i.target.parentNode.parentNode.children[8].children[0].value)).toFixed(2)

            i.target.parentNode.parentNode.children[13].textContent = 
                Number(i.target.value) + Number(i.target.parentNode.parentNode.children[6].textContent)
        });
    });
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function filaBodyProformaPincipal(){
    const fila_modal = document.querySelectorAll(".codigo_compras_modal");
    fila_modal.forEach((event)=>{

        event.parentNode.children[4].children[0].style.background = ""
        event.parentNode.children[7].children[0].style.background = ""
        event.parentNode.children[8].children[0].style.background = ""
        event.parentNode.children[10].children[0].style.background = ""

        if(event.parentNode.children[4].children[0].value !== "" &&
        Number(event.parentNode.children[7].children[0].value) > 0 &&
        event.parentNode.children[7].children[0].value !== "" &&
        Number(event.parentNode.children[8].children[0].value) >= 0 &&
        event.parentNode.children[8].children[0].value !== "" &&
        Number(event.parentNode.children[10].children[0].value) >= Number(event.parentNode.children[8].children[0].value) &&
        event.parentNode.children[10].children[0].value !== ""){
            let fila_principal = document.querySelector("#tabla_principal > tbody");
            let nueva_fila_principal = fila_principal.insertRow(-1);
            let fila = `<tr>
                            <td class="id_compras_proforma invisible">${event.parentNode.children[0].textContent}</td>
                            <td>${event.parentNode.children[1].textContent}</td>
                            <td>${event.parentNode.children[2].textContent}</td>
                            <td class="codigo_compras_proforma">${event.textContent}</td>
                            <td>${event.parentNode.children[4].children[0].value}</td>
                            <td>${event.parentNode.children[5].textContent}</td>
                            <td style="text-align: right">${event.parentNode.children[7].children[0].value}</td>
                            <td style="text-align: right">${event.parentNode.children[8].children[0].value}</td>
                            <td style="text-align: right">${event.parentNode.children[9].textContent}</td>
                            <td style="text-align: right">${event.parentNode.children[10].children[0].value}</td>
                            <td style="text-align: right">${event.parentNode.children[11].textContent}</td>
                            <td style="text-align: right">${event.parentNode.children[12].textContent}</td>
                            <td style="text-align: right" class="invisible">${event.parentNode.children[13].textContent}</td>
                            <td class="invisible">${event.parentNode.children[14].textContent}</td>
                            <td class="invisible">${event.parentNode.children[15].textContent}</td>
                            <td style="text-align: center">
                                <span style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila eliminar_fila_compras">delete</span>
                            </td>
                            <td class="invisible">${event.parentNode.children[17].textContent}</td>
                        </tr>
                        `
            nueva_fila_principal.innerHTML = fila;
        }else if(event.parentNode.children[4].children[0].value === ""){
            event.parentNode.children[4].children[0].style.background = "#b36659"
        }else if(Number(event.parentNode.children[7].children[0].value) <= 0 ||
        event.parentNode.children[7].children[0].value === ""){
            event.parentNode.children[7].children[0].style.background = "#b36659"
        }else if(Number(event.parentNode.children[8].children[0].value) < 0 ||
        event.parentNode.children[8].children[0].value === ""){
            event.parentNode.children[8].children[0].style.background = "#b36659"
        }else if(Number(event.parentNode.children[10].children[0].value) < Number(event.parentNode.children[8].children[0].value) ||
        event.parentNode.children[10].children[0].value === ""){
            event.parentNode.children[10].children[0].style.background = "#b36659"
        };
    });
    eliminarFilaCompras()
};
const mandarATablaRecomprasPrincipal = document.getElementById("procesar-pre-recompra");
mandarATablaRecomprasPrincipal.addEventListener("click", mandarATablaPrincipal)
function mandarATablaPrincipal(e){
    e.preventDefault();
    removerProductoRepetido();
    filaBodyProformaPincipal();
    const borrar = document.querySelectorAll(".insertarNumero");//eliminamos las filas de la tabla modal que si pasaron a la tabla principal
    borrar.forEach((e)=>{
        if(e.value > 0){
            e.parentNode.parentNode.remove()
        }
    })
    let sumaTotalCantidadComprada= 0;
        let sumaTotalCompra = 0;
        let numeroFilasTablaCompras = document.querySelector("#tabla_principal > tbody").rows.length;
        for(let i = 0; i < numeroFilasTablaCompras; i++){
            sumaTotalCompra += Number(document.querySelector("#tabla_principal > tbody").children[i].children[8].innerHTML) 
            sumaTotalCantidadComprada += Number(document.querySelector("#tabla_principal > tbody").children[i].children[6].innerHTML) 
    }
    if(document.querySelector("#tabla_modal > tbody").children.length == 0){
        document.querySelector(".contenedor-pre-recompra").classList.remove("modal-show")
        document.querySelector("#tabla_modal > thead > tr:nth-child(2)").remove()
    }
    document.getElementById("total-importe-tabla-compras").textContent = sumaTotalCompra.toFixed(2);
    document.getElementById("total-cantidad-tabla-compras").textContent = sumaTotalCantidadComprada;
    document.getElementById("formulario-compras-uno").reset()
    document.getElementById("id-compras").value = ""
    document.getElementById("buscador-productos-compras").focus();
};

const procesarComprasPlus = document.querySelector("#procesar-compras-plus");
procesarComprasPlus.addEventListener("click", procesamientoRecompras)
async function procesamientoRecompras(e){
    e.preventDefault();
    try{
        if(document.querySelector("#tabla_principal > tbody").children.length > 0){
            modal_proceso_abrir("Procesando la recompra!!!.", "")
            let obteniendo_numeracion = await cargarNumeracionComprobante();
            if(obteniendo_numeracion.status === 200){
                await realizarRecompra()
                document.querySelector("#tabla_principal > tbody").remove();
                document.querySelector("#tabla_principal").createTBody();
            }else{
                modal_proceso_abrir("La conexión con el servidor no es buena.", "")
                modal_proceso_salir_botones()
            };
        };
    }catch(error){
        modal_proceso_abrir("Ocurrió un error. " + error, "")
        console.error("Ocurrió un error. ", error)
        modal_proceso_salir_botones()
    };
};
async function realizarRecompra(){
    let suma_productos = 0;
    let array_lista_recompra = [];
    function DatosDeRecompra(a){
        this.idProd = a.children[0].textContent;
        this.sucursal_post = sucursales_activas[a.children[14].textContent];
        this.existencias_post = a.children[12].textContent;

        this.comprobante = "Recompra-" + (Number(numeracion[0].recompras) + 1);
        this.existencias_entradas = a.children[6].textContent;
        this.sucursal = a.children[13].textContent;
    };
    const numFilas = document.querySelector("#tabla_principal > tbody").children
    for(let i = 0 ; i < numFilas.length; i++ ){
        if(numFilas[i]){
            let filaPlus = new DatosDeRecompra(numFilas[i]);
            let urlRecompraProducto = URL_API_almacen_central + 'procesar_recompra'
            let response = await funcionFetch(urlRecompraProducto, filaPlus)
            console.log(`Fila ${i+1}: ${response.status}`)
            if(response.status === 200){
                array_lista_recompra.push(filaPlus)
                suma_productos +=1;
                modal_proceso_abrir("Procesando la recompra!!!.", `Producto ejecutado: ${suma_productos} de ${numFilas.length}`)
                console.log(`Producto ejecutado: ${suma_productos} de ${numFilas.length}`)
            }
        };
    };
    if(suma_productos === numFilas.length){
        await funcionRecomprasNumeracion();
    }else{
        modal_proceso_abrir(`Ocurrió un problema en la fila ${suma_productos + 1}`, `Producto ejecutado: ${suma_productos} de ${numFilas.length}`)
        console.log(`Producto ejecutado: ${suma_productos} de ${numFilas.length}`)
        modal_proceso_salir_botones()
    };
};
async function funcionRecomprasNumeracion(){
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
    let urlRecompraComprobante = URL_API_almacen_central + 'numeracion_comprobante'
    let response = await funcionFetch(urlRecompraComprobante, dataComprobante)
    console.log("Respuesta Numeración "+response.status)
    if(response.status === 200){
        modal_proceso_abrir('Operación completada exitosamente.', "")
        modal_proceso_salir_botones()
    };
};
const removerTablaComprasUno = document.getElementById("remover-tabla-compras-uno");
removerTablaComprasUno.addEventListener("click", () =>{
    document.querySelector(".contenedor-pre-recompra").classList.remove("modal-show")
    document.querySelector("#tabla_modal > thead > tr:nth-child(2)").remove()
    document.querySelector("#tabla_modal > tbody").remove();
    document.querySelector("#tabla_modal").createTBody();
    if(comprasNumerador == 0){
        document.getElementById("codigo-compras").focus();
    }else if(comprasNumerador == 1){
        document.getElementById("buscador-productos-compras").focus();
    };
});

const removerTablaComprasDos = document.getElementById("remover-tabla-compras-dos");
removerTablaComprasDos.addEventListener("click", () =>{
    document.querySelector("#tabla_principal > tbody").remove();
    document.querySelector("#tabla_principal").createTBody();
    if(comprasNumerador == 0){
        document.getElementById("codigo-compras").focus();
    }else if(comprasNumerador == 1){
        document.getElementById("buscador-productos-compras").focus();
    };
    
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////GRÁFICOS/////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function cargarComprasMes(){
    let url = URL_API_almacen_central + 'entradas_suma_compras_recompras_mes'
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    comprasMensuales = await respuesta.json();
};
async function cargarComprasLala(){
    let url = URL_API_almacen_central + 'procesar_nuevo_producto'
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    lalin = await respuesta.json();
    console.log(lalin)
};
let colorFondoBarra = ["#E6CA7B","#91E69C","#6380E6","#E66E8D"];
let sucursalesLabel = ["Almacén Central", "Sucursal Uno", "Sucursal Dos", "Sucursal Tres"];
function graficoComprasRecomprasMes(){
    let array_compras = [];
    let array_recompras = [];
    let masAlto = 0;
    document.querySelectorAll(".f_l_g").forEach((event, i)=>{
        event.textContent = arregloMeses[i];
    })
    for(let i = 0; i < 12; i++){
        array_compras.push(0);
        array_recompras.push(0);
        comprasMensuales.forEach((event)=>{
            if(event.mes == i + 1){
                array_compras[i] = event.suma_compra;
                array_recompras[i] = event.suma_recompra;
            }
            if(masAlto < event.suma_compra){masAlto = event.suma_compra}
            if(masAlto < event.suma_recompra){masAlto = event.suma_recompra}
        });
    };
    let masAltoDos = (226 * masAlto)/214;
    document.querySelectorAll(".eje_y_numeracion").forEach((e)=>{
        e.textContent = Number(masAltoDos).toFixed(2)
        masAltoDos -= 0.20 * ((226 * masAlto)/214);
    });
    pintarGraficoPositivo(document.querySelectorAll(".cg_1_c"), array_compras, masAlto, colorFondoBarra[0], document.querySelectorAll(".sg_1_c"))
    pintarGraficoPositivo(document.querySelectorAll(".cg_2_c"), array_recompras, masAlto, colorFondoBarra[2], document.querySelectorAll(".sg_2_c"))
};
function graficoComprasRecomprasPorcentaje(){
    let sum_compras = 0;
    let sum_recompras = 0;
    let total = 0;
    comprasMensuales.forEach((event)=>{
        sum_compras += event.suma_compra
        sum_recompras += event.suma_recompra
    });
    total = sum_compras + sum_recompras;

    let circulo = document.getElementById("circulo_porcentaje_compra_recompra");
    circulo.style.background = `conic-gradient(${colorFondoBarra[2]} ${(1 - (sum_compras/total)) * 360}deg, ${colorFondoBarra[0]} ${(1 - (sum_compras/total)) * 360}deg)`;
    document.querySelector(".nombre_circulo_porcentaje").textContent = `Total: S/ ${total.toFixed(2)}, 100%`
    document.querySelector(".valor_circulo_porcentaje_compras").textContent =  `Compras: S/ ${sum_compras.toFixed(2)}, ${Math.round((sum_compras/total) * 100)}%`
    document.querySelector(".valor_circulo_porcentaje_recompras").textContent =  `Recompras: S/ ${sum_recompras.toFixed(2)}, ${Math.round((sum_recompras/total) * 100)}%`
};