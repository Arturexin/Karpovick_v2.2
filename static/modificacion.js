document.addEventListener("DOMContentLoaded", inicioModificacion)
function inicioModificacion(){
    graficoModificacion()
    btnModificacion = 1;
    cambioSucursalModificacion()
};
let indice_sucursal_modificacion = 0;
function cambioSucursalModificacion(){
    document.getElementById("sucursal-principal").addEventListener("change", (event)=>{
        if(document.getElementById("sucursal-modificacion")){
            document.getElementById("formulario-modificacion").reset();
            indice_sucursal_modificacion = document.getElementById("sucursal-principal").selectedIndex;
            document.getElementById("sucursal-modificacion").value = event.target[indice_sucursal_modificacion].textContent
        };
    });
}

function formulario_registro(){
    let formRegistro = `
    <div class="into_form baja_opacidad_interior">
                    <h2 class="">Registro</h2>
                    <div class="contenedor-label-input-compras">
                        <div>
                            <input class="input-compras fondo" class="caja-texto" type="hidden" id="id-modificacion" name="id-modificacion" />
                            <label class="label-general">Sucursal<input name="sucursal-modificacion" id="sucursal-modificacion" class="input-general fondo" disabled></label>
                            <label class="label-general">Categoría    
                                <select name="categoria-modificacion" id="categoria-modificacion" class="input-general fondo">
                                </select>
                            </label>
                            <label class="label-general">Código<input class="input-general fondo" type="text" id="codigo-modificacion" name="codigo-modificacion"/></label>
                            <label class="label-general">Descripción<input class="input-general fondo" type="text" id="descripcion-modificacion" name="descripcion-modificacion"/></label>
                            <label class="label-general">Costo de Compra<input class="input-general fondo" type="text" id="pcompra-modificacion" name="pcompra-modificacion"/></label>
                            <label class="label-general">Precio de Venta<input class="input-general fondo" type="text" id="pventa-modificacion" name="pventa-modificacion"/></label>
                            <label class="label-general">Lote<input class="input-general fondo" type="text" id="lote-modificacion" name="lote-modificacion"/></label>
                            <label class="label-general">Proveedor
                                <select class="input-general fondo" id="proveedor-modificacion">
                                </select>
                            </label>
                        </div>
                    </div>
                    <div class="boton-cli">
                        <button id="mandar-tabla-modificacion" class="myButtonAgregar">Agregar a Proforma</button>
                        <input type="reset" class="myButtonEliminar">
                    </div> 
    </div>   
                        `;
    document.getElementById("formulario-modificacion").innerHTML = formRegistro;
};
function formulario_edit(){
    let formEdit = `
    <div class="into_form baja_opacidad_interior">
                    <h2 class="">Edición</h2>
                    <div>
                    <input id="buscador-productos-modificacion" type="text" class="input-general-importante fondo-importante" placeholder="Buscar Código"> 
                    </div>
                    <div class="contenedor-label-input-compras">
                        <div>
                            <input class="input-compras fondo" class="caja-texto" type="hidden" id="id-modificacion" name="id-modificacion" />
                            <label class="label-general">Sucursal<input name="sucursal-modificacion" id="sucursal-modificacion" class="input-general fondo" disabled></label>
                            <label class="label-general">Categoría    
                                <select name="categoria-modificacion" id="categoria-modificacion" class="input-general fondo">
                                </select>
                            </label>
                            <label class="label-general">Código<input class="input-general fondo" type="text" id="codigo-modificacion" name="codigo-modificacion"/></label>
                            <label class="label-general">Descripción<input class="input-general fondo" type="text" id="descripcion-modificacion" name="descripcion-modificacion"/></label>
                        </div>
                    </div>
                    <div class="boton-cli">
                        <button id="mandar-editar-modificacion" class="myButtonAgregar">Agregar a Proforma</button>
                        <input type="reset" class="myButtonEliminar">
                    </div> 
    </div>    
                        `;
    document.getElementById("formulario-modificacion").innerHTML = formEdit;
};

