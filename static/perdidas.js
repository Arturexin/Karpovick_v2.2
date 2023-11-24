document.addEventListener("DOMContentLoaded", inicioPerdidas)
function inicioPerdidas(){
    graficoPerdidas()
    btnPerdidas = 1;
    cambioSucursalPerdidas()
    llenarCategoriaProductosEjecucion("#categoria-perdidas")
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////Pérdidas/////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let sucursal_id_perdidas = 0;
let sucursal_indice_perdidas = 0;
let formularioPerdidas = document.getElementById("formulario-perdidas");
document.addEventListener("keyup", (e) =>{
    indice_base = JSON.parse(localStorage.getItem("base_datos_consulta"))
    let almacenCentral = indice_base.find(y => y.codigo.toLowerCase().startsWith(document.getElementById('buscador-perdidas').value.toLocaleLowerCase()))
    if(indice_base.find(y => y.codigo.toLowerCase().startsWith(document.getElementById('buscador-perdidas').value.toLocaleLowerCase()))){
        document.getElementById('id-perdidas').value = almacenCentral.idProd

        sucursal_id_perdidas = document.getElementById("sucursal-principal").value
        sucursal_indice_perdidas = document.getElementById("sucursal-principal").selectedIndex
        document.getElementById('categoria-perdidas').value = almacenCentral.categoria
        document.getElementById('sucursal-perdidas').value = document.getElementById("sucursal-principal")[sucursal_indice_perdidas].textContent
        document.getElementById('codigo-perdidas').value = almacenCentral.codigo
        document.getElementById('descripcion-perdidas').value = almacenCentral.descripcion
        if(document.getElementById('buscador-perdidas').value > 0 || document.getElementById('buscador-perdidas').value == ""){
            formularioPerdidas.reset();
        }
    };
});
const procesarPerdidas = document.getElementById("agregarATablaPrePerdidas");
procesarPerdidas.addEventListener("click",async (e) =>{
    e.preventDefault();
    if(document.getElementById("codigo-perdidas").value !== ""){
        modal_proceso_abrir(`Procesando la ${document.querySelector("#motivo_salida").value}!!!.`, "")
        let datoCodigoUnitario;
        let url = URL_API_almacen_central + `almacen_central_id_sucursal/${document.getElementById('id-perdidas').value}?`+
                                            `sucursal_get=${sucursales_activas[sucursal_indice_perdidas]}`
        let response = await fetch(url,{
            "method": "GET",
            "headers": {
                "Content-Type": 'application/json'
            }
        });
        datoCodigoUnitario = await response.json();
        let saldoPerdidas = 0;
        function DatosPerdidas(){
            this.idProd = document.getElementById('id-perdidas').value;
            this.sucursal_post = sucursales_activas[sucursal_indice_perdidas];
            this.existencias_post = datoCodigoUnitario.sucursal_get - document.getElementById('cantidad-perdida').value;
            saldoPerdidas = this.existencias_post;
            this.comprobante = document.getElementById('motivo_salida').value;
            this.existencias_entradas = -(document.getElementById('cantidad-perdida').value);
            this.sucursal = sucursal_id_perdidas;
        }
        let perdProd = new DatosPerdidas()
        if(document.getElementById('cantidad-perdida').value > 0 && saldoPerdidas >= 0){
            let urlProductos = URL_API_almacen_central + 'procesar_recompra'
            let respuesta_productos = await funcionFetch(urlProductos, perdProd);
            console.log(respuesta_productos.status)
            if(respuesta_productos.status === 200){
                modal_proceso_abrir("Producto procesado", "")
                modal_proceso_salir_botones()
                formularioPerdidas.reset();
                document.getElementById("buscador-perdidas").focus();
            }
        }else if(document.getElementById('cantidad-perdida').value <= 0){
            modal_proceso_abrir("Coloque una cantidad mayor a cero.", "")
            modal_proceso_salir_botones()
            document.getElementById("cantidad-perdida").focus();
        }else if(saldoPerdidas < 0){
            modal_proceso_abrir("No cuenta con stock suficiente.", "")
            modal_proceso_salir_botones()
        };
    };
});
let colorFondoBarra = ["#E6CA7B","#91E69C","#6380E6","#E66E8D"];
async function graficoPerdidas(){
    await cargarPerdidaDonacionMes();
    let array_donaciones = [];
    let array_perdidas = [];
    let masAlto = 0;
    document.querySelectorAll(".f_l_g").forEach((event, i)=>{
        event.textContent = arregloMeses[i];
    })
    for(let i = 0; i < 12; i++){
        array_donaciones.push(0);
        array_perdidas.push(0);
        PerDonEntradas.forEach((event)=>{
            if(event.mes == i + 1){
                array_donaciones[i] = -event.suma_donacion;
                array_perdidas[i] = -event.suma_perdida;
            }
            if(masAlto < -event.suma_donacion){masAlto = -event.suma_donacion}
            if(masAlto < -event.suma_perdida){masAlto = -event.suma_perdida}
        });
    };
    let masAltoDos = (226 * masAlto)/214;
    document.querySelectorAll(".eje_y_numeracion").forEach((e)=>{
        e.textContent = Number(masAltoDos).toFixed(2)
        masAltoDos -= 0.20 * ((226 * masAlto)/214);
    });
    pintarGraficoPositivo(document.querySelectorAll(".cg_1_c"), array_donaciones, masAlto, colorFondoBarra[0], document.querySelectorAll(".sg_1_c"))
    pintarGraficoPositivo(document.querySelectorAll(".cg_2_c"), array_perdidas, masAlto, colorFondoBarra[2], document.querySelectorAll(".sg_2_c"))
};
async function cargarPerdidaDonacionMes(){
    let url = URL_API_almacen_central + 'entradas_suma_perdidas_donaciones_mes'
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    PerDonEntradas = await respuesta.json();
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function cambioSucursalPerdidas(){
    document.getElementById("sucursal-principal").addEventListener("change", ()=>{
        document.getElementById("formulario-perdidas").reset();
        document.getElementById("id-perdidas").value = ""
    });
}
