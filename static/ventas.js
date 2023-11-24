document.addEventListener("DOMContentLoaded", inicioVentas)
function inicioVentas(){
    
    indice_base = JSON.parse(localStorage.getItem("base_datos_consulta"))
    indice_cli = JSON.parse(localStorage.getItem("base_datos_cli"))
    btnVentas = 1;
    document.getElementById("buscador-productos-ventas").focus()
    cambioSucursal();
    llenarCategoriaProductosEjecucion("#categoria-ventas")
    
};
const btnCaja = document.getElementById("apertura-caja");
btnCaja.addEventListener("click", (e) => {
    e.preventDefault();
    location.href = "/apertura_caja";
});
const btnEntradas = document.getElementById("entradas-caja");
btnEntradas.addEventListener("click", (e) => {
    e.preventDefault();
    location.href = "/ventas";
    document.getElementById("entradas-caja").classList.add("marcaBoton")
});
const btnSalidas = document.getElementById("salidas-caja");
btnSalidas.addEventListener("click", (e) => {
    e.preventDefault();
    location.href = "/salidas_caja";
    document.querySelector(".contenedor-entradas-caja").classList.add("invisible")
    
});
//////  CLIENTES//////////////////////////////////////////////////////////
function buscarClienteVentas(cliente){
    document.getElementById('txtIdv').value = cliente.id_cli
    document.getElementById('clientesv').value = cliente.nombre_cli
    document.getElementById('dniv').value = cliente.dni_cli
    document.getElementById('emailv').value = cliente.email_cli
    document.getElementById('telefonov').value = cliente.telefono_cli
    document.getElementById('direccionv').value = cliente.direccion_cli
};
document.getElementById("boton-buscar-ventas-clientes").addEventListener("click", (e)=>{
    e.preventDefault()
    document.getElementById("concurrencia_cliente").textContent = ""
    if(document.getElementById("opcion-buscar-cliente").value == 1){
        let cliente = indice_cli.find(y => y.nombre_cli.toLowerCase().includes(document.getElementById('buscar-cliente-ventas').value.toLowerCase()))
        if(indice_cli.find(y => y.nombre_cli.toLowerCase().includes(document.getElementById('buscar-cliente-ventas').value.toLowerCase()))){
            buscarClienteVentas(cliente)
            modal_proceso_abrir("Cliente encontrado.", "")
            modal_proceso_salir_botones()
        }else{
            modal_proceso_abrir("Cliente no encontrado", "")
            modal_proceso_salir_botones()
            document.getElementById("formularioClientesVentas").reset();
        };
    }else if(document.getElementById("opcion-buscar-cliente").value == 2){
        let cliente = indice_cli.find(y => y.dni_cli.toLowerCase().includes(document.getElementById('buscar-cliente-ventas').value.toLowerCase()))
        if(indice_cli.find(y => y.dni_cli.toLowerCase().includes(document.getElementById('buscar-cliente-ventas').value.toLowerCase()))){
            buscarClienteVentas(cliente)
            modal_proceso_abrir("Cliente encontrado.", "")
            modal_proceso_salir_botones()
        }else{
            modal_proceso_abrir("Cliente no encontrado", "")
            modal_proceso_salir_botones()
            document.getElementById("formularioClientesVentas").reset();
        };
    }else if(document.getElementById("opcion-buscar-cliente").value == 3){
        let cliente = indice_cli.find(y => y.email_cli.toLowerCase().includes(document.getElementById('buscar-cliente-ventas').value.toLowerCase()))
        if(indice_cli.find(y => y.email_cli.toLowerCase().includes(document.getElementById('buscar-cliente-ventas').value.toLowerCase()))){
            buscarClienteVentas(cliente)
            modal_proceso_abrir("Cliente encontrado.", "")
            modal_proceso_salir_botones()
        }else{
            modal_proceso_abrir("Cliente no encontrado", "")
            modal_proceso_salir_botones()
            document.getElementById("formularioClientesVentas").reset();
        };
    }else if(document.getElementById("opcion-buscar-cliente").value == 4){
        let cliente = indice_cli.find(y => y.telefono_cli.toLowerCase().includes(document.getElementById('buscar-cliente-ventas').value.toLowerCase()))
        if(indice_cli.find(y => y.telefono_cli.toLowerCase().includes(document.getElementById('buscar-cliente-ventas').value.toLowerCase()))){
            buscarClienteVentas(cliente)
            modal_proceso_abrir("Cliente encontrado.", "")
            modal_proceso_salir_botones()
        }else{
            modal_proceso_abrir("Cliente no encontrado", "")
            modal_proceso_salir_botones()
            document.getElementById("formularioClientesVentas").reset();
        };
    };
    conteoCliente()
});
////////////////////////////////////////////////////////////////////////////
function descolorearFormulario(formularioInput){
    document.querySelectorAll(formularioInput).forEach((e) => {e.style.background = ""})
};

