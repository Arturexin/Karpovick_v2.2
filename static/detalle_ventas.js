/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////Detalle de Ventas////////////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", inicioDetalleVentas)
function inicioDetalleVentas(){
    cargaDetalleVentas()
    inicioTablasDetalleVentas()
    btnDetalleVentas = 1;
};
let metodo_pago_detalle = ["Efectivo", "Tarjeta", "Crédito", "Pérdida"];
async function cargaDetalleVentas(){
    await cargarNumeracionDatos()
    await cargarDetalleVentasGrafico()

    circuloSucursales(0, "circulo_stock_uno", ".nombre_circulo_sucursal_uno", ".valor_circulo_sucursal_uno", ".porcentaje_circulo_sucursal_uno")
    circuloSucursales(1, "circulo_stock_dos", ".nombre_circulo_sucursal_dos", ".valor_circulo_sucursal_dos", ".porcentaje_circulo_sucursal_dos")
    circuloSucursales(2, "circulo_stock_tres", ".nombre_circulo_sucursal_tres", ".valor_circulo_sucursal_tres", ".porcentaje_circulo_sucursal_tres")
    circuloSucursales(3, "circulo_stock_cuatro", ".nombre_circulo_sucursal_cuatro", ".valor_circulo_sucursal_cuatro", ".porcentaje_circulo_sucursal_cuatro")
    llenarTituloCirculos()
    graficoVentas()

    promCanalVenta()
};
async function inicioTablasDetalleVentas(){
    await conteoDetalleVentas(document.getElementById("filtro-tabla-detalleVentas-sucursal").value, 
                            document.getElementById("filtro-tabla-detalleVentas-comprobante").value, 
                            document.getElementById("filtro-tabla-detalleVentas-tipoComprobante").value, 
                            document.getElementById("filtro-tabla-detalleVentas-dni").value,
                            '2000-01-01',
                            new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate())
    await searchDetalleVentas(document.getElementById("numeracionTablaVentas").value - 1, "", "", "", "",
                            '2000-01-01', new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate())
    avanzarTablaDetalleVentas()
    atajoTablaDetalleVentas()
    filtroDetalleVentas()
};
let detVentasComprobante = [];
let cliente_id = [];
let det_ve_gr = [];
let numeronIncrementoVentas = 1;
let sumaDetalleVentas = 0;
let inicio = 0;
let fin = 0;
async function conteoDetalleVentas(sucursal,comprobante,tipComp,cliente,inicio,fin){
    let url = URL_API_almacen_central + `ventas_conteo?`+
                                        `sucursal_det_venta=${sucursal}&`+
                                        `comprobante_det_venta=${comprobante}&`+
                                        `tipComp_det_venta=${tipComp}&`+
                                        `cliente_det_venta=${cliente}&`+
                                        `fecha_inicio_det_venta=${inicio}&`+
                                        `fecha_fin_det_venta=${fin}`
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
    document.querySelector("#numeracionTablaVentas").innerHTML = html
};
async function searchDetalleVentas(num,sucursal,comprobante,tipComp,cliente,inicio,fin){
    let url = URL_API_almacen_central + `ventas_tabla/${num}?`+
                                        `sucursal_det_venta=${sucursal}&`+
                                        `comprobante_det_venta=${comprobante}&`+
                                        `tipComp_det_venta=${tipComp}&`+
                                        `cliente_det_venta=${cliente}&`+
                                        `fecha_inicio_det_venta=${inicio}&`+
                                        `fecha_fin_det_venta=${fin}`
    let response = await fetch(url,{
        "method": "GET",
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    detalleVentas = await response.json()
    let html = ''
    if(detalleVentas.length > 0){
        
        for(detal of detalleVentas){
            let fila = `<tr class="ventas-fila">
                            <td class="invisible">${detal.id_det_ventas}</td>
                            <td>${detal.sucursal_nombre}</td>
                            <td>${detal.comprobante}</td>
                            <td>${detal.tipo_comprobante}</td>
                            <td>${detal.nombre_cli}</td>
                            <td style="text-align: end;">${detal.modo_efectivo.toFixed(2)}</td>
                            <td style="text-align: end;">${detal.modo_tarjeta.toFixed(2)}</td>
                            <td style="text-align: end;">${detal.modo_credito.toFixed(2)}</td>
                            <td style="text-align: end;">${detal.modo_perdida.toFixed(2)}</td>
                            <td style="text-align: end;">${detal.total_venta.toFixed(2)}</td>
                            <td style="text-align: end;" class="invisible">${detal.canal_venta}</td>
                            <td class="modoVenta"></td>
                            <td style="width: 95px">${detal.fecha_det_ventas}</td>
                            <td style="text-align: center;">
                                <span onclick="buscarTicketVenta(${detal.id_det_ventas})" style="font-size:18px;" class="material-symbols-outlined myButtonEditar">print</span>
                            </td>
                        </tr>`
            html = html + fila;
        };
        document.querySelector('#tabla-detalle-ventas > tbody').outerHTML = html;
        modeloVenta()
    }else{
        alert("No se encontraron resultados.")
        document.querySelector('#tabla-detalle-ventas > tbody').outerHTML = html;
        document.querySelector("#tabla-detalle-ventas").createTBody()
    };
};

function avanzarTablaDetalleVentas(){
    document.getElementById("avanzarVentas").addEventListener("click", () =>{
        if(sumaDetalleVentas + 20 < cantidadFilas){
            numeronIncrementoVentas += 1
            sumaDetalleVentas += 20
            document.getElementById("numeracionTablaVentas").value = numeronIncrementoVentas
            manejoDeFechasDetalleVentas()
            searchDetalleVentas(sumaDetalleVentas,
                                document.getElementById("filtro-tabla-detalleVentas-sucursal").value, 
                                document.getElementById("filtro-tabla-detalleVentas-comprobante").value, 
                                document.getElementById("filtro-tabla-detalleVentas-tipoComprobante").value, 
                                document.getElementById("filtro-tabla-detalleVentas-dni").value,
                                inicio,
                                fin)
        };
    });
    document.getElementById("retrocederVentas").addEventListener("click", () =>{
        if(numeronIncrementoVentas > 1){
            numeronIncrementoVentas -= 1
            sumaDetalleVentas -= 20
            document.getElementById("numeracionTablaVentas").value = numeronIncrementoVentas
            manejoDeFechasDetalleVentas()
            searchDetalleVentas(sumaDetalleVentas,
                                document.getElementById("filtro-tabla-detalleVentas-sucursal").value, 
                                document.getElementById("filtro-tabla-detalleVentas-comprobante").value, 
                                document.getElementById("filtro-tabla-detalleVentas-tipoComprobante").value, 
                                document.getElementById("filtro-tabla-detalleVentas-dni").value,
                                inicio,
                                fin)
        };
    });
};
function atajoTablaDetalleVentas(){
    document.getElementById("numeracionTablaVentas").addEventListener("change", ()=>{
        manejoDeFechasDetalleVentas()
        searchDetalleVentas((document.getElementById("numeracionTablaVentas").value - 1) * 20,
                            document.getElementById("filtro-tabla-detalleVentas-sucursal").value, 
                            document.getElementById("filtro-tabla-detalleVentas-comprobante").value, 
                            document.getElementById("filtro-tabla-detalleVentas-tipoComprobante").value, 
                            document.getElementById("filtro-tabla-detalleVentas-dni").value,
                            inicio,
                            fin)
        numeronIncrementoVentas = Number(document.getElementById("numeracionTablaVentas").value);
        sumaDetalleVentas = (document.getElementById("numeracionTablaVentas").value - 1) * 20;
    });
};
document.getElementById("restablecerVentas").addEventListener("click", async () =>{
    document.getElementById("filtro-tabla-detalleVentas-sucursal").value = ""
    document.getElementById("filtro-tabla-detalleVentas-comprobante").value = ""
    document.getElementById("filtro-tabla-detalleVentas-tipoComprobante").value = ""
    document.getElementById("filtro-tabla-detalleVentas-dni").value = ""
    document.getElementById("filtro-tabla-detalleVentas-fecha-inicio").value = ""
    document.getElementById("filtro-tabla-detalleVentas-fecha-fin").value = ""

    await conteoDetalleVentas(document.getElementById("filtro-tabla-detalleVentas-sucursal").value, 
                        document.getElementById("filtro-tabla-detalleVentas-comprobante").value, 
                        document.getElementById("filtro-tabla-detalleVentas-tipoComprobante").value, 
                        document.getElementById("filtro-tabla-detalleVentas-dni").value,
                        '2000-01-01',
                        new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate())
    await searchDetalleVentas(0,document.getElementById("filtro-tabla-detalleVentas-sucursal").value, 
                        document.getElementById("filtro-tabla-detalleVentas-comprobante").value, 
                        document.getElementById("filtro-tabla-detalleVentas-tipoComprobante").value, 
                        document.getElementById("filtro-tabla-detalleVentas-dni").value,
                        '2000-01-01',
                        new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate())
    numeronIncrementoVentas = 1;
    sumaDetalleVentas = 0;
});
function manejoDeFechasDetalleVentas(){
    inicio = document.getElementById("filtro-tabla-detalleVentas-fecha-inicio").value;
    fin = document.getElementById("filtro-tabla-detalleVentas-fecha-fin").value;
    if(inicio == "" && fin == ""){
        inicio = '2000-01-01';
        fin = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate()
    }else if(inicio == "" && fin != ""){
        inicio = '2000-01-01';
    }else if(inicio != "" && fin == ""){
        fin = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate();
    };
};
function filtroDetalleVentas(){
    document.getElementById("buscarFiltrosVentas").addEventListener("click", async (e)=>{
        e.preventDefault();
        manejoDeFechasDetalleVentas()
        await conteoDetalleVentas(document.getElementById("filtro-tabla-detalleVentas-sucursal").value, 
                            document.getElementById("filtro-tabla-detalleVentas-comprobante").value, 
                            document.getElementById("filtro-tabla-detalleVentas-tipoComprobante").value, 
                            document.getElementById("filtro-tabla-detalleVentas-dni").value,
                            inicio,
                            fin)
        await searchDetalleVentas(0,document.getElementById("filtro-tabla-detalleVentas-sucursal").value, 
                            document.getElementById("filtro-tabla-detalleVentas-comprobante").value, 
                            document.getElementById("filtro-tabla-detalleVentas-tipoComprobante").value, 
                            document.getElementById("filtro-tabla-detalleVentas-dni").value,
                            inicio,
                            fin)
        numeronIncrementoSalidasTabla = 1;
        sumaSalidasTabla = 0;
        alert(`Se obtuvieron ${cantidadFilas} registros.`)
    });
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function buscarTicketVenta(id_ventas) {
    
    let numeracion_comprobante_venta = "";
    let importe_venta = 0;
    let nombre_cliente = "";
    let filaDetalleVenta = detalleVentas.find(y => y.id_det_ventas == id_ventas)
    if(filaDetalleVenta.tipo_comprobante[0] === "N"){
        numeracion_comprobante_venta = "Nota de Venta"
    }else if(filaDetalleVenta.tipo_comprobante[0] === "B"){
        numeracion_comprobante_venta = "Boleta de Venta"
    }else if(filaDetalleVenta.tipo_comprobante[0] === "F"){
        numeracion_comprobante_venta = "Factura"
    };
    await cargarDetalleSalidas(filaDetalleVenta.comprobante)
    await cargarClientesId(detVentasComprobante[0].cliente);
    if(cliente_id.nombre_cli === "Sin datos"){
        nombre_cliente = "";
    }else{
        nombre_cliente = cliente_id.nombre_cli;
    };
    // Generar el contenido HTML con los datos de la tabla
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
                            <p>Sede: ${filaDetalleVenta.sucursal_nombre}</p>
                            <h2 class="tipo_comprobante">${numeracion_comprobante_venta}</h2>
                            <br>
                            <h2>${filaDetalleVenta.tipo_comprobante}</h2>
                            <br>
                            <p>FECHA   : ${filaDetalleVenta.fecha_det_ventas}</p>
                            <p>CLIENTE : ${nombre_cliente}</p>
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
        detVentasComprobante.forEach((event) =>{
        if(event.comprobante === filaDetalleVenta.comprobante){
            let producto = event.descripcion;
            let catidad = event.existencias_salidas;
            let precio = Number(event.precio_venta_salidas).toFixed(2);
            let importe = (event.precio_venta_salidas * event.existencias_salidas).toFixed(2);
            contenidoHTML += `<tr>
                        <td>${producto}</td>
                        <td>${catidad}</td>
                        <td>${precio}</td>
                        <td>${importe}</td>
                    </tr>`;
            importe_venta += Number(event.precio_venta_salidas * event.existencias_salidas);

        }
    });
            contenidoHTML +=    `</tbody>
                                <tfoot>
                                    <tr class="clave">
                                        <th>oper. GRAVADAS</th>
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
                            <p>LADO: COPIA</p>
                                        <img class="codBarTicket" src="">
                            <p>PRESENTACIÓN IMPRESA DE LA<p>
                            <p>${numeracion_comprobante_venta}<p>
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
                        JsBarcode(".codBarTicket", "${filaDetalleVenta.comprobante}", {
                            format: "CODE128",
                            displayValue: true
                        });
                        var options = {
                            filename: '${filaDetalleVenta.tipo_comprobante}.pdf',
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
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let colorFondoBarra = ["#E6CA7B","#91E69C","#6380E6","#E66E8D"];
function graficoVentas(){
    
    let array_efectivo = [];
    let array_tarjeta = [];
    let array_credito = [];
    let array_perdida = [];
    let masAlto = 0;
    document.querySelectorAll(".color_item_grafico_detVenta").forEach((event, i)=>{
        event.style.background = `${colorFondoBarra[i]}`
        event.style.width = `20px`
        event.style.height = `10px`
    });
    document.querySelectorAll(".f_l_g").forEach((event, i)=>{
        event.textContent = arregloMeses[i];
    })
    for(let i = 0; i < 12; i++){
        array_efectivo.push(0);
        array_tarjeta.push(0);
        array_credito.push(0);
        array_perdida.push(0);
        det_ve_gr.forEach((event)=>{
            if(event.mes == i + 1){
                array_efectivo[i] += event.suma_efectivo;
                array_tarjeta[i] += event.suma_tarjeta;
                array_credito[i] += event.suma_credito;
                array_perdida[i] += event.suma_perdida;
            }
            
            if(masAlto < array_efectivo[i]){masAlto = array_efectivo[i]}
            if(masAlto < array_tarjeta[i]){masAlto = array_tarjeta[i]}
            if(masAlto < array_credito[i]){masAlto = array_credito[i]}
            if(masAlto < array_perdida[i]){masAlto = array_perdida[i]}
        });
    };
    let masAltoDos = (226 * masAlto)/214;
    document.querySelectorAll(".eje_y_numeracion").forEach((e)=>{
        e.textContent = Number(masAltoDos).toFixed(2)
        masAltoDos -= 0.20 * ((226 * masAlto)/214);
    });
    pintarGraficoPositivo(document.querySelectorAll(".cg_1_c"), array_efectivo, masAlto, colorFondoBarra[0], document.querySelectorAll(".sg_1_c"))
    pintarGraficoPositivo(document.querySelectorAll(".cg_2_c"), array_tarjeta, masAlto, colorFondoBarra[1], document.querySelectorAll(".sg_2_c"))
    pintarGraficoPositivo(document.querySelectorAll(".cg_3_c"), array_credito, masAlto, colorFondoBarra[2], document.querySelectorAll(".sg_3_c"))
    pintarGraficoPositivo(document.querySelectorAll(".cg_4_c"), array_perdida, masAlto, colorFondoBarra[3], document.querySelectorAll(".sg_4_c"))
};
function llenarTituloCirculos(){
    document.querySelectorAll(".titulo_circulo_detalle_venta").forEach((event, i)=>{
        event.textContent = suc_enc[i].sucursal_nombre
    })
};

function circuloSucursales(sucursal, circulo_suc, nombre_suc, valor_suc, procentaje_suc){
    let modo_cobro = [0,0,0,0];
    let num_oper = [0,0,0,0];
    let total = 0;
    let totalNeto = 0;
    let total_oper = 0;
    let total_oper_neto = 0;
    let arrayDatos = [];
    let valor_sucursal_principal = document.getElementById("sucursal-principal").children
    det_ve_gr.forEach((event)=>{
        if(event.sucursal === Number(valor_sucursal_principal[sucursal].value)){
            modo_cobro[0] += event.suma_efectivo
            modo_cobro[1] += event.suma_tarjeta
            modo_cobro[2] += event.suma_credito
            modo_cobro[3] += event.suma_perdida

            num_oper[0] += event.suma_conteo_efectivo
            num_oper[1] += event.suma_conteo_tarjeta
            num_oper[2] += event.suma_conteo_credito
            num_oper[3] += event.suma_conteo_perdida
        }
    });
    modo_cobro.forEach((event, i)=>{
        total +=event
        if(i < 3){//evitamos sumar pérdidas
            totalNeto +=event
        }
    });
    num_oper.forEach((event, i)=>{
        total_oper +=event
        if(i < 3){//evitamos sumar pérdidas
            total_oper_neto +=event
        }
    });

    document.querySelector(nombre_suc).textContent = "Total Venta"
    document.querySelector(valor_suc).textContent = "S/" + totalNeto.toFixed(2)
    document.querySelector(procentaje_suc).textContent = `100% / ${total_oper_neto} oper.`
    let circulo = document.getElementById(circulo_suc)
    circulo.style.background = `conic-gradient(${colorFondoBarra[0]} ${(modo_cobro[0]/total)*360}deg, 
                                                ${colorFondoBarra[1]} ${(modo_cobro[0]/total)*360}deg ${((modo_cobro[0] + modo_cobro[1])/total)*360}deg, 
                                                ${colorFondoBarra[2]} ${((modo_cobro[0] + modo_cobro[1])/total)*360}deg ${((modo_cobro[0] + modo_cobro[1] + modo_cobro[2])/total)*360}deg, 
                                                ${colorFondoBarra[3]} ${((modo_cobro[0] + modo_cobro[1] + modo_cobro[2])/total)*360}deg)`;
    circulo.addEventListener("mouseleave", ()=>{
        document.querySelector(nombre_suc).textContent = "Total Venta"
        document.querySelector(valor_suc).textContent = "S/" + totalNeto.toFixed(2)
        document.querySelector(procentaje_suc).textContent = `100% / ${total_oper_neto} oper.`
    });
    let inicio = 271;
    let fin = 0;
    let suma = 0;
    for(let i = 0; i < modo_cobro.length; i++){
        suma += modo_cobro[i]
        fin = ((suma/total)*360)
        if(inicio > 270 && inicio <= 360 && fin > 0 && fin <= 90){
            arrayDatos.push(new objetoColoresinventario_prom_suc(colorFondoBarra[i], Math.ceil(inicio), Math.floor(fin + 270)))
            inicio = fin + 270
        }else if(inicio > 270 && inicio <= 360 && fin >= 90 && fin <= 360){
            arrayDatos.push(new objetoColoresinventario_prom_suc(colorFondoBarra[i], Math.ceil(inicio), Math.floor(360)))
            arrayDatos.push(new objetoColoresinventario_prom_suc(colorFondoBarra[i], Math.ceil(0), Math.floor(fin - 90)))
            inicio = fin - 90
        }else{
            arrayDatos.push(new objetoColoresinventario_prom_suc(colorFondoBarra[i], Math.ceil(inicio), Math.floor(fin - 90)))
            inicio = fin - 90
        };
    };
    
    function objetoColoresinventario_prom_suc(color, inicio, fin){
        this.color = color;
        this.inicio = inicio;
        this.fin = fin;
    };
    circulo.addEventListener('mousemove', (event) => {
        const { offsetX, offsetY } = event;
        const rect = circulo.getBoundingClientRect();
        const x = offsetX - rect.width / 2;
        const y = offsetY - rect.height / 2;
      
        const angle = (Math.atan2(y, x) * 180) / Math.PI;
        const degrees = (angle < 0 ? angle + 360 : angle);
      
        const color = obtenerColorSeccion(degrees);
      
        if (color) {
          ejecutarAccion(color);
        }
    });
    function obtenerColorSeccion(grados) {
        for (const array of arrayDatos) {
            if (grados >= array.inicio && grados < array.fin) {
                return array.color;
            }
        };
        return null;
    };
    function ejecutarAccion(color) {
        // Realiza la acción deseada según el color de la sección capturada
        switch (color) {
            case `${colorFondoBarra[0]}`:
                document.querySelector(nombre_suc).textContent = metodo_pago_detalle[0]
                document.querySelector(valor_suc).textContent = "S/" + modo_cobro[0].toFixed(2)
                document.querySelector(procentaje_suc).textContent = `${Math.round((modo_cobro[0]/totalNeto)*100)}% / ${num_oper[0]} oper.`
                break;
            case `${colorFondoBarra[1]}`:
                document.querySelector(nombre_suc).textContent = metodo_pago_detalle[1]
                document.querySelector(valor_suc).textContent = "S/" + modo_cobro[1].toFixed(2)
                document.querySelector(procentaje_suc).textContent = `${Math.round((modo_cobro[1]/totalNeto)*100)}% / ${num_oper[1]} oper.`
                break;
            case `${colorFondoBarra[2]}`:
                document.querySelector(nombre_suc).textContent = metodo_pago_detalle[2]
                document.querySelector(valor_suc).textContent = "S/" + modo_cobro[2].toFixed(2)
                document.querySelector(procentaje_suc).textContent = `${Math.round((modo_cobro[2]/totalNeto)*100)}% / ${num_oper[2]} oper.`
                break;
            case `${colorFondoBarra[3]}`:
                document.querySelector(nombre_suc).textContent = metodo_pago_detalle[3]
                document.querySelector(valor_suc).textContent = "S/" + modo_cobro[3].toFixed(2)
                document.querySelector(procentaje_suc).textContent = `${Math.round((modo_cobro[3]/totalNeto)*100)}% / ${num_oper[3]} oper.`
                break;
            default:
                document.querySelector(nombre_suc).textContent = "Total Venta"
                document.querySelector(valor_suc).textContent = "S/" + totalNeto.toFixed(2)
                document.querySelector(procentaje_suc).textContent = `100% / ${total_oper_neto} oper.`
                break;
        };
        
    };
};
function promCanalVenta(){
    let meses = 0;
    let suma_conteo = 0;
    let suma_delivery = 0;
    let abs_local = [];
    let abs_delivery = [];
    let total_local = 0;
    let total_delivery = 0;
    det_ve_gr.forEach((event)=>{
        suma_conteo += event.conteo
        suma_delivery += event.suma_delivery
    });
    for(let i = 0; i < document.getElementById("sucursal-principal").children.length; i++){
        let suma_local = 0;
        let suma_delivery = 0;
        det_ve_gr.forEach((event)=>{
            if(event.sucursal === Number(document.getElementById("sucursal-principal").children[i].value)){
                suma_local += (event.conteo - event.suma_delivery)
                suma_delivery += event.suma_delivery
            }
        });
        abs_local.push(suma_local)
        abs_delivery.push(suma_delivery)
    };
    abs_local.forEach((event)=>{
        total_local += event
    })
    abs_delivery.forEach((event)=>{
        total_delivery += event
    })
    document.querySelectorAll(".absoluto_local").forEach((event, i)=>{
        event.textContent = `${abs_local[i]} oper.`
        event.parentNode.children[2].textContent = `${abs_delivery[i]} oper.`
    })
    document.querySelectorAll(".porcentaje_local").forEach((event, i)=>{
        event.textContent = `${Math.round((abs_local[i]/(abs_local[i] + abs_delivery[i]))*100)}%`
        event.parentNode.children[2].textContent = `${Math.round((abs_delivery[i]/(abs_local[i] + abs_delivery[i]))*100)}%`
    })
    if((det_ve_gr[det_ve_gr.length-1].mes - det_ve_gr[0].mes) === 0){
        meses = 1
    }else{
        meses = (det_ve_gr[det_ve_gr.length-1].mes - det_ve_gr[0].mes)+1
    };
    document.getElementById("promedio_venta_local").textContent = `${(Math.round((suma_conteo - suma_delivery) / meses))} por mes`
    document.getElementById("promedio_venta_delivery").textContent = `${suma_delivery / meses} por mes`
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function cargarClientesId(id){
    let url = URL_API_almacen_central + `clientes/${id}`
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    cliente_id = await respuesta.json();
};
async function cargarDetalleSalidas(comprobante){
    let url = URL_API_almacen_central + `salidas_comprobante/${comprobante}`
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    detVentasComprobante = await respuesta.json();
};
async function cargarDetalleVentasGrafico(){
    let url = URL_API_almacen_central + `ventas_grafico`
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    det_ve_gr = await respuesta.json();
};
function modeloVenta(){
    document.querySelectorAll(".modoVenta").forEach((event)=>{
        if(event.parentNode.children[10].textContent === "0"){
            event.textContent = "Local"
        }else{
            event.textContent = "Delivery"
        }
    })
}
