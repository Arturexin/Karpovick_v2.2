document.addEventListener("DOMContentLoaded", inicioDevolucionCompras)
function inicioDevolucionCompras(){
    graficoDevolucionesCompras();

    /* cargarDatosEntradas(); */
    btnDevolucionCompras = 1;
};
let devolucionesComprobante= []
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////DEVOLUCION POR COMPRAS////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let sucursal_id_dev_compras = 0;
let sucursal_indice_dev_compras = 0;
function eliminarFilaCompras(){
    document.querySelectorAll(".eliminar_fila_compras").forEach((event)=>{
        event.addEventListener("click", ()=>{
            event.parentNode.parentNode.remove()
        })
    });
};
async function crearBodyDevoluciones(){
    await cargarDevolucionesEntradasMesComprobante();
    devolucionesComprobante.forEach((event) => {
        if(event.comprobante.toLowerCase() === document.getElementById('buscador-comporbante-compras').value.toLowerCase()){
            if(event.sucursal_nombre == document.querySelector("#sucursal-principal").children[0].textContent){
                sucursal_indice_dev_compras = 0
                sucursal_id_dev_compras = document.querySelector("#sucursal-principal")[0].value
            }else if(event.sucursal_nombre == document.querySelector("#sucursal-principal").children[1].textContent){
                sucursal_indice_dev_compras = 1
                sucursal_id_dev_compras = document.querySelector("#sucursal-principal")[1].value
            }else if(event.sucursal_nombre == document.querySelector("#sucursal-principal").children[2].textContent){
                sucursal_indice_dev_compras = 2
                sucursal_id_dev_compras = document.querySelector("#sucursal-principal")[2].value
            }else if(event.sucursal_nombre == document.querySelector("#sucursal-principal").children[3].textContent){
                sucursal_indice_dev_compras = 3
                sucursal_id_dev_compras = document.querySelector("#sucursal-principal")[3].value
            };

            let tablaDevolucionesCompras= document.querySelector("#tabla-devolucion-compras > tbody");
            let nuevaFilaTablaDevolucionesCompras = tablaDevolucionesCompras.insertRow(-1);
            let fila = `<tr>
                            <td class="invisible">${event.idEntr}</td>
                            <td>${event.sucursal_nombre}</td>
                            <td class="codigoDevoluciones" style="background: rgb(105, 211, 35)">${event.codigo}</td>
                            <td>${event.existencias_entradas}</td>
                            <td><input class="cantidadADevolver input-tablas-dos"></td>
                            <td>${event.comprobante}</td>
                            <td class="invisible"></td>
                            <td class="invisible"></td>
                            <td class="invisible"></td>
                            <td class="invisible"></td>
                            <td>${event.existencias_devueltas}</td>
                            <td class="invisible"></td>
                            <td></td>
                            <td class="invisible">${sucursal_id_dev_compras}</td>
                            <td class="invisible">${sucursal_indice_dev_compras}</td>
                            <td style="text-align: center">
                                <span style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila eliminar_fila_compras">delete</span>
                            </a></td>
                        </tr>
                        `
            nuevaFilaTablaDevolucionesCompras.innerHTML = fila;
            eliminarFilaCompras()
        };
    });
};

