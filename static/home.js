
document.addEventListener("DOMContentLoaded", inicioHome)
let anio_principal = ""
function inicioHome(){
    anio_principal = new Date().getFullYear()
    cargarFuncionesGraficos()
    cambiarAnio()
    btnHome = 1;
};
let ventasMensuales = []
let ventasMensualesSucursales = []
let stockSucursales = []
let ventasDiaSucursales = []
let sumaTotalEntradas = []
let colorFondoBarra = ["#E6CA7B","#91E69C","#6380E6","#E66E8D"];
let sucursalesLabel = ["Almacén Central", "Sucursal Uno", "Sucursal Dos", "Sucursal Tres"];

async function cargarFuncionesGraficos(){
    
    await cargarVentaMensual(anio_principal)
    await cargarVentaMensualSucursal(anio_principal)
    await cargarStockSucursal()
    await cargarVentaDiaSucursal()
    await cargarTotalEntradas(anio_principal)
    await cargarTotalSalidas(anio_principal)
    margenVenta()
    stockSucursal()

    totalVentasPorMes()
    totalVentasPorMesSucursal()

    avanceMensualPorSucursal()
    avanceDiarioPorSucursal()
    devolucionMensualPorSucursal()

    rotacionSucursal()
    leyendaSucursal();
}
function leyendaSucursal(){
    let leyenda = document.querySelectorAll(".color_leyenda_sucursales");
    leyenda.forEach((event, i)=>{
        event.style.background = `${colorFondoBarra[i]}`
    })
    let etiquetas_uno = document.querySelectorAll(".etiqueta_sucursal");
    etiquetas_uno.forEach((event, i)=>{
        event.textContent = suc_enc[i].sucursal_nombre
    })
    let etiquetas_dos = document.querySelectorAll(".color_total_sucursal");
    etiquetas_dos.forEach((event, i)=>{
        event.textContent = suc_enc[i].sucursal_nombre
    })
};
function stockSucursal(){
    let inventario_prom_suc = [stockSucursales[0].almacen_central,stockSucursales[0].sucursal_uno,stockSucursales[0].sucursal_dos,stockSucursales[0].sucursal_tres];
    let total = 0;
    let arrayDatos = [];
    inventario_prom_suc.forEach((event)=>{
        total +=event
    });

    document.querySelector(".nombre_circulo_sucursal").textContent = "Total Inventarios"
    document.querySelector(".valor_circulo_sucursal").textContent = "S/ " + total.toFixed(2)
    document.querySelector(".porcentaje_circulo_sucursal").textContent = "100%"

    let circulo = document.getElementById("circulo_stock_sucursal")
    circulo.style.background = `conic-gradient(${colorFondoBarra[0]} ${(inventario_prom_suc[0]/total)*360}deg, 
                                                ${colorFondoBarra[1]} ${(inventario_prom_suc[0]/total)*360}deg ${((inventario_prom_suc[0] + inventario_prom_suc[1])/total)*360}deg, 
                                                ${colorFondoBarra[2]} ${((inventario_prom_suc[0] + inventario_prom_suc[1])/total)*360}deg ${((inventario_prom_suc[0] + inventario_prom_suc[1] + inventario_prom_suc[2])/total)*360}deg, 
                                                ${colorFondoBarra[3]} ${((inventario_prom_suc[0] + inventario_prom_suc[1] + inventario_prom_suc[2])/total)*360}deg)`;
    circulo.addEventListener("mouseleave", ()=>{
        document.querySelector(".nombre_circulo_sucursal").textContent = "Total Inventarios"
        document.querySelector(".valor_circulo_sucursal").textContent = "S/ " + total.toFixed(2)
        document.querySelector(".porcentaje_circulo_sucursal").textContent = "100%"
    });
    let inicio = 271;
    let fin = 0;
    let suma = 0;
    for(let i = 0; i < inventario_prom_suc.length; i++){
        suma += inventario_prom_suc[i]
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
                document.querySelector(".nombre_circulo_sucursal").textContent = sucursalesLabel[0]
                document.querySelector(".valor_circulo_sucursal").textContent = "S/ " + inventario_prom_suc[0].toFixed(2)
                document.querySelector(".porcentaje_circulo_sucursal").textContent = Math.round((inventario_prom_suc[0]/total)*100)+ "%"
                break;
            case `${colorFondoBarra[1]}`:
                document.querySelector(".nombre_circulo_sucursal").textContent = sucursalesLabel[1]
                document.querySelector(".valor_circulo_sucursal").textContent = "S/ " + inventario_prom_suc[1].toFixed(2)
                document.querySelector(".porcentaje_circulo_sucursal").textContent = Math.round((inventario_prom_suc[1]/total)*100)+ "%"
                break;
            case `${colorFondoBarra[2]}`:
                document.querySelector(".nombre_circulo_sucursal").textContent = sucursalesLabel[2]
                document.querySelector(".valor_circulo_sucursal").textContent = "S/ " + inventario_prom_suc[2].toFixed(2)
                document.querySelector(".porcentaje_circulo_sucursal").textContent = Math.round((inventario_prom_suc[2]/total)*100)+ "%"
                break;
            case `${colorFondoBarra[3]}`:
                document.querySelector(".nombre_circulo_sucursal").textContent = sucursalesLabel[3]
                document.querySelector(".valor_circulo_sucursal").textContent = "S/ " + inventario_prom_suc[3].toFixed(2)
                document.querySelector(".porcentaje_circulo_sucursal").textContent = Math.round((inventario_prom_suc[3]/total)*100)+ "%"
                break;
            default:
                document.querySelector(".nombre_circulo_sucursal").textContent = "Total Inventarios"
                document.querySelector(".valor_circulo_sucursal").textContent = "S/ " + total.toFixed(2)
                document.querySelector(".porcentaje_circulo_sucursal").textContent = "100%"
                break;
        };
        
    };
};

