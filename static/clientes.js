

document.addEventListener("DOMContentLoaded", inicioClientes)
function inicioClientes(){
    inicioTablasClientes()
    graficoClientes();
    btnClientes = 1;
};
async function inicioTablasClientes(){
    await conteoClientes(document.getElementById("filtro-tabla-clientes-nombre").value, 
                        document.getElementById("filtro-tabla-clientes-dni").value, 
                        document.getElementById("filtro-tabla-clientes-email").value, 
                        document.getElementById("filtro-tabla-clientes-telefono").value, 
                        document.getElementById("filtro-tabla-clientes-usuario").value, 
                        document.getElementById("filtro-tabla-clientes-clase").value,
                        '2000-01-01',
                        new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate())
    await searchClientes(document.getElementById("numeracionTablaClientes").value - 1, "", "", "", "", "", 0, 
                        '2000-01-01', new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate())
    atajoTablaClientes()
    avanzarTablaClientes()
    filtroPersonas()
};
let numeronIncremento = 1;
let suma = 0;
let inicio = 0;
let fin = 0;
async function conteoClientes(nombre,dni,email,telefono,usuario,clase,inicio,fin){
    let url = URL_API_almacen_central + `clientes_conteo?`+
                                        `nombre_persona=${nombre}&`+
                                        `dni_persona=${dni}&`+
                                        `email_persona=${email}&`+
                                        `telefono_persona=${telefono}&`+
                                        `usuario_persona=${usuario}&`+
                                        `clase_persona=${clase}&`+
                                        `fecha_inicio_persona=${inicio}&`+
                                        `fecha_fin_persona=${fin}`
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
    document.querySelector("#numeracionTablaClientes").innerHTML = html
};
async function searchClientes(num, nombre, dni, email, telefono, usuario, clase, inicio, fin) {
    let url = URL_API_almacen_central + `clientes_tabla/${num}?`+
                                        `nombre_persona=${nombre}&`+
                                        `dni_persona=${dni}&`+
                                        `email_persona=${email}&`+
                                        `telefono_persona=${telefono}&`+
                                        `usuario_persona=${usuario}&`+
                                        `clase_persona=${clase}&`+
                                        `fecha_inicio_persona=${inicio}&`+
                                        `fecha_fin_persona=${fin}`
    let response = await fetch(url,{
        "method": "GET",
        "headers": {
            "Content-Type": 'application/json'
        }
    });
    clientes = await response.json()
    let html = ''
    if(clientes.length > 0){
        for(cli of clientes){
        let filaClientes = `
                            <tr class="busqueda-nombre">
                                <td class="invisible">${cli.id_cli}</td>
                                <td>${cli.nombre_cli}</td>
                                <td style="text-align: center;">${cli.dni_cli}</td>
                                <td>${cli.email_cli}</td>
                                <td style="text-align: center;">${cli.telefono_cli}</td>
                                <td>${cli.direccion_cli}</td>
                                <td style="text-align: center;">${cli.nombres}</td>
                                <td style="text-align: center;width: 120px">${cli.fecha_cli}</td>
                                <td style="text-align: center;">
                                    <span onclick="edit(${cli.id_cli})" style="font-size:18px;" class="material-symbols-outlined myButtonEditar">edit</span>
                                    <span onclick="remove(${cli.id_cli})" style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila">delete</span>
                                </td>
                            </tr>`
            html = html + filaClientes;
        };
        document.querySelector('#tabla-clientes > tbody').outerHTML = html;
    }else{
        alert("No se encontraron resultados.")
        document.querySelector('#tabla-clientes > tbody').outerHTML = html;
        document.querySelector("#tabla-clientes").createTBody()
    };
};
function avanzarTablaClientes(){
    document.getElementById("avanzarClientes").addEventListener("click", () =>{
        if(suma + 20 < cantidadFilas){
            numeronIncremento += 1
            suma += 20
            document.getElementById("numeracionTablaClientes").value = numeronIncremento
            manejoDeFechasPersonas()
            searchClientes(suma, 
                        document.getElementById("filtro-tabla-clientes-nombre").value, 
                        document.getElementById("filtro-tabla-clientes-dni").value, 
                        document.getElementById("filtro-tabla-clientes-email").value, 
                        document.getElementById("filtro-tabla-clientes-telefono").value, 
                        document.getElementById("filtro-tabla-clientes-usuario").value, 
                        document.getElementById("filtro-tabla-clientes-clase").value,
                        inicio,
                        fin);
        };
    });
    document.getElementById("retrocederClientes").addEventListener("click", () =>{
        if(numeronIncremento > 1){
            numeronIncremento -= 1
            suma -= 20
            document.getElementById("numeracionTablaClientes").value = numeronIncremento
            manejoDeFechasPersonas()
            searchClientes(suma, 
                        document.getElementById("filtro-tabla-clientes-nombre").value, 
                        document.getElementById("filtro-tabla-clientes-dni").value, 
                        document.getElementById("filtro-tabla-clientes-email").value, 
                        document.getElementById("filtro-tabla-clientes-telefono").value, 
                        document.getElementById("filtro-tabla-clientes-usuario").value, 
                        document.getElementById("filtro-tabla-clientes-clase").value,
                        inicio,
                        fin);
        };
    });
};
function atajoTablaClientes(){
    document.getElementById("numeracionTablaClientes").addEventListener("change", ()=>{
        manejoDeFechasPersonas()
        searchClientes((document.getElementById("numeracionTablaClientes").value - 1) * 20, 
                    document.getElementById("filtro-tabla-clientes-nombre").value, 
                    document.getElementById("filtro-tabla-clientes-dni").value, 
                    document.getElementById("filtro-tabla-clientes-email").value, 
                    document.getElementById("filtro-tabla-clientes-telefono").value, 
                    document.getElementById("filtro-tabla-clientes-usuario").value, 
                    document.getElementById("filtro-tabla-clientes-clase").value,
                    inicio,
                    fin);
        numeronIncremento = Number(document.getElementById("numeracionTablaClientes").value);
        suma = (document.getElementById("numeracionTablaClientes").value - 1) * 20;
    });
};
document.getElementById("restablecerClientes").addEventListener("click", async () => {
    document.getElementById("filtro-tabla-clientes-nombre").value = ""
    document.getElementById("filtro-tabla-clientes-dni").value = ""
    document.getElementById("filtro-tabla-clientes-email").value = ""
    document.getElementById("filtro-tabla-clientes-telefono").value = ""
    document.getElementById("filtro-tabla-clientes-usuario").value = ""
    document.getElementById("filtro-tabla-clientes-fecha-inicio").value = ""
    document.getElementById("filtro-tabla-clientes-fecha-fin").value = ""

    await conteoClientes(document.getElementById("filtro-tabla-clientes-nombre").value, 
                document.getElementById("filtro-tabla-clientes-dni").value, 
                document.getElementById("filtro-tabla-clientes-email").value, 
                document.getElementById("filtro-tabla-clientes-telefono").value, 
                document.getElementById("filtro-tabla-clientes-usuario").value, 
                document.getElementById("filtro-tabla-clientes-clase").value,
                '2000-01-01',
                new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate())
    await searchClientes(0, 
                document.getElementById("filtro-tabla-clientes-nombre").value, 
                document.getElementById("filtro-tabla-clientes-dni").value, 
                document.getElementById("filtro-tabla-clientes-email").value, 
                document.getElementById("filtro-tabla-clientes-telefono").value, 
                document.getElementById("filtro-tabla-clientes-usuario").value, 
                document.getElementById("filtro-tabla-clientes-clase").value, 
                '2000-01-01', 
                new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate())
    numeronIncremento = 1;
    suma = 0;
});
function manejoDeFechasPersonas(){
    inicio = document.getElementById("filtro-tabla-clientes-fecha-inicio").value;
    fin = document.getElementById("filtro-tabla-clientes-fecha-fin").value;
    if(inicio == "" && fin == ""){
        inicio = '2000-01-01';
        fin = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate()
    }else if(inicio == "" && fin != ""){
        inicio = '2000-01-01';
    }else if(inicio != "" && fin == ""){
        fin = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate();
    };
};
function filtroPersonas(){
    document.getElementById("buscarFiltrosClientes").addEventListener("click", async (e)=>{
        e.preventDefault();
        manejoDeFechasPersonas()
        await conteoClientes(document.getElementById("filtro-tabla-clientes-nombre").value, 
                        document.getElementById("filtro-tabla-clientes-dni").value, 
                        document.getElementById("filtro-tabla-clientes-email").value, 
                        document.getElementById("filtro-tabla-clientes-telefono").value, 
                        document.getElementById("filtro-tabla-clientes-usuario").value, 
                        document.getElementById("filtro-tabla-clientes-clase").value,
                        inicio,
                        fin)
        await searchClientes(0, 
                        document.getElementById("filtro-tabla-clientes-nombre").value, 
                        document.getElementById("filtro-tabla-clientes-dni").value, 
                        document.getElementById("filtro-tabla-clientes-email").value, 
                        document.getElementById("filtro-tabla-clientes-telefono").value, 
                        document.getElementById("filtro-tabla-clientes-usuario").value, 
                        document.getElementById("filtro-tabla-clientes-clase").value,
                        inicio,
                        fin);
        numeronIncremento = 1;
        suma = 0;
        alert(`Se obtuvieron ${cantidadFilas} registros.`)
    });
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
function edit(id) {
    let cliente = clientes.find(x => x.id_cli == id)
    document.getElementById('txtId').value = cliente.id_cli
    document.getElementById('nombre').value = cliente.nombre_cli
    document.getElementById('dni').value = cliente.dni_cli
    document.getElementById('email').value = cliente.email_cli
    document.getElementById('telefono').value = cliente.telefono_cli
    document.getElementById('direccion').value = cliente.direccion_cli
    document.getElementById('clase_cli').value = cliente.clase_cli
};
async function remove(id) {
    let respuesta = confirm('¿Estas seguro de eliminarlo?')
    if (respuesta) {
        if(id != document.querySelector("#tabla-clientes > tbody > tr:nth-child(1) > td.invisible").textContent){
            let url = URL_API_almacen_central + 'clientes/' + id
            await fetch(url,{
                "method": "DELETE",
                "headers": {
                    "Content-Type": 'application/json'
                }
            });
            await searchClientes(document.getElementById("numeracionTablaClientes").value - 1, "", "", "", "", "", 
                                document.getElementById("filtro-tabla-clientes-clase").value, 
                                '2000-01-01', new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate())
            if(document.querySelector("#filtro-tabla-clientes-clase").value == 0){
                await llenarClientes();
                localStorage.setItem("base_datos_cli", JSON.stringify(clientes_ventas))                         
            }else if(document.querySelector("#filtro-tabla-clientes-clase") == 1){
                await llenarProveedores();
                localStorage.setItem("base_datos_prov", JSON.stringify(proveedores))
            };
        }else{
            alert(`El nombre "Sin datos" no se puede eliminar.`)
        };
    };
};

const registrarCliente = document.getElementById("registrar-cliente");
registrarCliente.addEventListener("click", saveClientes)
async function saveClientes(e) {
    e.preventDefault();
    let base_datos_clientes = JSON.parse(localStorage.getItem("base_datos_cli"))
    let encontrado = base_datos_clientes.find(y => y.nombre_cli.toLowerCase().startsWith(document.getElementById("nombre").value.toLowerCase()) && 
                                            y.telefono_cli.toLowerCase().startsWith(document.getElementById("telefono").value.toLowerCase()))
    if(encontrado === undefined){
        if(expregul.cliente.test(document.getElementById("nombre").value) &&
        expregul.telefono.test(document.getElementById("telefono").value) &&
        expregul.direccion.test(document.getElementById("direccion").value)){
            manejoDeFechasPersonas()
            let dataS = {
                "clase_cli": document.getElementById('clase_cli').value,
                "direccion_cli": document.getElementById('direccion').value,
                "dni_cli": document.getElementById('dni').value,
                "email_cli": document.getElementById('email').value,
                "nombre_cli": document.getElementById('nombre').value,
                "telefono_cli": document.getElementById('telefono').value,
                "usuario_cli": document.getElementById("identificacion_usuario_id").textContent,
                "fecha_cli": fechaPrincipal
            };
                
            let id = document.getElementById('txtId').value
            if (id != '') {
                dataS.id_cli = id
            };
            let url = URL_API_almacen_central + 'clientes'
            let response = await fetch(url,{
                "method": 'POST',
                "body": JSON.stringify(dataS),
                "headers": {
                    "Content-Type": 'application/json'
                }
            });
            if(response.status === 200){
                await searchClientes((document.getElementById("numeracionTablaClientes").value - 1) * 20, 
                                document.getElementById("filtro-tabla-clientes-nombre").value, 
                                document.getElementById("filtro-tabla-clientes-dni").value, 
                                document.getElementById("filtro-tabla-clientes-email").value, 
                                document.getElementById("filtro-tabla-clientes-telefono").value, 
                                document.getElementById("filtro-tabla-clientes-usuario").value, 
                                document.getElementById("filtro-tabla-clientes-clase").value,
                                inicio,
                                fin);
                if(document.getElementById('clase_cli').value == 0){
                    await llenarClientes();
                    localStorage.setItem("base_datos_cli", JSON.stringify(clientes_ventas))
                    alert("Cliente registrado.");
                }else if(document.getElementById('clase_cli').value == 1){
                    await llenarProveedores();
                    localStorage.setItem("base_datos_prov", JSON.stringify(proveedores))
                    alert("Proveedor registrado.");   
                }
                formClientes.reset();
                document.getElementById('txtId').value = ""
                document.getElementById("nombre").focus();
            };
        }else if(expregul.cliente.test(document.getElementById("nombre").value) == false){
            document.getElementById("nombre").style.background = "#b36659"
            alert("Ingrese un nombre de cliente correcto")
        }else if(expregul.telefono.test(document.getElementById("telefono").value) == false){
            document.getElementById("telefono").style.background = "#b36659"
            alert("Ingrese un número de teléfono o celular")
        }else if(expregul.direccion.test(document.getElementById("direccion").value) == false){
            document.getElementById("direccion").style.background = "#b36659"
            alert("Ingrese una dirección")
        };
    }else{
        alert(`El cliente/proveedor ${document.getElementById("nombre").value} con numero de teléfono `+
        `${document.getElementById("telefono").value} ya se encunetra registrado.`)
    };
};
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////////////
let colorFondoBarra = ["#E6CA7B","#91E69C","#6380E6","#E66E8D"];

async function graficoClientes(){
    await cargarClientesMes()
    let array_clientes = [];
    let array_proveedores = [];
    let masAlto = 0;
    document.querySelectorAll(".f_l_g").forEach((event, i)=>{
        event.textContent = arregloMeses[i];
    });
    for(let i = 0; i < 12; i++){
        array_clientes.push(0);
        array_proveedores.push(0);
        clientesMensuales.forEach((event)=>{
            if(event.mes == i + 1){
                array_clientes[i] = Number(event.suma_clientes);
                array_proveedores[i] = Number(event.suma_proveedores);
            }
            if(masAlto < Number(event.suma_clientes)){masAlto = Number(event.suma_clientes)}
            if(masAlto < Number(event.suma_proveedores)){masAlto = Number(event.suma_proveedores)}
        });
    };
    let masAltoDos = (226 * masAlto)/214;
    document.querySelectorAll(".eje_y_numeracion").forEach((e)=>{
        e.textContent = Number(masAltoDos).toFixed(2)
        masAltoDos -= 0.20 * ((226 * masAlto)/214);
    });
    pintarGraficoPositivo(document.querySelectorAll(".cg_1_c"), array_clientes, masAlto, colorFondoBarra[0], document.querySelectorAll(".sg_1_c"))
    pintarGraficoPositivo(document.querySelectorAll(".cg_2_c"), array_proveedores, masAlto, colorFondoBarra[2], document.querySelectorAll(".sg_2_c"))
};
async function cargarClientesMes(){
    let url = URL_API_almacen_central + 'clientes_mes'
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    });
    clientesMensuales = await respuesta.json();
};