const registrarClienteVentas = document.getElementById("save-ventas-clientes");
registrarClienteVentas.addEventListener("click", saveClientesVentas)
async function saveClientesVentas(e) {
    e.preventDefault();
    let base_datos_clientes = JSON.parse(localStorage.getItem("base_datos_cli"))
    let encontrado = base_datos_clientes.find(y => y.nombre_cli.toLowerCase().startsWith(document.getElementById("clientesv").value.toLowerCase()) && 
                                            y.telefono_cli.toLowerCase().startsWith(document.getElementById("telefonov").value.toLowerCase()))
    if(encontrado === undefined){
        if(expregul.cliente.test(document.getElementById("clientesv").value) &&
            expregul.telefono.test(document.getElementById("telefonov").value) &&
            expregul.direccion.test(document.getElementById("direccionv").value)){
            modal_proceso_abrir("Procesando el registro!!!.", "")    
            let data = {
                "clase_cli": 0,
                "direccion_cli": document.getElementById('direccionv').value,
                "dni_cli": document.getElementById('dniv').value,
                "email_cli": document.getElementById('emailv').value,
                "nombre_cli": document.getElementById('clientesv').value,
                "telefono_cli": document.getElementById('telefonov').value
            };
            let url = URL_API_almacen_central + 'clientes'
            let response = await funcionFetch(url, data);
            if(response.ok){
                descolorearFormulario("#formularioClientesVentas input");
                await llenarClientes();
                localStorage.setItem("base_datos_cli", JSON.stringify(clientes_ventas))
                indice_cli = JSON.parse(localStorage.getItem("base_datos_cli"))
                buscarIdNuevo()
                modal_proceso_abrir("Cliente registrado!!!.", "")
                modal_proceso_salir_botones()
            };
        }else if(expregul.cliente.test(document.getElementById("clientesv").value) == false){
            document.getElementById("clientesv").style.background = "#b36659"
            modal_proceso_abrir("Ingrese un nombre de cliente correcto.", "")
            modal_proceso_salir_botones()
        }else if(expregul.telefono.test(document.getElementById("telefonov").value) == false){
            document.getElementById("telefonov").style.background = "#b36659"
            modal_proceso_abrir("Ingrese un número de teléfono o celular.", "")
            modal_proceso_salir_botones()
        }else if(expregul.direccion.test(document.getElementById("direccionv").value) == false){
            document.getElementById("direccionv").style.background = "#b36659"
            modal_proceso_abrir("Ingrese una dirección.", "")
            modal_proceso_salir_botones()
        };
    }else{
        modal_proceso_abrir(`El cliente ${document.getElementById("clientesv").value} con numero de teléfono `+
        `${document.getElementById("telefonov").value} ya se encunetra registrado.`, "")
        modal_proceso_salir_botones()
    };
};
function buscarIdNuevo(){
    let nuevo_id = indice_cli.find(x => x.nombre_cli === document.getElementById('clientesv').value &&
                                        x.dni_cli === document.getElementById('dniv').value &&
                                        x.email_cli === document.getElementById('emailv').value &&
                                        x.telefono_cli === document.getElementById('telefonov').value)
    document.getElementById('txtIdv').value = nuevo_id.id_cli
};

document.getElementById("boton_restablecer_form_clientes_ventas").addEventListener("click", ()=>{
    document.getElementById('txtIdv').value = ""
});
//////////////////////////////////////////////////////////////////////////////////////
///////////////////BUSCADOR DE PRODUCTOS EN FORMULARIO VENTAS/////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
let sucursal_ventas = 0;
let indice_sucursal_ventas = 0;
let datoCodigoId = [];

document.addEventListener("keyup", async () =>{
    
    let almacenCentral = indice_base.find(y => y.codigo.toLowerCase().startsWith(document.getElementById('buscador-productos-ventas').value.toLowerCase()))
    if(indice_base.find(y => y.codigo.toLowerCase().startsWith(document.getElementById('buscador-productos-ventas').value.toLowerCase()))){
        document.getElementById('id-ventas').value = almacenCentral.idProd

        sucursal_ventas = document.getElementById("sucursal-principal").value
        if(document.getElementById("puesto_usuario").textContent == 1){
            indice_sucursal_ventas = 1
        }else if(document.getElementById("puesto_usuario").textContent == 2){
            indice_sucursal_ventas = 2
        }else if(document.getElementById("puesto_usuario").textContent == 3){
            indice_sucursal_ventas = 3
        }else{
            indice_sucursal_ventas = document.getElementById("sucursal-principal").selectedIndex
        }
        /* indice_sucursal_ventas = document.getElementById("sucursal-principal").selectedIndex */
        document.getElementById('sucursal-ventas').value = document.querySelector("#sucursal-principal").children[indice_sucursal_ventas].textContent

        document.getElementById('categoria-ventas').value = almacenCentral.categoria 
        document.getElementById('codigo-ventas').value = almacenCentral.codigo
        document.getElementById('descripcion-ventas').value = almacenCentral.descripcion
        if(document.getElementById('buscador-productos-ventas').value > 0 || document.getElementById('buscador-productos-ventas').value == ""){
            const formularioVentas = document.getElementById("formulario-ventas");
            document.getElementById("id-ventas").value = ""
            formularioVentas.reset()
        };
    };
});


