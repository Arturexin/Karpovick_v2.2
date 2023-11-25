const listElements = document.querySelectorAll(".lista-boton-click");
const subLists = document.querySelectorAll(".sub-lista");
const pagina = document.querySelectorAll(".pagina")
const ventas = document.querySelector(".boton-ventas");
const home = document.querySelector(".boton-home");
document.addEventListener("DOMContentLoaded", init)
function init(){
    inicioColoresFondo()
    cambioColorFondo()
    sidebarMarcadito()

    cargarIndices()

};
const URL_API_almacen_central = 'http://127.0.0.1:3000/api/'

const fechaPrincipal = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate()+" "+new Date().getHours()+":"+new Date().getMinutes()+":"+new Date().getSeconds();

let productosAlmacenCentral = []
let productosCCD = []
let entradasAlmacenCentral =[]
let salidasAlmacenCentral =[]
let cajaTotal =[];
let detalleVentas =[];
let gastosVarios = [];
let clientes = [];
let categorias = [];
let numeracion = [];
let datos = [];
let sucursales = [];
let array_sucursales = [];
let sucursales_activas = ['existencias_ac', 'existencias_su', 'existencias_sd', 'existencias_st'];

let obttenerAnio = new Date().getFullYear() % 100
let arregloMeses = [`01-${obttenerAnio}`, `02-${obttenerAnio}` ,`03-${obttenerAnio}` ,`04-${obttenerAnio}` ,`05-${obttenerAnio}` ,`06-${obttenerAnio}`, 
                    `07-${obttenerAnio}`, `08-${obttenerAnio}`, `09-${obttenerAnio}`, `10-${obttenerAnio}`, `11-${obttenerAnio}` ,`12-${obttenerAnio}`];
let meses_letras = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Set","Oct","Nov","Dic",]
let indice_base = [];
let suc_enc = [];
let cat_con = [];
let indice_cli = [];
let indice_cat = [];
let clientes_ventas = [];


