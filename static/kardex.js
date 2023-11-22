document.addEventListener("DOMContentLoaded", inicioKardex)
function inicioKardex(){
    btnKardex = 1;
    cambioSucursalKardex()
    llenarCategoriaProductosEjecucion("#categoria-detalle-movimientos")
};
let kardex_salidas = [];
let kardex_entradas = [];
let kardex_salidas_categoria = [];
let kardex_salidas_categoria_suma = [];
let kardex_entradas_categoria_suma = [];
let costoKardex = 0;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////DETALLE DE MOVIMIENTOS////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let sucursal_kardex = 0;
let indice_sucursal_kardex = 0;
document.addEventListener("keyup", () => {
    indice_base = JSON.parse(localStorage.getItem("base_datos_consulta"))
    let almacenCentral = indice_base.find(y => y.codigo.toLowerCase().startsWith(document.getElementById('buscador-productos-detalle-movimientos').value.toLocaleLowerCase()))
    if(indice_base.find(y => y.codigo.toLowerCase().startsWith(document.getElementById('buscador-productos-detalle-movimientos').value.toLocaleLowerCase()))){

        sucursal_kardex = document.getElementById("sucursal-principal").value
        indice_sucursal_kardex = document.getElementById("sucursal-principal").selectedIndex

        document.getElementById("sucursal-detalle-movimientos").value = document.querySelector("#sucursal-principal").children[indice_sucursal_kardex].textContent
        document.getElementById("categoria-detalle-movimientos").value = almacenCentral.categoria
        document.getElementById("codigo-detalle-movimientos").value = almacenCentral.codigo
        document.getElementById("descripcion-detalle-movimientos").value = almacenCentral.descripcion
        document.getElementById("costo-unitario-detalle-movimientos").value = almacenCentral.costo_unitario
        if(document.getElementById('buscador-productos-detalle-movimientos').value > 0 || document.getElementById('buscador-productos-detalle-movimientos').value == ""){
            formularioDetalleMovimientos.reset()
        };
    };
});
function llenarTablaDetalleEntradas(){
    
    kardex_entradas.forEach((event) => {
        let fecha_kardex = new Date(event.fecha)
        let tablaDetalleEntradas = document.querySelector("#tabla-detalle-movimientos-entradas > tbody");
        let nuevaFilaTablaDetalleEntradas = tablaDetalleEntradas.insertRow(-1);

        nuevaCeldaTablaDetalleEntradas = nuevaFilaTablaDetalleEntradas.insertCell(0);
        nuevaCeldaTablaDetalleEntradas.textContent = event.comprobante// comprobante

        nuevaCeldaTablaDetalleEntradas = nuevaFilaTablaDetalleEntradas.insertCell(1);
        nuevaCeldaTablaDetalleEntradas.textContent = `${fecha_kardex.getDate()}-${fecha_kardex.getMonth()+1}-${fecha_kardex.getFullYear()}`// fecha

        nuevaCeldaTablaDetalleEntradas = nuevaFilaTablaDetalleEntradas.insertCell(2);
        nuevaCeldaTablaDetalleEntradas.style.textAlign="right"
        nuevaCeldaTablaDetalleEntradas.textContent = event.existencias_entradas// cantidad

        nuevaCeldaTablaDetalleEntradas = nuevaFilaTablaDetalleEntradas.insertCell(3);
        nuevaCeldaTablaDetalleEntradas.style.textAlign="right"
        nuevaCeldaTablaDetalleEntradas.textContent = event.existencias_devueltas// cantidad devuelta

        nuevaCeldaTablaDetalleEntradas = nuevaFilaTablaDetalleEntradas.insertCell(4);
        nuevaCeldaTablaDetalleEntradas.style.textAlign="right"
        nuevaCeldaTablaDetalleEntradas.textContent = (Number((event.existencias_entradas - 
                                                    event.existencias_devueltas) *
                                                    (event.costo_unitario))).toFixed(2)// costo total
        costoKardex = event.costo_unitario
    });
    let sumaTotalExistenciasEntradas = 0;
    let sumaTotalExistenciasDevueltasEntradas = 0;
    let sumaTotalImporteEntradas = 0;
    let numeroFilasTablaDetalleEntradas = document.querySelector("#tabla-detalle-movimientos-entradas > tbody").rows.length;
    for(let i = 0; i < numeroFilasTablaDetalleEntradas; i++){
        if(document.querySelector("#tabla-detalle-movimientos-entradas > tbody").children[i].children[0].textContent.startsWith("Dev")){
            sumaTotalExistenciasDevueltasEntradas += Number(document.querySelector("#tabla-detalle-movimientos-entradas > tbody").children[i].children[3].textContent)
        }else{
            sumaTotalImporteEntradas += Number(document.querySelector("#tabla-detalle-movimientos-entradas > tbody").children[i].children[4].textContent) 
            sumaTotalExistenciasEntradas += Number(document.querySelector("#tabla-detalle-movimientos-entradas > tbody").children[i].children[2].textContent) 
        };
    };
    document.getElementById("total-existencias-detalle-entradas").textContent = sumaTotalExistenciasEntradas;
    document.getElementById("total-devoluciones-detalle-entradas").textContent = sumaTotalExistenciasDevueltasEntradas;
    document.getElementById("total-importe-detalle-entradas").textContent = "S/ " + sumaTotalImporteEntradas.toFixed(2);
};
function llenarTablaDetalleSalidas(){
    kardex_salidas.forEach((event) => {
        let fecha_kardex = new Date(event.fecha)
        let tablaDetalleSalidas = document.querySelector("#tabla-detalle-movimientos-salidas > tbody");
        let nuevaFilaTablaDetalleSalidas = tablaDetalleSalidas.insertRow(-1);

        nuevaCeldaTablaDetalleSalidas = nuevaFilaTablaDetalleSalidas.insertCell(0);
        nuevaCeldaTablaDetalleSalidas.textContent = event.comprobante// comprobante

        nuevaCeldaTablaDetalleSalidas = nuevaFilaTablaDetalleSalidas.insertCell(1);
        nuevaCeldaTablaDetalleSalidas.textContent = `${fecha_kardex.getDate()}-${fecha_kardex.getMonth()+1}-${fecha_kardex.getFullYear()}`// fecha

        nuevaCeldaTablaDetalleSalidas = nuevaFilaTablaDetalleSalidas.insertCell(2);
        nuevaCeldaTablaDetalleSalidas.style.textAlign="right"
        nuevaCeldaTablaDetalleSalidas.textContent = event.existencias_salidas// cantidad

        nuevaCeldaTablaDetalleSalidas = nuevaFilaTablaDetalleSalidas.insertCell(3);
        nuevaCeldaTablaDetalleSalidas.style.textAlign="right"
        nuevaCeldaTablaDetalleSalidas.textContent = event.existencias_devueltas// cantidad devuelta

        nuevaCeldaTablaDetalleSalidas = nuevaFilaTablaDetalleSalidas.insertCell(4);
        nuevaCeldaTablaDetalleSalidas.style.textAlign="right"
        nuevaCeldaTablaDetalleSalidas.textContent = (Number((event.existencias_salidas - 
                                                    event.existencias_devueltas) * 
                                                    (event.costo_unitario))).toFixed(2)// costo total
    });
    let sumaTotalExistenciasSalidas = 0;
    let sumaTotalExistenciasDevueltasSalidas = 0;
    let sumaTotalImporteSalidas = 0;
    let numeroFilasTablaDetalleSalidas = document.querySelector("#tabla-detalle-movimientos-salidas > tbody").rows.length;
    for(let i = 0; i < numeroFilasTablaDetalleSalidas; i++){
        if(document.querySelector("#tabla-detalle-movimientos-salidas > tbody").children[i].children[0].textContent.startsWith("Dev")){
            sumaTotalExistenciasDevueltasSalidas += Number(document.querySelector("#tabla-detalle-movimientos-salidas > tbody").children[i].children[3].textContent)
        }else{
            sumaTotalExistenciasSalidas += Number(document.querySelector("#tabla-detalle-movimientos-salidas > tbody").children[i].children[2].textContent) 
            sumaTotalImporteSalidas += Number(document.querySelector("#tabla-detalle-movimientos-salidas > tbody").children[i].children[4].textContent) 
        };
    };
    
    document.getElementById("total-existencias-detalle-salidas").textContent = sumaTotalExistenciasSalidas;
    document.getElementById("total-devoluciones-detalle-salidas").textContent = sumaTotalExistenciasDevueltasSalidas;
    document.getElementById("total-importe-detalle-salidas").textContent = "S/ " + sumaTotalImporteSalidas.toFixed(2);
};
function llenarKardex(){
    let tablaKardex = document.querySelector("#tabla-consolidado-kardex > tbody");
    let nuevaFilatablaKardex = tablaKardex.insertRow(-1);

    let nuevaCeldatablaKardex = nuevaFilatablaKardex.insertCell(0);
    nuevaCeldatablaKardex.textContent = document.getElementById("codigo-detalle-movimientos").value

    nuevaCeldatablaKardex = nuevaFilatablaKardex.insertCell(1);
    nuevaCeldatablaKardex.textContent = document.getElementById("descripcion-detalle-movimientos").value

    nuevaCeldatablaKardex = nuevaFilatablaKardex.insertCell(2);
    nuevaCeldatablaKardex.style.textAlign="right"
    nuevaCeldatablaKardex.textContent = document.getElementById("total-existencias-detalle-entradas").textContent -
                                        document.getElementById("total-devoluciones-detalle-entradas").textContent

    nuevaCeldatablaKardex = nuevaFilatablaKardex.insertCell(3);
    nuevaCeldatablaKardex.style.textAlign="right"
    nuevaCeldatablaKardex.textContent = (Number(costoKardex)).toFixed(2)

    nuevaCeldatablaKardex = nuevaFilatablaKardex.insertCell(4);
    nuevaCeldatablaKardex.style.textAlign="right"
    nuevaCeldatablaKardex.textContent = (Number((document.getElementById("total-existencias-detalle-entradas").textContent -
                                        document.getElementById("total-devoluciones-detalle-entradas").textContent) *
                                        costoKardex)).toFixed(2)

    nuevaCeldatablaKardex = nuevaFilatablaKardex.insertCell(5);
    nuevaCeldatablaKardex.style.textAlign="right"
    nuevaCeldatablaKardex.textContent = document.getElementById("total-existencias-detalle-salidas").textContent - 
                                        document.getElementById("total-devoluciones-detalle-salidas").textContent

    nuevaCeldatablaKardex = nuevaFilatablaKardex.insertCell(6);
    nuevaCeldatablaKardex.style.textAlign="right"
    nuevaCeldatablaKardex.textContent = (Number(costoKardex)).toFixed(2)

    nuevaCeldatablaKardex = nuevaFilatablaKardex.insertCell(7);
    nuevaCeldatablaKardex.style.textAlign="right"
    nuevaCeldatablaKardex.textContent = (Number((document.getElementById("total-existencias-detalle-salidas").textContent - 
                                        document.getElementById("total-devoluciones-detalle-salidas").textContent) *
                                        costoKardex)).toFixed(2)

    nuevaCeldatablaKardex = nuevaFilatablaKardex.insertCell(8);
    nuevaCeldatablaKardex.style.textAlign="right"
    nuevaCeldatablaKardex.textContent = (document.getElementById("total-existencias-detalle-entradas").textContent -
                                        document.getElementById("total-devoluciones-detalle-entradas").textContent) -
                                        (document.getElementById("total-existencias-detalle-salidas").textContent - 
                                        document.getElementById("total-devoluciones-detalle-salidas").textContent)

    nuevaCeldatablaKardex = nuevaFilatablaKardex.insertCell(9);
    nuevaCeldatablaKardex.style.textAlign="right"
    nuevaCeldatablaKardex.textContent = (Number(costoKardex)).toFixed(2)

    nuevaCeldatablaKardex = nuevaFilatablaKardex.insertCell(10);
    nuevaCeldatablaKardex.style.textAlign="right"
    nuevaCeldatablaKardex.textContent = (Number(((document.getElementById("total-existencias-detalle-entradas").textContent -
                                        document.getElementById("total-devoluciones-detalle-entradas").textContent) -
                                        (document.getElementById("total-existencias-detalle-salidas").textContent - 
                                        document.getElementById("total-devoluciones-detalle-salidas").textContent)) *
                                        costoKardex)).toFixed(2)
};