let modificacionNumerador = 0;
const botonRegistrarRegistro = document.getElementById("registra-modificacion");
botonRegistrarRegistro.addEventListener("click", mostrarFormRegistro)
function mostrarFormRegistro(e){
    e.preventDefault();
    formulario_registro()

    llenarCategoriaProductosEjecucion("#categoria-modificacion")
    baseProv("#proveedor-modificacion")

    indice_sucursal_modificacion = document.getElementById("sucursal-principal").selectedIndex;
    document.getElementById("sucursal-modificacion").value = document.querySelector("#sucursal-principal").children[indice_sucursal_modificacion].textContent
    document.getElementById("registra-modificacion").classList.add("marcaBoton")
    document.getElementById("editar-modificacion").classList.remove("marcaBoton")
    document.getElementById("codigo-modificacion").focus();
    document.querySelector(".baja_opacidad_interior").classList.add("alta_opacidad_interior")
    document.getElementById("procesar-modificacion-uno").classList.remove("invisible")
    document.getElementById("procesar-modificacion-dos").classList.add("invisible")
    document.getElementById("procesar-registro").classList.remove("invisible")
    document.getElementById("procesar-modificacion-principal").classList.add("invisible")
    document.getElementById("id-modificacion").value = ""
    document.querySelector("#tabla-pre-modificacion > tbody").remove()
    document.querySelector("#tabla-pre-modificacion").createTBody()
    document.querySelector("#tabla-proforma-modificacion > tbody").remove()
    document.querySelector("#tabla-proforma-modificacion").createTBody()

    modificacionNumerador = 0;
    const mandarNuevoProductoATabla = document.getElementById("mandar-tabla-modificacion");
    mandarNuevoProductoATabla.addEventListener("click", agregarNuevoProductoATablaModificacion)
};
const botonEditarProducto = document.getElementById("editar-modificacion");
botonEditarProducto.addEventListener("click", (e) =>{
    e.preventDefault();
    formulario_edit()
    llenarCategoriaProductosEjecucion("#categoria-modificacion");

    indice_sucursal_modificacion = document.getElementById("sucursal-principal").selectedIndex;
    document.getElementById("registra-modificacion").classList.remove("marcaBoton")
    document.getElementById("editar-modificacion").classList.add("marcaBoton")
    document.getElementById("buscador-productos-modificacion").focus();
    document.querySelector(".baja_opacidad_interior").classList.add("alta_opacidad_interior") 
    document.getElementById("categoria-modificacion").setAttribute("disabled", "true")
    document.getElementById("codigo-modificacion").setAttribute("disabled", "true")
    document.getElementById("descripcion-modificacion").setAttribute("disabled", "true")  
    document.getElementById("procesar-modificacion-uno").classList.add("invisible")
    document.getElementById("procesar-modificacion-dos").classList.remove("invisible")
    document.getElementById("procesar-registro").classList.add("invisible")
    document.getElementById("procesar-modificacion-principal").classList.remove("invisible")                
    document.getElementById("id-modificacion").value = ""
    document.querySelector("#tabla-pre-modificacion > tbody").remove()
    document.querySelector("#tabla-pre-modificacion").createTBody()
    document.querySelector("#tabla-proforma-modificacion > tbody").remove()
    document.querySelector("#tabla-proforma-modificacion").createTBody()

    modificacionNumerador = 1;
    const mandarATablaModificacion = document.getElementById("mandar-editar-modificacion");
    mandarATablaModificacion.addEventListener("click", agregarATablaPreModificacion)
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////REGISTRAR PRODUCTOS//////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let codigoComprobacionRegistro = ""
function marcarCodigoRepetido(){//verificamos que el nuevo producto no tenga el mismo código en la tabla proforma modificación
    const codigoRegistroComparacion = document.querySelectorAll(".codigo-registro-comparacion");
    codigoRegistroComparacion.forEach((event) => {
        document.querySelectorAll(".codigo-comparacion-tabla-proforma-modificacion").forEach((elemento) => {
            if(elemento.textContent.toLocaleLowerCase().includes(event.value.toLocaleLowerCase()) &&
                elemento.parentNode.children[1].textContent === document.getElementById("sucursal-principal").value){
                    let respuesta = confirm('El código ' + elemento.textContent + ' en ' + elemento.parentNode.children[1].textContent + " ya existe en la tabla Lista de Compras, si continúa se remplazará por este nuevo código, ¿Desea continuar?.")
                    if(respuesta){
                        elemento.parentNode.style.background = "#b36659"
                    }else{
                        event.parentNode.parentNode.remove();
                    }
            }
        });
    });
};
function removerCodigoRepetido(){//verificamos que el nuevo producto no tenga el mismo código en la tabla proforma modificación
    const codigoRegistroComparacion = document.querySelectorAll(".codigo-registro-comparacion");
    codigoRegistroComparacion.forEach((event) => {
        document.querySelectorAll(".codigo-comparacion-tabla-proforma-modificacion").forEach((elemento) => {
            if(elemento.textContent.toLocaleLowerCase().includes(event.value.toLocaleLowerCase()) && 
                event.parentNode.parentNode.children[1].textContent === elemento.parentNode.children[1].textContent &&
                event.parentNode.parentNode.children[6].children[0].value > 0){
                elemento.parentNode.remove()
            }
        });
    });
};
function crearBodyRegistro(tallaRegistro, loteRegistro){
    let tablaRegistro = document.querySelector("#tabla-pre-modificacion > tbody");
    let nuevaFilaTablaRegistro = tablaRegistro.insertRow(-1);
    let fila = `<tr>
                    <td class="invisible"></td>
                    <td>${document.getElementById("sucursal-modificacion").value}</td>
                    <td>${document.getElementById("categoria-modificacion").children[document.getElementById("categoria-modificacion").selectedIndex].textContent}</td>
                    <td class="codigo-registro-comparacion" style="background: rgb(105, 211, 35)">${document.getElementById("codigo-modificacion").value + "-" + tallaRegistro + "-" + loteRegistro}</td>
                    <td><input class="input-tablas-texto-largo" value="${document.getElementById("descripcion-modificacion").value}"></td>
                    <td>${tallaRegistro}</td>
                    <td><input class="input-tablas-dos-largo existencias-modificacion"></td>
                    <td><input class="input-tablas-dos-largo costo-unitario-modificacion" value="${(Number(document.getElementById("pcompra-modificacion").value)).toFixed(2)}"></td>
                    <td style="text-align: right"></td>
                    <td><input class="input-tablas-dos-largo" value="${(Number(document.getElementById("pventa-modificacion").value)).toFixed(2)}"></td>
                    <td>${document.getElementById("lote-modificacion").value}</td>
                    <td>${document.getElementById("proveedor-modificacion").value}</td>
                    <td class="invisible"></td>
                    <td class="invisible">${document.getElementById("sucursal-principal").value}</td>
                    <td class="invisible">${indice_sucursal_modificacion}</td>
                    <td style="text-align: center">
                        <span style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila eliminar_fila_compras">delete</span>
                    </td>
                    <td class="invisible">${document.getElementById("categoria-modificacion").value}</td>
                </tr>
                `
    nuevaFilaTablaRegistro.innerHTML = fila;
    codigoComprobacionRegistro = document.getElementById("codigo-modificacion").value + "-" + tallaRegistro + "-" + loteRegistro
    eliminarFilaCompras()
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////PASAR DATOS DE FORMULARIO A TABLA DE MODIFICACIÓN///////////////////////////////////////////////
let arrayCreacionCategoriaTallasModificacion = [];

function agregarNuevoProductoATablaModificacion(e){
    e.preventDefault();
    if(expregul.codigo.test(document.getElementById("codigo-modificacion").value) &&
    expregul.descripcion.test(document.getElementById("descripcion-modificacion").value) &&
    expregul.cantidad.test(document.getElementById("lote-modificacion").value) &&
    expregul.precios.test(document.getElementById("pcompra-modificacion").value) &&
    expregul.precios.test(document.getElementById("pventa-modificacion").value)){
        ///////////////////////////////////////////////////////////////////////////////
        document.querySelector(".contenedor-pre-modificacion").classList.add("modal-show-modificacion");
        categoriaProductosCreacion("categoria-modificacion", arrayCreacionCategoriaTallasModificacion);
        compararCodigosNuevos(".codigo-registro-comparacion", codigoComprobacionRegistro, ".label-modificacion");
        ///////////////////////////////////////////////////////////////////////////////
        arrayCreacionCategoriaTallasModificacion.forEach((event) =>{
            crearBodyRegistro(event, document.getElementById("lote-modificacion").value)
        });
        document.getElementById("categoria-modificacion").style.background = ""
        document.getElementById("codigo-modificacion").style.background = ""
        document.getElementById("descripcion-modificacion").style.background = ""
        document.getElementById("lote-modificacion").style.background = ""
        document.getElementById("pcompra-modificacion").style.background = ""
        document.getElementById("pventa-modificacion").style.background = ""
        document.getElementById("proveedor-modificacion").style.background = ""
        document.querySelector("#formulario-modificacion").reset();
        document.getElementById("sucursal-modificacion").value = document.querySelector("#sucursal-principal").children[indice_sucursal_modificacion].textContent

        operacionCostoTotalModificacion();
        comprobarCodigoProductos(".codigo-registro-comparacion");
        marcarCodigoRepetido();
        arrayCreacionCategoriaTallasModificacion = [];
        document.querySelector("#tabla-pre-modificacion > tbody > tr:nth-child(1) > td:nth-child(7) > input").focus()

    }else if(expregul.codigo.test(document.getElementById("codigo-modificacion").value) == false){
        document.getElementById("codigo-modificacion").style.background ="#b36659"
    }else if(expregul.descripcion.test(document.getElementById("descripcion-modificacion").value) == false){
        document.getElementById("descripcion-modificacion").style.background ="#b36659"
    }else if(expregul.precios.test(document.getElementById("pcompra-modificacion").value) == false){
        document.getElementById("pcompra-modificacion").style.background ="#b36659"
    }else if(expregul.precios.test(document.getElementById("pventa-modificacion").value) == false){
        document.getElementById("pventa-modificacion").style.background ="#b36659"
    }else if(expregul.cantidad.test(document.getElementById("lote-modificacion").value) == false){
        document.getElementById("lote-modificacion").style.background ="#b36659"
    }
    
};
function filaBodyProformaPincipal(){
    const fila_modal = document.querySelectorAll(".codigo-registro-comparacion");
    fila_modal.forEach((event)=>{
        if(Number(event.parentNode.children[8].textContent) >= 0 &&
        event.parentNode.children[4].children[0].value != "" &&
        Number(event.parentNode.children[9].children[0].value) > 0 &&
        event.parentNode.children[11].textContent != ""){
            let fila_principal = document.querySelector("#tabla-proforma-modificacion > tbody");
            let nueva_fila_principal = fila_principal.insertRow(-1);
            let fila = `<tr>
                        <td class="id_compras_modal invisible">${event.parentNode.children[0].textContent}</td>
                        <td>${event.parentNode.children[1].textContent}</td>
                        <td>${event.parentNode.children[2].textContent}</td>
                        <td class="codigo-comparacion-tabla-proforma-modificacion">${event.textContent}</td>
                        <td>${event.parentNode.children[4].children[0].value}</td>
                        <td>${event.parentNode.children[5].textContent}</td>
                        <td style="text-align: right">${event.parentNode.children[6].children[0].value}</td>
                        <td style="text-align: right">${event.parentNode.children[7].children[0].value}</td>
                        <td style="text-align: right">${event.parentNode.children[8].textContent}</td>
                        <td style="text-align: right">${event.parentNode.children[9].children[0].value}</td>
                        <td style="text-align: right">${event.parentNode.children[10].textContent}</td>
                        <td style="text-align: right">${event.parentNode.children[11].textContent}</td>
                        <td class="invisible"></td>
                        <td class="invisible">${event.parentNode.children[13].textContent}</td>
                        <td class="invisible">${event.parentNode.children[14].textContent}</td>
                        <td style="text-align: center">
                            <span style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila eliminar_fila_compras">delete</span>
                        </td>
                        <td class="invisible">${event.parentNode.children[16].textContent}</td>
                    </tr>
                    `
            nueva_fila_principal.innerHTML = fila;
        };
    });
    eliminarFilaCompras()
};
const procesarIngresarNuevo = document.getElementById("procesar-modificacion-uno");
procesarIngresarNuevo.addEventListener("click", (e) => {
    e.preventDefault();
    removerCodigoRepetido();
    filaBodyProformaPincipal()
    const borrar = document.querySelectorAll(".existencias-modificacion");//eliminamos las filas que si pasaron a la tabla principal
    borrar.forEach((e)=>{
        if(e.value >= 0){
            e.parentNode.parentNode.remove();
        }else{
            e.style.background = "#b36659"
        };
    });
    if(document.querySelector("#tabla-pre-modificacion > tbody").children.length == 0){
        document.querySelector(".contenedor-pre-modificacion").classList.remove("modal-show-modificacion")
    }
    document.getElementById("formulario-modificacion").reset()
    document.getElementById("sucursal-modificacion").value = document.querySelector("#sucursal-principal").children[indice_sucursal_modificacion].textContent
    document.getElementById("id-modificacion").value = ""
    document.getElementById("codigo-modificacion").focus();
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const procesarRegistro = document.getElementById("procesar-registro");
procesarRegistro.addEventListener("click", procesamientoRegistros)
async function procesamientoRegistros(e){
    e.preventDefault();
    try{
        if(document.querySelector("#tabla-proforma-modificacion > tbody").children.length > 0){
            await funcionRegistrosProductos();
        };
    }catch(error){
        alert("Ocurrió un error. " + error);
        console.error("Ocurrió un error. ", error)
    };
};
async function funcionRegistrosProductos(){
    let suma_productos = 0;
    function EnviarRegistroAProductos(a){
        let array = [0,0,0,0]

        this.categoria= a.children[16].textContent;
        this.codigo= a.children[3].textContent;
        this.costo_unitario= a.children[7].textContent;
        this.descripcion= a.children[4].textContent;
        this.lote= a.children[10].textContent;
        this.precio_venta= a.children[9].textContent;
        this.proveedor= a.children[11].textContent;
        this.talla= a.children[5].textContent;

        for(let i = 0; i < array.length; i++){
            if(a.children[14].textContent == i && a.children[6].textContent > 0){
                array[i] = a.children[6].textContent
            }
        };
        this.existencias_ac = array[0];
        this.existencias_su = array[1];
        this.existencias_sd = array[2];
        this.existencias_st = array[3];
    };
    let cantidadDeFilasRegistro = document.querySelector("#tabla-proforma-modificacion > tbody").rows.length;
    for(let i = 0 ; i < cantidadDeFilasRegistro; i++ ){
        if(document.querySelector("#tabla-proforma-modificacion > tbody").children[i]){
            let filaRegistro = new EnviarRegistroAProductos(document.querySelector("#tabla-proforma-modificacion > tbody").children[i]);
            let url = URL_API_almacen_central + 'almacen_central'
            let response = await funcionFetch(url, filaRegistro)
            console.log("Respuesta Productos "+response.status)
            if(response.status === 200){
                suma_productos +=1;
            }
        };
    };
    if(suma_productos === cantidadDeFilasRegistro){
        await encontrarIdProductosRegistro();
    }else{
        alert(`Ocurrió un problema en la fila ${suma_productos + 1}`)
    };
};
async function encontrarIdProductosRegistro(){//busca el id del nuevo producto el almacén central para grabar la compra en entradas
    let suma_id_productos = 0;
    let codigoNuevo;
    let codigoComparador = document.querySelectorAll(".codigo-comparacion-tabla-proforma-modificacion")
    for(cod of codigoComparador){
        let url = URL_API_almacen_central + `almacen_central_codigo_sucursal/${cod.textContent}?`+
                                            `sucursal_get=${sucursales_activas[indice_sucursal_modificacion]}`
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
        };
    };
    if(suma_id_productos === codigoComparador.length){
        await funcionRegistrosEntradas();
    }else{
        alert(`Ocurrió un problema en la fila ${suma_id_productos + 1}`)
    };
};
async function funcionRegistrosEntradas(){
    let suma_entradas = 0;
    function EnviarAEntradas(a){
        this.idProd = a.children[12].textContent;
        this.sucursal = a.children[13].textContent;
        this.causa_devolucion = 0;
        this.fecha = fechaPrincipal;
        this.comprobante = "Traspaso";
        this.existencias_entradas = a.children[6].textContent;
        this.usuario = document.getElementById("identificacion_usuario_id").textContent;
        this.existencias_devueltas = 0;
    };
    let cantidadDeFilas = document.querySelector("#tabla-proforma-modificacion > tbody").rows.length;
    for(let i = 0 ; i < cantidadDeFilas; i++ ){
        if(Number(document.querySelector("#tabla-proforma-modificacion > tbody").children[i].children[12].textContent) > 0 &&
        Number(document.querySelector("#tabla-proforma-modificacion > tbody").children[i].children[6].textContent) > 0){
            let filaUnoEntradas = new EnviarAEntradas(document.querySelector("#tabla-proforma-modificacion > tbody").children[i]);
            let urlCompraEntradas = URL_API_almacen_central + 'entradas'
            let response = await funcionFetch(urlCompraEntradas, filaUnoEntradas)
            console.log("Respuesta Entradas "+response.status)
            if(response.status === 200){
                suma_entradas +=1;
            }
        };
    };
    if(suma_entradas === cantidadDeFilas){
        alert("Operación completada exitosamente. (Entradas: Traspaso)")
        document.querySelector("#tabla-proforma-modificacion  > tbody").remove();
        document.querySelector("#tabla-proforma-modificacion ").createTBody();
        await cargarDatosProductosCCD();
        localStorage.setItem("base_datos_consulta", JSON.stringify(productosCCD))
    }else if(suma_entradas == 0){
        alert("Operación completada exitosamente.")
        document.querySelector("#tabla-proforma-modificacion  > tbody").remove();
        document.querySelector("#tabla-proforma-modificacion ").createTBody();
        await cargarDatosProductosCCD();
        localStorage.setItem("base_datos_consulta", JSON.stringify(productosCCD))
    }else{
        alert(`Ocurrió un problema en la fila ${suma_entradas + 1}`)
    };
    
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////MODIFICACION DE PRODUCTOS/////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////BUSCAR EN PRODUCTOS /////////////////////////////////////////////////////
document.addEventListener("keyup", () =>{
    if(modificacionNumerador == 0){
        return;
    }else{
        indice_base = JSON.parse(localStorage.getItem("base_datos_consulta"))
        let almacenCentral = indice_base.find(y => y.codigo.toLowerCase().startsWith(document.getElementById('buscador-productos-modificacion').value.toLocaleLowerCase()))
        if(indice_base.find(y => y.codigo.toLowerCase().startsWith(document.getElementById('buscador-productos-modificacion').value.toLocaleLowerCase()))){
            document.getElementById('id-modificacion').value = almacenCentral.idProd
            indice_sucursal_modificacion = document.getElementById("sucursal-principal").selectedIndex;
            document.getElementById('sucursal-modificacion').value = document.getElementById("sucursal-principal").children[indice_sucursal_modificacion].textContent
            document.getElementById('categoria-modificacion').value = almacenCentral.categoria
            document.getElementById('codigo-modificacion').value = almacenCentral.codigo
            document.getElementById('descripcion-modificacion').value = almacenCentral.descripcion
            if(document.getElementById('buscador-productos-modificacion').value > 0 || document.getElementById('buscador-productos-modificacion').value == ""){
                document.getElementById("formulario-modificacion").reset();
            }
        };
    };
    
});
function eliminarFilaCompras(){
    document.querySelectorAll(".eliminar_fila_compras").forEach((event)=>{
        event.addEventListener("click", ()=>{
            event.parentNode.parentNode.remove()
        })
    });
};
function crearBodyModificacion(codigoModificacion){
    let tablaMofidicacion = document.querySelector("#tabla-pre-modificacion > tbody");
    let nuevaFilaTablaModificacion = tablaMofidicacion.insertRow(-1);
    let fila = `<tr>
                    <td class="id-modificacion-comprobacion-proforma invisible"></td>
                    <td>${document.getElementById("sucursal-modificacion").value}</td>
                    <td>
                        <select class="categoria_cambio">
                        </select>
                    </td>
                    <td><input class="codigo-registro-comparacion input-tablas" value="${codigoModificacion}"></td>
                    <td><input class="input-tablas-texto-largo"></td>
                    <td></td>
                    <td><input class="existencias-modificacion input-tablas-dos-largo"></td>
                    <td><input class="costo-unitario-modificacion input-tablas-dos-largo"></td>
                    <td style="text-align: right"></td>
                    <td><input class="input-tablas-dos-largo"></td>
                    <td><input class="input-tablas-dos"></td>

                    <td>
                        <select class="proveedor_cambio">
                        </select>
                    </td>

                    <td class="invisible"></td>
                    <td class="invisible">${document.getElementById("sucursal-principal").value}</td>
                    <td class="invisible">${indice_sucursal_modificacion}</td>
                    <td style="text-align: center">
                        <span style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila eliminar_fila_compras">delete</span>
                    </td>
                    <td class="invisible">${document.getElementById("categoria-modificacion").value}</td>
                </tr>
                `
    nuevaFilaTablaModificacion.innerHTML = fila;
    eliminarFilaCompras()
    rellenarCategoria()
    rellenarProveedor()
};

/////AQUI MANDAMOS A TABLA PREMODIFICACION PARA EDITAR VALORES/////////////////////////////////////////////////////////////

function agregarATablaPreModificacion(e){
    e.preventDefault();
    if(document.getElementById("id-modificacion").value > 0){
        document.querySelector(".contenedor-pre-modificacion").classList.add("modal-show-modificacion");
    };
    categoriaProductosCreacion("categoria-modificacion", arrayCreacionCategoriaTallasModificacion);
    for(let i = 0; i < arrayCreacionCategoriaTallasModificacion.length; i++){
        if(document.getElementById("id-modificacion").value > 0){
            let codigoModificacion = document.getElementById("codigo-modificacion").value
            if(codigoModificacion.includes("-" + arrayCreacionCategoriaTallasModificacion[0])){
                codigoModificacion = codigoModificacion.replace("-" + arrayCreacionCategoriaTallasModificacion[0], "-" + arrayCreacionCategoriaTallasModificacion[i])
            }else if(codigoModificacion.includes("-" + arrayCreacionCategoriaTallasModificacion[1])){
                codigoModificacion = codigoModificacion.replace("-" + arrayCreacionCategoriaTallasModificacion[1], "-" + arrayCreacionCategoriaTallasModificacion[i])
            }else if(codigoModificacion.includes("-" + arrayCreacionCategoriaTallasModificacion[2])){
                codigoModificacion = codigoModificacion.replace("-" + arrayCreacionCategoriaTallasModificacion[2], "-" + arrayCreacionCategoriaTallasModificacion[i])
            }else if(codigoModificacion.includes("-" + arrayCreacionCategoriaTallasModificacion[3])){
                codigoModificacion = codigoModificacion.replace("-" + arrayCreacionCategoriaTallasModificacion[3], "-" + arrayCreacionCategoriaTallasModificacion[i])
            }else if(codigoModificacion.includes("-" + arrayCreacionCategoriaTallasModificacion[4])){
                codigoModificacion = codigoModificacion.replace("-" + arrayCreacionCategoriaTallasModificacion[4], "-" + arrayCreacionCategoriaTallasModificacion[i])
            }else if(codigoModificacion.includes("-" + arrayCreacionCategoriaTallasModificacion[5])){
                codigoModificacion = codigoModificacion.replace("-" + arrayCreacionCategoriaTallasModificacion[5], "-" + arrayCreacionCategoriaTallasModificacion[i])
            }else if(codigoModificacion.includes("-" + arrayCreacionCategoriaTallasModificacion[6])){
                codigoModificacion = codigoModificacion.replace("-" + arrayCreacionCategoriaTallasModificacion[6], "-" + arrayCreacionCategoriaTallasModificacion[i])
            }else if(codigoModificacion.includes("-" + arrayCreacionCategoriaTallasModificacion[7])){
                codigoModificacion = codigoModificacion.replace("-" + arrayCreacionCategoriaTallasModificacion[7], "-" + arrayCreacionCategoriaTallasModificacion[i])
            }else if(codigoModificacion.includes("-" + arrayCreacionCategoriaTallasModificacion[8])){
                codigoModificacion = codigoModificacion.replace("-" + arrayCreacionCategoriaTallasModificacion[8], "-" + arrayCreacionCategoriaTallasModificacion[i])
            }else if(codigoModificacion.includes("-" + arrayCreacionCategoriaTallasModificacion[9])){
                codigoModificacion = codigoModificacion.replace("-" + arrayCreacionCategoriaTallasModificacion[9], "-" + arrayCreacionCategoriaTallasModificacion[i])
            }else if(codigoModificacion.includes("-" + arrayCreacionCategoriaTallasModificacion[10])){
                codigoModificacion = codigoModificacion.replace("-" + arrayCreacionCategoriaTallasModificacion[10], "-" + arrayCreacionCategoriaTallasModificacion[i])
            }else if(codigoModificacion.includes("-" + arrayCreacionCategoriaTallasModificacion[11])){
                codigoModificacion = codigoModificacion.replace("-" + arrayCreacionCategoriaTallasModificacion[11], "-" + arrayCreacionCategoriaTallasModificacion[i])
            }
            crearBodyModificacion(codigoModificacion);
        };
    };
    
    buscarPorCodidoModificacionOrigen();
    marcarCodigoRepetido();
    operacionCostoTotalModificacion()
    arrayCreacionCategoriaTallasModificacion = [];
};
function rellenarCategoria(){
    cat_con = JSON.parse(localStorage.getItem("categoria_consulta"))
    let html_cat = "";
    document.querySelectorAll(".categoria_cambio").forEach((event)=>{
        html_cat = "";
        for(categoria of cat_con) {
            let fila = `<option value="${categoria.id}">${categoria.categoria_nombre}</option>`
            html_cat = html_cat + fila;
        };
        event.innerHTML = html_cat
    });
};

function rellenarProveedor(){
    prov_con = JSON.parse(localStorage.getItem("base_datos_prov"))
    let html_prov = "";
    document.querySelectorAll(".proveedor_cambio").forEach((event)=>{
        html_prov = "";
        for(proveedor of prov_con) {
            let fila = `<option value="${proveedor.id_cli}">${proveedor.nombre_cli}</option>`
            html_prov = html_prov + fila;
        };
        event.innerHTML = html_prov
    });
};
async function buscarPorCodidoModificacionOrigen(){
    const codigoComparacion = document.querySelectorAll(".codigo-registro-comparacion");
    for(codMod of codigoComparacion){
        try{
            let url = URL_API_almacen_central + `almacen_central_codigo_sucursal/${codMod.value}?`+
                                                `sucursal_get=${sucursales_activas[indice_sucursal_modificacion]}`
            let response = await fetch(url,{
                "method": "GET",
                "headers": {
                    "Content-Type": 'application/json'
                }
            });
            if(response.ok){
                const datoCodigoUnitario = await response.json();
                if(datoCodigoUnitario.codigo){
                    codMod.parentNode.parentNode.children[0].textContent = datoCodigoUnitario.idProd
                    codMod.parentNode.parentNode.children[1].textContent = document.querySelector("#sucursal-principal").children[indice_sucursal_modificacion].textContent
                    codMod.parentNode.parentNode.children[2].children[0].value = datoCodigoUnitario.categoria
                    codMod.parentNode.parentNode.children[4].children[0].value = datoCodigoUnitario.descripcion
                    codMod.parentNode.parentNode.children[5].textContent = datoCodigoUnitario.talla
                    codMod.parentNode.parentNode.children[6].children[0].value = datoCodigoUnitario.sucursal_get
                    codMod.parentNode.parentNode.children[7].children[0].value = datoCodigoUnitario.costo_unitario.toFixed(2)
                    codMod.parentNode.parentNode.children[8].textContent = datoCodigoUnitario.costo_unitario.toFixed(2) * datoCodigoUnitario.sucursal_get
                    codMod.parentNode.parentNode.children[9].children[0].value = datoCodigoUnitario.precio_venta.toFixed(2)
                    codMod.parentNode.parentNode.children[10].children[0].value = datoCodigoUnitario.lote
                    codMod.parentNode.parentNode.children[11].children[0].value = datoCodigoUnitario.proveedor
                    if(codMod.parentNode.parentNode.children[0].textContent == document.getElementById("id-modificacion").value){
                        codMod.style.background = "rgb(105, 211, 35)"
                    };
                };
                if(codMod.parentNode.parentNode.children[0].textContent  < 1){//OCULTAMOS LAS FILAS QUE NO MUESTRAN ID O NO EXISTEN EL LA TABLA PRODUCTOS
                    codMod.parentNode.parentNode.remove()
                };
                
                
            }else {
                console.error("Error en la solicitud a la API");
            };
        }catch (error) {
            console.error("Error en la solicitud a la API:", error);
        };
    };
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function operacionCostoTotalModificacion(){
    const existenciasModificacion = document.querySelectorAll(".existencias-modificacion");
    existenciasModificacion.forEach((event)=>{
        event.addEventListener("keyup", (e) => {
            e.target.parentNode.parentNode.children[8].textContent = (Number(e.target.parentNode.parentNode.children[7].children[0].value *
                e.target.value)).toFixed(2)
        });
    });
    const costoUnitarioModificacion = document.querySelectorAll(".costo-unitario-modificacion");
    costoUnitarioModificacion.forEach((event)=>{
        event.addEventListener("keyup", (e) => {
            e.target.parentNode.parentNode.children[8].textContent = (Number(e.target.parentNode.parentNode.children[6].children[0].value *
                e.target.value)).toFixed(2)
        });
    });
};
/////////AQUI SE MANDA A TABLA MODIFICACION PRINCIPAL CON VALORES YA EDITADOS////////////////////////////////////////////////////////////////
const procesarModificar = document.getElementById("procesar-modificacion-dos");
procesarModificar.addEventListener("click", (e) => {
    e.preventDefault();
    removerCodigoRepetido();
    filaBodyProformaPincipalDos();

    document.querySelector("#tabla-pre-modificacion > tbody").remove();
    document.querySelector("#tabla-pre-modificacion").createTBody();
    document.getElementById("formulario-modificacion").reset()
    document.getElementById("id-modificacion").value = ""
    document.querySelector(".contenedor-pre-modificacion").classList.remove("modal-show-modificacion");
    document.getElementById("buscador-productos-modificacion").focus();
});
function filaBodyProformaPincipalDos(){
    
    const fila_modal = document.querySelectorAll(".codigo-registro-comparacion");
    fila_modal.forEach((event)=>{
        if(Number(event.parentNode.parentNode.children[8].textContent) >= 0 &&
        event.parentNode.parentNode.children[4].children[0].value != "" &&
        Number(event.parentNode.parentNode.children[9].children[0].value) > 0 &&
        event.parentNode.parentNode.children[11].children[0].value != ""){
            let fila_principal = document.querySelector("#tabla-proforma-modificacion > tbody");
            let nueva_fila_principal = fila_principal.insertRow(-1);
            let fila = `<tr>
                            <td class="id_compras_modal invisible">${event.parentNode.parentNode.children[0].textContent}</td>
                            <td>${event.parentNode.parentNode.children[1].textContent}</td>
                            <td>${event.parentNode.parentNode.children[2].children[0].children[event.parentNode.parentNode.children[2].children[0].selectedIndex].textContent}</td>
                            <td class="codigo-comparacion-tabla-proforma-modificacion">${event.value}</td>
                            <td>${event.parentNode.parentNode.children[4].children[0].value}</td>
                            <td>${event.parentNode.parentNode.children[5].textContent}</td>
                            <td style="text-align: right">${event.parentNode.parentNode.children[6].children[0].value}</td>
                            <td style="text-align: right">${event.parentNode.parentNode.children[7].children[0].value}</td>
                            <td style="text-align: right">${event.parentNode.parentNode.children[8].textContent}</td>
                            <td style="text-align: right">${event.parentNode.parentNode.children[9].children[0].value}</td>
                            <td style="text-align: right">${event.parentNode.parentNode.children[10].children[0].value}</td>
                            <td style="text-align: right">${event.parentNode.parentNode.children[11].children[0].value}</td>
                            <td class="invisible"></td>
                            <td class="invisible">${event.parentNode.parentNode.children[13].textContent}</td>
                            <td class="invisible">${event.parentNode.parentNode.children[14].textContent}</td>
                            <td style="text-align: center">
                                <span style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila eliminar_fila_compras">delete</span>
                            </td>
                            <td class="invisible">${event.parentNode.parentNode.children[2].children[0].value}</td>
                        </tr>
                        `
            nueva_fila_principal.innerHTML = fila;
            eliminarFilaCompras()
        };
    });
};
const procesarModificacionAProductos = document.getElementById("procesar-modificacion-principal");
procesarModificacionAProductos.addEventListener("click", mandarModificacionAProductos)
async function mandarModificacionAProductos(e){
    e.preventDefault();
    let suma_productos = 0;
    if(document.querySelector("#tabla-proforma-modificacion > tbody").children.length > 0){
        function EnviarAProducto(a){
            this.idProd = a.children[0].textContent;
            this.categoria = a.children[16].textContent;
            this.codigo = a.children[3].textContent;
            this.costo_unitario = a.children[7].textContent;
            this.descripcion = a.children[4].textContent;
            this.lote = a.children[10].textContent;
            this.precio_venta = a.children[9].textContent;
            this.proveedor = a.children[11].textContent;
            this.talla = a.children[5].textContent;
            this.sucursal_post = sucursales_activas[a.children[14].textContent];
            this.existencias_post = a.children[6].textContent;
        };
        let cantidadDeFilas = document.querySelector("#tabla-proforma-modificacion > tbody").rows.length;
        for(let i = 0 ; i < cantidadDeFilas; i++ ){
            let editProducto = new EnviarAProducto(document.querySelector("#tabla-proforma-modificacion > tbody").children[i]);
            let url = URL_API_almacen_central + 'almacen_central';
            let response = await funcionFetch(url, editProducto);
            console.log("Respuesta Productos "+response.status)
            if(response.status === 200){
                suma_productos +=1;
            }
        };
        if(suma_productos === cantidadDeFilas){
            alert("Modificación exitosa.")
            document.querySelector("#tabla-proforma-modificacion > tbody").remove();
            document.querySelector("#tabla-proforma-modificacion").createTBody();
            await cargarDatosProductosCCD();
            localStorage.setItem("base_datos_consulta", JSON.stringify(productosCCD))
        }else{
            alert(`Ocurrió un problema en la fila ${suma_productos + 1}`)
        };
    };
};

const removerTablaModificacionUno = document.getElementById("remover-tabla-modificacion-uno");
removerTablaModificacionUno.addEventListener("click", () =>{
    document.querySelector(".contenedor-pre-modificacion").classList.remove("modal-show-modificacion");
    document.querySelector("#tabla-pre-modificacion > tbody").remove();
    document.querySelector("#tabla-pre-modificacion").createTBody();
    document.getElementById("codigo-modificacion").focus();
    if(modificacionNumerador == 0){
        document.getElementById("codigo-modificacion").focus();
    }else if(modificacionNumerador == 1){
        document.getElementById("buscador-productos-modificacion").focus();
    };
});
const removerTablaModificacionDos = document.getElementById("remover-tabla-modificacion-dos");
removerTablaModificacionDos.addEventListener("click", () =>{
    document.querySelector(".contenedor-pre-modificacion").classList.remove("modal-show-modificacion");
    document.querySelector("#tabla-proforma-modificacion > tbody").remove();
    document.querySelector("#tabla-proforma-modificacion").createTBody();
    if(modificacionNumerador == 0){
        document.getElementById("codigo-modificacion").focus();
    }else if(modificacionNumerador == 1){
        document.getElementById("buscador-productos-modificacion").focus();
    };
    
});
//////////////////////GRÁFICOS////////////////////////////////////////////////////////////////
let colorFondoBarra = ["#E6CA7B","#91E69C","#6380E6","#E66E8D"];
async function graficoModificacion(){
    await cargarTraspasosMes();
    let array_t = [];
    let sumaMasAlto = 0;
    document.querySelectorAll(".f_l_g").forEach((event, i)=>{
        event.textContent = arregloMeses[i];
    })
    for(let i = 0; i < 12; i++){
        array_t.push(0);
        traspasosMensuales.forEach((event)=>{
            if(event.mes == i + 1){
                array_t[i] = event.suma_traspasos_entradas;
            };
            if(sumaMasAlto < event.suma_traspasos_entradas){
                sumaMasAlto = event.suma_traspasos_entradas
            };
        });
    };
    let masAltoDos = (226 * sumaMasAlto)/214;
    document.querySelectorAll(".eje_y_numeracion").forEach((e)=>{
        e.textContent = Number(masAltoDos).toFixed(2)
        masAltoDos -= 0.20 * ((226 * sumaMasAlto)/214);
    });
    pintarGraficoPositivo(document.querySelectorAll(".cg_2_t"), array_t, sumaMasAlto, colorFondoBarra[0], document.querySelectorAll(".sg_2_t"))
}


async function cargarTraspasosMes(){
    let url = URL_API_almacen_central + 'entradas_suma_traspaso_mes'
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    traspasosMensuales = await respuesta.json();
};