document.getElementById("cantidad-vendida-ventas").addEventListener("focus", encontrarPrecioVenta)
async function encontrarPrecioVenta() {
    
    
    
    if(document.getElementById("buscador-productos-ventas").value !== ""){
        let cantidad_sucursal = [];
        let url = URL_API_almacen_central + `almacen_central_id_sucursal/${document.getElementById('id-ventas').value}?`+
                                            `sucursal_get=${sucursales_activas[indice_sucursal_ventas]}`
        let respuesta  = await fetch(url, {
            "method": 'GET',
            "headers": {
                "Content-Type": 'application/json'
            }
        });
        cantidad_sucursal = await respuesta.json();

        document.getElementById('costo-unitario-ventas').value = cantidad_sucursal.costo_unitario
        document.getElementById('precio-ventas-formulario').value = cantidad_sucursal.precio_venta
        document.getElementById('existencias-almacen-ventas').value = cantidad_sucursal.sucursal_get
        document.getElementById('talla-ventas').value = cantidad_sucursal.talla
        document.getElementById('precio-ventas').value = cantidad_sucursal.precio_venta.toFixed(2)
    };
    document.getElementById("cantidad-vendida-ventas").value = ""
    document.getElementById("saldo-existencias-almacen-ventas").value = ""
};
//////PASAR DATOS DE FORMULARIO A LISTA DE PRODUCTOS///////////////////////////
let formularioMetodoDePago = document.getElementById("contenedor-metodo-pago");
document.getElementById("restablecerFormVentas").addEventListener("click", () => {
    document.getElementById("formulario-ventas").reset()
    document.getElementById("cantidad-vendida-ventas").value = ""
    document.getElementById("precio-ventas").value = ""
    document.getElementById("saldo-existencias-almacen-ventas").value = ""
    document.getElementById("total-ventas").value = ""

});
const mandarATablaVentas = document.getElementById("agregarATablaVentas");
mandarATablaVentas.addEventListener("click", agregarATablaVentas)
function agregarATablaVentas(e){
    e.preventDefault();
    /////////////////////ESTO ES PARA NO AUMENTAR UNA FILA MAS DE UN PRODUCTO QUE YA EXISTE EN LA TABLA VENTAS/////////////////////////////////////
    document.querySelectorAll(".id-ventas-comprobacion").forEach((e) => {// SE TOMA LOS ID PARA OPERAR Y NO SUMAR UNA NUEVA FILA CON EL MISMO PRODUCTO
        if(e.textContent == document.getElementById("id-ventas").value && document.getElementById("saldo-existencias-almacen-ventas").value >= 0){ 
            alert("El producto seleccionado ya existe en la tabla de ventas, se reemplazará por este nuevo.")
            e.parentNode.remove();
        }
    });
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    if ((Number(document.getElementById("existencias-almacen-ventas").value) -
    Number(document.getElementById("cantidad-vendida-ventas").value)) >= 0 && 
    document.getElementById('id-ventas').value != "" &&
    document.getElementById('cantidad-vendida-ventas').value > 0 && 
    Number(document.getElementById('precio-ventas').value) >= Number(document.getElementById('costo-unitario-ventas').value)){

        let tablaVentas = document.querySelector("#tabla-ventas > tbody");
        let nuevaFilaTablaVentas = tablaVentas.insertRow(-1);

        let nuevaCeldaTablaVentas = nuevaFilaTablaVentas.insertCell(0);
        nuevaCeldaTablaVentas.textContent = document.getElementById("id-ventas").value
        nuevaCeldaTablaVentas.classList.add("id-oculto")//OCULTO ESTA COLUMNA//////////
        nuevaCeldaTablaVentas.classList.add("id-ventas-comprobacion")//OCULTO ESTA COLUMNA//////////

        nuevaCeldaTablaVentas = nuevaFilaTablaVentas.insertCell(1);
        nuevaCeldaTablaVentas.textContent = sucursal_ventas
        nuevaCeldaTablaVentas.classList.add("id-oculto")//OCULTO ESTA COLUMNA//////////

        nuevaCeldaTablaVentas = nuevaFilaTablaVentas.insertCell(2);//Código
        nuevaCeldaTablaVentas.textContent = document.getElementById("codigo-ventas").value

        nuevaCeldaTablaVentas = nuevaFilaTablaVentas.insertCell(3);//descripción
        nuevaCeldaTablaVentas.textContent = document.getElementById("descripcion-ventas").value

        nuevaCeldaTablaVentas = nuevaFilaTablaVentas.insertCell(4);//talla
        nuevaCeldaTablaVentas.textContent = document.getElementById("talla-ventas").value

        nuevaCeldaTablaVentas = nuevaFilaTablaVentas.insertCell(5);//existencias en sucursal de origen
        nuevaCeldaTablaVentas.textContent = document.getElementById("existencias-almacen-ventas").value
        nuevaCeldaTablaVentas.classList.add("id-oculto")//OCULTO ESTA COLUMNA//////////

        nuevaCeldaTablaVentas = nuevaFilaTablaVentas.insertCell(6);//cantidad a vender
        nuevaCeldaTablaVentas.style.textAlign="right"
        nuevaCeldaTablaVentas.textContent = document.getElementById("cantidad-vendida-ventas").value

        nuevaCeldaTablaVentas = nuevaFilaTablaVentas.insertCell(7);//precio de venta
        nuevaCeldaTablaVentas.style.textAlign="right"
        nuevaCeldaTablaVentas.textContent = document.getElementById("precio-ventas").value

        nuevaCeldaTablaVentas = nuevaFilaTablaVentas.insertCell(8);//Total venta
        nuevaCeldaTablaVentas.style.textAlign="right"
        nuevaCeldaTablaVentas.textContent = document.getElementById("total-ventas").value

        nuevaCeldaTablaVentas = nuevaFilaTablaVentas.insertCell(9);//saldo de existencias en sucursal de origen
        nuevaCeldaTablaVentas.textContent = Number(document.getElementById("existencias-almacen-ventas").value) -
                                             Number(document.getElementById("cantidad-vendida-ventas").value)
        nuevaCeldaTablaVentas.classList.add("id-oculto")//OCULTO ESTA COLUMNA//////////

        nuevaCeldaTablaVentas = nuevaFilaTablaVentas.insertCell(10);//cliente
        nuevaCeldaTablaVentas.textContent = document.getElementById('txtIdv').value
        nuevaCeldaTablaVentas.classList.add("id-oculto")//OCULTO ESTA COLUMNA//////////

        let eliminarFila = nuevaFilaTablaVentas.insertCell(11);
        let botonEliminar = document.createElement("span");
        botonEliminar.classList.add("eliminarTablaFila", "material-symbols-outlined")
        botonEliminar.textContent = "delete";
        eliminarFila.appendChild(botonEliminar)
        botonEliminar.addEventListener("click", (event) => {
            event.target.parentNode.parentNode.remove()
            formularioMetodoDePago.reset();
            totalesTabla()
        });
        document.querySelector("#formulario-ventas").reset();

        document.getElementById("cantidad-vendida-ventas").value = ""
        document.getElementById("precio-ventas").value = ""
        document.getElementById("saldo-existencias-almacen-ventas").value = ""
        document.getElementById("total-ventas").value = ""

        totalesTabla()
        document.getElementById("buscador-productos-ventas").focus()

    }else if((Number(document.getElementById("existencias-almacen-ventas").value) -
    Number(document.getElementById("cantidad-vendida-ventas").value)) < 0){//// BLOQUEA EL ENVIO A LA TABLA SI LA CANTIDAD COMPRADA ES MAYOR A LA CANTIDAD EN STOCK//////////
        alert("Cantidad a vender mayor a existencias.")
        document.getElementById('cantidad-vendida-ventas').value = ""
        document.getElementById('saldo-existencias-almacen-ventas').value = document.getElementById('existencias-almacen-ventas').value
        document.getElementById('saldo-existencias-almacen-ventas').style.background = ""
        document.getElementById('total-ventas').value = ""
        document.getElementById("cantidad-vendida-ventas").focus()
    }else if(Number(document.getElementById('precio-ventas').value) < Number(document.getElementById('costo-unitario-ventas').value)){//// BLOQUEA EL ENVIO A LA TABLA SI EL PRECIO DE VENTA ES MENOR AL COSTO DE COMPRA//////////
        alert("Precio de venta incorrecto.")
        document.getElementById('precio-ventas').value = document.getElementById('precio-ventas-formulario').value
        document.getElementById('total-ventas').value = ""
        document.getElementById("precio-ventas").focus()
    }else if(document.getElementById('cantidad-vendida-ventas').value == 0 || document.getElementById('cantidad-vendida-ventas').value == " "){
        alert("Digite una cantidad a vender válida.")
        document.getElementById("cantidad-vendida-ventas").focus()
        /* document.querySelector("#formulario-ventas").reset(); */
    };
    
    
}; 
function totalesTabla(){
    let sumaTotalCantidadVendida = 0;
    let sumaTotalVenta = 0;
    let numeroFilasTablaVentas = document.querySelector("#tabla-ventas > tbody").rows.length;
    for(let i = 0; i < numeroFilasTablaVentas; i++){
        sumaTotalVenta += Number(document.querySelector("#tabla-ventas > tbody").children[i].children[8].innerHTML)
        sumaTotalCantidadVendida += Number(document.querySelector("#tabla-ventas > tbody").children[i].children[6].innerHTML) 
    }
    document.getElementById("total-importe-tabla-ventas").textContent = sumaTotalVenta.toFixed(2);
    document.getElementById("total-cantidad-tabla-ventas").textContent = sumaTotalCantidadVendida;
    document.querySelector("#radio-efectivo").checked = true;
    document.getElementById("efectivo-ventas").value = Number(document.getElementById("total-importe-tabla-ventas").textContent);
};
///////////////////OPERACION DE RESTA EN FORMULARIO VENTAS ///////////////////////////////////
let cantidAdAVender = document.getElementById("cantidad-vendida-ventas");
cantidAdAVender.addEventListener("keyup", (e) =>{
    document.getElementById('saldo-existencias-almacen-ventas').value = Number(document.getElementById('existencias-almacen-ventas').value) - 
                                                                        Number(e.target.value)
    document.getElementById('total-ventas').value = (Number(e.target.value) * 
                                                    Number(document.getElementById('precio-ventas').value)).toFixed(2)
    document.getElementById('saldo-existencias-almacen-ventas').style.background = ""                                            
    if(document.getElementById('saldo-existencias-almacen-ventas').value < 0){
        document.getElementById('saldo-existencias-almacen-ventas').style.background = "rgb(240, 69, 69)"
    }
});
let precioAdAVender = document.getElementById("precio-ventas");
precioAdAVender.addEventListener("keyup", (e) =>{
    document.getElementById('total-ventas').value = (document.getElementById("cantidad-vendida-ventas").value * 
                                                    Number(e.target.value)).toFixed(2)
    document.getElementById('total-ventas').style.background = ""                                                                                         
    if(Number(e.target.value) < Number(document.getElementById('costo-unitario-ventas').value)){
        document.getElementById('total-ventas').style.background = "rgb(240, 69, 69)"
    }
});
let llave_comprobacion = 0;
let procesarVenta = document.getElementById("procesar-venta");
procesarVenta.addEventListener("click", procesamientoVentas);
async function procesamientoVentas(e){
    e.preventDefault();
    try{
        await asegurarExistenciaStock();
        if(document.getElementById("total-metodo-pago-ventas").value == 0 && 
        document.querySelector("#tabla-ventas > tbody").rows.length > 0 &&
        llave_comprobacion == 1){
            modal_proceso_abrir("Procesando la venta!!!.", "")
            let obteniendo_numeracion = await cargarNumeracionComprobante();
            if(obteniendo_numeracion.status === 200){
                await realizarVenta()
                await NuevaVentanaComprobanteDePago()//comprobante
                formularioClientesVentas.reset();
            }else{
                modal_proceso_abrir("La conexión con el servidor no es buena.", "")
                modal_proceso_salir_botones()
            };
            
        }else if(document.querySelector("#tabla-ventas > tbody").rows.length == 0){
            modal_proceso_abrir("Imposible procesar venta, las lista está vacía.", "")
            modal_proceso_salir_botones()
        }else{
            document.getElementById("total-metodo-pago-ventas").style.background = "#b36659"
            modal_proceso_abrir("Monto de método de pago inadecuado, procure que el saldo sea cero.", "")
            modal_proceso_salir_botones()
        };
    }catch(error){
        modal_proceso_abrir("Ocurrió un error. " + error, "");
        console.error("Ocurrió un error. ", error)
        modal_proceso_salir_botones()
    };
    llave_comprobacion = 0;
};
async function realizarVenta(){
    let suma_productos = 0;
    let array_lista_venta = [];
    function DatosDeVenta(a){
        this.idProd = a.children[0].textContent;
        this.sucursal_post = sucursales_activas[indice_sucursal_ventas];
        this.existencias_post = a.children[9].textContent;
        if(document.getElementById('txtIdv').value != ""){
            this.cliente = document.getElementById('txtIdv').value;
        }else{
            this.cliente = indice_cli[0].id_cli;
        }
        this.comprobante = "Venta-" + (Number(numeracion[0].ventas) + 1);
        this.precio_venta_salidas = a.children[7].textContent;
        this.sucursal = a.children[1].textContent;
        this.existencias_salidas = a.children[6].textContent;
    };
    const numFilas = document.querySelector("#tabla-ventas > tbody").children
    for(let i = 0 ; i < numFilas.length; i++ ){
        if(numFilas[i]){
            let filaVenta = new DatosDeVenta(numFilas[i]);
            let url = URL_API_almacen_central + 'procesar_venta'
            let response = await funcionFetch(url, filaVenta);
            console.log(`Fila ${i+1}: ${response.status}`)
            if(response.status === 200){
                array_lista_venta.push(filaVenta)
                suma_productos +=1;
                modal_proceso_abrir("Procesando la venta!!!.", `Producto ejecutado: ${suma_productos} de ${numFilas.length}`)
                console.log(`Producto ejecutado: ${suma_productos} de ${numFilas.length}`)
            }
        };
    };
    if(suma_productos === numFilas.length){
        await funcionVentaNumeracion();
    }else{
        modal_proceso_abrir(`Ocurrió un problema en la fila ${suma_productos + 1}.`, `Producto ejecutado: ${suma_productos} de ${numFilas.length}`)
        console.log(`Producto ejecutado: ${suma_productos} de ${numFilas.length}`)
        modal_proceso_salir_botones()
    };
};
async function funcionVentaNumeracion(){
    let numeracion_comprobante_venta = "";
    let notaVenta = 0;
    let boletaVenta = 0;
    let facturaVenta = 0;
    if(document.getElementById("input-tipo-comprobante").value === "Nota de Venta"){
        numeracion_comprobante_venta = "N001-" + (Number(numeracion[0].nota_venta)+1);
        notaVenta = 1;
    }else if(document.getElementById("input-tipo-comprobante").value === "Boleta de Venta"){
        numeracion_comprobante_venta = "B001-" + (Number(numeracion[0].boleta_venta)+1);
        boletaVenta = 1;
    }else if(document.getElementById("input-tipo-comprobante").value === "Factura"){
        numeracion_comprobante_venta = "F001-" + (Number(numeracion[0].factura)+1);
        facturaVenta = 1;
    };
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let dataComprobante = {
        "id": numeracion[0].id,
        "compras": numeracion[0].compras,
        "recompras": numeracion[0].recompras,
        "transferencias": numeracion[0].transferencias,
        "ventas": Number(numeracion[0].ventas) + 1,
        "nota_venta": Number(numeracion[0].nota_venta) + Number(notaVenta),
        "boleta_venta": Number(numeracion[0].boleta_venta) + Number(boletaVenta),
        "factura": Number(numeracion[0].factura) + Number(facturaVenta)
    };
    let urlComprobante = URL_API_almacen_central + 'numeracion_comprobante'
    let response_numeracion = await funcionFetch(urlComprobante, dataComprobante);
    console.log("Respuesta Numeración "+response_numeracion.status)
    let metodoPago = {
        "sucursal": sucursal_ventas,
        "comprobante": "Venta-" + (Number(numeracion[0].ventas) + 1),
        "tipo_comprobante": numeracion_comprobante_venta,
        "modo_efectivo": Number(document.getElementById("efectivo-ventas").value),
        "modo_credito": Number(document.getElementById("credito-ventas").value),
        "modo_tarjeta": Number(document.getElementById("tarjeta-ventas").value),
        "modo_perdida": 0,
        "total_venta": Number(document.getElementById("total-importe-tabla-ventas").textContent),
        "fecha_det_ventas": fechaPrincipal,
        "canal_venta": document.getElementById("modo_pago_ventas").checked,
    };
    if(document.getElementById('txtIdv').value != ""){
        metodoPago.dni_cliente = document.getElementById('txtIdv').value;
    }else{
        metodoPago.dni_cliente = indice_cli[0].id_cli;
    };
    let urlMetodoDePago = URL_API_almacen_central + 'ventas'
    let response_detalle = await funcionFetch(urlMetodoDePago, metodoPago);
    console.log("Respuesta Detalle Venta "+response_detalle.status)
};
//////////////////////método de pago///////////////////////////////////////////////////////////////////////////////////////////
function removeAtributoMetodoDePago(){
    document.getElementById("efectivo-ventas").removeAttribute("disabled")
    document.getElementById("tarjeta-ventas").removeAttribute("disabled")
    document.getElementById("credito-ventas").removeAttribute("disabled")
}
function setAtributoMetodoDePago(){
    document.getElementById("efectivo-ventas").setAttribute("disabled", "true")
    document.getElementById("tarjeta-ventas").setAttribute("disabled", "true")
    document.getElementById("credito-ventas").setAttribute("disabled", "true")
}
const inputRadioMetodoPago = document.querySelectorAll(".inputRadioVentas");
inputRadioMetodoPago.forEach((radioVentas) =>{
    radioVentas.addEventListener("click", (event) =>{
        if(event.target.value == "efectivo"){
            setAtributoMetodoDePago()
            document.getElementById("efectivo-ventas").value = Number(document.getElementById("total-importe-tabla-ventas").textContent)
            document.getElementById("tarjeta-ventas").value = ""
            document.getElementById("credito-ventas").value = ""
            document.getElementById("total-metodo-pago-ventas").value = ""
            document.getElementById("total-metodo-pago-ventas").style.background = ""
        }else if(event.target.value == "tarjeta"){
            setAtributoMetodoDePago()
            document.getElementById("efectivo-ventas").value = ""
            document.getElementById("tarjeta-ventas").value = Number(document.getElementById("total-importe-tabla-ventas").textContent)
            document.getElementById("credito-ventas").value = ""
            document.getElementById("total-metodo-pago-ventas").value = ""
            document.getElementById("total-metodo-pago-ventas").style.background = ""
        }else if(event.target.value == "credito"){
            setAtributoMetodoDePago()
            document.getElementById("efectivo-ventas").value = ""
            document.getElementById("tarjeta-ventas").value = ""
            document.getElementById("credito-ventas").value = Number(document.getElementById("total-importe-tabla-ventas").textContent)
            document.getElementById("total-metodo-pago-ventas").value = ""
            document.getElementById("total-metodo-pago-ventas").style.background = ""
        }else if(event.target.value == "combinado"){
            removeAtributoMetodoDePago()
            document.getElementById("efectivo-ventas").value = ""
            document.getElementById("tarjeta-ventas").value = ""
            document.getElementById("credito-ventas").value = ""
            document.getElementById("total-metodo-pago-ventas").value = Number(document.getElementById("total-importe-tabla-ventas").textContent)
            document.getElementById("total-metodo-pago-ventas").style.background = ""

            const operacionEfectivo = document.getElementById("efectivo-ventas");
            operacionEfectivo.addEventListener("keyup", (event) =>{
                event.target.parentNode.parentNode.children[3].children[1].value = Number(document.getElementById("total-importe-tabla-ventas").textContent) - 
                                                                                    (Number(event.target.value) + Number(event.target.parentNode.parentNode.children[1].children[1].value) +
                                                                                    Number(event.target.parentNode.parentNode.children[2].children[1].value ))
                if(document.getElementById("total-metodo-pago-ventas").value == 0){
                    document.getElementById("total-metodo-pago-ventas").style.background = "green"
                }else{
                    document.getElementById("total-metodo-pago-ventas").style.background = "#b36659"
                }
            });
            const operacionTarjeta = document.getElementById("tarjeta-ventas");
            operacionTarjeta.addEventListener("keyup", (event) =>{
                event.target.parentNode.parentNode.children[3].children[1].value = Number(document.getElementById("total-importe-tabla-ventas").textContent) - 
                                                                                    (Number(event.target.value) + Number(event.target.parentNode.parentNode.children[0].children[1].value) +
                                                                                    Number(event.target.parentNode.parentNode.children[2].children[1].value))
                if(document.getElementById("total-metodo-pago-ventas").value == 0){
                    document.getElementById("total-metodo-pago-ventas").style.background = "green"
                }else{
                    document.getElementById("total-metodo-pago-ventas").style.background = "#b36659"
                }
            });
            const operacionCred = document.getElementById("credito-ventas");
            operacionCred.addEventListener("keyup", (event) =>{
                event.target.parentNode.parentNode.children[3].children[1].value = Number(document.getElementById("total-importe-tabla-ventas").textContent) - 
                                                                                    (Number(event.target.value) + Number(event.target.parentNode.parentNode.children[0].children[1].value) +
                                                                                    Number(event.target.parentNode.parentNode.children[1].children[1].value ))
                if(document.getElementById("total-metodo-pago-ventas").value == 0){
                    document.getElementById("total-metodo-pago-ventas").style.background = "green"
                }else{
                    document.getElementById("total-metodo-pago-ventas").style.background = "#b36659"
                }
            });
        };
    });
});