const mandarATablaDevoluciones = document.getElementById("mandar-tabla-devoluciones");
mandarATablaDevoluciones.addEventListener("click",manadarDevoluciones)
async function manadarDevoluciones(e){
    e.preventDefault();
    if(document.getElementById("buscador-comporbante-compras").value.startsWith("Compra") ||
    document.getElementById("buscador-comporbante-compras").value.startsWith("Recompra")){
        document.querySelector(".contenedor-devolucion-compras").classList.add("modal-show-devolucion-compras");
        await crearBodyDevoluciones();
        operarCantidaDevolucion();
        await buscarPorCodidoDevolucionesEnProductos();
        document.querySelectorAll(".id-comprobacion-devoluciones-compras").forEach((e) => {
            if(e.parentNode.children[13].textContent == document.getElementById("buscador-comporbante-compras").value){
                alert("Esta compra ya existe en tabla devoluciones, si continua se sobreescribirá por esta nueva.")
                e.parentNode.style.background = "#b36659"
            }
        });
        document.querySelector("#tabla-devolucion-compras > tbody > tr:nth-child(1) > td:nth-child(5) > input").focus()
    }else{
        alert(`Ingrese un formato válido, ejemplo: Compra-10 o Recompra-20`)
    };
};
function operarCantidaDevolucion(){
    const insertarDevolucion = document.querySelectorAll(".cantidadADevolver")
    insertarDevolucion.forEach((event) => {
        event.addEventListener("keyup", (e) => {
            ////saldo existencias tabla productos///////                                                            
            e.target.parentNode.parentNode.children[9].textContent = Number(e.target.parentNode.parentNode.children[8].textContent) - 
                                                                    Number(e.target.value)
            ////cantidad a devolver mas cantidad devuelta///////                                                         
            e.target.parentNode.parentNode.children[11].textContent = Number(e.target.value) + Number(e.target.parentNode.parentNode.children[10].textContent);
            ////saldo de la compra///////  
            e.target.parentNode.parentNode.children[12].textContent = Number(e.target.parentNode.parentNode.children[3].textContent) - 
                                                                    (Number(e.target.value) + Number(e.target.parentNode.parentNode.children[10].textContent));

            if(Number(e.target.parentNode.parentNode.children[11].textContent) > Number(e.target.parentNode.parentNode.children[3].textContent)){
                e.target.parentNode.parentNode.children[12].style.background = "#b36659"
                e.target.style.background = "#b36659"
            }else{
                e.target.parentNode.parentNode.children[12].style.background = ""
                e.target.style.background = ""
            };                 
        });
    });
};