//////////////////////////////////////////////////////////////////////////////
function margenVenta() {
    let margenVentas = 0;
    let margenVentasEsperado = 0;
    let sumaPrecioVenta = 0;
    let sumaCostoVenta = 0;
    let sumaPrecioVentaEsperado = 0;
    ventasMensuales.forEach((event)=>{
        sumaPrecioVenta += event.suma_ventas
        sumaCostoVenta += event.suma_costos
        sumaPrecioVentaEsperado += event.suma_ventas_esperado
    });
    margenVentas = ((1 - (sumaCostoVenta/sumaPrecioVenta)) * 100).toFixed(2)
    margenVentasEsperado = ((1 - (sumaCostoVenta/sumaPrecioVentaEsperado)) * 100).toFixed(2)
    let circulo = document.getElementById("circulo_stock_margen");
    circulo.style.background = `conic-gradient(#E6CA7B ${(1 - (sumaCostoVenta/sumaPrecioVenta)) * 360}deg, #E66E8D ${(1 - (sumaCostoVenta/sumaPrecioVenta)) * 360}deg)`;
    document.querySelector(".valor_circulo_margen").textContent = "S/"+(sumaPrecioVenta - sumaCostoVenta).toFixed(2)
    document.querySelector(".porcentaje_circulo_margen").textContent = margenVentas + "%"

    let circulo_esperado = document.getElementById("circulo_stock_margen_esperado");
    circulo_esperado.style.background = `conic-gradient(#E6CA7B ${(1 - (sumaCostoVenta/sumaPrecioVentaEsperado)) * 360}deg, #E66E8D ${(1 - (sumaCostoVenta/sumaPrecioVentaEsperado)) * 360}deg)`;
    document.querySelector(".valor_circulo_margen_esperado").textContent = "S/"+(sumaPrecioVentaEsperado - sumaCostoVenta).toFixed(2)
    document.querySelector(".porcentaje_circulo_margen_esperado").textContent = margenVentasEsperado + "%"

    let circulo_facturado = document.getElementById("circulo_stock_facturado");
    circulo_facturado.style.background = `conic-gradient(#E6CA7B ${((sumaPrecioVenta/sumaPrecioVentaEsperado)) * 360}deg, #6380E6 ${((sumaPrecioVenta/sumaPrecioVentaEsperado)) * 360}deg)`;
    document.querySelector(".valor_circulo_margen_facturado").textContent = "S/"+(sumaPrecioVenta).toFixed(2)
    document.querySelector(".porcentaje_circulo_margen_facturado").textContent = ((sumaPrecioVenta/sumaPrecioVentaEsperado)*100).toFixed(2) + "%"
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function avanceMensualPorSucursal(){
    let sucursales_numeracion = document.getElementById("sucursal-principal").children
    let arrayImporteStock = [];
    let sumaBarra = 0;
    for(let i = 0; i < sucursales_numeracion.length; i++){
        arrayImporteStock.push(0)
        ventasMensualesSucursales.forEach((event)=>{
            if(event.mes == new Date().getMonth()+1 && event.sucursal == sucursales_numeracion[i].value){
                arrayImporteStock[i] = event.suma_ventas
            }
        });
    };
    
    let masAlto = arrayImporteStock[0];
    arrayImporteStock.forEach((e)=>{
        if(masAlto < e){
            masAlto = e
        };
    });
    let barras = document.querySelectorAll(".pestana_uno")
    barras.forEach((event)=>{
        event.style.width = `${(arrayImporteStock[sumaBarra]/masAlto) * 110}px`
        event.style.background = `${colorFondoBarra[sumaBarra]}`
        event.style.transition = `width .6s`
        event.parentNode.children[1].textContent = Math.round(arrayImporteStock[sumaBarra]).toFixed(2)
        event.style.boxShadow = `0px 0px 5px 0px #6f6e6ee0`
        sumaBarra +=1
    });
};
function avanceDiarioPorSucursal(){
    let arrayImporteStock = [];
    let sumaBarra = 0;
    for(let i = 0; i < 4; i++){
        arrayImporteStock.push(0)
        ventasDiaSucursales.forEach((event)=>{
            if(event.sucursal == document.getElementById("sucursal-principal").children[i].value){
                arrayImporteStock[i] = event.suma_ventas_dia
            }
        });
    };
    
    let masAlto = arrayImporteStock[0];
    arrayImporteStock.forEach((e)=>{
        if(masAlto < e){
            masAlto = e
        };
    });
    let barras = document.querySelectorAll(".pestana_dos")
    barras.forEach((event)=>{
        event.style.width = `${(arrayImporteStock[sumaBarra]/masAlto) * 110}px`
        event.style.background = `${colorFondoBarra[sumaBarra]}`
        event.style.transition = `width .6s`
        event.parentNode.children[1].textContent = Math.round(arrayImporteStock[sumaBarra]).toFixed(2)
        event.style.boxShadow = `0px 0px 5px 0px #6f6e6ee0`
        sumaBarra +=1
    });
};
function devolucionMensualPorSucursal(){
    let sucursales_numeracion = document.getElementById("sucursal-principal").children
    let arrayImporteStock = [];
    let sumaBarra = 0;
    for(let i = 0; i < sucursales_numeracion.length; i++){
        arrayImporteStock.push(0)
        ventasMensualesSucursales.forEach((event)=>{
            if(event.mes == new Date().getMonth()+1 && event.sucursal == sucursales_numeracion[i].value){
                arrayImporteStock[i] = event.unidades_devueltas
            }
        });
    };
    let masAlto = arrayImporteStock[0];
    arrayImporteStock.forEach((e)=>{
        if(masAlto < e){
            masAlto = e
        };
    });
    let barras = document.querySelectorAll(".pestana_tres")
    barras.forEach((event)=>{
        event.style.width = `${(arrayImporteStock[sumaBarra]/masAlto) * 110}px`
        event.style.background = `${colorFondoBarra[sumaBarra]}`
        event.style.transition = `width .6s`
        event.parentNode.children[1].textContent = arrayImporteStock[sumaBarra]
        event.style.boxShadow = `0px 0px 5px 0px #6f6e6ee0`
        sumaBarra +=1
    });
};
async function rotacionSucursal(){
    let inventarios_uno = [];
    let inventarios_dos = [];
    let inventarios_tres = [];
    let inventarios_cuatro = [];

    let costo_venta_uno = 0;
    let costo_venta_dos = 0;
    let costo_venta_tres = 0;
    let costo_venta_cuatro = 0;

    let rotacionMes = []
    let valor_sucursal_principal = document.getElementById("sucursal-principal").children

    sumaTotalEntradas.forEach((event, i)=>{
        for(let j = 0; j < new Date().getMonth() + 1; j++){
            if(event.mes == j + 1 && event.sucursal == valor_sucursal_principal[0].value){
                sumaTotalSalidas.forEach((e)=>{
                    if(e.mes == j + 1 && e.sucursal == valor_sucursal_principal[0].value){
                        inventarios_uno.push(event.suma_total_entradas - e.suma_total_salidas)
                    }
                })
            }
            if(event.mes == j + 1 && event.sucursal == valor_sucursal_principal[1].value){
                sumaTotalSalidas.forEach((e)=>{
                    if(e.mes == j + 1 && e.sucursal == valor_sucursal_principal[1].value){
                        inventarios_dos.push(event.suma_total_entradas - e.suma_total_salidas)
                    }
                })
            }
            if(event.mes == j + 1 && event.sucursal == valor_sucursal_principal[2].value){
                sumaTotalSalidas.forEach((e)=>{
                    if(e.mes == j + 1 && e.sucursal == valor_sucursal_principal[2].value){
                        inventarios_tres.push(event.suma_total_entradas - e.suma_total_salidas)
                    }
                })
            }
            if(event.mes == j + 1 && event.sucursal == valor_sucursal_principal[3].value){
                sumaTotalSalidas.forEach((e)=>{
                    if(e.mes == j + 1 && e.sucursal == valor_sucursal_principal[3].value){
                        inventarios_cuatro.push(event.suma_total_entradas - e.suma_total_salidas)
                    }
                })
            }
        }
    });
    ventasMensualesSucursales.forEach((event)=>{
        if(event.sucursal == valor_sucursal_principal[0].value){
            costo_venta_uno += event.suma_costos;
        }
        if(event.sucursal == valor_sucursal_principal[1].value){
            costo_venta_dos += event.suma_costos;
        }
        if(event.sucursal == valor_sucursal_principal[2].value){
            costo_venta_tres += event.suma_costos;
        }
        if(event.sucursal == valor_sucursal_principal[3].value){
            costo_venta_cuatro += event.suma_costos;
        }
    });
    rotacionMes.push(inventarios_uno.length/(costo_venta_uno/((inventarios_uno[0] + inventarios_uno[inventarios_uno.length - 1]) / 2)))
    rotacionMes.push(inventarios_dos.length/(costo_venta_dos/((inventarios_dos[0] + inventarios_dos[inventarios_dos.length - 1]) / 2)))
    rotacionMes.push(inventarios_tres.length/(costo_venta_tres/((inventarios_tres[0] + inventarios_tres[inventarios_tres.length - 1]) / 2)))
    rotacionMes.push(inventarios_cuatro.length/(costo_venta_cuatro/((inventarios_cuatro[0] + inventarios_cuatro[inventarios_cuatro.length - 1]) / 2)))
    for(let i = 0; i < rotacionMes.length; i++){
        if(!isFinite(rotacionMes[i])){
            rotacionMes[i] = 0;
        };
    };
    let masAlto = 0;
    for(let i = 0; i < rotacionMes.length; i++){
        if(masAlto < rotacionMes[i]){
            masAlto = rotacionMes[i]
        };
    };
    let barras = document.querySelectorAll(".pestana_cuatro")
    barras.forEach((event, i)=>{
        event.style.width = `${ (rotacionMes[i]/masAlto) * 110}px`
        event.style.background = `${colorFondoBarra[i]}`
        event.style.transition = `width .6s`
        event.parentNode.children[1].textContent = Math.round(rotacionMes[i]) + "m"
        event.style.boxShadow = `0px 0px 5px 0px #6f6e6ee0`
    });
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function totalVentasPorMes(){
    let array_ventas_total = [];
    let array_costos_total = [];
    let masAlto = 0;
    let mes_alto = 0;
    let masBajo = 0;
    let mes_bajo = 0;
    let suma_mensual_ventas = 0
    document.querySelectorAll(".f_l_g").forEach((event, i)=>{
        event.textContent = arregloMeses[i];
    });
    for(let i = 0; i < 12; i++){
        array_ventas_total.push(0);
        array_costos_total.push(0);
        ventasMensuales.forEach((event)=>{
            
            if(event.mes == i + 1){
                suma_mensual_ventas += event.suma_ventas
                array_ventas_total[i] = event.suma_ventas;
                array_costos_total[i] = event.suma_costos;
            }
            if(masAlto < event.suma_ventas){
                masAlto = event.suma_ventas
                mes_alto = event.mes
            }
            if(masAlto < event.suma_costos){
                masAlto = event.suma_costos
            }
            masBajo = masAlto + 1
            if(masBajo > event.suma_ventas && event.suma_ventas > 0){
                masBajo = event.suma_ventas
                mes_bajo = event.mes
            }
        });
    };
    document.getElementById("menor_venta").textContent = `S/${(masBajo).toFixed(2)}`
    document.getElementById("mayor_venta").textContent = `S/${(masAlto).toFixed(2)}`
    document.getElementById("promedio_venta").textContent = `S/${(suma_mensual_ventas/ventasMensuales.length).toFixed(2)}`
    document.querySelector(".mes_max").textContent = `${meses_letras[mes_alto - 1]}-${new Date().getFullYear()}`
    document.querySelector(".mes_min").textContent = `${meses_letras[mes_bajo - 1]}-${new Date().getFullYear()}`
    let masAltoDos = (226 * masAlto)/214;
    document.querySelectorAll(".eje_y_numeracion").forEach((e)=>{
        e.textContent = Number(masAltoDos).toFixed(2)
        masAltoDos -= 0.20 * ((226 * masAlto)/214);
    });
    pintarGraficoPositivo(document.querySelectorAll(".cg_1_c"), array_ventas_total, masAlto, colorFondoBarra[0], document.querySelectorAll(".sg_1_c"))
    pintarGraficoPositivo(document.querySelectorAll(".cg_2_c"), array_costos_total, masAlto, colorFondoBarra[3], document.querySelectorAll(".sg_2_c"))
};
function totalVentasPorMesSucursal(){
    let arrayAC = [];
    let arraySU = [];
    let arraySD = [];
    let arrayST = [];
    let sumaMasAlto = 0;
    let valor_sucursal_principal = document.getElementById("sucursal-principal").children
    let suc_cero = 0;
    let suc_uno = 0;
    let suc_dos = 0;
    let suc_tres = 0;
    document.querySelectorAll(".f_l_g_s").forEach((event, i)=>{
        event.textContent = arregloMeses[i];
    });
    document.querySelectorAll(".color_item_grafico_sucursal").forEach((event, i)=>{
        event.style.background = `${colorFondoBarra[i]}`
        event.style.width = `20px`
        event.style.height = `10px`
        document.querySelectorAll(".descripcion_item_grafico_s")[i].textContent = array_sucursales[i]
    });
    for(let j = 0; j < 12; j++){
        arrayAC.push(0)
        arraySU.push(0)
        arraySD.push(0)
        arrayST.push(0)
        ventasMensualesSucursales.forEach((event)=>{
            if(event.sucursal == valor_sucursal_principal[0].value && event.mes == j + 1){
                arrayAC[j] = event.suma_ventas;
            };
            if(event.sucursal == valor_sucursal_principal[1].value && event.mes == j + 1){
                arraySU[j] = event.suma_ventas;
            };
            if(event.sucursal == valor_sucursal_principal[2].value && event.mes == j + 1){
                arraySD[j] = event.suma_ventas;
            };
            if(event.sucursal == valor_sucursal_principal[3].value && event.mes == j + 1){
                arrayST[j] = event.suma_ventas;
            };
            if(sumaMasAlto < event.suma_ventas){
                sumaMasAlto = event.suma_ventas
            };
        });
    };
    for(let i = 0; i < 12; i++){
        suc_cero += arrayAC[i]
        suc_uno += arraySU[i]
        suc_dos += arraySD[i]
        suc_tres += arrayST[i]
    }
    let total_venta_anual = suc_cero + suc_uno + suc_dos + suc_tres
    document.getElementById("circulo_total_cero").style.background = colorFondoBarra[0];
    document.querySelector(".valor_circulo_cero").textContent = `S/${suc_cero.toFixed(2)}`
    document.querySelector(".porcentaje_circulo_cero").textContent = `${((suc_cero/total_venta_anual)*100).toFixed(2)}%`
    document.getElementById("circulo_total_uno").style.background = colorFondoBarra[1];
    document.querySelector(".valor_circulo_uno").textContent = `S/${suc_uno.toFixed(2)}`
    document.querySelector(".porcentaje_circulo_uno").textContent = `${((suc_uno/total_venta_anual)*100).toFixed(2)}%`
    document.getElementById("circulo_total_dos").style.background = colorFondoBarra[2];
    document.querySelector(".valor_circulo_dos").textContent = `S/${suc_dos.toFixed(2)}`
    document.querySelector(".porcentaje_circulo_dos").textContent = `${((suc_dos/total_venta_anual)*100).toFixed(2)}%`
    document.getElementById("circulo_total_tres").style.background = colorFondoBarra[3];
    document.querySelector(".valor_circulo_tres").textContent = `S/${suc_tres.toFixed(2)}`
    document.querySelector(".porcentaje_circulo_tres").textContent = `${((suc_tres/total_venta_anual)*100).toFixed(2)}%`
    let masAltoDos = (226 * sumaMasAlto)/214;
    document.querySelectorAll(".eje_y_numeracion_s").forEach((e)=>{
        e.textContent = Number(masAltoDos).toFixed(2)
        masAltoDos -= 0.20 * ((226 * sumaMasAlto)/214);
    });
    pintarGraficoPositivo(document.querySelectorAll(".cg_1_c_s"), arrayAC, sumaMasAlto, colorFondoBarra[0], document.querySelectorAll(".sg_1_c_s"))
    pintarGraficoPositivo(document.querySelectorAll(".cg_2_c_s"), arraySU, sumaMasAlto, colorFondoBarra[1], document.querySelectorAll(".sg_2_c_s"))
    pintarGraficoPositivo(document.querySelectorAll(".cg_3_c_s"), arraySD, sumaMasAlto, colorFondoBarra[2], document.querySelectorAll(".sg_3_c_s"))
    pintarGraficoPositivo(document.querySelectorAll(".cg_4_c_s"), arrayST, sumaMasAlto, colorFondoBarra[3], document.querySelectorAll(".sg_4_c_s"))
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function cargarVentaMensual(anio){
    let url = URL_API_almacen_central + `salidas_suma_ventas_por_mes?`+
                                        `year_actual=${anio}`
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    ventasMensuales = await respuesta.json();
};
async function cargarVentaMensualSucursal(anio){
    let url = URL_API_almacen_central + `salidas_suma_ventas_por_mes_por_sucursal?`+
                                        `year_actual=${anio}`
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    ventasMensualesSucursales = await respuesta.json();
};
async function cargarStockSucursal(){
    let url = URL_API_almacen_central + `almacen_central_stock_sucursal`
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    stockSucursales = await respuesta.json();
};
async function cargarVentaDiaSucursal(){
    let url = URL_API_almacen_central + `salidas_suma_ventas_por_dia_por_sucursal`
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    ventasDiaSucursales = await respuesta.json();
};
async function cargarTotalEntradas(anio){
    let url = URL_API_almacen_central + `entradas_suma_total_mes?`+
                                        `year_actual=${anio}`
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    sumaTotalEntradas = await respuesta.json();
};
async function cargarTotalSalidas(anio){
    let url = URL_API_almacen_central + `salidas_suma_total_por_mes?`+
                                        `year_actual=${anio}`
    let respuesta  = await fetch(url, {
        "method": 'GET',
        "headers": {
            "Content-Type": 'application/json'
        }
    })
    sumaTotalSalidas = await respuesta.json();
};

/////////////////////////////////////////////////////////
let mapa_calor = ["#91ff85","#C6F556","#F5CF6F","#DE8B59","#FF666D"]
let array_categorias = [];
let array_codigos = [];
let array_totales = [];
let array_unidades = [];
let array_ganancias = [];

///////
let conteo_ventas = []

async function frecuenciaDeVentas(sucursal_id, anio){
    let cuadro_frecuencias = []
    let Array_anual = []
    
    let urlDos = URL_API_almacen_central + `ventas_conteo_montos?`+
                                            `sucursal_det_venta=${sucursal_id}&`+
                                            `year_actual=${anio}`
    let response  = await fetch(urlDos, {
                        "method": 'GET',
                        "headers": {
                            "Content-Type": 'application/json'
                            }
                    })
    conteo_ventas = await response.json();
    
    for(let i = 0; i < 12; i++){
        let array_mensual = []
        let tabla_frecuencias = {
            numero_datos: 0,
            max: 0,
            min: 0,
            intervalo: 0,
            amplitud: 0,
            limites: [],
            marca:[],
            frecuencia_absoluta:[],
            frecuencia_absoluta_acumulada:[],
            frecuencia_relativa:[],
            frecuencia_relativa_acumulada:[],
            frecuencia_por_marca:[],
            media: 0,
            mediana: 0,
            moda: 0
        }
        
        conteo_ventas.forEach((event)=>{
            if(event.mes == i + 1){
                array_mensual.push(event)
            }
        })
        tabla_frecuencias.numero_datos = array_mensual.length//conteo de datos

        array_mensual.forEach((event)=>{//tomamos el valor máximo
            if(tabla_frecuencias.max < event.total_venta){
                tabla_frecuencias.max = event.total_venta
            }
        })
        tabla_frecuencias.min = tabla_frecuencias.max
        array_mensual.forEach((event)=>{//tomamos el valor mínimo
            if(tabla_frecuencias.min > event.total_venta){
                tabla_frecuencias.min = event.total_venta
            }
        })
        tabla_frecuencias.intervalo = Math.ceil(1 + 3.3 * Math.log(tabla_frecuencias.numero_datos) / Math.log(10))
        tabla_frecuencias.amplitud = Math.round((tabla_frecuencias.max - tabla_frecuencias.min)/tabla_frecuencias.intervalo)
    
        let numero = tabla_frecuencias.min
        for(let i = 0; i < tabla_frecuencias.intervalo + 1; i++){
            tabla_frecuencias.limites.push(numero)
            numero+=tabla_frecuencias.amplitud
        }
    
        for(let i = 0; i < tabla_frecuencias.intervalo; i++){
            let num = 0;
            array_mensual.forEach((event)=>{
                if(i == tabla_frecuencias.intervalo - 1){
                    if(event.total_venta >= tabla_frecuencias.limites[i]){
                        num+=1
                    }
                }else if(i < tabla_frecuencias.intervalo - 1){
                    if(event.total_venta >= tabla_frecuencias.limites[i] && event.total_venta < (tabla_frecuencias.limites[i+1])){
                        num+=1
                    }
                }
                
            })
            tabla_frecuencias.marca.push((tabla_frecuencias.limites[i]+tabla_frecuencias.limites[i+1])/2)
            tabla_frecuencias.frecuencia_absoluta.push(num)
            let suma = 0;
            tabla_frecuencias.frecuencia_absoluta.forEach((event)=>{
                suma+= event
            })
            tabla_frecuencias.frecuencia_absoluta_acumulada.push(suma)
            tabla_frecuencias.frecuencia_relativa.push(Math.round((num/tabla_frecuencias.numero_datos)*100)/100)
            let suma_dos = 0;
            tabla_frecuencias.frecuencia_relativa.forEach((event)=>{
                suma_dos+= event
            })
            tabla_frecuencias.frecuencia_relativa_acumulada.push(Math.round(suma_dos*100)/100)
            tabla_frecuencias.frecuencia_por_marca.push(((tabla_frecuencias.limites[i]+tabla_frecuencias.limites[i+1])/2)*num)
        }
        //Media
        let suma = 0;
        tabla_frecuencias.frecuencia_por_marca.forEach((event)=>{
            suma += event
        })
        if(tabla_frecuencias.numero_datos > 0){
            tabla_frecuencias.media = Math.round(suma/tabla_frecuencias.numero_datos)
        }else{
            tabla_frecuencias.media = 0
        };
        
        //Mediana
        let ubicacion = Math.round(tabla_frecuencias.numero_datos/2)
        let temporal = 0;
        let posicion_absoluta_acumulada = 0;
        tabla_frecuencias.frecuencia_absoluta_acumulada.forEach((event, i)=>{
            if(i == 0){
                if(ubicacion > 0 && ubicacion <= event){
                    posicion_absoluta_acumulada = i
                }
            }else if(i > 0){
                if(ubicacion > temporal && ubicacion <= event){
                    posicion_absoluta_acumulada = i
                }
            }
            temporal = event;
        })

        if(posicion_absoluta_acumulada == 0){
            tabla_frecuencias.mediana = Math.round(tabla_frecuencias.limites[posicion_absoluta_acumulada]+
                                        ((ubicacion - 0)/tabla_frecuencias.frecuencia_absoluta[posicion_absoluta_acumulada])*
                                        tabla_frecuencias.amplitud)
        }else if(posicion_absoluta_acumulada > 0){
            tabla_frecuencias.mediana = Math.round(tabla_frecuencias.limites[posicion_absoluta_acumulada]+
                                        ((ubicacion - tabla_frecuencias.frecuencia_absoluta_acumulada[posicion_absoluta_acumulada - 1])/tabla_frecuencias.frecuencia_absoluta[posicion_absoluta_acumulada])*
                                        tabla_frecuencias.amplitud)
        }
        //Moda
        let mayor_frecuencia = 0;
        let mayor_frecuencia_i = 0;
        tabla_frecuencias.frecuencia_absoluta.forEach((event, i)=>{
            if(mayor_frecuencia < event){
                mayor_frecuencia = event
                mayor_frecuencia_i = i
            }
        })
        if(mayor_frecuencia_i == 0){
            tabla_frecuencias.moda = Math.round(tabla_frecuencias.limites[mayor_frecuencia_i]+
                                        ((tabla_frecuencias.frecuencia_absoluta[mayor_frecuencia_i] - 0)/((tabla_frecuencias.frecuencia_absoluta[mayor_frecuencia_i] - 0) + (tabla_frecuencias.frecuencia_absoluta[mayor_frecuencia_i] + tabla_frecuencias.frecuencia_absoluta[mayor_frecuencia_i + 1])))*
                                        tabla_frecuencias.amplitud)
        }else if(mayor_frecuencia_i > 0){
            tabla_frecuencias.moda = Math.round(tabla_frecuencias.limites[mayor_frecuencia_i]+
            ((tabla_frecuencias.frecuencia_absoluta[mayor_frecuencia_i] - tabla_frecuencias.frecuencia_absoluta[mayor_frecuencia_i - 1])/((tabla_frecuencias.frecuencia_absoluta[mayor_frecuencia_i] - tabla_frecuencias.frecuencia_absoluta[mayor_frecuencia_i - 1]) + (tabla_frecuencias.frecuencia_absoluta[mayor_frecuencia_i] + tabla_frecuencias.frecuencia_absoluta[mayor_frecuencia_i + 1])))*
            tabla_frecuencias.amplitud)
        }

        Array_anual.push(tabla_frecuencias)
    };

    for(let i = 0; i < 12; i++){
        let num = 0;
        conteo_ventas.forEach((event)=>{
            if(event.mes == i + 1){
                num += 1
            }
        })
        cuadro_frecuencias.push(num)
    }
    document.getElementById("opciones_frecuencias").addEventListener("change", ()=>{
        let indice = document.getElementById("opciones_frecuencias").value
        if(Array_anual[indice].numero_datos > 0){
            
            let html = "";
            for(let i = 0; i < Array_anual[indice].intervalo; i++){
                let fila = `
                        <tr>
                            <td class="categoria_anual">${Array_anual[indice].limites[i]}-${Array_anual[indice].limites[i + 1]}</td>
                            <td style="text-align: end;font-size: 14px;">${Array_anual[indice].marca[i]}</td>
                            <td style="text-align: end;font-size: 14px;">${Array_anual[indice].frecuencia_absoluta[i]}</td>
                            <td style="text-align: end;font-size: 14px;">${Array_anual[indice].frecuencia_absoluta_acumulada[i]}</td>
                            <td style="text-align: end;font-size: 14px;">${Array_anual[indice].frecuencia_relativa[i]}</td>
                            <td style="text-align: end;font-size: 14px;">${Array_anual[indice].frecuencia_relativa_acumulada[i]}</td>
                            <td style="text-align: end;font-size: 14px;">${Array_anual[indice].frecuencia_por_marca[i]}</td>
                            <td style="text-align: end;font-size: 14px;">${Array_anual[indice].marca[i] - Array_anual[indice].media}</td>
                            <td style="text-align: end;font-size: 14px;">${(Array_anual[indice].marca[i] - Array_anual[indice].media)**2}</td>
                            <td style="text-align: end;font-size: 14px;">${((Array_anual[indice].marca[i] - Array_anual[indice].media)**2) * Array_anual[indice].frecuencia_absoluta[i]}</td>
                        </tr>`
                html = html + fila;
            }; 
            document.querySelector("#tabla_frecuencias > tbody").outerHTML = html;
        }else{
            document.getElementById("opciones_frecuencias").value = 100
            alert("No se encontraron datos.")
        }
        
    });

    
    let fila = `
            <tr>
                <td style="text-align: end;width: 80px;font-size: 14px;">${Array_anual[0].media}</td>
                <td style="text-align: end;width: 80px;font-size: 14px;">${Array_anual[1].media}</td>
                <td style="text-align: end;width: 80px;font-size: 14px;">${Array_anual[2].media}</td>
                <td style="text-align: end;width: 80px;font-size: 14px;">${Array_anual[3].media}</td>
                <td style="text-align: end;width: 80px;font-size: 14px;">${Array_anual[4].media}</td>
                <td style="text-align: end;width: 80px;font-size: 14px;">${Array_anual[5].media}</td>
                <td style="text-align: end;width: 80px;font-size: 14px;">${Array_anual[6].media}</td>
                <td style="text-align: end;width: 80px;font-size: 14px;">${Array_anual[7].media}</td>
                <td style="text-align: end;width: 80px;font-size: 14px;">${Array_anual[8].media}</td>
                <td style="text-align: end;width: 80px;font-size: 14px;">${Array_anual[9].media}</td>
                <td style="text-align: end;width: 80px;font-size: 14px;">${Array_anual[10].media}</td>
                <td style="text-align: end;width: 80px;font-size: 14px;">${Array_anual[11].media}</td>
            </tr>`

    document.querySelector("#tabla_ticket_promedio > tbody").outerHTML = fila;
};

/* document.getElementById("estadistica_ventas_categoria").addEventListener("click", async ()=>{ */
async function estadisticasSucursal(sucursa_id, anio){
    array_categorias = [];
    let mayor_venta_monto = 0;
    let mayor_venta_monto_relativo = 0;
    let mayor_venta_unidad = 0;
    let mayor_venta_unidad_relativo = 0;
    let mayor_ganancia = 0;
    let mayor_ganancia_relativo = 0;
    let mayor_recurrencia = 0;
    let mayor_recurrencia_relativo = 0;
    array_totales = [];
    array_unidades = [];
    array_ganancias = [];
    let nuevo_array_categorias = [];
    let tabla = ""

    let cuadro_frecuencias = [];


    document.getElementById("opciones_categorias").value = 0
    document.getElementById("opciones_frecuencias").value = 100
    document.getElementById("opciones_codigos").value = 0
    document.getElementById("tit_monto").textContent = ""

    document.querySelector("#tabla_frecuencias > tbody").remove()
    document.querySelector("#tabla_frecuencias").createTBody()
    document.querySelector("#tabla_codigos_venta > tbody").remove()
    document.querySelector("#tabla_codigos_venta").createTBody()
    document.querySelectorAll(".total_mes_sucursal").forEach((event)=>{
        event.textContent = ""
    })
    document.querySelectorAll(".total_mes_categoria").forEach((event)=>{
        event.textContent = ""
    })

    
    let url = URL_API_almacen_central + `salidas_categorias_sucursal?`+
                                        `sucursal_salidas=${sucursa_id}&`+
                                        `year_actual=${anio}`
    let response  = await fetch(url, {
                        "method": 'GET',
                        "headers": {
                            "Content-Type": 'application/json'
                            }
                    })
    array_categorias = await response.json();

    for(let i = 0;i < 12; i++){//FOOTER
        let suma_montos_mes = 0;
        let suma_unidades_mes = 0;
        let suma_ganacias_mes = 0;
        array_categorias.forEach((event)=>{
            if(event.mes == i + 1){
                suma_montos_mes += event.suma_ventas
                suma_ganacias_mes += event.suma_ventas - event.suma_costos
                suma_unidades_mes += event.suma_unidades
            }
        })
        array_totales.push(suma_montos_mes)
        array_unidades.push(suma_unidades_mes)
        array_ganancias.push(suma_ganacias_mes)
    };
    for(let i = 0; i < 12; i++){
        let num = 0;
        conteo_ventas.forEach((event)=>{
            if(event.mes == i + 1){
                num += 1
            }
        })
        cuadro_frecuencias.push(num)
    }

    array_categorias.forEach((event)=>{
        if(event.suma_ventas > mayor_venta_monto){
            mayor_venta_monto = event.suma_ventas
        }
        if(event.suma_ventas/array_totales[event.mes - 1] > mayor_venta_monto_relativo){
            mayor_venta_monto_relativo = event.suma_ventas/array_totales[event.mes - 1]
        }
        if(event.suma_ventas - event.suma_costos > mayor_ganancia){
            mayor_ganancia = event.suma_ventas - event.suma_costos
        }
        if((event.suma_ventas - event.suma_costos)/array_ganancias[event.mes - 1] > mayor_ganancia_relativo){
            mayor_ganancia_relativo = (event.suma_ventas - event.suma_costos)/array_ganancias[event.mes - 1]
        }
        if(event.suma_unidades > mayor_venta_unidad){
            mayor_venta_unidad = event.suma_unidades
        }
        if(event.suma_unidades/array_unidades[event.mes - 1] > mayor_venta_unidad_relativo){
            mayor_venta_unidad_relativo = event.suma_unidades/array_unidades[event.mes - 1]
        }
        if(event.suma_veces > mayor_recurrencia){
            mayor_recurrencia = event.suma_veces
        }
        if(event.suma_veces/cuadro_frecuencias[event.mes - 1] > mayor_recurrencia_relativo){
            mayor_recurrencia_relativo = event.suma_veces/cuadro_frecuencias[event.mes - 1]
        }
    });

    let nuevo_objeto = {};
    nuevo_array_categorias = array_categorias.filter(obj => {//eliminamos categorías repetidas
        if (!nuevo_objeto[obj.categoria_nombre]) {
            nuevo_objeto[obj.categoria_nombre] = true;
            return true;
        }
        return false;
    });

    
    if(nuevo_array_categorias.length > 0){
        let html = ''
        for(categoria of nuevo_array_categorias){
            let fila = `
                    <tr>
                        <td class="categoria_anual">${categoria.categoria_nombre}</td>
                        <td style="text-align: end;color: #000;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: end;color: #000;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: end;color: #000;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: end;color: #000;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: end;color: #000;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: end;color: #000;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: end;color: #000;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: end;color: #000;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: end;color: #000;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: end;color: #000;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: end;color: #000;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: end;color: #000;width: 80px;font-size: 14px;"></td>
                        <td class="total_categoria" style="text-align: end;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: center;width: 40px;">
                            <span onclick="llamarDetalleVentaProductos(${categoria.categoria}, ${categoria.sucursal}, ${document.getElementById("anio_referencia").value})" style="font-size:18px;" class="material-symbols-outlined myButtonEditar">play_arrow</span>
                        </td>
                    </tr>`
            html = html + fila;
        }; 
        document.querySelector("#tabla_categorias_venta > tbody").outerHTML = html;

        document.getElementById("opciones_categorias").addEventListener("change", ()=>{
            let num = 0;
            let param = 0;
            tabla = document.querySelector("#tabla_categorias_venta > tbody").children
            for(let i = 0; i < tabla.length; i++){
                let suma_ventas = 0;

                array_categorias.forEach((event) =>{
                    if(tabla[i].children[0].textContent == event.categoria_nombre){
                        if(document.getElementById("opciones_categorias").value == 1){
                            num = mayor_venta_monto
                            tabla[i].children[event.mes].textContent = event.suma_ventas.toFixed(2)
                            param = event.suma_ventas
                        }else if(document.getElementById("opciones_categorias").value == 2){
                            num = mayor_venta_monto_relativo
                            tabla[i].children[event.mes].textContent = `${((event.suma_ventas/array_totales[event.mes - 1])*100).toFixed(2)}%`
                            param = event.suma_ventas/array_totales[event.mes - 1]
                        }else if(document.getElementById("opciones_categorias").value == 3){
                            num = mayor_ganancia
                            tabla[i].children[event.mes].textContent = (event.suma_ventas - event.suma_costos).toFixed(2)
                            param = event.suma_ventas - event.suma_costos
                        }else if(document.getElementById("opciones_categorias").value == 4){
                            num = mayor_ganancia_relativo
                            tabla[i].children[event.mes].textContent = `${(((event.suma_ventas - event.suma_costos)/array_ganancias[event.mes - 1])*100).toFixed(2)}%`
                            param = (event.suma_ventas - event.suma_costos)/array_ganancias[event.mes - 1]
                        }else if(document.getElementById("opciones_categorias").value == 5){
                            num = mayor_venta_unidad
                            tabla[i].children[event.mes].textContent = event.suma_unidades
                            param = event.suma_unidades
                        }else if(document.getElementById("opciones_categorias").value == 6){
                            num = mayor_venta_unidad_relativo
                            tabla[i].children[event.mes].textContent = `${((event.suma_unidades/array_unidades[event.mes - 1])*100).toFixed(2)}%`
                            param = event.suma_unidades/array_unidades[event.mes - 1]
                        }else if(document.getElementById("opciones_categorias").value == 7){
                            num = mayor_recurrencia
                            tabla[i].children[event.mes].textContent = event.suma_veces
                            param = event.suma_veces
                        }else if(document.getElementById("opciones_categorias").value == 8){
                            num = mayor_recurrencia_relativo
                            tabla[i].children[event.mes].textContent = `${((event.suma_veces/cuadro_frecuencias[event.mes - 1])*100).toFixed(2)}%`
                            param = event.suma_veces/cuadro_frecuencias[event.mes - 1]
                        }else{
                            num = 0
                            tabla[i].children[event.mes].textContent = ``
                            param = 0
                        }
                        
                        if(param <= num * 0.20){
                            tabla[i].children[event.mes].style.background = mapa_calor[0]
                        }else if(param <= num * 0.40){
                            tabla[i].children[event.mes].style.background = mapa_calor[1]
                        }else if(param <= num * 0.60){
                            tabla[i].children[event.mes].style.background = mapa_calor[2]
                        }else if(param <= num * 0.80){
                            tabla[i].children[event.mes].style.background = mapa_calor[3]
                        }else if(param <= num * 1){
                            tabla[i].children[event.mes].style.background = mapa_calor[4]
                        }
                        suma_ventas += event.suma_ventas
                    }
                });

                let suma_mes_cat = 0;
                let suma_mes_cero = 0;
                for(let j = 1; j <= 12; j++){
                    let num = tabla[i].children[j].textContent.replace("%", "")
                    if(num !== ""){
                        suma_mes_cat += Number(num)
                        suma_mes_cero +=1
                    }
                };
                if(document.getElementById("opciones_categorias").value == 2 ||
                document.getElementById("opciones_categorias").value == 4 ||
                document.getElementById("opciones_categorias").value == 6 ||
                document.getElementById("opciones_categorias").value == 8){
                    tabla[i].children[13].textContent  = `${(suma_mes_cat/suma_mes_cero).toFixed(2)}%`
                    document.querySelector("#tabla_categorias_venta > thead > tr:nth-child(3) > th:nth-child(14)").textContent = "Promedio"
                }else if(document.getElementById("opciones_categorias").value == 7 ||
                document.getElementById("opciones_categorias").value == 5){
                    tabla[i].children[13].textContent  = suma_mes_cat
                    document.querySelector("#tabla_categorias_venta > thead > tr:nth-child(3) > th:nth-child(14)").textContent = "Total"
                }else{
                    tabla[i].children[13].textContent  = suma_mes_cat.toFixed(2)
                    document.querySelector("#tabla_categorias_venta > thead > tr:nth-child(3) > th:nth-child(14)").textContent = "Total"
                }
            };

            document.querySelectorAll(".total_mes_sucursal").forEach((event, x)=>{
                let sum = 0;
                let suma_mayor_cero = 0;
                for(let i = 0; i < tabla.length; i++){
                    let num = tabla[i].children[x + 1].textContent.replace("%", "")
                    if(num !== ""){
                        sum += Number(num)
                        suma_mayor_cero +=1
                    }
                }
                
                if(document.getElementById("opciones_categorias").value == 2 ||
                document.getElementById("opciones_categorias").value == 4 ||
                document.getElementById("opciones_categorias").value == 6){
                    event.textContent = `${sum.toFixed(2)}%`
                    if(x == 12){
                        event.textContent = ``
                    }
                    document.querySelector("#tabla_categorias_venta > tfoot > tr > th:nth-child(1)").textContent = "Total"
                }else if(document.getElementById("opciones_categorias").value == 8){
                    event.textContent = ``
                    if(x == 12){
                        event.textContent = ``
                    }
                    document.querySelector("#tabla_categorias_venta > tfoot > tr > th:nth-child(1)").textContent = ""
                }else if(document.getElementById("opciones_categorias").value == 7){
                    event.textContent = cuadro_frecuencias[x]
                    document.querySelector("#tabla_categorias_venta > tfoot > tr > th:nth-child(1)").textContent = "Total"
                }else if(document.getElementById("opciones_categorias").value == 5){
                    event.textContent = sum
                    document.querySelector("#tabla_categorias_venta > tfoot > tr > th:nth-child(1)").textContent = "Total"
                }else{
                    event.textContent = sum.toFixed(2)
                    document.querySelector("#tabla_categorias_venta > tfoot > tr > th:nth-child(1)").textContent = "Total"
                }
                
            })
        });
    };
};

async function llamarDetalleVentaProductos(categoria_id, sucursal_id, anio){

    array_codigos = [];
    let mayor_venta_monto = 0;
    let mayor_venta_monto_relativo = 0;
    let mayor_venta_unidad = 0;
    let mayor_venta_unidad_relativo = 0;
    let mayor_venta_ganancia = 0;
    let mayor_venta_ganancia_relativo = 0;
    let mayor_venta_recurrencia = 0;
    let mayor_venta_recurrencia_relativo = 0;
    let mayor_venta_devolucion = 0;
    let mayor_venta_devolucion_relativo = 0;
    let array_totales_unidad = [];
    let tabla = ""

    let cuadro_frecuencias = [];

    document.getElementById("opciones_codigos").value = 0

    let url = URL_API_almacen_central + `salidas_productos_sucursal?`+
                                        `sucursal_salidas=${sucursal_id}&`+
                                        `categoria_salidas=${categoria_id}&`+
                                        `year_actual=${anio}`
    let response  = await fetch(url, {
                        "method": 'GET',
                        "headers": {
                            "Content-Type": 'application/json'
                            }
                    })
    array_codigos = await response.json();
console.log(array_codigos)
    for(let i = 0;i < 12; i++){//FOOTER
        let suma_unidades_mes = 0;
        array_codigos.forEach((event)=>{
            if(event.mes == i + 1){
                suma_unidades_mes += event.suma_unidades
            }
        })
        array_totales_unidad.push(suma_unidades_mes)
    };
    for(let i = 0; i < 12; i++){
        let num = 0;
        conteo_ventas.forEach((event)=>{
            if(event.mes == i + 1){
                num += 1
            }
        })
        cuadro_frecuencias.push(num)
    };
    array_codigos.forEach((event)=>{
        if(event.suma_ventas > mayor_venta_monto){
            mayor_venta_monto = event.suma_ventas
        }
        if(event.suma_ventas/array_totales[event.mes - 1] > mayor_venta_monto_relativo){
            mayor_venta_monto_relativo = event.suma_ventas/array_totales[event.mes - 1]
        }
        if(event.suma_ventas - event.suma_costos > mayor_venta_ganancia){
            mayor_venta_ganancia = event.suma_ventas - event.suma_costos
        }
        if((event.suma_ventas - event.suma_costos)/array_ganancias[event.mes - 1] > mayor_venta_ganancia_relativo){
            mayor_venta_ganancia_relativo = (event.suma_ventas - event.suma_costos)/array_ganancias[event.mes - 1]
        }
        if(event.suma_unidades > mayor_venta_unidad){
            mayor_venta_unidad = event.suma_unidades
        }
        if(event.suma_unidades/array_unidades[event.mes - 1] > mayor_venta_unidad_relativo){
            mayor_venta_unidad_relativo = event.suma_unidades/array_unidades[event.mes - 1]
        }
        if(event.suma_veces > mayor_venta_recurrencia){
            mayor_venta_recurrencia = event.suma_veces
        }
        if(event.suma_veces/cuadro_frecuencias[event.mes - 1] > mayor_venta_recurrencia_relativo){
            mayor_venta_recurrencia_relativo = event.suma_veces/cuadro_frecuencias[event.mes - 1]
        }
        if(event.suma_unidades_dev > mayor_venta_devolucion){
            mayor_venta_devolucion = event.suma_unidades_dev
        }
        if(event.suma_unidades_dev/(event.suma_unidades + event.suma_unidades_dev) > mayor_venta_devolucion_relativo){
            mayor_venta_devolucion_relativo = event.suma_unidades_dev/(event.suma_unidades + event.suma_unidades_dev)
        }
    });

    let nuevo_objeto = {};
    let nuevo_array_codigos = array_codigos.filter(obj => {//eliminamos códigos repetidos
        if (!nuevo_objeto[obj.codigo]) {
            nuevo_objeto[obj.codigo] = true;
            return true;
        }
        return false;
    });

    document.getElementById("tit_monto").textContent = array_codigos[0].categoria_nombre
    let html_monto = ''

    if(nuevo_array_codigos.length > 0){
        for(cod of nuevo_array_codigos){
            let fila = `
                    <tr>
                        <td style="width: 120px;">${cod.codigo}</td>
                        <td style="text-align: end;color: #000;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: end;color: #000;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: end;color: #000;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: end;color: #000;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: end;color: #000;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: end;color: #000;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: end;color: #000;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: end;color: #000;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: end;color: #000;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: end;color: #000;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: end;color: #000;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: end;color: #000;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: end;width: 80px;font-size: 14px;"></td>
                        <td style="text-align: center;width: 40px;">
                            <span onclick="graficoRadar('${cod.codigo}')" style="font-size:18px;" class="material-symbols-outlined myButtonEditar">play_arrow</span>
                        </td>
                    </tr>`
            html_monto = html_monto + fila;
        }; 
        document.querySelector("#tabla_codigos_venta > tbody").outerHTML = html_monto;

        tabla = document.querySelector("#tabla_codigos_venta > tbody").children
        document.getElementById("opciones_codigos").addEventListener("change", ()=>{
            let num = 0;
            let param = 0;
            for(let i = 0; i < tabla.length; i++){
                let suma_ventas = 0;
                array_codigos.forEach((event) =>{
                    if(tabla[i].children[0].textContent == event.codigo){
                        if(document.getElementById("opciones_codigos").value == 1){
                            num = mayor_venta_monto
                            tabla[i].children[event.mes].textContent = event.suma_ventas.toFixed(2)
                            param = event.suma_ventas
                        }else if(document.getElementById("opciones_codigos").value == 2){
                            num = mayor_venta_monto_relativo
                            tabla[i].children[event.mes].textContent = `${((event.suma_ventas/array_totales[event.mes - 1])*100).toFixed(2)}%`
                            param = event.suma_ventas/array_totales[event.mes - 1]
                        }else if(document.getElementById("opciones_codigos").value == 3){
                            num = mayor_venta_ganancia
                            tabla[i].children[event.mes].textContent = (event.suma_ventas - event.suma_costos).toFixed(2)
                            param = event.suma_ventas - event.suma_costos
                        }else if(document.getElementById("opciones_codigos").value == 4){
                            num = mayor_venta_ganancia_relativo
                            tabla[i].children[event.mes].textContent = `${(((event.suma_ventas - event.suma_costos)/array_ganancias[event.mes - 1])*100).toFixed(2)}%`
                            param = (event.suma_ventas - event.suma_costos)/array_ganancias[event.mes - 1]
                        }else if(document.getElementById("opciones_codigos").value == 5){
                            num = mayor_venta_unidad
                            tabla[i].children[event.mes].textContent = event.suma_unidades
                            param = event.suma_unidades
                        }else if(document.getElementById("opciones_codigos").value == 6){
                            num = mayor_venta_unidad_relativo
                            tabla[i].children[event.mes].textContent = `${((event.suma_unidades/array_unidades[event.mes - 1])*100).toFixed(2)}%`
                            param = event.suma_unidades/array_unidades[event.mes - 1]
                        }else if(document.getElementById("opciones_codigos").value == 7){
                            num = mayor_venta_recurrencia
                            tabla[i].children[event.mes].textContent = event.suma_veces
                            param = event.suma_veces
                        }else if(document.getElementById("opciones_codigos").value == 8){
                            num = mayor_venta_recurrencia_relativo
                            tabla[i].children[event.mes].textContent = `${((event.suma_veces/cuadro_frecuencias[event.mes - 1])*100).toFixed(2)}%`
                            param = event.suma_veces/cuadro_frecuencias[event.mes - 1]
                        }else if(document.getElementById("opciones_codigos").value == 9){
                            num = mayor_venta_devolucion
                            tabla[i].children[event.mes].textContent = event.suma_unidades_dev
                            param = event.suma_unidades_dev
                        }else if(document.getElementById("opciones_codigos").value == 10){
                            num = mayor_venta_devolucion_relativo
                            tabla[i].children[event.mes].textContent = `${((event.suma_unidades_dev/(event.suma_unidades + event.suma_unidades_dev))*100).toFixed(2)}%`
                            param = event.suma_unidades_dev/(event.suma_unidades + event.suma_unidades_dev)
                        }else{
                            num = 0
                            tabla[i].children[event.mes].textContent = ``
                            param = 0
                        }
                        
                        if(param <= num * 0.20){
                            tabla[i].children[event.mes].style.background = mapa_calor[0]
                        }else if(param <= num * 0.40){
                            tabla[i].children[event.mes].style.background = mapa_calor[1]
                        }else if(param <= num * 0.60){
                            tabla[i].children[event.mes].style.background = mapa_calor[2]
                        }else if(param <= num * 0.80){
                            tabla[i].children[event.mes].style.background = mapa_calor[3]
                        }else if(param <= num * 1){
                            tabla[i].children[event.mes].style.background = mapa_calor[4]
                        }
                        suma_ventas += event.suma_ventas
                    }
                })

                let suma_mes_cat = 0;
                let suma_mes_cero = 0;
                for(let j = 1; j <= 12; j++){
                    let num = tabla[i].children[j].textContent.replace("%", "")
                    if(num !== ""){
                        suma_mes_cat += Number(num)
                        suma_mes_cero +=1
                    }
                };
                if(document.getElementById("opciones_codigos").value == 2 ||
                document.getElementById("opciones_codigos").value == 4 ||
                document.getElementById("opciones_codigos").value == 6 ||
                document.getElementById("opciones_codigos").value == 8 ||
                document.getElementById("opciones_codigos").value == 10){
                    tabla[i].children[13].textContent  = `${(suma_mes_cat/suma_mes_cero).toFixed(2)}%`
                    document.querySelector("#tabla_codigos_venta > thead > tr:nth-child(3) > th:nth-child(14)").textContent = "Promedio"
                }else if(document.getElementById("opciones_codigos").value == 5 ||
                document.getElementById("opciones_codigos").value == 7 ||
                document.getElementById("opciones_codigos").value == 9){
                    tabla[i].children[13].textContent = suma_mes_cat
                    document.querySelector("#tabla_codigos_venta > thead > tr:nth-child(3) > th:nth-child(14)").textContent = "Total"
                }else{
                    tabla[i].children[13].textContent  = suma_mes_cat.toFixed(2)
                    document.querySelector("#tabla_codigos_venta > thead > tr:nth-child(3) > th:nth-child(14)").textContent = "Total"
                }
            }

            document.querySelectorAll(".total_mes_categoria").forEach((event, x)=>{
                let sum = 0;
                let suma_mayor_cero = 0;
                for(let i = 0; i < tabla.length; i++){
                    let num = tabla[i].children[x + 1].textContent.replace("%", "")
                    if(num !== ""){
                        sum += Number(num)
                        suma_mayor_cero +=1
                    }
                }
                if(document.getElementById("opciones_codigos").value == 10 ||
                document.getElementById("opciones_codigos").value == 8){
                    event.textContent = ``
                    document.querySelector("#tabla_codigos_venta > tfoot > tr > th:nth-child(1)").textContent = ""
                }else if(document.getElementById("opciones_codigos").value == 2 ||
                document.getElementById("opciones_codigos").value == 4 ||
                document.getElementById("opciones_codigos").value == 6){
                    event.textContent = `${sum.toFixed(2)}%`
                    if(x == 12){
                        event.textContent = ``
                    }
                    document.querySelector("#tabla_codigos_venta > tfoot > tr > th:nth-child(1)").textContent = "Total"
                }else if(document.getElementById("opciones_codigos").value == 5 ||
                document.getElementById("opciones_codigos").value == 9){
                    event.textContent = sum
                    document.querySelector("#tabla_codigos_venta > tfoot > tr > th:nth-child(1)").textContent = "Total"
                }else if(document.getElementById("opciones_codigos").value == 7){
                    event.textContent = cuadro_frecuencias[x]
                    document.querySelector("#tabla_codigos_venta > tfoot > tr > th:nth-child(1)").textContent = "Total"
                }else{
                    event.textContent = sum.toFixed(2)
                    document.querySelector("#tabla_codigos_venta > tfoot > tr > th:nth-child(1)").textContent = "Total"
                }
            })
        });
    };
};
////////////////////////////////////////////////////////////
document.querySelectorAll(".suc_estad").forEach((event, i)=>{
    event.addEventListener("click", (e)=>{
        document.querySelectorAll(".suc_estad")[0].classList.remove("marcaBoton")
        document.querySelectorAll(".suc_estad")[1].classList.remove("marcaBoton")
        document.querySelectorAll(".suc_estad")[2].classList.remove("marcaBoton")
        document.querySelectorAll(".suc_estad")[3].classList.remove("marcaBoton")
        let valor_sucursal_principal = document.getElementById("sucursal-principal").children
        if(i === 0){
            frecuenciaDeVentas(valor_sucursal_principal[i].value, anio_principal)
            estadisticasSucursal(valor_sucursal_principal[i].value, anio_principal)
            event.classList.add("marcaBoton")
        }else if(i === 1){
            frecuenciaDeVentas(valor_sucursal_principal[i].value, anio_principal)
            estadisticasSucursal(valor_sucursal_principal[i].value, anio_principal)
            event.classList.add("marcaBoton")
        }else if(i === 2){
            frecuenciaDeVentas(valor_sucursal_principal[i].value, anio_principal)
            estadisticasSucursal(valor_sucursal_principal[i].value, anio_principal)
            event.classList.add("marcaBoton")
        }else if(i === 3){
            frecuenciaDeVentas(valor_sucursal_principal[i].value, anio_principal)
            estadisticasSucursal(valor_sucursal_principal[i].value, anio_principal)
            event.classList.add("marcaBoton")
        };
    })
});
////////////////////////////////////////////////////////////

function cambiarAnio(){
    let anio_referencia = document.getElementById("anio_referencia")
    anio_referencia.value = new Date().getFullYear()
    anio_referencia.setAttribute("max", new Date().getFullYear())
    let suma = 0;
    document.getElementById("suma_anio").addEventListener("click", ()=>{
        if(anio_referencia.value < new Date().getFullYear()){
            suma += 1;
            anio_referencia.value = new Date().getFullYear() + suma
        }
    })
    document.getElementById("resta_anio").addEventListener("click", ()=>{
        suma -= 1;
        anio_referencia.value = new Date().getFullYear() + suma
    })
    document.getElementById("cargar_datos_anio").addEventListener("click", ()=>{
        anio_principal = anio_referencia.value;
        document.getElementById("opciones_categorias").value = 0
        document.getElementById("opciones_frecuencias").value = 100
        document.getElementById("opciones_codigos").value = 0
        document.getElementById("tit_monto").textContent = ""

        document.querySelector("#tabla_frecuencias > tbody").remove()
        document.querySelector("#tabla_frecuencias").createTBody()
        document.querySelector("#tabla_codigos_venta > tbody").remove()
        document.querySelector("#tabla_codigos_venta").createTBody()
        document.querySelector("#tabla_categorias_venta > tbody").remove()
        document.querySelector("#tabla_categorias_venta").createTBody()
        document.querySelectorAll(".total_mes_sucursal").forEach((event)=>{
            event.textContent = ""
        })
        document.querySelectorAll(".total_mes_categoria").forEach((event)=>{
            event.textContent = ""
        })

        cargarFuncionesGraficos()

        alert(`Datos del año ${anio_principal} cargados.`)
    })
}
///////////////////////////////////////////////
function graficoRadar(codigo_ref){
    let array_codigo = [];
    let array_sucursal = [];
    let array_venta_monto = [];
    let array_venta_numero = [];
    let array_venta_recurrencia = [];
    
    let suma_ventas = 0;
    let suma_ganancias = 0;
    let suma_unidades = 0;
    let suma_unidades_dev = 0;
    let suma_ventas_cod = 0;
    let suma_ganancias_cod = 0;
    let suma_unidades_cod = 0;
    let suma_unidades_dev_cod = 0;
    array_codigos.forEach((event)=>{
        suma_ventas += event.suma_ventas
        suma_ganancias += (event.suma_ventas - event.suma_costos)
        suma_unidades += event.suma_unidades
        suma_unidades_dev += event.suma_unidades_dev
        if(event.codigo == codigo_ref){
            suma_ventas_cod += event.suma_ventas
            suma_ganancias_cod += (event.suma_ventas - event.suma_costos)
            suma_unidades_cod += event.suma_unidades
            suma_unidades_dev_cod += event.suma_unidades_dev
        }
        
    });

    array_sucursal.push(suma_ventas)
    array_sucursal.push(suma_ganancias)
    array_sucursal.push(suma_unidades)
    array_sucursal.push(1-(suma_unidades_dev/suma_unidades))

    array_codigo.push(suma_ventas_cod)
    array_codigo.push(suma_ganancias_cod)
    array_codigo.push(suma_unidades_cod)
    array_codigo.push(1-(suma_unidades_dev_cod/suma_unidades_cod))

    console.log(array_sucursal)
    console.log(array_codigo)
    
    let total_monto = 0;
    let total_numero = 0;
    let total_ganancia = 0;
    let total_recurrencia = 0;
    let conteo = 0;
    for(let i = 0; i < 12; i++){
        let suma_monto = 0;
        let suma_numero = 0;
        let suma_ganancia = 0;
        let suma_recurrencia = 0;
        
        array_codigos.forEach((event)=>{
            if(event.codigo == codigo_ref && event.mes == i + 1){
                suma_monto += event.suma_ventas;
                suma_numero += event.suma_unidades;
                suma_ganancia += (event.suma_ventas-event.suma_costos)/event.suma_ventas;
                suma_recurrencia += event.suma_veces;
                conteo +=1;
            }
        })

        total_monto += suma_monto
        total_numero += suma_numero
        total_ganancia += suma_ganancia
        total_recurrencia += suma_recurrencia
        
        array_venta_monto.push(suma_monto)
        array_venta_numero.push(suma_numero)
        array_venta_recurrencia.push(suma_recurrencia)
    }
    console.log(array_venta_monto)
    console.log(array_venta_numero)
    console.log(array_venta_recurrencia)
    //monto mayor
    let suma_monto_mayor = 0;
    let suma_numero_mayor = 0;
    let suma_recurrencia_mayor = 0;
    let suma_monto_menor = total_monto;
    let suma_numero_menor = total_numero;
    let suma_recurrencia_menor = total_recurrencia;
    let array_potencia_monto = [];
    let suma_venta_monto = 0;
    let suma_venta_numero = 0;
    let suma_venta_recurrencia = 0;
    array_venta_monto.forEach((event)=>{
        if(suma_monto_mayor < event){
            suma_monto_mayor = event
        }
        if(suma_monto_menor > event && event > 0){
            suma_monto_menor = event
        }
        if(event > 0){
            array_potencia_monto.push((event - (total_monto/conteo))**2)
        }
        suma_venta_monto += event
    })
    array_venta_numero.forEach((event)=>{
        if(suma_numero_mayor < event){
            suma_numero_mayor = event
        }
        if(suma_numero_menor > event && event > 0){
            suma_numero_menor = event
        }
        suma_venta_numero += event
    })
    array_venta_recurrencia.forEach((event)=>{
        if(suma_recurrencia_mayor < event){
            suma_recurrencia_mayor = event
        }
        if(suma_recurrencia_menor > event && event > 0){
            suma_recurrencia_menor = event
        }
        suma_venta_recurrencia += event
    })


    let total_frecuencias = 0;
    for(let i = 0; i < 12; i++){
        let num = 0;
        conteo_ventas.forEach((event)=>{
            if(event.mes == i + 1){
                num += 1
            }
        })
        total_frecuencias += num
    }
    console.log(suma_venta_recurrencia)
    console.log(suma_recurrencia_mayor)
    console.log(suma_venta_recurrencia/conteo)
    document.querySelector(".pentagono").style.clipPath = `polygon(50% ${((1-((suma_venta_monto/conteo)/((suma_monto_mayor))))*0.5)*100}%, `+
                                                            `${(((total_ganancia/conteo)+1)*0.5)*100}% ${(((1-(total_ganancia/conteo))*0.12)+0.38)*100}%, `+
                                                            `${((((suma_venta_numero/conteo)/suma_numero_mayor)*0.32)+0.5)*100}% ${((((suma_venta_numero/conteo)/suma_numero_mayor)*0.50)+0.50)*100}%, `+
                                                            `${(((1-((suma_venta_recurrencia/conteo)/suma_recurrencia_mayor))*0.32)+0.18)*100}% ${((((suma_venta_recurrencia/conteo)/suma_recurrencia_mayor)*0.50)+0.50)*100}%, `+
                                                            `${(((1-(2/3))*0.5))*100}% ${(((1-(2/3))*0.12)+0.38)*100}%)`
    /* document.querySelector(".pentagono").style.clipPath = `polygon(50% ${((1-(array_codigo[0]/array_sucursal[0]))*0.5)*100}%, `+
                                                            `${(((array_codigo[1]/array_sucursal[1])+1)*0.5)*100}% ${(((1-(array_codigo[1]/array_sucursal[1]))*0.12)+0.38)*100}%, `+
                                                            `${(((array_codigo[2]/array_sucursal[2])*0.32)+0.5)*100}% ${(((array_codigo[2]/array_sucursal[2])*0.50)+0.50)*100}%, `+
                                                            `${(((1-(array_codigo[3]/array_sucursal[3]))*0.32)+0.18)*100}% ${(((array_codigo[3]/array_sucursal[3])*0.50)+0.50)*100}%, `+
                                                            `${(((1-(array_codigo[4]/array_sucursal[4]))*0.5))*100}% ${(((1-(array_codigo[4]/array_sucursal[4]))*0.12)+0.38)*100}%)` */
}

