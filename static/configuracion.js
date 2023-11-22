document.addEventListener("DOMContentLoaded", inicioConfiguracion)
function inicioConfiguracion(){
    searchCategorias();
    searchNumeracion();
    searchDatos();
    searchSucursales();
    searchUsuarios()
    btnConfiguracion = 1;
};
async function searchCategorias(){
    let url = URL_API_almacen_central + 'categorias'
    let response = await fetch(url,{
        "method": "GET",
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    categorias = await response.json()

    let html = ''
    for(categoria of categorias) {
        let fila = `<tr>
                        <td class="invisible">${categoria.id}</td>
                        <td class="categoria-configuracion">${categoria.categoria_nombre}</td>
                        <td>${categoria.unidad_medida}</td>
                        <td style="text-align: end;">${categoria.cantidad_item}</td>
                        <td>${categoria.uno}</td>
                        <td>${categoria.dos}</td>
                        <td>${categoria.tres}</td>
                        <td>${categoria.cuatro}</td>
                        <td>${categoria.cinco}</td>
                        <td>${categoria.seis}</td>
                        <td>${categoria.siete}</td>
                        <td>${categoria.ocho}</td>
                        <td>${categoria.nueve}</td>
                        <td>${categoria.diez}</td>
                        <td>${categoria.once}</td>
                        <td>${categoria.doce}</td>
                        <td style="text-align: center;">
                            <span onclick="editCategorias(${categoria.id})" style="font-size:18px;" class="material-symbols-outlined myButtonEditar">edit</span>
                            <span onclick="removeCategorias(${categoria.id})" style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila">delete</span>
                        </td>
                    </tr>`
            html = html + fila;
    };
    document.querySelector('#tabla-categorias > tbody').outerHTML = html
};
function editCategorias(id) {
    let categoria = categorias.find(x => x.id == id)
    document.getElementById('id-configuracion').value = categoria.id
    document.getElementById('categoria-configuracion').value = categoria.categoria_nombre
    document.getElementById('unidad-configuracion').value = categoria.unidad_medida
    document.getElementById('cantidad-configuracion').value = categoria.cantidad_item
    document.getElementById('uno-configuracion').value = categoria.uno
    document.getElementById('dos-configuracion').value = categoria.dos
    document.getElementById('tres-configuracion').value = categoria.tres
    document.getElementById('cuatro-configuracion').value = categoria.cuatro
    document.getElementById('cinco-configuracion').value = categoria.cinco
    document.getElementById('seis-configuracion').value = categoria.seis
    document.getElementById('siete-configuracion').value = categoria.siete
    document.getElementById('ocho-configuracion').value = categoria.ocho
    document.getElementById('nueve-configuracion').value = categoria.nueve
    document.getElementById('diez-configuracion').value = categoria.diez
    document.getElementById('once-configuracion').value = categoria.once
    document.getElementById('doce-configuracion').value = categoria.doce
    agregarItem()
}
let reiniciarConfig = document.getElementById("reiniciar_config");
reiniciarConfig.addEventListener("click", (e)=>{
    e.preventDefault()
    formularioConfiguracionCategorias.reset()
    agregarItem()
})
async function removeCategorias(id) {
    respuesta = confirm('¿Estas seguro de eliminarlo?')
    if (respuesta) {
        let url = URL_API_almacen_central + 'categorias/' + id
        await fetch(url,{
            "method": "DELETE",
            "headers": {
                "Content-Type": 'application/json'
            }
        })
        await searchCategorias();
    }
}
const registrarCategoria = document.getElementById("registrar-categoria");
registrarCategoria.addEventListener("click", saveCategoria);
async function saveCategoria(e) {
    e.preventDefault();
    let data = {
        "categoria_nombre": document.getElementById('categoria-configuracion').value,
        "unidad_medida": document.getElementById('unidad-configuracion').value,
        "cantidad_item": document.getElementById('cantidad-configuracion').value,
        "uno": document.getElementById('uno-configuracion').value,
        "dos": document.getElementById('dos-configuracion').value,
        "tres": document.getElementById('tres-configuracion').value,
        "cuatro": document.getElementById('cuatro-configuracion').value,
        "cinco": document.getElementById('cinco-configuracion').value,
        "seis": document.getElementById('seis-configuracion').value,
        "siete": document.getElementById('siete-configuracion').value,
        "ocho": document.getElementById('ocho-configuracion').value,
        "nueve": document.getElementById('nueve-configuracion').value,
        "diez": document.getElementById('diez-configuracion').value,
        "once": document.getElementById('once-configuracion').value,
        "doce": document.getElementById('doce-configuracion').value,
    };
    
    let id = document.getElementById('id-configuracion').value
    if (id != '') {
        data.id = id
    };

    let url = URL_API_almacen_central + 'categorias'
    let response = await funcionFetch(url, data);
    console.log("Respuesta Categorías "+response.status)
    if(response.ok){
        alert("Operación completada.")
        await searchCategorias();
        formularioConfiguracionCategorias.reset();
        localStorage.setItem("categoria_consulta", JSON.stringify(categorias))
    };  
};

const numeroDeItem = document.getElementById("cantidad-configuracion");
numeroDeItem.addEventListener("keyup", agregarItem)
function agregarItem(){
    let numEspacios = document.querySelectorAll(".num_config");
    for(let i = 0; i < numEspacios.length; i++){
        if(document.getElementById("cantidad-configuracion").value > i){
            numEspacios[i].classList.remove("invisible")
        }else{
            numEspacios[i].classList.add("invisible")
            numEspacios[i].value = "";
        };
    };
};
/////////////////////////////////////////////////////////////////////////////////////////////////////
///////////NUMERACION//////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
async function searchNumeracion(){
    let url = URL_API_almacen_central + 'numeracion_comprobante'
    let response = await fetch(url,{
        "method": "GET",
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    numeracion = await response.json()

    let html = ''
    for(numero of numeracion) {
        let fila = `<tr>
                        <td class="invisible">${numero.id}</td>
                        <td>${numero.compras}</td>
                        <td>${numero.recompras}</td>
                        <td>${numero.transferencias}</td>
                        <td>${numero.ventas}</td>
                        <td>${numero.nota_venta}</td>
                        <td>${numero.boleta_venta}</td>
                        <td>${numero.factura}</td>
                        <td style="text-align: center;">
                            <span onclick="editNumeracion(${numero.id})" style="font-size:18px;" class="material-symbols-outlined myButtonEditar">edit</span>
                        </td>
                    </tr>`
            html = html + fila;
            document.getElementById("id-datos").value = numero.id
    };
    document.querySelector('#tabla-numeracion > tbody').outerHTML = html
};
function editNumeracion(id) {
    let numero = numeracion.find(x => x.id == id)
    document.getElementById('id-numeracion').value = numero.id
    document.getElementById('compras-numeracion').value = numero.compras
    document.getElementById('recompras-numeracion').value = numero.recompras
    document.getElementById('transferencias-numeracion').value = numero.transferencias
    document.getElementById('ventas-numeracion').value = numero.ventas
    document.getElementById('nota-venta-numeracion').value = numero.nota_venta
    document.getElementById('boleta-venta-numeracion').value = numero.boleta_venta
    document.getElementById('factura-numeracion').value = numero.factura
}
const registrarNumeracion = document.getElementById("registrar-numeracion");
registrarNumeracion.addEventListener("click", saveNumeracion);
async function saveNumeracion(e) {
    e.preventDefault();
    let data = {
        "id": document.getElementById('id-numeracion').value,
        "compras": document.getElementById('compras-numeracion').value,
        "recompras": document.getElementById('recompras-numeracion').value,
        "transferencias": document.getElementById('transferencias-numeracion').value,
        "ventas": document.getElementById('ventas-numeracion').value,      
        "nota_venta": document.getElementById('nota-venta-numeracion').value,      
        "boleta_venta": document.getElementById('boleta-venta-numeracion').value,      
        "factura": document.getElementById('factura-numeracion').value      
    }
    let url = URL_API_almacen_central + 'numeracion_comprobante'
    await fetch(url,{
        "method": 'POST',
        "body": JSON.stringify(data),
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    searchNumeracion();
    formularioConfiguracionNumeracion.reset();
}
async function searchDatos(){
    let url = URL_API_almacen_central + 'numeracion_comprobante_datos'
    let response = await fetch(url,{
        "method": "GET",
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    datos = await response.json()

    let html = ''
    for(dato of datos) {
        let fila = `<tr>
                        <td class="invisible">${dato.id}</td>
                        <td>${dato.nombre_empresa}</td>
                        <td>${dato.ruc}</td>
                        <td>${dato.direccion}</td>
                        <td>${dato.moneda}</td>
                        <td>${dato.web}</td>
                        <td style="text-align: center;">
                            <span onclick="editNumeracionDatos(${dato.id})" style="font-size:18px;" class="material-symbols-outlined myButtonEditar">edit</span>
                        </td>
                    </tr>`
            html = html + fila;
    };
    document.querySelector('#tabla-numeracion-datos > tbody').outerHTML = html
};
function editNumeracionDatos(id) {
    let dato = datos.find(x => x.id == id)
    document.getElementById('id-datos').value = dato.id
    document.getElementById('razon-datos').value = dato.nombre_empresa
    document.getElementById('ruc-datos').value = dato.ruc
    document.getElementById('direccion-datos').value = dato.direccion
    document.getElementById('moneda-datos').value = dato.moneda
    document.getElementById('web-datos').value = dato.web
};
const registrarDatos = document.getElementById("registrar-datos");
registrarDatos.addEventListener("click", saveNumeracionDatos);
async function saveNumeracionDatos(e) {
    e.preventDefault();
    let data = {
        "id": document.getElementById('id-datos').value,
        "nombre_empresa": document.getElementById('razon-datos').value,
        "ruc": document.getElementById('ruc-datos').value,
        "direccion": document.getElementById('direccion-datos').value,
        "moneda": document.getElementById('moneda-datos').value,      
        "web": document.getElementById('web-datos').value    
    }
    let url = URL_API_almacen_central + 'numeracion_comprobante_datos'
    await fetch(url,{
        "method": 'POST',
        "body": JSON.stringify(data),
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    searchDatos();
    formularioConfiguracionNumeracionDatos.reset();
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////USUARIOS//////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
const registro = document.getElementById('formulario-create-usuarios');
registro.addEventListener('submit',async (event)=>{
    event.preventDefault();
    if(document.getElementById("password-create-usuario").value === document.getElementById("password-confirmar-create-usuario").value &&
    expregul.cliente.test(document.getElementById("nombres-create-usuario").value) &&
    expregul.cliente.test(document.getElementById("apellidos-create-usuario").value) &&
    expregul.dni.test(document.getElementById("dni-create-usuario").value) &&
    expregul.email.test(document.getElementById("email-create-usuario").value) &&
    expregul.telefono.test(document.getElementById("telefono-create-usuario").value) &&
    expregul.password.test(document.getElementById("password-create-usuario").value)){
        let data = {
                        "nombres": document.getElementById("nombres-create-usuario").value,
                        "apellidos": document.getElementById("apellidos-create-usuario").value,
                        "dni": document.getElementById("dni-create-usuario").value,
                        "e_mail": document.getElementById("email-create-usuario").value,
                        "telefono": document.getElementById("telefono-create-usuario").value,
                        "cargo": document.getElementById("cargo-create-usuario").value,
                        "passw": document.getElementById("password-create-usuario").value,
                        "fecha": fechaPrincipal
                    }
        let id = document.getElementById('id_usuarios').value
        if (id != '') {
            data.id = id
        };
        let response = ""
        if(id != ''){
            response = await fetch('/registroInterno',{
                "method":'POST',
                "headers":{
                    'Content-Type': 'application/json'
                },
                "body":JSON.stringify(data)
            });
        }else{
            let respuesta = confirm('La tarifa de un nuevo usuario es de S/2.00 por mes. ¿Desea continuar?.')
            if(respuesta){
                if(data.cargo != 201){
                    response = await fetch('/registroInterno',{
                        "method":'POST',
                        "headers":{
                            'Content-Type': 'application/json'
                        },
                        "body":JSON.stringify(data)
                    });
                }else{
                    alert("No se puede crear un usuario con cargo de administrador.")
                }
            };
        };
        if(response.ok){
            alert("Usuario registrado satisfactoriamente.")
            await searchUsuarios()
            document.getElementById("formulario-create-usuarios").reset()
            document.getElementById("id_usuarios").value = ""
            document.getElementById("nombres-create-usuario").style.background =""
            document.getElementById("apellidos-create-usuario").style.background =""
            document.getElementById("dni-create-usuario").style.background =""
            document.getElementById("email-create-usuario").style.background =""
            document.getElementById("telefono-create-usuario").style.background =""
            document.getElementById("password-create-usuario").style.background =""
        };
    }else if(document.getElementById("password-create-usuario").value != document.getElementById("password-confirmar-create-usuario").value){
        alert("Password y password de confirmación no son iguales.")
    }else if(expregul.cliente.test(document.getElementById("nombres-create-usuario").value) == false){
        document.getElementById("nombres-create-usuario").style.background ="#b36659"
    }else if(expregul.cliente.test(document.getElementById("apellidos-create-usuario").value) == false){
        document.getElementById("apellidos-create-usuario").style.background ="#b36659"
    }else if(expregul.dni.test(document.getElementById("dni-create-usuario").value) == false){
        document.getElementById("dni-create-usuario").style.background ="#b36659"
    }else if(expregul.email.test(document.getElementById("email-create-usuario").value) == false){
        document.getElementById("email-create-usuario").style.background ="#b36659"
    }else if(expregul.telefono.test(document.getElementById("telefono-create-usuario").value) == false){
        document.getElementById("telefono-create-usuario").style.background ="#b36659"
    }else if(expregul.password.test(document.getElementById("password-create-usuario").value) == false){
        document.getElementById("password-create-usuario").style.background ="#b36659"
    };
});
async function searchUsuarios(){
    let url = URL_API_almacen_central + 'usuarios_tabla_local'
    let response = await fetch(url,{
        "method": "GET",
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    usuarios = await response.json()
    let html = ''
    for(usuario of usuarios) {
        let fila = `<tr>
                        <td class="invisible">${usuario.id}</td>
                        <td>${usuario.nombres}</td>
                        <td>${usuario.apellidos}</td>
                        <td>${usuario.dni}</td>
                        <td>${usuario.e_mail}</td>
                        <td>${usuario.telefono}</td>
                        <td class="invisible" style="text-align: end;">${usuario.cargo}</td>
                        <td class="cargo_usuario"></td>
                        <td class="invisible">${usuario.clave}</td>
                        <td>${usuario.fecha}</td>
                        <td style="text-align: center; display: flex; gap: 3px">
                            <span onclick="reproducirUsuario(${usuario.id})" style="font-size: 20px" class="reproducir_usuario myButtonEditar material-symbols-outlined">play_arrow</span>
                            <span onclick="pausarUsuario(${usuario.id})" style="font-size: 20px" class="pausar_usuario myButtonEditar material-symbols-outlined">pause</span>
                            <span onclick="editUsuarios(${usuario.id})" style="font-size:18px;" class="material-symbols-outlined myButtonEditar">edit</span>
                            <span onclick="desactivarUsuario(${usuario.id})" style="font-size:18px;" class="material-symbols-outlined eliminarTablaFila desactivar_usuario">delete</span>
                        </td>
                    </tr>`
            html = html + fila;
    };
    document.querySelector('#tabla-usuarios-local > tbody').outerHTML = html
    botonesUsuarios()
};
function editUsuarios(id) {
    let usuario = usuarios.find(x => x.id == id)
    document.getElementById('id_usuarios').value = usuario.id
    document.getElementById('nombres-create-usuario').value = usuario.nombres
    document.getElementById('apellidos-create-usuario').value = usuario.apellidos
    document.getElementById('dni-create-usuario').value = usuario.dni
    document.getElementById('email-create-usuario').value = usuario.e_mail
    document.getElementById('telefono-create-usuario').value = usuario.telefono
    document.getElementById('cargo-create-usuario').value = usuario.cargo
}
async function reproducirUsuario(id){
    let usuario = usuarios.find(x => x.id == id)
    if(usuario.cargo !== 201){
        data = {
            'id': usuario.id,
            'vinculacion': document.getElementById("identificacion_usuario_id").textContent,
            'clave': 1,
            'num_sucursales': 0,
            'num_usuarios': 0
        };
        let url = URL_API_almacen_central + 'usuarios_acciones'
        let response = await funcionFetch(url, data)
        if(response.ok){
            await searchUsuarios()
            alert(`Usuario reanudado.`)
        };
    }else{
        alert(`No se puede reanudar al administrador.`)
    };
};
async function pausarUsuario(id){
    let usuario = usuarios.find(x => x.id == id)
    if(usuario.cargo !== 201){
        data = {
            'id': usuario.id,
            'vinculacion': document.getElementById("identificacion_usuario_id").textContent,
            'clave': 4,
            'num_sucursales': 0,
            'num_usuarios': 0
        };
        let url = URL_API_almacen_central + 'usuarios_acciones'
        let response = await funcionFetch(url, data)
        if(response.ok){
            await searchUsuarios()
            alert(`Usuario pausado.`)
        };
    }else{
        alert(`No se puede pausar al administrador.`)
    };
};
async function desactivarUsuario(id){
    let usuario = usuarios.find(x => x.id == id)
    if(usuario.cargo !== 201){
        data = {
            'id': usuario.id,
            'vinculacion': document.getElementById("identificacion_usuario_id").textContent,
            'clave': 2,
            'num_sucursales': 0,
            'num_usuarios': 0
        };
        let url = URL_API_almacen_central + 'usuarios_acciones'
        let response = await funcionFetch(url, data)
        if(response.ok){
            await searchUsuarios()
            alert(`La desactivación de este usuario se aprobará en las siguientes horas.`)
        };
    }else{
        alert(`No se puede desactivar al administrador.`)
    };
};
function botonesUsuarios(){
    let boton_reproducir = document.querySelectorAll(".reproducir_usuario")
    boton_reproducir.forEach((event)=>{
        if(event.parentNode.parentNode.children[8].textContent == 1){
            event.style.background = "var(--boton-dos)"
        }
    });
    let boton_pausar = document.querySelectorAll(".pausar_usuario")
    boton_pausar.forEach((event)=>{
        if(event.parentNode.parentNode.children[8].textContent == 4){
            event.style.background = "var(--boton-dos)"
        }
    });
    let mostrarCargo = document.querySelectorAll(".cargo_usuario")
    mostrarCargo.forEach((event)=>{
        let cargos = document.getElementById("cargo-create-usuario").children
        for(let i = 0; i < cargos.length; i++){
            if(event.parentNode.children[6].textContent == cargos[i].value){
                event.textContent = cargos[i].textContent
            }
        };
    });
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
document.getElementById("agregar_sucursal").addEventListener("click", async (e)=>{
    e.preventDefault();
    let respuesta = confirm(`La tarifa por una sucursal nueva es de S/8.00 al mes. ¿Desea Continuar?`)
    if(respuesta){
        let num_filas = document.querySelector('#tabla_sucursales > tbody').children
        if(num_filas.length < 4){
            let suc_add = ["Almacén Central", "Sucursal Uno", "Sucursal Dos", "Sucursal Tres"]
            let sucursal_opcion = "";
            for(let i = 0; i <= num_filas.length; i++){
                if(num_filas.length == i){
                    sucursal_opcion = suc_add[i]
                }
            }
            let data = {
                'sucursal_nombre': sucursal_opcion,
                'fecha_suc': fechaPrincipal
            };
            let url = URL_API_almacen_central + 'sucursales'
            let response = await funcionFetch(url, data)
            console.log(response.status)
            if(response.ok){
                alert(`${data.sucursal_nombre} ha sido creado.`)
            }
        }else{
            alert("Ya se alcanzó el máximo de sucursales.")
        };
    };
});
async function searchSucursales(){
    let url = URL_API_almacen_central + 'sucursales'
    let response = await fetch(url,{
        "method": "GET",
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    sucursales = await response.json()
    console.log(sucursales)
    let html = ''
    for(sucursal of sucursales) {
        let fila = `<tr>
                        <td class="invisible">${sucursal.id_sucursales}</td>
                        <td>${sucursal.sucursal_nombre}</td>
                        <td class="invisible estado_sucursal">${sucursal.estado}</td>
                        <td></td>
                        <td>${sucursal.fecha_suc}</td>
                        <td style="text-align: center;">
                            <a onclick="activarSucursales(${sucursal.id_sucursales})" class="myButtonEditar">Activar</a>
                            <a onclick="desactivarSucursales(${sucursal.id_sucursales})" class="eliminarTablaFila">Desactivar</a>
                        </td>
                    </tr>`
            html = html + fila;
    };
    document.querySelector('#tabla_sucursales > tbody').outerHTML = html
    estadoDeSucursalesTabla();
};
async function activarSucursales(id){
    let sucursal = sucursales.find(x => x.id_sucursales == id)
    if(sucursal.estado === 3){
        data = {
            'id_sucursales': sucursal.id_sucursales,
            'estado': 0,
        };
        let url = URL_API_almacen_central + 'sucursales'
        let response = await funcionFetch(url, data);
        if(response.ok){
            searchSucursales()
            alert(`${sucursal.sucursal_nombre} activado.`)
        };
    }else if(sucursal.estado === 0 || sucursal.estado === 2){
        alert("Hay una solicitud pendiente.")
    }else{
        alert("Esta sucursal ya esta activada.")
    };
};
async function desactivarSucursales(id){
    let sucursal = sucursales.find(x => x.id_sucursales == id)
    if(sucursal.estado === 1){
        data = {
            'id_sucursales': sucursal.id_sucursales,
            'estado': 2,
        };
        let url = URL_API_almacen_central + 'sucursales'
        let response = await funcionFetch(url, data);
        if(response.ok){
            searchSucursales()
            alert(`${sucursal.sucursal_nombre} desactivado.`)
        };
    }else if(sucursal.estado === 0 || sucursal.estado === 2){
        alert("Hay una solicitud pendiente.")
    }else{
        alert("Esta sucursal ya esta desactivada.")
    };
}
function estadoDeSucursalesTabla(){
    let opciones_estado = ["Esperando activación", "Activado", "Esperando desactivación", "Desactivado"]
    document.querySelectorAll(".estado_sucursal").forEach((event)=>{
        for(let i = 0; i < opciones_estado.length; i++){
            if(event.textContent == i){
                event.parentNode.children[3].textContent = opciones_estado[i]
            }
        };
    });
};
/////////////////////////////////////////////////////////
document.getElementById("reiniciar_config").addEventListener("click", ()=>{
    document.getElementById("id-configuracion").value = ""
})
document.getElementById("reset_usuarios").addEventListener("click", ()=>{
    document.getElementById("id_usuarios").value = ""
})