async function cargarIndices(){
    if(!localStorage.getItem("base_datos_consulta") || JSON.parse(localStorage.getItem("base_datos_consulta")).length === 0){
        await cargarDatosProductosCCD();
        localStorage.setItem("base_datos_consulta", JSON.stringify(productosCCD))
        /* indice_base = JSON.parse(localStorage.getItem("base_datos_consulta")) */
    };
    if(!localStorage.getItem("sucursal_encabezado") || JSON.parse(localStorage.getItem("sucursal_encabezado")).length === 0){
        await cargarSucursales();
        localStorage.setItem("sucursal_encabezado", JSON.stringify(sucursales))
    };
    cargarSucursalesEjecucion(); //llena select suscursal encabezado

    if(!localStorage.getItem("categoria_consulta") || JSON.parse(localStorage.getItem("categoria_consulta")).length === 0){
        await llenarCategoriaProductos();
        localStorage.setItem("categoria_consulta", JSON.stringify(categorias))
    };
    if(!localStorage.getItem("base_datos_prov") || JSON.parse(localStorage.getItem("base_datos_prov")).length === 0){
        await llenarProveedores();
        localStorage.setItem("base_datos_prov", JSON.stringify(proveedores))
    };
    if(!localStorage.getItem("base_datos_cli") || JSON.parse(localStorage.getItem("base_datos_cli")).length === 0){
        await llenarClientes();
        localStorage.setItem("base_datos_cli", JSON.stringify(clientes_ventas))
    };
};
async function cargarDatosProductos(){
    let url = URL_API_almacen_central + 'almacen_central'
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    productosAlmacenCentral = await respuesta.json();
}
async function cargarDatosProductosCCD(){
    let url = URL_API_almacen_central + 'almacen_central_ccd'
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    });
    productosCCD = await respuesta.json();
};
async function cargarDatosEntradas(){
    let url = URL_API_almacen_central + 'entradas'
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    entradasAlmacenCentral = await respuesta.json();
}
async function cargarDatosSalidas(){
    let url = URL_API_almacen_central + 'salidas'
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    salidasAlmacenCentral = await respuesta.json();
}
async function cargarDatosDetalleVentas(){
    let url = URL_API_almacen_central + 'ventas'
    let response = await fetch(url,{
        "method": "GET",
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    detalleVentas = await response.json()
}
async function cargarDatosGastosVarios(){
    let url = URL_API_almacen_central + 'gastos_varios'
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    gastosVarios = await respuesta.json();
}
async function cargarDatosClientes(){
    let url = URL_API_almacen_central + 'clientes'
    let response = await fetch(url,{
        "method": "GET",
        "headers": {
            "Content-Type": 'application/json'
        }
    });
    clientes = await response.json()
}
async function cargarNumeracionComprobante(){
    try {
        let url = URL_API_almacen_central + 'numeracion_comprobante';
        let response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": 'application/json'
            }
        });

        if (response.ok) {
            numeracion = await response.json();
            // Realizar la acción en caso de éxito
            /* console.log("Solicitud exitosa. Numeración cargada: ", numeracion); */
        } else {
            alert("Error en la respuesta de la API: " + response.statusText)
            throw new Error("Error en la respuesta de la API: " + response.statusText);
        };
        return response;
    } catch (error) {
        alert("Error durante la solicitud: ", error);
        console.error("Error durante la solicitud: ", error);
    }
}
async function cargarNumeracionDatos(){
    try {
        let url = URL_API_almacen_central + 'numeracion_comprobante_datos';
        let response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": 'application/json'
            }
        });

        if (response.ok) {
            datos = await response.json();
            // Realizar la acción en caso de éxito
            /* console.log("Solicitud exitosa. Datos de negocio cargados: ", datos); */
        } else {
            alert("Error en la respuesta de la API: " + response.statusText)
            throw new Error("Error en la respuesta de la API: " + response.statusText);
        }
    } catch (error) {
        alert("Error durante la solicitud: ", error);
        console.error("Error durante la solicitud: ", error);
    }
}
async function funcionFetch(url, fila){
    try {
        let response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(fila),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error("Error en la respuesta de la API: " + response.statusText);
        };
        return response;
    } catch (error) {
        console.error("Error durante la solicitud:", error);
        // Opcional: puedes volver a lanzar el error para que sea manejado en el contexto superior
        throw error;
    };
};
async function cargarSucursales(){// SE LLAMA AL CARGAR LA PAGINA INDEX
    let url = URL_API_almacen_central + 'sucursales_index'
    let response = await fetch(url,{
        "method": "GET",
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    sucursales = await response.json()
};
function cargarSucursalesEjecucion(){// SE LLAMA AL CARGAR LA PAGINA INDEX
    suc_enc = JSON.parse(localStorage.getItem("sucursal_encabezado"))
    let html = ''
    /* for(sucursal of suc_enc) {
        if(array_sucursales.length < 4){
            array_sucursales.push(sucursal.sucursal_nombre)
        }
        if(document.getElementById("puesto_usuario").textContent == 1){

        }
        
        let fila = `<option value="${sucursal.id_sucursales }">${sucursal.sucursal_nombre}</option>`
        html = html + fila;
    }; */
    for(let i = 0; i < suc_enc.length; i++){
        let fila = ""
        if(array_sucursales.length < 4){
            array_sucursales.push(suc_enc[i].sucursal_nombre)
        }
        if(document.getElementById("puesto_usuario").textContent == 1){
            fila = `<option value="${suc_enc[1].id_sucursales }">${suc_enc[1].sucursal_nombre}</option>`
        }else if(document.getElementById("puesto_usuario").textContent == 2){
            fila = `<option value="${suc_enc[2].id_sucursales }">${suc_enc[2].sucursal_nombre}</option>`
        }else if(document.getElementById("puesto_usuario").textContent == 3){
            fila = `<option value="${suc_enc[3].id_sucursales }">${suc_enc[3].sucursal_nombre}</option>`
        }else{
            fila = `<option value="${suc_enc[i].id_sucursales }">${suc_enc[i].sucursal_nombre}</option>`
        }
        html = html + fila;
    }
    document.querySelector("#sucursal-principal").innerHTML = html
};
async function llenarCategoriaProductos(){// SE LLAMA AL CARGAR LA PAGINA
    let url = URL_API_almacen_central + 'categorias'
    let response = await fetch(url,{
        "method": "GET",
        "headers": {
            "Content-Type": 'application/json'
        }
    });
    categorias = await response.json()
};
function llenarCategoriaProductosEjecucion(cate){
    cat_con = JSON.parse(localStorage.getItem("categoria_consulta"))
    let html_cat = "";
    for(categoria of cat_con) {
        let fila = `<option value="${categoria.id}">${categoria.categoria_nombre}</option>`
        html_cat = html_cat + fila;
    };
    document.querySelector(cate).innerHTML = html_cat
};
async function llenarProveedores(){// SE LLAMA AL CARGAR LA PAGINA
    let url = URL_API_almacen_central + 'proveedores'
    let response = await fetch(url,{
        "method": "GET",
        "headers": {
            "Content-Type": 'application/json'
        }
    });
    proveedores = await response.json()
};
function baseProv(cate){
    prov_con = JSON.parse(localStorage.getItem("base_datos_prov"))
   let html = ''
    for(prov of prov_con) {
        let fila;
            fila = `<option value="${prov.id_cli}">${prov.nombre_cli}</option>`
        html = html + fila;
    };
    document.querySelector(cate).innerHTML = html 
}
async function llenarClientes(){// SE LLAMA AL CARGAR LA PAGINA
    let url = URL_API_almacen_central + 'clientes_ventas'
    let response = await fetch(url,{
        "method": "GET",
        "headers": {
            "Content-Type": 'application/json'
        }
    });
    clientes_ventas = await response.json()
};
function categoriaProductosCreacion(categoria, array){
    const event = document.getElementById(categoria);
    if(event){
        cat_con.forEach((elemento) => {
            if(elemento.id === Number(event.value)){
                if(elemento.uno !== ""){array.push(elemento.uno)};
                if(elemento.dos !== ""){array.push(elemento.dos)};
                if(elemento.tres !== ""){array.push(elemento.tres)};
                if(elemento.cuatro !== ""){array.push(elemento.cuatro)};
                if(elemento.cinco !== ""){array.push(elemento.cinco)};
                if(elemento.seis !== ""){array.push(elemento.seis)};
                if(elemento.siete !== ""){array.push(elemento.siete)};
                if(elemento.ocho !== ""){array.push(elemento.ocho)};
                if(elemento.nueve !== ""){array.push(elemento.nueve)};
                if(elemento.diez !== ""){array.push(elemento.diez)};
                if(elemento.once !== ""){array.push(elemento.once)};
                if(elemento.doce !== ""){array.push(elemento.doce)};
            };
        });
    };
    return array;
};
function compararCodigosProformaRecompra(idTabla, idFormulario, formulario){
    document.querySelectorAll(idTabla).forEach((elemento) => {
        if(elemento.textContent === document.getElementById(idFormulario).value){
            alert('El código ' + elemento.parentNode.children[3].children[0].value + ' en ' + elemento.parentNode.children[1].textContent + ' ya existe en la tabla Proforma')
            document.getElementById(idFormulario).value = ""
            document.getElementById(formulario).reset();
        };
    });
};
async function comprobarCodigoProductos(codigo){//verificamos que el nuevo producto no tenga el mismo código en la tabla productos
    const codigoTablaProformaProductos = document.querySelectorAll(codigo);
    let suma = 0;
    let arrayMensaje = [];
    let base_datos_comparacion = JSON.parse(localStorage.getItem("base_datos_consulta"))
    for(let i = 0; i< codigoTablaProformaProductos.length;i++){
        let cod_com = base_datos_comparacion.find(y => y.codigo.toLowerCase().startsWith(codigoTablaProformaProductos[i].textContent.toLowerCase()))
        if(cod_com){
            arrayMensaje.push(cod_com.codigo)
            codigoTablaProformaProductos[i].parentNode.remove()
            suma+=1
        };
    };
    if(suma > 0){
        alert(`Los códigos [ ${arrayMensaje} ] ya existen en la base de datos, si está ingresando datos con costos diferentes y/o proveedores diferentes coloque un lote diferente al de los códigos ya existentes en la base de datos.`)
    };
};
function compararCodigosNuevos(codigoUno, codigoDos){
    document.querySelectorAll(codigoUno).forEach((elemento) => {
        if(elemento.textContent.toLocaleLowerCase() === codigoDos){
            alert('Él o los códigos en ' + elemento.parentNode.children[1].textContent + ' ya existe en la tabla Proforma, si desea voler a crearlos primero elimínelos de la tabla Proforma')
        };
    });
};

const expregul= {
    cliente: /^[A-ZÑa-zñáéíóúÁÉÍÓÚ'° ]+$/,
    precios: /^\d*\.?\d+/,
    dni: /^\d{8,8}$/,
    email: /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/,
    telefono: /^[ 0-9]+$/,
    direccion: /^[A-ZÑa-zñáéíóúÁÉÍÓÚ'°,.:/\d\- ]+$/,
    cantidad: /^[0-9]+$/,
    codigo: /^[A-ZÑa-zñ'°\d ]+$/,
    descripcion: /^[A-ZÑa-zñáéíóúÁÉÍÓÚ'°\-_/:()\d ]+$/,
    password: /(?=(.*[0-9]))(?=.*[\!@#$%^&*()\\[\]{}\-_+=|:;"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}/
};
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
let btnHome, btnVentas, btnCompras, btnTransferencias, btnKardex, btnDetalleVentas, 
    btnModificacion, btnDevolucionCompras, btnDevolucionSalidas, btnPerdidas, btnProductos,
    btnEntradasP, btnSalidasP, btnClientes, btnConfiguracion;
document.getElementById("button-home").addEventListener("click",(event) => {
    location.href = "/home";
});
document.getElementById("button-ventas").addEventListener("click",(event) => {
    location.href = "/ventas";
});
function sidebarMarcadito(){
    if(btnHome == 1){
        document.getElementById("button-home").classList.add("marcadito")
        document.querySelector(".baja_opacidad").classList.add("alta_opacidad")
    }else if(btnVentas == 1){
        document.getElementById("button-ventas").classList.add("marcadito")
        document.querySelector(".baja_opacidad").classList.add("alta_opacidad")
        /* document.getElementById("saldo-apertura-caja").focus(); */
    }else if(btnCompras == 1){
        document.getElementById("button-compras").classList.add("marcadito");
        document.getElementById("btnMovimientos").nextElementSibling.style.height = 
        `${document.getElementById("btnMovimientos").nextElementSibling.scrollHeight}px`;
        document.querySelector(".baja_opacidad").classList.add("alta_opacidad")
        /* document.getElementById("sucursal-compras").value = document.getElementById("sucursal-principal").value; */
        /* document.getElementById("codigo-compras").focus(); */
    }else if(btnTransferencias == 1){
        document.getElementById("button-transferencias").classList.add("marcadito")
        document.getElementById("btnMovimientos").nextElementSibling.style.height = 
        `${document.getElementById("btnMovimientos").nextElementSibling.scrollHeight}px`;
        document.querySelector(".baja_opacidad").classList.add("alta_opacidad")
        document.getElementById("buscador-productos-transferencias").focus();
    }else if(btnKardex == 1){
        document.getElementById("button-kardex").classList.add("marcadito")
        document.getElementById("btnMovimientos").nextElementSibling.style.height = 
        `${document.getElementById("btnMovimientos").nextElementSibling.scrollHeight}px`;
        document.querySelector(".baja_opacidad").classList.add("alta_opacidad")
        document.getElementById("buscador-productos-detalle-movimientos").focus();
    }else if(btnDetalleVentas == 1){
        document.getElementById("button-detalle-ventas").classList.add("marcadito")
        document.getElementById("btnMovimientos").nextElementSibling.style.height = 
        `${document.getElementById("btnMovimientos").nextElementSibling.scrollHeight}px`;
        document.querySelector(".baja_opacidad").classList.add("alta_opacidad")
    }else if(btnModificacion == 1){
        document.getElementById("button-modificacion").classList.add("marcadito")
        document.getElementById("btnMantenimiento").nextElementSibling.style.height = 
        `${document.getElementById("btnMantenimiento").nextElementSibling.scrollHeight}px`;
        document.querySelector(".baja_opacidad").classList.add("alta_opacidad")
        /* document.getElementById("sucursal-modificacion").value = document.getElementById("sucursal-principal").value */
        /* document.getElementById("codigo-modificacion").focus(); */
    }else if(btnDevolucionCompras == 1){
        document.getElementById("button-devolucion-compras").classList.add("marcadito")
        document.getElementById("btnMantenimiento").nextElementSibling.style.height = 
        `${document.getElementById("btnMantenimiento").nextElementSibling.scrollHeight}px`;
        document.querySelector(".baja_opacidad").classList.add("alta_opacidad")
        document.getElementById("buscador-comporbante-compras").focus();
    }else if(btnDevolucionSalidas == 1){
        document.getElementById("button-devolucion-salidas").classList.add("marcadito")
        document.getElementById("btnMantenimiento").nextElementSibling.style.height = 
        `${document.getElementById("btnMantenimiento").nextElementSibling.scrollHeight}px`;
        document.querySelector(".baja_opacidad").classList.add("alta_opacidad")
        document.getElementById("buscador-comporbante-salidas").focus();
    }else if(btnPerdidas == 1){
        document.getElementById("button-perdidas").classList.add("marcadito")
        document.getElementById("btnMantenimiento").nextElementSibling.style.height = 
        `${document.getElementById("btnMantenimiento").nextElementSibling.scrollHeight}px`;
        document.querySelector(".baja_opacidad").classList.add("alta_opacidad")
        document.getElementById("buscador-perdidas").focus();
    }else if(btnProductos == 1){
        document.getElementById("button-productos").classList.add("marcadito")
        document.getElementById("btnInventario").nextElementSibling.style.height = 
        `${document.getElementById("btnInventario").nextElementSibling.scrollHeight}px`;
        document.querySelector(".baja_opacidad").classList.add("alta_opacidad")
        document.getElementById("codigo-productos").focus();
    }else if(btnEntradasP == 1){
        document.getElementById("button-entradas").classList.add("marcadito")
        document.getElementById("btnInventario").nextElementSibling.style.height = 
        `${document.getElementById("btnInventario").nextElementSibling.scrollHeight}px`;
        document.querySelector(".baja_opacidad").classList.add("alta_opacidad")
    }else if(btnSalidasP == 1){
        document.getElementById("button-salidas").classList.add("marcadito")
        document.getElementById("btnInventario").nextElementSibling.style.height = 
        `${document.getElementById("btnInventario").nextElementSibling.scrollHeight}px`;
        document.querySelector(".baja_opacidad").classList.add("alta_opacidad")
    }else if(btnClientes == 1){
        document.getElementById("button-clientes").classList.add("marcadito")
        document.getElementById("btnAdministracion").nextElementSibling.style.height = 
        `${document.getElementById("btnAdministracion").nextElementSibling.scrollHeight}px`;
        document.querySelector(".baja_opacidad").classList.add("alta_opacidad")
        document.getElementById("nombre").focus();
    }else if(btnConfiguracion == 1){
        document.getElementById("button-configuracion").classList.add("marcadito")
        document.getElementById("btnAdministracion").nextElementSibling.style.height = 
        `${document.getElementById("btnAdministracion").nextElementSibling.scrollHeight}px`;
        document.querySelector(".baja_opacidad").classList.add("alta_opacidad")
    };
};
listElements.forEach((listElement) => {
    listElement.addEventListener("click", () => {
        listElement.classList.toggle("mostrar");
        let height = 0;
        let menu = listElement.nextElementSibling;
        if(menu.clientHeight == "0"){
            height = menu.scrollHeight;
        };
        menu.style.height = `${height}px`;
    });
});
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
const cerrarSesion = document.getElementById("cerrar-sesion");
cerrarSesion.addEventListener("click", (event) => {
    /* event.preventDefault(); */
    
    localStorage.clear();
    guardadoUsuario = ""
    location.reload();
});
/////////////////////////////////////////////////////////////////////////////////////////////
function menuVertical(){
    document.getElementById("boton_despliegue").addEventListener("click", ()=>{
        document.querySelector(".menu-vertical").classList.toggle("menu_vertical_dos")
        document.querySelector(".body_web").classList.toggle("body_web_dos")
        document.getElementById("boton_despliegue").classList.toggle("cambioColor")
        if(document.querySelector("#sidebar").clientWidth > 55){
            reduccionTexto()
        }else if(window.innerWidth > 1280){
            expancionTexto()
        }
    });
    
};
menuVertical()
window.addEventListener('resize', function() {
    if (window.innerWidth > 1280 && document.querySelector("#sidebar").clientWidth > 55) {
        expancionTexto()
    }else{
        reduccionTexto()
    }
});

function inicioMenu(){
    if(document.querySelector("#sidebar").clientWidth == 55){
        reduccionTexto()
    }else{
        expancionTexto()
    }
}
inicioMenu()

function reduccionTexto(){
    document.getElementById("button-compras").textContent = "1a"
    document.getElementById("button-transferencias").textContent = "2a"
    document.getElementById("button-kardex").textContent = "3a"
    document.getElementById("button-detalle-ventas").textContent = "4a"
    document.getElementById("button-modificacion").textContent = "1b"
    document.getElementById("button-devolucion-compras").textContent = "2b"
    document.getElementById("button-devolucion-salidas").textContent = "3b"
    document.getElementById("button-perdidas").textContent = "4b"
    document.getElementById("button-productos").textContent = "1c"
    document.getElementById("button-entradas").textContent = "2c"
    document.getElementById("button-salidas").textContent = "3c"
    document.getElementById("button-clientes").textContent = "1d"
    document.getElementById("button-configuracion").textContent = "2d"
}    
function expancionTexto(){
    document.getElementById("button-compras").textContent = "Compras"
    document.getElementById("button-transferencias").textContent = "Transferencias"
    document.getElementById("button-kardex").textContent = "Kardex"
    document.getElementById("button-detalle-ventas").textContent = "Detalle de Ventas"
    document.getElementById("button-modificacion").textContent = "Modificación"
    document.getElementById("button-devolucion-compras").textContent = "Devolución por Compras"
    document.getElementById("button-devolucion-salidas").textContent = "Devolución por Salidas"
    document.getElementById("button-perdidas").textContent = "Pérdidas"
    document.getElementById("button-productos").textContent = "Productos"
    document.getElementById("button-entradas").textContent = "Entradas"
    document.getElementById("button-salidas").textContent = "Salidas"
    document.getElementById("button-clientes").textContent = "Clientes"
    document.getElementById("button-configuracion").textContent = "Configuración"
}    
/////////////////////////////////////////////////////////////////////////////////////
document.querySelector(".usuario_cliente").addEventListener("click", ()=>{
    document.querySelector(".usuario_cliente").classList.toggle("cambioColor")
    document.querySelector(".usuario_opciones").classList.toggle("usuario_opciones_dos")
})
//////////////////////////////////////////////////////////////////////////////////////
//////TEMPORIZADOR///////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////
const colores_fondo_web = {
    fondo_principal : ["#121212", "#C774B5", "#FFD700", "#FBF5EE"],
    fondo_secundario : ["#050505", "#5b90bd", "#232323", "#44b6db"],
    fondo_terciario : ["#31383f", "#efe7ee", "#F4EAF6", "#FFFFFF"],
    fuente_principal : ["#eee", "#1c101a", "#232323", "#000"],
    fuente_secundario : ["#eee", "#1c101a", "#eee", "#eee"],
    marca_uno : ["#994d40", "#BFC77D", "#232323", "#44b6db"],
    border_principal : ["#994d40", "#BFC77D", "#232323", "#50C3CC"],
    fondo_input : ["#31383f", "#efe7ee", "#FFE44D", "#FFFFFF"],

    boton_uno : ["#4b9ec3", "#5b90bd", "#3e3e97", "#50C3CC"],
    boton_dos : ["#994d40", "#BFC77D", "#5d5c5c", "#dd836e"],

    boton_tres : ["#77E578", "#5FC7C4", "#232323", "#44db95"],
};

function cambioColorFondo() {
    document.querySelectorAll(".color_fondo").forEach((event, i) => {
        event.style.background = colores_fondo_web.fondo_principal[i];
        event.addEventListener("click", () => {
            document.documentElement.style.setProperty('--fondo-principal', colores_fondo_web.fondo_principal[i]);
            document.documentElement.style.setProperty('--fondo-terciario', colores_fondo_web.fondo_terciario[i]);
            document.documentElement.style.setProperty('--fondo-secundario', colores_fondo_web.fondo_secundario[i]);
            document.documentElement.style.setProperty('--color-principal', colores_fondo_web.fuente_principal[i]);
            document.documentElement.style.setProperty('--color-secundario', colores_fondo_web.fuente_secundario[i]);
            document.documentElement.style.setProperty('--fondo-marca-uno', colores_fondo_web.marca_uno[i]);
            document.documentElement.style.setProperty('--border-principal', colores_fondo_web.border_principal[i]);
            document.documentElement.style.setProperty('--fondo-input', colores_fondo_web.fondo_input[i]);
            document.documentElement.style.setProperty('--boton-uno', colores_fondo_web.boton_uno[i]);
            document.documentElement.style.setProperty('--boton-dos', colores_fondo_web.boton_dos[i]);
            document.documentElement.style.setProperty('--boton-tres', colores_fondo_web.boton_tres[i]);
            localStorage.setItem("clave_control_color", i)
        });
    });
};
function inicioColoresFondo(){
    for(let i = 0; i < 4; i++){
        if(localStorage.getItem("clave_control_color") === `${i}`){
            document.documentElement.style.setProperty('--fondo-principal', colores_fondo_web.fondo_principal[i]);
            document.documentElement.style.setProperty('--fondo-terciario', colores_fondo_web.fondo_terciario[i]);
            document.documentElement.style.setProperty('--fondo-secundario', colores_fondo_web.fondo_secundario[i]);
            document.documentElement.style.setProperty('--color-principal', colores_fondo_web.fuente_principal[i]);
            document.documentElement.style.setProperty('--color-secundario', colores_fondo_web.fuente_secundario[i]);
            document.documentElement.style.setProperty('--fondo-marca-uno', colores_fondo_web.marca_uno[i]);
            document.documentElement.style.setProperty('--border-principal', colores_fondo_web.border_principal[i]);
            document.documentElement.style.setProperty('--fondo-input', colores_fondo_web.fondo_input[i]);
            document.documentElement.style.setProperty('--boton-uno', colores_fondo_web.boton_uno[i]);
            document.documentElement.style.setProperty('--boton-dos', colores_fondo_web.boton_dos[i]);
            document.documentElement.style.setProperty('--boton-tres', colores_fondo_web.boton_tres[i]);
        }
    }
};
function modal_proceso_abrir(mensaje, estado){
    document.getElementById('myModal').style.display = 'block';
    document.getElementById('mensaje_proceso').textContent = mensaje
    document.getElementById('estado_proceso').textContent = estado
}
function modal_proceso_abrir_botones(){
    document.querySelector('.botones_respuesta').style.display = 'block';
}
function modal_proceso_abrir_botones_salir(){
    document.querySelector('.botones_respuesta_dos').style.display = 'block';
}
function modal_proceso_cerrar(){
    document.getElementById('myModal').style.display = 'none';
}
function modal_proceso_cerrar_botones(){
    document.querySelector('.botones_respuesta').style.display = 'none';
}
function modal_proceso_salir_botones(){
    modal_proceso_abrir_botones_salir()
    document.getElementById("si_salir").addEventListener("click", () =>{
        document.querySelector('.botones_respuesta_dos').style.display = 'none';
        modal_proceso_cerrar()
    })
}
//////////////////////////////////////////////////////////////////////////////
//Modal y tablas
/////////////////////////////////////////////////////////////////////////////
function marcarCodigoRepetido(class_codigo_modal, class_codigo_proforma, nombre_tabla_proforma){//verificamos que el nuevo producto no tenga el mismo código en la tabla proforma modificación
    const codigoModal = document.querySelectorAll(class_codigo_modal);
    codigoModal.forEach((event) => {
        document.querySelectorAll(class_codigo_proforma).forEach((elemento) => {
            if(elemento.textContent.toLocaleLowerCase().includes(event.textContent.toLocaleLowerCase())){
                let respuesta = confirm(`El código ${event.textContent} `+
                                        `ya existe en la tabla ${nombre_tabla_proforma}, `+
                                        `si continúa se remplazará por este nuevo código, `+
                                        `¿Desea continuar?.`)
                if(respuesta){
                    elemento.parentNode.style.background = "#b36659"
                }else{
                    event.parentNode.remove();
                };
            };
        });
    });
};
function marcarIdRepetido(class_id_modal, class_id_proforma, nombre_tabla_proforma){//verificamos que el nuevo producto no tenga el mismo id en la tabla productos
    const idModal = document.querySelectorAll(class_id_modal);
    idModal.forEach((event) => {
        document.querySelectorAll(class_id_proforma).forEach((elemento) => {
            if(elemento.textContent === event.textContent &&
            elemento.parentNode.children[1].textContent === event.parentNode.children[1].textContent){
                let respuesta = confirm(`El código  ${event.parentNode.children[3].textContent} ya existe en la `+
                                        `tabla ${nombre_tabla_proforma}Lista de Productos, si continúa se remplazará `+
                                        `por este nuevo código, ¿Desea continuar?.`)
                if(respuesta){
                    elemento.parentNode.style.background = "#b36659"
                }else{
                    event.parentNode.remove()
                }
            };
        });
    });
};
function removerCodigoRepetido(class_codigo_modal, class_codigo_proforma, num_columna){//verificamos que el nuevo producto no tenga el mismo código en la tabla proforma modificación
    const codigoModal = document.querySelectorAll(class_codigo_modal);
    codigoModal.forEach((event) => {
        document.querySelectorAll(class_codigo_proforma).forEach((elemento) => {
            if(elemento.textContent.toLocaleLowerCase().includes(event.textContent.toLocaleLowerCase()) &&
                event.parentNode.children[num_columna].children[0].value > 0){
                elemento.parentNode.remove()
            }
        });
    });
};