const removerTablaVentas = document.getElementById("remover-tabla-ventas");
removerTablaVentas.addEventListener("click", () =>{
    document.querySelector("#tabla-ventas > tbody").remove();
    document.querySelector("#tabla-ventas").createTBody();
    totalesTabla()
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function asegurarExistenciaStock(){
    let suma_comprobacion = 0;
    let filasTabla = document.querySelector("#tabla-ventas > tbody").children;
    for(let i = 0; i < filasTabla.length; i++){
        let stock_asegurado = [];
        let url = URL_API_almacen_central + `almacen_central_id_sucursal/${filasTabla[i].children[0].textContent}?`+
                                        `sucursal_get=${sucursales_activas[indice_sucursal_ventas]}`
        let response  = await fetch(url, {
            "method": 'GET',
            "headers": {
                "Content-Type": 'application/json'
            }
        });
        if(response.status === 200){
            stock_asegurado = await response.json();
            if(Number(filasTabla[i].children[6].textContent) <= stock_asegurado.sucursal_get){
                suma_comprobacion +=1;
                modal_proceso_abrir("Procesando la venta!!!.", `Stock asegurado: ${suma_comprobacion} de ${filasTabla.length}`)
                console.log(`Stock asegurado: ${suma_comprobacion} de ${filasTabla.length}`)
            }else{
                alert(`El código ${filasTabla[i].children[2].textContent} con descripción "${filasTabla[i].children[3].textContent }", 
                no cuenta con stock suficiente. Actualice la página para conocer el nuevo stock.`)
            };
        };
    };
    if(suma_comprobacion == filasTabla.length){
        llave_comprobacion = 1
    };
};

///////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////GENERAR TICKET/////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
async function NuevaVentanaComprobanteDePago() {
    modal_proceso_abrir_botones()
    modal_proceso_abrir('Operación completada exitosamente. ¿Desea imprimir comprobante de venta?')
    document.getElementById("si_comprobante").addEventListener("click", async() =>{
        await cargarNumeracionDatos();
        let numeracion_comprobante_venta = "";
        let importe_venta = 0;
        if(document.getElementById("input-tipo-comprobante").value === "Nota de Venta"){
            numeracion_comprobante_venta = "N001-" + (Number(numeracion[0].nota_venta)+1)
        }else if(document.getElementById("input-tipo-comprobante").value === "Boleta de Venta"){
            numeracion_comprobante_venta = "B001-" + (Number(numeracion[0].boleta_venta)+1)
        }else if(document.getElementById("input-tipo-comprobante").value === "Factura"){
            numeracion_comprobante_venta = "F001-" + (Number(numeracion[0].factura)+1)
        };
        // Generar el contenido HTML con los datos de la tabla
        let bodyTicket = document.querySelector("#tabla-ventas > tbody");
        let contenidoHTML = `<style>
                                *{
                                    margin: 0;
                                    padding: 0;
                                }
                                .contenedor_ticket {
                                    display: flex;
                                    justify-content: center;
                                }
                                .ticket{
                                    width: 260px;
                                    margin: 20px;
                                    font-size: 10px;
                                    display: flex;
                                    flex-direction: column;
                                    align-items: center;
                                }
                                table{
                                    font-size: 10px;
                                }
                                .tabla_head th{
                                    color: black;
                                    border-top: 1px solid black;
                                    border-bottom: 1px solid black;
                                    margin: auto;
                                }
                                .codBarTicket {
                                    width: 150px;
                                }
                                .invisible {
                                    display: none;
                                }
                            </style>
                            <div class="contenedor_ticket">
                            <div class="ticket">
                                <p>${datos[0].nombre_empresa}</p>
                                <p>${datos[0].direccion}</p>
                                <p>RUC: ${datos[0].ruc}</p>
                                <p>Sede: ${document.getElementById("sucursal-principal").children[document.getElementById("sucursal-principal").selectedIndex].textContent}</p>
                                <h2 class="tipo_comprobante">${document.getElementById("input-tipo-comprobante").value}</h2>
                                <br>
                                <h2>${numeracion_comprobante_venta}</h2>
                                <br>
                                <p>FECHA   : ${fechaPrincipal}</p>
                                <p>CLIENTE : ${document.getElementById("clientesv").value}</p>
                                <table>
                                    <thead class="tabla_head">
                                        <tr>
                                            <th>PRODUCTO</th>
                                            <th>CANTIDAD</th>
                                            <th>PRECIO</th>
                                            <th>IMPORTE</th>
                                        </tr>
                                    </thead>
                                    <tbody>`;
        for (let i = 0; i < bodyTicket.rows.length; i++) {
            let producto = bodyTicket.children[i].children[3].textContent;
            let catidad = bodyTicket.children[i].children[6].textContent;
            let precio = Number(bodyTicket.children[i].children[7].textContent).toFixed(2);
            let importe = bodyTicket.children[i].children[8].textContent;
            contenidoHTML += `<tr>
                                    <td>${producto}</td>
                                    <td>${catidad}</td>
                                    <td>${precio}</td>
                                    <td>${importe}</td>
                                </tr>`;
            importe_venta += Number(bodyTicket.children[i].children[8].textContent);
        };
                contenidoHTML +=    `</tbody>
                                    <tfoot>
                                        <tr class="clave">
                                            <th>OP. GRAVADAS</th>
                                            <th></th>
                                            <th></th>
                                            <th> S/ ${((1/1.18)*(importe_venta)).toFixed(2)}</th>
                                        </tr>
                                        <tr class="clave">
                                            <th>I.G.V.</th>
                                            <th>18%</th>
                                            <th></th>
                                            <th> S/ ${((importe_venta)-((1/1.18)*(importe_venta))).toFixed(2)}</th>
                                        </tr>
                                        <tr>
                                            <th>IMPORTE TOTAL</th>
                                            <th></th>
                                            <th></th>
                                            <th> S/ ${importe_venta.toFixed(2)}</th>
                                        </tr>
                                    </tfoot>   
                                </table>
                                <p>USUARIO: ${document.getElementById("puesto_usuario").textContent}</p>
                                <p>LADO: ORIGINAL   </p>
                                            <img class="codBarTicket" src="">
                                <p>PRESENTACIÓN IMPRESA DE LA<p>
                                <p>${document.getElementById("input-tipo-comprobante").value}<p>
                                <br>
                                <p>ACUMULA Y CANJEA PUNTOS EN NUESTROS<p>
                                <p>DESCUENTOS Y PROMOCIONES!!!<p>
                                <p>GRACIAS POR SU PREFERENCIA<p>
                                <p>Sistema ventas: http://karpovick.com<p>
                                
                            </div>
                            </div>
                            <br>
                            <br>
                            <br>
                            <br>
                            <button id="imprimir_ticket">Imprimir</button>
                            <button id="guardar_pdf_dos">PDF</button>
                            <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.2/html2pdf.bundle.min.js"></script>
                            <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
                            <script>
                            if(document.querySelector(".tipo_comprobante").textContent === "Nota de Venta"){
                                document.querySelectorAll(".clave").forEach((event)=>{
                                    event.classList.add("invisible")
                                });   
                            }
                            JsBarcode(".codBarTicket", "Venta-" + ${(Number(numeracion[0].ventas) + 1)}, {
                                format: "CODE128",
                                displayValue: true
                            });
                            var options = {
                                filename: '${numeracion_comprobante_venta}.pdf',
                                image: { type: 'jpeg', quality: 0.98 },
                                html2canvas: { scale: 2 },
                                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                            };
                            document.getElementById("guardar_pdf_dos").addEventListener("click",(e)=>{
                                e.preventDefault()
                                html2pdf().set(options).from(document.querySelector(".ticket")).save();
                            })
                            document.getElementById("imprimir_ticket").addEventListener("click",(e)=>{
                                e.preventDefault()
                                window.print();
                            })
                            </script>`;

        // Abrir una nueva ventana o pestaña con el contenido HTML generado
        let nuevaVentana = window.open('');
        nuevaVentana.document.write(contenidoHTML);
        modal_proceso_cerrar_botones()
        modal_proceso_cerrar()
        reiniciandoVentas()
    });
    document.getElementById("no_salir").addEventListener("click", () =>{
        modal_proceso_cerrar_botones()
        modal_proceso_cerrar()
        reiniciandoVentas()
    })
};

//////////////////////////////////////////////////////////////////////
function cambioSucursal(){
    document.getElementById("sucursal-principal").addEventListener("click",()=>{
        if(document.querySelector("#tabla-ventas > tbody").children.length > 0){

            respuestaVenta = confirm('Hay datos en cola en la lista de productos, si cambia de sucursal se borrarán los datos, ¿Desea continuar?')
            if(respuestaVenta){
                document.getElementById("formulario-ventas").reset();
                reiniciandoVentas()
            };

        }else{
            document.getElementById("sucursal-principal").addEventListener("change", ()=>{
                document.getElementById("formulario-ventas").reset();
                document.getElementById("id-ventas").value = "";
            })
        };
    });
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////Reporte de Ventas///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
document.getElementById("reporte_ventas_hoy").addEventListener("click", async ()=>{

    let url_dos = URL_API_almacen_central + `salidas_tabla_reporte?`+
                                        `comprobante_salidas=Venta&`+
                                        `fecha_inicio_salidas=${new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate()}&`+
                                        `fecha_fin_salidas=${new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate()}`
    let respuesta  = await fetch(url_dos, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    });
    let reporte_ventas = await respuesta.json();

    let reporteHTML = `
                    <style>
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
                        <h2>${document.getElementById("sucursal-principal").children[document.getElementById("sucursal-principal").selectedIndex].textContent}</h2>
                        <h3>Fecha de reporte: ${new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate()}</h3>
                    </div>
                    <table>
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
    for(sal of reporte_ventas){
        if(sal.sucursal_nombre == 
            document.getElementById("sucursal-principal").children[document.getElementById("sucursal-principal").selectedIndex].textContent){
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
        };
    };                  
    reporteHTML += `
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th></th>
                                </tr>
                            </tfoot>
                        </table>
                        <div>
                            <button class="imprimir_reporte_ventas">Imprimir</button>
                        </div>
                        <script>
                                document.querySelector(".imprimir_reporte_ventas").addEventListener("click", (event) => {
                                event.preventDefault()
                                window.print()
                            });
                        </script>
                    `
    let nuevaVentana = window.open('');
    nuevaVentana.document.write(reporteHTML);
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function conteoCliente(){
    let url = URL_API_almacen_central + `ventas_cliente_conteo/${Number(document.getElementById("txtIdv").value)}`
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    });
    
    if(respuesta.ok){
        let cli_conteo = await respuesta.json();
        if(cli_conteo[0].conteo_cliente > 0){
            document.getElementById("concurrencia_cliente").textContent = `Cliente recurrente con ${cli_conteo[0].conteo_cliente} `+
                                                                            `operaciones de S/${cli_conteo[0].suma_total.toFixed(2)}, `+
                                                                            `venta promedio S/${(cli_conteo[0].suma_total/cli_conteo[0].conteo_cliente).toFixed(2)}`
        }
    }
};
//////////////////////////////////////////////////////////////
function reiniciandoVentas(){
    document.querySelector("#tabla-ventas > tbody").remove();
    document.querySelector("#tabla-ventas").createTBody();
    document.getElementById("total-importe-tabla-ventas").textContent = "";
    document.getElementById("total-cantidad-tabla-ventas").textContent = "";
    document.getElementById("contenedor-metodo-pago").reset();
    document.getElementById("total-metodo-pago-ventas").style.background = ""
    document.getElementById('txtIdv').value = ""
}
/* function cambioSucursal(){
    document.getElementById("sucursal-principal").addEventListener("change", ()=>{
        document.getElementById("formulario-ventas").reset();
        document.getElementById("id-ventas").value = "";
    })
} */