const mandarATablaDetalle = document.getElementById("agregar-detalle-movimientos");
mandarATablaDetalle.addEventListener("click", async (e) =>{
    e.preventDefault();
    if(document.querySelector("#codigo-detalle-movimientos").value !== ""){
        await cargarEntradasKardex(document.getElementById("codigo-detalle-movimientos").value)
        await cargarSalidasKardex(document.getElementById("codigo-detalle-movimientos").value)
        await cargarSalidasCategoria(document.getElementById("categoria-detalle-movimientos").value)
        await cargarSalidasCategoriaSumaTotal(document.getElementById("categoria-detalle-movimientos").value)
        await cargarEntradasCategoriaSumaTotal(document.getElementById("categoria-detalle-movimientos").value)

        reinicarKardex()
        llenarTablaDetalleEntradas();
        llenarTablaDetalleSalidas();
        llenarKardex();
        
        analisisProducto()
        analisisCategoria()
    };
});
const reiniciarTablas = document.getElementById("reiniciar-tablas");
reiniciarTablas.addEventListener("click", () =>{
    formularioDetalleMovimientos.reset();
    reinicarKardex()
    borrarAnalisis()
});
const reiniciarForm = document.getElementById("reset_form");
reiniciarForm.addEventListener("click", () =>{
    formularioDetalleMovimientos.reset();
    reinicarKardex()
    borrarAnalisis()
});
function reinicarKardex(){
    document.querySelector("#tabla-detalle-movimientos-entradas > tbody").remove();
    document.querySelector("#tabla-detalle-movimientos-entradas").createTBody();
    document.querySelector("#tabla-detalle-movimientos-salidas > tbody").remove();
    document.querySelector("#tabla-detalle-movimientos-salidas").createTBody();
    document.querySelector("#tabla-consolidado-kardex > tbody").remove();
    document.querySelector("#tabla-consolidado-kardex").createTBody();
    document.getElementById("total-existencias-detalle-entradas").textContent = "";
    document.getElementById("total-devoluciones-detalle-entradas").textContent = "";
    document.getElementById("total-importe-detalle-entradas").textContent = "";
    document.getElementById("total-existencias-detalle-salidas").textContent = "";
    document.getElementById("total-devoluciones-detalle-salidas").textContent = "";
    document.getElementById("total-importe-detalle-salidas").textContent = "";
};
function cambioSucursalKardex(){
    document.getElementById("sucursal-principal").addEventListener("change", (event)=>{
        formularioDetalleMovimientos.reset();
        reinicarKardex();
        borrarAnalisis()
    });
}



