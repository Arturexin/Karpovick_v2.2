document.addEventListener("DOMContentLoaded", inicioTransferencias)
function inicioTransferencias(){
    llenarCategoriaProductosEjecucion("#categoria-transferencias")
 
    graficoTransferenciasMes()
    llenarSucursalDestino()
    btnTransferencias = 1;
    cambioSucursalTransferencias()
    llenarCategoriaProductosEjecucion("#categoria-transferencias")
};
let suc_tra = [];
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////TRANSFERENCIAS//////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function llenarSucursalDestino(){
    suc_tra = JSON.parse(localStorage.getItem("sucursal_encabezado"))
    let html = ''
    for(sucursal of suc_tra) {
        let fila = `<option value="${sucursal.id_sucursales }">${sucursal.sucursal_nombre}</option>`
        html = html + fila;
    };
    document.querySelector("#sucursal-destino-transferencias").innerHTML = html
};

const formularioTransferencias = document.getElementById("formulario-transferencias");
///////////////////BUSCADOR DE PRODUCTOS EN FORMULARIO TRANSFERENCIAS/////////////////////////
let sucursal_transferencias = 0;
let indice_sucursal_transferencias = 0;
let sucursal_transferencias_dos = 0;
let indice_sucursal_transferencias_dos = 0;
document.addEventListener("keyup", () =>{
    indice_base = JSON.parse(localStorage.getItem("base_datos_consulta"))
    let almacenCentral = indice_base.find(y => y.codigo.toLowerCase().startsWith(document.getElementById('buscador-productos-transferencias').value.toLocaleLowerCase()))
    if(indice_base.find(y => y.codigo.toLowerCase().startsWith(document.getElementById('buscador-productos-transferencias').value.toLocaleLowerCase()))){
        document.getElementById('id-transferencias').value = almacenCentral.idProd

        sucursal_transferencias = document.getElementById("sucursal-principal").value
        indice_sucursal_transferencias = document.getElementById("sucursal-principal").selectedIndex
        
        document.getElementById('sucursal-transferencias').value = document.querySelector("#sucursal-principal").children[indice_sucursal_transferencias].textContent
        document.getElementById('categoria-transferencias').value = almacenCentral.categoria
        document.getElementById('codigo-transferencias').value = almacenCentral.codigo
        document.getElementById('descripcion-transferencias').value = almacenCentral.descripcion
        if(document.getElementById('buscador-productos-transferencias').value > 0 || document.getElementById('buscador-productos-transferencias').value == ""){
            formularioTransferencias.reset()
        };
    };
});
document.getElementById("sucursal-destino-transferencias").addEventListener("change", ()=>{
        sucursal_transferencias_dos = document.getElementById("sucursal-destino-transferencias").value;
        indice_sucursal_transferencias_dos = document.getElementById("sucursal-destino-transferencias").selectedIndex;
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////TRANSFERENCIAS PLUS////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function marcarProductoRepetidoTransferencias(){//verificamos que el nuevo producto no tenga el mismo código en la tabla transferencias comparando id
    const codigoComprasComparacionProductos = document.querySelectorAll(".id-transferencias-comprobacion");
    codigoComprasComparacionProductos.forEach((event) => {
        document.querySelectorAll(".id-transferencias-comprobacion-proforma").forEach((elemento) => {
            if(elemento.textContent === event.textContent &&
            event.parentNode.children[8].textContent == elemento.parentNode.children[8].textContent){
                let respuesta = confirm("El código " + event.parentNode.children[3].textContent + " ya está en proceso de transferencia a " + event.parentNode.children[8].textContent + ", si continua se reemplazará por este nuevo.")
                if(respuesta){
                    event.parentNode.style.background = "#b36659"
                }else{
                    elemento.parentNode.remove()
                    document.querySelector(".contenedor-pre-transferencia").classList.remove("modal-show-transferencia")
                }
            };
        });
    });
};
function removerProductoRepetidoTransferencias(){//elimina fila repetida
    const codigoComprasComparacionProductos = document.querySelectorAll(".id-transferencias-comprobacion");
    codigoComprasComparacionProductos.forEach((event) => {
        document.querySelectorAll(".id-transferencias-comprobacion-proforma").forEach((elemento) => {
            if(elemento.textContent === event.textContent &&
                elemento.parentNode.children[7].children[0].value > 0 &&
                event.parentNode.children[8].textContent == elemento.parentNode.children[8].textContent){
                event.parentNode.remove()
            }
        });
    });
};
function crearBodyTransferencias (codigoTransferencia){
    let tablaTransferencias= document.querySelector("#tabla-pre-transferencias > tbody");
    let nuevaFilaTablaTransferencias = tablaTransferencias.insertRow(-1);
    let fila = `<tr>
                    <td class="id-transferencias-comprobacion-proforma invisible"></td>
                    <td>${document.getElementById("sucursal-transferencias").value}</td>
                    <td class="invisible"></td>
                    <td class="insertar input-tablas fondo">${codigoTransferencia}</td>
                    <td></td>
                    <td class="invisible"></td>
                    <td style="text-align: right"></td>
                    <td><input class="input-tablas-dos-largo insertarNumeroTransferencias"></td>
                    <td>${document.getElementById("sucursal-destino-transferencias")[indice_sucursal_transferencias_dos].textContent}</td>
                    <td style="text-align: right"></td>
                    <td style="text-align: right"></td>
                    <td class="invisible">${sucursal_transferencias}</td>
                    <td class="invisible">${indice_sucursal_transferencias}</td>
                    <td class="invisible">${sucursal_transferencias_dos}</td>
                    <td class="invisible">${indice_sucursal_transferencias_dos}</td>
                    <td style="text-align: center">
                        <span style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila eliminar_fila_transferencias">delete</span>
                    </td>
                </tr>
                `
    nuevaFilaTablaTransferencias.innerHTML = fila;
    eliminarFilaTransferencias()
};
function eliminarFilaTransferencias(){
    document.querySelectorAll(".eliminar_fila_transferencias").forEach((event)=>{
        event.addEventListener("click", ()=>{
            event.parentNode.parentNode.remove()
        })
    });
};
let arrayCreacionCategoriaTallasTransferencias = [];
const mandarATablaPreTransferencias = document.getElementById("agregarATablaPreTransferencias");
mandarATablaPreTransferencias.addEventListener("click", agregarAtablaPreTransferencias)
async function agregarAtablaPreTransferencias(e){
    e.preventDefault();

    if(document.getElementById("sucursal-principal").value !=
        document.getElementById("sucursal-destino-transferencias").value &&
        document.getElementById("sucursal-destino-transferencias").value != "" &&
        document.getElementById("id-transferencias").value > 0){
        categoriaProductosCreacion("categoria-transferencias", arrayCreacionCategoriaTallasTransferencias);    
        for(let i = 0; i < arrayCreacionCategoriaTallasTransferencias.length; i++){
            if(document.getElementById("id-transferencias").value > 0){
                let codigoTransferencia = document.getElementById("codigo-transferencias").value
                if(codigoTransferencia.includes("-" + arrayCreacionCategoriaTallasTransferencias[0])){
                    codigoTransferencia = codigoTransferencia.replace("-" + arrayCreacionCategoriaTallasTransferencias[0], "-" + arrayCreacionCategoriaTallasTransferencias[i])
                }else if(codigoTransferencia.includes("-" + arrayCreacionCategoriaTallasTransferencias[1])){
                    codigoTransferencia = codigoTransferencia.replace("-" + arrayCreacionCategoriaTallasTransferencias[1], "-" + arrayCreacionCategoriaTallasTransferencias[i])
                }else if(codigoTransferencia.includes("-" + arrayCreacionCategoriaTallasTransferencias[2])){
                    codigoTransferencia = codigoTransferencia.replace("-" + arrayCreacionCategoriaTallasTransferencias[2], "-" + arrayCreacionCategoriaTallasTransferencias[i])
                }else if(codigoTransferencia.includes("-" + arrayCreacionCategoriaTallasTransferencias[3])){
                    codigoTransferencia = codigoTransferencia.replace("-" + arrayCreacionCategoriaTallasTransferencias[3], "-" + arrayCreacionCategoriaTallasTransferencias[i])
                }else if(codigoTransferencia.includes("-" + arrayCreacionCategoriaTallasTransferencias[4])){
                    codigoTransferencia = codigoTransferencia.replace("-" + arrayCreacionCategoriaTallasTransferencias[4], "-" + arrayCreacionCategoriaTallasTransferencias[i])
                }else if(codigoTransferencia.includes("-" + arrayCreacionCategoriaTallasTransferencias[5])){
                    codigoTransferencia = codigoTransferencia.replace("-" + arrayCreacionCategoriaTallasTransferencias[5], "-" + arrayCreacionCategoriaTallasTransferencias[i])
                }else if(codigoTransferencia.includes("-" + arrayCreacionCategoriaTallasTransferencias[6])){
                    codigoTransferencia = codigoTransferencia.replace("-" + arrayCreacionCategoriaTallasTransferencias[6], "-" + arrayCreacionCategoriaTallasTransferencias[i])
                }else if(codigoTransferencia.includes("-" + arrayCreacionCategoriaTallasTransferencias[7])){
                    codigoTransferencia = codigoTransferencia.replace("-" + arrayCreacionCategoriaTallasTransferencias[7], "-" + arrayCreacionCategoriaTallasTransferencias[i])
                }else if(codigoTransferencia.includes("-" + arrayCreacionCategoriaTallasTransferencias[8])){
                    codigoTransferencia = codigoTransferencia.replace("-" + arrayCreacionCategoriaTallasTransferencias[8], "-" + arrayCreacionCategoriaTallasTransferencias[i])
                }else if(codigoTransferencia.includes("-" + arrayCreacionCategoriaTallasTransferencias[9])){
                    codigoTransferencia = codigoTransferencia.replace("-" + arrayCreacionCategoriaTallasTransferencias[9], "-" + arrayCreacionCategoriaTallasTransferencias[i])
                }else if(codigoTransferencia.includes("-" + arrayCreacionCategoriaTallasTransferencias[10])){
                    codigoTransferencia = codigoTransferencia.replace("-" + arrayCreacionCategoriaTallasTransferencias[10], "-" + arrayCreacionCategoriaTallasTransferencias[i])
                }else if(codigoTransferencia.includes("-" + arrayCreacionCategoriaTallasTransferencias[11])){
                    codigoTransferencia = codigoTransferencia.replace("-" + arrayCreacionCategoriaTallasTransferencias[11], "-" + arrayCreacionCategoriaTallasTransferencias[i])
                }
                crearBodyTransferencias(codigoTransferencia)
            };
        };
        document.querySelector(".contenedor-pre-transferencia").classList.add("modal-show-transferencia")
        await buscarPorCodidoTransferenciasOrigen();
        operarCantidadTransferencias();
        marcarProductoRepetidoTransferencias();
        document.getElementById("id-transferencias").value = ""
        document.getElementById("formulario-transferencias").reset();
        saldosTransferencias()
        arrayCreacionCategoriaTallasTransferencias = [];
        document.querySelector("#tabla-pre-transferencias > tbody > tr > td:nth-child(8) > input").focus()
    }else if(document.getElementById("sucursal-principal").value ===
    document.getElementById("sucursal-destino-transferencias").value){
        alert("Elija una sucursal de destino diferente a la de origen.")
    }else if(document.getElementById("id-transferencias").value < 1){
        alert("Seleccione un código a transferir.")
    };
};
async function buscarPorCodidoTransferenciasOrigen(){
    const codtra = document.querySelectorAll(".insertar");
    let datoCodigoUnitario;
    for(let i = 0; i < codtra.length; i++){
        try{
            let url = URL_API_almacen_central + `almacen_central_codigo_doble_sucursal/${codtra[i].textContent}?`+
                                            `sucursal_get=${sucursales_activas[indice_sucursal_transferencias]}&`+
                                            `sucursal_get_dos=${sucursales_activas[indice_sucursal_transferencias_dos]}`
            let response = await fetch(url,{
                "method": "GET",
                "headers": {
                    "Content-Type": 'application/json'
                }
            });
            if(response.ok){
                datoCodigoUnitario = await response.json();
                if(datoCodigoUnitario.codigo){
                    codtra[i].parentNode.children[0].textContent = datoCodigoUnitario.idProd
                    codtra[i].parentNode.children[1].textContent = document.querySelector("#sucursal-principal").children[indice_sucursal_transferencias].textContent
                    codtra[i].parentNode.children[2].textContent = datoCodigoUnitario.categoria
                    codtra[i].parentNode.children[4].textContent = datoCodigoUnitario.descripcion
                    codtra[i].parentNode.children[5].textContent = datoCodigoUnitario.sucursal_get
                    codtra[i].parentNode.children[6].textContent = datoCodigoUnitario.sucursal_get
                    codtra[i].parentNode.children[9].textContent = datoCodigoUnitario.sucursal_get_dos
                    if(codtra[i].parentNode.children[0].textContent == document.getElementById("id-transferencias").value){
                        codtra[i].style.background = "rgb(105, 211, 35)"
                    };
                };
                if(codtra[i].parentNode.children[0].textContent  < 1){//OCULTAMOS LAS FILAS QUE NO MUESTRAN ID O NO EXISTEN EL LA TABLA PRODUCTOS
                    codtra[i].parentNode.remove()
                };
            }else {
                console.error("Error en la solicitud a la API");
            };
        }catch (error) {
            console.error("Error en la solicitud a la API:", error);
        };
    };
};

function saldosTransferencias(){
    const saldosExistenciasEnOrigen = document.querySelectorAll(".id-transferencias-comprobacion-proforma");
    saldosExistenciasEnOrigen.forEach((event) => {
        if(event){
            let sumaDeCantidadesTransferidasPorProducto = 0
            document.querySelectorAll(".id-transferencias-comprobacion").forEach((elemento) => {
                if(elemento.parentNode.children[3].textContent === event.parentNode.children[3].textContent &&//codigo
                    elemento.parentNode.children[1].textContent === event.parentNode.children[1].textContent &&//sucursal de origen
                    elemento.parentNode.children[8].textContent != event.parentNode.children[8].textContent){//sucursal de destino
                    sumaDeCantidadesTransferidasPorProducto += Number(elemento.parentNode.children[7].textContent)//tabla lista de transferencias
                    event.parentNode.children[5].textContent = Number(event.parentNode.children[5].textContent) - Number(sumaDeCantidadesTransferidasPorProducto)
                }
            });
        };
    });
};
function operarCantidadTransferencias(){
    const cantidadTransferencias = document.querySelectorAll(".insertarNumeroTransferencias");
    cantidadTransferencias.forEach((e)=>{
        e.addEventListener("keyup",(i)=>{
            i.target.parentNode.parentNode.children[6].textContent = 
                Number(i.target.parentNode.parentNode.children[5].textContent) - Number(i.target.value);

            i.target.parentNode.parentNode.children[10].textContent = 
                Number(i.target.parentNode.parentNode.children[9].textContent) + Number(i.target.value);
        });
    });
};
function filaBodyTransferenciasProformaPincipal(){
    let fila_modal = document.querySelectorAll(".insertar");
    fila_modal.forEach((event)=>{
        if(Number(event.parentNode.children[7].children[0].value) > 0 &&
        Number(event.parentNode.children[6].textContent) >= 0){
            let tablaTransferencias = document.querySelector("#tabla-proforma-transferencias > tbody");
            let nuevaFilaTablaTransferencias = tablaTransferencias.insertRow(-1);
            let fila = `<tr>
                            <td class="id-transferencias-comprobacion invisible">${event.parentNode.children[0].textContent}</td>
                            <td>${event.parentNode.children[1].textContent}</td>
                            <td class="invisible">${event.parentNode.children[2].textContent}</td>
                            <td>${event.parentNode.children[3].textContent}</td>
                            <td>${event.parentNode.children[4].textContent}</td>
                            <td class="invisible">${event.parentNode.children[5].textContent}</td>
                            <td class="invisible">${event.parentNode.children[6].textContent}</td>
                            <td style="text-align: right">${event.parentNode.children[7].children[0].value}</td>
                            <td>${event.parentNode.children[8].textContent}</td>

                            <td class="invisible">${event.parentNode.children[9].textContent}</td>
                            <td class="invisible">${event.parentNode.children[10].textContent}</td>

                            <td class="invisible">${event.parentNode.children[11].textContent}</td>
                            <td class="invisible">${event.parentNode.children[12].textContent}</td>
                            <td class="invisible">${event.parentNode.children[13].textContent}</td>
                            <td class="invisible">${event.parentNode.children[14].textContent}</td>
                            <td style="text-align: center">
                                <span style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila eliminar_fila_transferencias">delete</span>
                            </td>
                        </tr>
                        `
            nuevaFilaTablaTransferencias.innerHTML = fila;
            event.parentNode.children[7].children[0].style.background = ""
            eliminarFilaTransferencias()
        }else if(Number(event.parentNode.children[7].children[0].value) <= 0){
            event.parentNode.children[7].children[0].style.background = "#b36659"
        }else if(Number(event.parentNode.children[6].textContent) < 0){
            alert("La cantidad a transferir supera las existencias en la sucursal de origen.")
            event.parentNode.children[7].children[0].style.background = "#b36659"
        };
    });
    
};
const procesarPreTransferencias = document.querySelector("#procesar-pre-transferencias");
procesarPreTransferencias.addEventListener("click", agregarAtablaTransferenciasPrincipal)
function agregarAtablaTransferenciasPrincipal(e){
    e.preventDefault();
    removerProductoRepetidoTransferencias();
    filaBodyTransferenciasProformaPincipal();
    const borrar = document.querySelectorAll(".insertarNumeroTransferencias");//eliminamos las filas que si pasaron a la tabla principal
    borrar.forEach((e)=>{
        if(e.parentNode.parentElement.children[6].textContent >= 0 && e.value > 0){
            e.parentNode.parentNode.remove()
        }
    })
    if(document.querySelector("#tabla-pre-transferencias > tbody").children.length == 0){
        document.querySelector(".contenedor-pre-transferencia").classList.remove("modal-show-transferencia")
    }
    let sumaTotalCantidadtransferida= 0;
    let numeroFilasTablaTransferencias = document.querySelector("#tabla-proforma-transferencias > tbody").rows.length;
    for(let i = 0; i < numeroFilasTablaTransferencias; i++){
        sumaTotalCantidadtransferida += Number(document.querySelector("#tabla-proforma-transferencias > tbody").children[i].children[7].innerHTML) 
    }
    document.getElementById("total-cantidad-tabla-transferencias").textContent = sumaTotalCantidadtransferida;

    formularioTransferencias.reset()
    document.getElementById("id-transferencias").value = ""
    document.getElementById("buscador-productos-transferencias").value = ""
    document.getElementById("buscador-productos-transferencias").focus();
};

const procesarTransferenciaPlus = document.getElementById("procesar-transferencias-plus");
procesarTransferenciaPlus.addEventListener("click", procesamientoTransferencias)
async function procesamientoTransferencias(e){
    e.preventDefault();
    try{
        if(document.querySelector("#tabla-proforma-transferencias > tbody").children.length > 0){
            let obteniendo_numeracion = await cargarNumeracionComprobante();
            if(obteniendo_numeracion.status === 200){
                await funcionTransferenciasProductos()
                document.querySelector("#tabla-proforma-transferencias > tbody").remove();
                document.querySelector("#tabla-proforma-transferencias").createTBody();
            }else{
                alert("La conexión con el servidor no es buena.")
            };
        }
        
    }catch(error){
        alert("Ocurrió un error. " + error);
        console.error("Ocurrió un error. ", error)
    };
};
async function funcionTransferenciasProductos(){
    let suma_productos = 0;
    function EnviarAProductosEditarExistente(a){
        this.idProd = a.children[0].textContent;
        this.sucursal_post = sucursales_activas[a.children[12].textContent]
        this.existencias_post = a.children[6].textContent;
        this.sucursal_post_dos = sucursales_activas[a.children[14].textContent]
        this.existencias_post_dos = a.children[10].textContent;
    };
    let cantidadDeFilas = document.querySelector("#tabla-proforma-transferencias > tbody").rows.length;
    for(let i = 0 ; i < cantidadDeFilas; i++ ){
        if(document.querySelector("#tabla-proforma-transferencias > tbody").children[i]){
            let filaUno = new EnviarAProductosEditarExistente(document.querySelector("#tabla-proforma-transferencias > tbody").children[i]);
            let urlTransferenciasProductoUno = URL_API_almacen_central + 'almacen_central_doble_operacion'
            let response = await funcionFetch(urlTransferenciasProductoUno, filaUno)
            console.log("Respuesta Productos "+response.status)
            if(response.status === 200){
                suma_productos +=1;
            }
        };
    };
    if(suma_productos === cantidadDeFilas){
        await funcionTransferenciasSalidas();
    }else{
        alert(`Ocurrió un problema en la fila ${suma_productos + 1}`)
    };
};
async function funcionTransferenciasSalidas(){
    let suma_salidas = 0;
    function EnviarASalidas(a){
        this.idProd = a.children[0].textContent;
        this.cliente = 1;
        this.comprobante = "Transferencia-" + (Number(numeracion[0].transferencias) + 1);
        this.causa_devolucion = 0;
        this.fecha = fechaPrincipal;
        this.precio_venta_salidas = 0;
        this.sucursal = a.children[11].textContent;
        this.existencias_salidas = a.children[7].textContent;
        this.existencias_devueltas = 0;
        this.usuario = document.getElementById("identificacion_usuario_id").textContent;
    };
    let cantidadDeFilas = document.querySelector("#tabla-proforma-transferencias > tbody").rows.length;
    for(let i = 0 ; i < cantidadDeFilas; i++ ){
        if(document.querySelector("#tabla-proforma-transferencias > tbody").children[i]){
            let filaSalidas = new EnviarASalidas( document.querySelector("#tabla-proforma-transferencias > tbody").children[i]);
            let urlTransferenciasSalidas = URL_API_almacen_central + 'salidas'
            let response = await funcionFetch(urlTransferenciasSalidas, filaSalidas)
            console.log("Respuesta Salidas "+response.status)
            if(response.status === 200){
                suma_salidas +=1;
            }
        };
    };
    if(suma_salidas === cantidadDeFilas){
        await funcionTransferenciasEntradas();
    }else{
        alert(`Ocurrió un problema en la fila ${suma_salidas + 1}`)
    };
};
async function funcionTransferenciasEntradas(){
    let suma_entradas = 0;
    function EnviarAEntradasT(a){
        this.idProd = a.children[0].textContent
        this.comprobante = "Transferencia-" + (Number(numeracion[0].transferencias) + 1);
        this.causa_devolucion = 0;
        this.fecha = fechaPrincipal;
        this.existencias_entradas = a.children[7].textContent;
        this.sucursal = a.children[13].textContent;
        this.usuario = document.getElementById("identificacion_usuario_id").textContent;
        this.existencias_devueltas = 0;
    };
    let cantidadDeFilas = document.querySelector("#tabla-proforma-transferencias > tbody").rows.length;
    for(let i = 0 ; i < cantidadDeFilas; i++ ){
        if(document.querySelector("#tabla-proforma-transferencias > tbody").children[i]){
            let filaEntradas = new EnviarAEntradasT( document.querySelector("#tabla-proforma-transferencias > tbody").children[i]);
            let urlTransferenciasEntradas = URL_API_almacen_central + 'entradas'
            let response = await funcionFetch(urlTransferenciasEntradas, filaEntradas)
            console.log("Respuesta Entradas "+response.status)
            if(response.status === 200){
                suma_entradas +=1;
            }
        };
    };
    if(suma_entradas === cantidadDeFilas){
        await funcionTransferenciasNumeracion();
    }else{
        alert(`Ocurrió un problema en la fila ${suma_entradas + 1}`)
    };
};
async function funcionTransferenciasNumeracion(){
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
    let urlTranferenciasComprobante = URL_API_almacen_central + 'numeracion_comprobante'
    let response = await funcionFetch(urlTranferenciasComprobante, dataComprobante)
    console.log("Respuesta Numeración "+response.status)
    if(response.status === 200){
        alert("Operación completada exitosamente.")
    };
};
////BOTONES PARA ELIMINAR CONTENIDO DE TABLAS////////////////////////////////////////////////////////////////////////


const removerTablaTransferenciasUno = document.getElementById("remover-tabla-transferencias-uno");
removerTablaTransferenciasUno.addEventListener("click", () =>{
    document.querySelector(".contenedor-pre-transferencia").classList.remove("modal-show-transferencia")
    document.querySelector("#tabla-pre-transferencias > tbody").remove();
    document.querySelector("#tabla-pre-transferencias").createTBody();
    document.getElementById("buscador-productos-transferencias").focus();
});
const removerTablaTransferenciasDos = document.getElementById("remover-tabla-transferencias-dos");
removerTablaTransferenciasDos.addEventListener("click", () =>{
    document.querySelector("#tabla-proforma-transferencias > tbody").remove();
    document.querySelector("#tabla-proforma-transferencias").createTBody();
    document.getElementById("buscador-productos-transferencias").focus();
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
function cambioSucursalTransferencias(){
    document.getElementById("sucursal-principal").addEventListener("change", ()=>{
        document.getElementById("formulario-transferencias").reset();
        document.getElementById("id-transferencias").value = "";
        document.getElementById("buscador-productos-transferencias").value = "";
        document.getElementById("buscador-productos-transferencias").focus();
    });
}



async function cargarTransferenciasEntradasMes(){
    let url = URL_API_almacen_central + 'entradas_suma_transferencias_mes'
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    transferenciasEntradas = await respuesta.json();
};
async function cargarTransferenciasSalidasMes(){
    let url = URL_API_almacen_central + 'salidas_suma_transferencias_mes'
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    transferenciasSalidas = await respuesta.json();
};
let colorFondoBarra = ["#E6CA7B","#91E69C","#6380E6","#E66E8D"];
let sucursalesLabel = ["Almacén Central", "Sucursal Uno", "Sucursal Dos", "Sucursal Tres"];
async function graficoTransferenciasMes(){
    await cargarTransferenciasEntradasMes();
    await cargarTransferenciasSalidasMes();
    let arrayAC_e = [];
    let arraySU_e = [];
    let arraySD_e = [];
    let arrayST_e = [];
    let sumaMasAlto = 0;
    document.querySelectorAll(".f_l_g").forEach((event, i)=>{
        event.textContent = arregloMeses[i];
    })
    for(let i = 0; i < 12; i++){
        arrayAC_e.push(0);
        arraySU_e.push(0);
        arraySD_e.push(0);
        arrayST_e.push(0);
        transferenciasEntradas.forEach((event)=>{
            if(event.sucursal == 1 && event.mes == i + 1){
                arrayAC_e[i] = event.suma_transferencias_entradas;
            };
            if(event.sucursal == 2 && event.mes == i + 1){
                arraySU_e[i] = event.suma_transferencias_entradas;
            };
            if(event.sucursal == 3 && event.mes == i + 1){
                arraySD_e[i] = event.suma_transferencias_entradas;
            };
            if(event.sucursal == 4 && event.mes == i + 1){
                arrayST_e[i] = event.suma_transferencias_entradas;
            };
            
            if(sumaMasAlto < event.suma_transferencias_entradas){
                sumaMasAlto = event.suma_transferencias_entradas
            };
        });
    };
    document.querySelectorAll(".color_item_grafico_transferencia").forEach((event, i)=>{
        event.style.background = `${colorFondoBarra[i]}`
        event.style.width = `20px`
        event.style.height = `10px`
        document.querySelectorAll(".descripcion_item_grafico")[i].textContent = array_sucursales[i]
    })
    let masAltoDos = (226 * sumaMasAlto)/214;
    document.querySelectorAll(".eje_y_numeracion").forEach((e)=>{
        e.textContent = Number(masAltoDos).toFixed(2)
        masAltoDos -= 0.20 * ((226 * sumaMasAlto)/214);
    });
    pintarGraficoPositivo(document.querySelectorAll(".cg_1_t"), arrayAC_e, sumaMasAlto, colorFondoBarra[0], document.querySelectorAll(".sg_1_t"))
    pintarGraficoPositivo(document.querySelectorAll(".cg_2_t"), arraySU_e, sumaMasAlto, colorFondoBarra[1], document.querySelectorAll(".sg_2_t"))
    pintarGraficoPositivo(document.querySelectorAll(".cg_3_t"), arraySD_e, sumaMasAlto, colorFondoBarra[2], document.querySelectorAll(".sg_3_t"))
    pintarGraficoPositivo(document.querySelectorAll(".cg_4_t"), arrayST_e, sumaMasAlto, colorFondoBarra[3], document.querySelectorAll(".sg_4_t"))
};