async function buscarPorCodidoDevolucionesEnProductos(){
    const insertarBuscarMovimientos = document.querySelectorAll(".codigoDevoluciones");
    let datoCodigoUnitario;
    for(let i = 0; i < insertarBuscarMovimientos.length; i++){
        let url = URL_API_almacen_central + `almacen_central_codigo_sucursal/${insertarBuscarMovimientos[i].textContent}?`+
                                            `sucursal_get=${sucursales_activas[insertarBuscarMovimientos[i].parentNode.children[14].textContent]}`
        let response = await fetch(url,{
            "method": "GET",
            "headers": {
                "Content-Type": 'application/json'
            }
        });
        datoCodigoUnitario = await response.json();
        if(datoCodigoUnitario.codigo){
            insertarBuscarMovimientos[i].parentNode.children[7].textContent = datoCodigoUnitario.idProd
            insertarBuscarMovimientos[i].parentNode.children[8].textContent = datoCodigoUnitario.sucursal_get
        };
    };
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function crearBodyDevolucionesFinal(){
    let fila_modal = document.querySelectorAll(".codigoDevoluciones")
    fila_modal.forEach((event)=>{
        document.querySelectorAll(".id-comprobacion-devoluciones-compras").forEach((e) => {
            if(event.parentNode.children[0].textContent == e.textContent && 
            event.parentNode.children[4].children[0].value > 0){
                e.parentElement.remove()
                alert("Este producto ya se encuentra en la tabla devoluciones, se reempazará con estos datos recientes.")
            }
        });
        if(event.parentNode.children[4].children[0].value > 0 &&
        event.parentNode.children[8].textContent > 0 &&
        event.parentNode.children[12].textContent >= 0){
            let tablaDevolucionesComprasFinal= document.querySelector("#tabla-devolucion-compras-final > tbody");
            let nuevaFilaTablaDevolucionesComprasFinal = tablaDevolucionesComprasFinal.insertRow(-1);
            let fila = `<tr>
                            <td class="id-comprobacion-devoluciones-compras invisible">${event.parentNode.children[0].textContent}</td>
                            <td>${event.parentNode.children[1].textContent}</td>
                            <td>${event.textContent}</td>
                            <td>${event.parentNode.children[3].textContent}</td>
                            <td>${event.parentNode.children[4].children[0].value}</td>
                            <td>${event.parentNode.children[5].textContent}</td>
                            <td>${document.getElementById("causaDevolucionCompras").value}</td>
                            <td class="invisible">${event.parentNode.children[7].textContent}</td>
                            <td class="invisible">${event.parentNode.children[8].textContent}</td>
                            <td class="invisible">${event.parentNode.children[9].textContent}</td>
                            <td class="invisible">${event.parentNode.children[10].textContent}</td>
                            <td>${event.parentNode.children[11].textContent}</td>
                            <td class="invisible">${event.parentNode.children[13].textContent}</td>
                            <td class="invisible">${event.parentNode.children[14].textContent}</td>
                            <td style="text-align: center">
                                <span style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila eliminar_fila_compras">delete</span>
                            </a></td>
                        </tr>
                        `
            nuevaFilaTablaDevolucionesComprasFinal.innerHTML = fila;
            eliminarFilaCompras()
        };
    });
};

const mandarATablaDevolucion = document.getElementById("procesar-devolucion-compras");
mandarATablaDevolucion.addEventListener("click", (e)=>{
    e.preventDefault();

    crearBodyDevolucionesFinal();
    const borrar = document.querySelectorAll(".cantidadADevolver");//eliminamos las filas que si pasaron a la tabla principal
    borrar.forEach((e)=>{
        if(e.value > 0 && e.parentNode.parentNode.children[12].textContent >= 0){
            e.parentNode.parentNode.remove()
        }else if(e.parentNode.parentNode.children[12].textContent < 0){
            alert("Ya no cuenta con unidades para devolver")
        };
    });
    if(document.querySelector("#tabla-devolucion-compras > tbody").children.length == 0){
        document.querySelector(".contenedor-devolucion-compras").classList.remove("modal-show-devolucion-compras");
    };
    document.getElementById("causaDevolucionCompras").value = ""
    document.getElementById("buscador-comporbante-compras").value = ""
    document.getElementById("buscador-comporbante-compras").focus();
});
const procesarDevolucionCompras = document.getElementById("procesar-devolucion-compras-final");
procesarDevolucionCompras.addEventListener("click", procesamientoDevolucionCompras)
async function procesamientoDevolucionCompras(e){
    e.preventDefault();
    try{
        if(document.querySelector("#tabla-devolucion-compras-final > tbody").children.length > 0){
            await funcionDevolucionComprasProductos()
        }
        
    }catch(error){
        alert("Ocurrió un error. " + error);
        console.error("Ocurrió un error. ", error)
    };
};
async function funcionDevolucionComprasProductos(){
    let suma_productos = 0;
    function EnviarDevolucionAProductos(a){
        this.idProd = a.children[7].textContent;
        this.sucursal_post = sucursales_activas[a.children[13].textContent];
        this.existencias_post = a.children[9].textContent;
    };
    
    let cantidadDeFilas = document.querySelector("#tabla-devolucion-compras-final > tbody").rows.length;
    for(let i = 0 ; i < cantidadDeFilas; i++){
        if(document.querySelector("#tabla-devolucion-compras-final > tbody").children[i]){
            let filaPlus = new EnviarDevolucionAProductos(document.querySelector("#tabla-devolucion-compras-final > tbody").children[i]);
            let urlDevolucionProductosUnoC = URL_API_almacen_central + 'almacen_central_operacion'
            let response = await funcionFetch(urlDevolucionProductosUnoC, filaPlus)
            console.log("Respuesta Productos "+response.status)
            if(response.status === 200){
                suma_productos +=1;
            }
        };
    };
    if(suma_productos === cantidadDeFilas){
        await funcionDevolucionComprasEntradasUno();
    }else{
        alert(`Ocurrió un problema en la fila ${suma_productos + 1}`)
    };
};
async function funcionDevolucionComprasEntradasUno(){
    let suma_entradas = 0;
    function EnviarAEntradas(a){
        this.idEntr = a.children[0].textContent;
        this.existencias_entradas = a.children[3].textContent;
        this.existencias_devueltas = a.children[11].textContent;
    }
    let cantidadDeFilas = document.querySelector("#tabla-devolucion-compras-final > tbody").rows.length;
    for(let i = 0 ; i < cantidadDeFilas; i++){
        if(document.querySelector("#tabla-devolucion-compras-final > tbody").children[i]){
            let filaUnoEntradas = new EnviarAEntradas(document.querySelector("#tabla-devolucion-compras-final > tbody").children[i]);
            let urlDevolucionEntradasC = URL_API_almacen_central + 'entradas'
            let response = await funcionFetch(urlDevolucionEntradasC, filaUnoEntradas)
            console.log("Respuesta Entradas "+response.status)
            if(response.status === 200){
                suma_entradas +=1;
            }
        };
    };
    if(suma_entradas === cantidadDeFilas){
        await funcionDevolucionComprasEntradasDos();
    }else{
        alert(`Ocurrió un problema en la fila ${suma_entradas + 1}`)
    };
};
async function funcionDevolucionComprasEntradasDos(){
    let suma_entradas_dos = 0;
    function EnviarAEntradasNuevaFila(a){
        this.idProd = a.children[7].textContent;
        this.comprobante = "Dev-" + a.children[5].textContent;
        this.causa_devolucion = a.children[6].textContent;
        this.fecha = fechaPrincipal;
        this.existencias_entradas = 0;
        this.sucursal = a.children[12].textContent;
        this.usuario = document.getElementById("identificacion_usuario_id").textContent;
        this.existencias_devueltas = a.children[4].textContent;
    }
    let cantidadDeFilas = document.querySelector("#tabla-devolucion-compras-final > tbody").rows.length;
    for(let i = 0 ; i < cantidadDeFilas; i++){
        if(document.querySelector("#tabla-devolucion-compras-final > tbody").children[i]){
            let filaDosEntradas = new EnviarAEntradasNuevaFila(document.querySelector("#tabla-devolucion-compras-final > tbody").children[i]);
            let urlDevolucionesComprasDosC = URL_API_almacen_central + 'entradas'
            let response = await funcionFetch(urlDevolucionesComprasDosC, filaDosEntradas)
            console.log("Respuesta Entradas dos "+response.status)
            if(response.status === 200){
                suma_entradas_dos +=1;
            }
        };
    };
    if(suma_entradas_dos === cantidadDeFilas){
        alert("Operación completada exitosamente.")
        document.getElementById("buscador-comporbante-compras").value="";
        document.querySelector("#tabla-devolucion-compras-final > tbody").remove();
        document.querySelector("#tabla-devolucion-compras-final").createTBody();
    }else{
        alert(`Ocurrió un problema en la fila ${suma_entradas_dos + 1}`)
    };
};

const removerTablaDevolucionesUno = document.getElementById("remover-tabla-devoluciones-compras-uno");
removerTablaDevolucionesUno.addEventListener("click", () =>{
    document.querySelector(".contenedor-devolucion-compras").classList.remove("modal-show-devolucion-compras");
    document.querySelector("#tabla-devolucion-compras > tbody").remove();
    document.querySelector("#tabla-devolucion-compras").createTBody();
    document.getElementById("buscador-comporbante-compras").focus();
});
const removerTablaDevolucionesDos = document.getElementById("remover-tabla-devoluciones-compras-dos");
removerTablaDevolucionesDos.addEventListener("click", () =>{
    document.querySelector("#tabla-devolucion-compras-final > tbody").remove();
    document.querySelector("#tabla-devolucion-compras-final").createTBody();
});
let colorFondoBarra = ["#E6CA7B","#91E69C","#6380E6","#E66E8D"];
async function graficoDevolucionesCompras(){
    await cargarDevolucionesEntradasMes();
    let arrayDevolucionCompras = [];
    let masAlto = 0;
    document.querySelectorAll(".f_l_g").forEach((event, i)=>{
        event.textContent = arregloMeses[i];
    });
    for(let i = 0; i < 12; i++){
        arrayDevolucionCompras.push(0);
        devolucionesEntradas.forEach((event)=>{
            if(event.mes == i + 1){
                arrayDevolucionCompras[i] = -event.suma_devoluciones_entradas;
            }
            if(masAlto > event.suma_devoluciones_entradas){masAlto = -event.suma_devoluciones_entradas}
        });
    };
    let masAltoDos = (226 * masAlto)/214;
    document.querySelectorAll(".eje_y_numeracion").forEach((e)=>{
        e.textContent = Number(masAltoDos).toFixed(2)
        masAltoDos -= 0.20 * ((226 * masAlto)/214);
    });
    pintarGraficoPositivo(document.querySelectorAll(".cg_1_c"), arrayDevolucionCompras, masAlto, colorFondoBarra[0], document.querySelectorAll(".sg_1_c"))
};


async function cargarDevolucionesEntradasMes(){
    let url = URL_API_almacen_central + 'entradas_suma_devoluciones_mes'
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    devolucionesEntradas = await respuesta.json();
};
async function cargarDevolucionesEntradasMesComprobante(){
    let url = URL_API_almacen_central + `entradas_comprobante/${document.getElementById("buscador-comporbante-compras").value}`
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    devolucionesComprobante = await respuesta.json();
};