async function cargarEntradasKardex(codigo){
    let url = URL_API_almacen_central + `entradas_codigo_kardex/${codigo}?`+
                                        `entradas_sucursal=${document.getElementById("sucursal-principal").value}`
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    kardex_entradas = await respuesta.json();
};
async function cargarSalidasKardex(codigo){
    let url = URL_API_almacen_central + `salidas_codigo_kardex/${codigo}?`+
                                        `salidas_sucursal=${document.getElementById("sucursal-principal").value}`
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    kardex_salidas = await respuesta.json();
};
async function cargarSalidasCategoria(categoria){
    let url = URL_API_almacen_central + `salidas_categoria_kardex/${categoria}?`+
                                        `sucursal_salidas=${document.getElementById("sucursal-principal").value}`
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    kardex_salidas_categoria = await respuesta.json();
};
async function cargarSalidasCategoriaSumaTotal(categoria){
    let url = URL_API_almacen_central + `salidas_kardex_suma_total_por_mes/${categoria}?`+
                                        `sucursal_salidas=${document.getElementById("sucursal-principal").value}`
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    kardex_salidas_categoria_suma = await respuesta.json();
};
async function cargarEntradasCategoriaSumaTotal(categoria){
    let url = URL_API_almacen_central + `entradas_kardex_suma_total_por_mes/${categoria}?`+
                                        `sucursal_entradas=${document.getElementById("sucursal-principal").value}`
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    kardex_entradas_categoria_suma = await respuesta.json();
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////ANÁLISIS DE PRODUCTO//////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////

function analisisProducto(){
    //Rentabilidad
    let suma_costos_salidas = 0;
    let suma_ventas = 0;
    let suma_ventas_esperado = 0;
    let num_ventas = 0;
    let suma_stock_entradas = 0;
    let suma_stock_salidas = 0;
    let inventarios_kardex = [];
    let num_prom = 0;
    let monto_prom = 0;
    let primera_fecha_venta = 0
    kardex_salidas.forEach((event)=>{
        if(event.comprobante.startsWith("Venta") && new Date(event.fecha).getFullYear() == new Date().getFullYear()){
            suma_costos_salidas += event.costo_unitario * (event.existencias_salidas - event.existencias_devueltas);
            suma_ventas += event.precio_venta_salidas * (event.existencias_salidas - event.existencias_devueltas);
            suma_ventas_esperado += event.precio_venta * (event.existencias_salidas - event.existencias_devueltas);
            num_ventas +=1;
            if(primera_fecha_venta == 0){
                primera_fecha_venta = event.fecha
            }
        }
        if(event.comprobante.startsWith("Trans") && new Date(event.fecha).getFullYear() == new Date().getFullYear()){
            suma_stock_salidas += event.costo_unitario * (event.existencias_salidas - event.existencias_devueltas);
        }
    });
    kardex_entradas.forEach((event)=>{
        suma_stock_entradas += event.costo_unitario * (event.existencias_entradas - event.existencias_devueltas);
    });
    for(let i = 0; i < new Date().getMonth() + 1; i++){
        let acumulado_entradas = 0;
        let acumulado_salidas = 0;
        kardex_entradas.forEach((event)=>{
            if(new Date(event.fecha).getMonth() == i && new Date(event.fecha).getFullYear() == new Date().getFullYear()){
                acumulado_entradas += event.costo_unitario * (event.existencias_entradas - event.existencias_devueltas)
            }
        });
        kardex_salidas.forEach((event)=>{
            if(new Date(event.fecha).getMonth() == i && new Date(event.fecha).getFullYear() == new Date().getFullYear()){
                acumulado_salidas += event.costo_unitario * (event.existencias_salidas - event.existencias_devueltas)
            }
        });
        if(acumulado_entradas !== 0 && acumulado_salidas !== 0){
            inventarios_kardex.push(acumulado_entradas - acumulado_salidas)
        }
    }

    const fechaInicio = new Date(primera_fecha_venta);
    const fechaFin = new Date();
    const diferenciaDias = Math.round((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24));

    if(diferenciaDias > 30){
        num_prom = (num_ventas/diferenciaDias) * 30
        monto_prom = (suma_ventas/diferenciaDias) * 30
    }else{
        num_prom = num_ventas/inventarios_kardex.length
        monto_prom = suma_ventas/inventarios_kardex.length
    }

    document.getElementById("kardex_rotacion").textContent = `${Math.round(inventarios_kardex.length/(suma_costos_salidas/((inventarios_kardex[0] + inventarios_kardex[inventarios_kardex.length - 1]) / 2)))} meses`
    document.getElementById("kardex_margen").textContent = `${((1 - (suma_costos_salidas/suma_ventas)) * 100).toFixed(2)}%`
    document.getElementById("kardex_margen_esperado").textContent = `${((1 - (suma_costos_salidas/suma_ventas_esperado)) * 100).toFixed(2)}%`
    document.getElementById("kardex_num").textContent = `${Math.round(num_prom)} por mes`
    document.getElementById("kardex_stock").textContent = `S/${(suma_stock_entradas - suma_stock_salidas - suma_costos_salidas).toFixed(2)}`
    document.getElementById("kardex_venta").textContent = `S/${monto_prom.toFixed(2)} por mes`
}
function analisisCategoria(){
    let inventario_categoria = [];
    let costo_salidas_categoria = 0;
    let venta_salidas_categoria = 0;
    let venta_salidas_categoria_esperado = 0;
    let total_entradas = 0;
    let total_salidas = 0;
    let conteo_ventas = 0;
    let num_prom = 0;
    let monto_prom = 0;
    kardex_entradas_categoria_suma.forEach((event)=>{
        
        for(let j = 0; j < new Date().getMonth() + 1; j++){
            if(event.mes == j + 1){
                kardex_salidas_categoria_suma.forEach((e)=>{
                    if(e.mes == j + 1){
                        inventario_categoria.push(event.suma_total_entradas - e.suma_total_salidas)
                    }
                })
            }; 
        };
        total_entradas += event.suma_total_entradas;
    });
    kardex_salidas_categoria_suma.forEach((event)=>{
        total_salidas += event.suma_total_salidas;
    });

//////////////////////////////////////////////////////////////////////////////////
    if(kardex_salidas_categoria.length > 0){
        kardex_salidas_categoria.forEach((event)=>{
            costo_salidas_categoria += event.suma_costos;
            venta_salidas_categoria += event.suma_ventas;
            venta_salidas_categoria_esperado += event.suma_ventas_esperado;
            conteo_ventas += event.conteo;
        });
        const fechaInicio = new Date(kardex_salidas_categoria[0].fecha);
        const fechaFin = new Date();
        const diferenciaDias = Math.round((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24));

        if(diferenciaDias > 30){
            num_prom = (conteo_ventas/diferenciaDias) * 30
            monto_prom = (venta_salidas_categoria/diferenciaDias) * 30
        }else{
            num_prom = conteo_ventas/kardex_salidas_categoria.length
            monto_prom = venta_salidas_categoria/kardex_salidas_categoria.length
        };
    }
        
/////////////////////////////////////////////////////////////////////////////////
    document.getElementById("kardex_rotacion_categoria").textContent = `${Math.round(inventario_categoria.length/(costo_salidas_categoria/((inventario_categoria[0] + inventario_categoria[inventario_categoria.length - 1]) / 2)))} meses`
    document.getElementById("kardex_margen_categoria").textContent = `${((1 - (costo_salidas_categoria/venta_salidas_categoria)) * 100).toFixed(2)}%`
    document.getElementById("kardex_margen_esperado_categoria").textContent = `${((1 - (costo_salidas_categoria/venta_salidas_categoria_esperado)) * 100).toFixed(2)}%`
    document.getElementById("kardex_num_categoria").textContent = `${Math.round(num_prom)} por mes`
    document.getElementById("kardex_stock_categoria").textContent = `S/${(total_entradas - total_salidas).toFixed(2)}`
    document.getElementById("kardex_venta_categoria").textContent = `S/${monto_prom.toFixed(2)} por mes`
};
function borrarAnalisis(){
    document.getElementById("kardex_rotacion").textContent = ""
    document.getElementById("kardex_margen").textContent = ""
    document.getElementById("kardex_margen_esperado").textContent = ""
    document.getElementById("kardex_num").textContent = ""
    document.getElementById("kardex_stock").textContent = ""
    document.getElementById("kardex_venta").textContent = ""

    document.getElementById("kardex_rotacion_categoria").textContent = ""
    document.getElementById("kardex_margen_categoria").textContent = ""
    document.getElementById("kardex_margen_esperado_categoria").textContent = ""
    document.getElementById("kardex_num_categoria").textContent = ""
    document.getElementById("kardex_stock_categoria").textContent = ""
    document.getElementById("kardex_venta_categoria").textContent = ""
};