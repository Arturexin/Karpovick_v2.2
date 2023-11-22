class BarraGraficoVertical extends HTMLElement{
    l_0 = "";
    c_1 = "";
    c_2 = "";
    c_3 = "";
    c_4 = "";
    c_5 = "";
    s_1 = "";
    s_2 = "";
    s_3 = "";
    s_4 = "";
    s_5 = "";
    constructor(){
        super();
    };
    connectedCallback(){
        this.getAttributes()
        this.style();
        this.render();
    };
    getAttributes(){
        this.l_0 = this.attributes.l_0.value 
        this.c_1 = this.attributes.c_1.value 
        this.c_2 = this.attributes.c_2.value 
        this.c_3 = this.attributes.c_3.value 
        this.c_4 = this.attributes.c_4.value 
        this.c_5 = this.attributes.c_5.value 
        this.s_1 = this.attributes.s_1.value 
        this.s_2 = this.attributes.s_2.value 
        this.s_3 = this.attributes.s_3.value 
        this.s_4 = this.attributes.s_4.value 
        this.s_5 = this.attributes.s_5.value 
    }
    style(){
        this.innerHTML = `
                        <style>
                            barra-grafico_vertical{
                                display: grid;
                                align-items: end;
                            }
                            .grafico_compras{
                                height: 240px;
                                display: grid;
                                grid-template-columns: repeat(13, 1fr);
                                justify-content: center;
                                gap: 3px;
                                padding: 0px 20px;
                            }
                            .columna_grafico{
                                width: auto;
                                min-width: 40px;
                                display: grid;
                                grid-template-columns: repeat(5, 1fr);
                                grid-template-areas: "a b c d e"
                                                "f f f f f";
                                align-items: end;
                                justify-items: center;
                            }
                            .${this.c_1}{
                                grid-area: a;
                            }
                            .${this.c_2}{
                                grid-area: b;
                            }
                            .${this.c_3}{
                                grid-area: c;
                            }
                            .${this.c_4}{
                                grid-area: d;
                            }
                            .${this.c_5}{
                                grid-area: e;
                            }
                            .${this.l_0}{
                                grid-area: f;
                            }
                            .${this.l_0}{
                                display: inline-block;
                                transform: rotate(-40deg);
                                font-size: 14px;
                                margin-top: 20px;
                            }
                            .formato_columna{
                                position: relative;
                                display: inline-block;
                            }
                            .formato_espan{
                                visibility: hidden;
                                width: max-content;
                                background-color: #000;
                                color: #fff;
                                text-align: center;
                                border-radius: 6px;
                                padding: 5px;
                                position: absolute;
                                z-index: 1;
                                bottom: 100%;
                                left: 50%;
                                transform: translateX(-50%);
                                opacity: 0;
                                transition: opacity 0.3s;
                            }
                            .formato_columna:hover .formato_espan{
                                visibility: visible;
                                opacity: 1;
                            }
                        </style>`
    };
    render(){
        this.innerHTML += `<div class="columna_grafico">
                                <div class="${this.l_0}"></div>
                                <div class="formato_columna ${this.c_1}"><span class="formato_espan ${this.s_1}"></span></div>
                                <div class="formato_columna ${this.c_2}"><span class="formato_espan ${this.s_2}"></span></div>
                                <div class="formato_columna ${this.c_3}"><span class="formato_espan ${this.s_3}"></span></div>
                                <div class="formato_columna ${this.c_4}"><span class="formato_espan ${this.s_4}"></span></div>
                                <div class="formato_columna ${this.c_5}"><span class="formato_espan ${this.s_5}"></span></div>
                            </div>`
    };
};
customElements.define('barra-grafico_vertical', BarraGraficoVertical);
function pintarGraficoPositivo(totalSucursal, array, suma, color, valorDelGrafico){
    totalSucursal.forEach((event, i)=>{
        if(array[i] > 0){
            event.style.height = `${(array[i]/suma) * 180}px`;
            valorDelGrafico[i].textContent = 'Total: S/'+ array[i].toFixed(2)
        }
        event.style.margin = "1px"
        event.style.width = `8px`;
        event.style.background = color
        event.style.transition = `height .6s`
        
        event.style.boxShadow = `0px 0px 5px 0px #6f6e6ee0`
        event.style.borderRadius = `5px`
    });
};
class ejeYNumeracion extends HTMLElement{
    e_0 = "";
    constructor(){
        super();
    };
    connectedCallback(){
        this.getAttributes()
        this.style();
        this.render();
    };
    getAttributes(){
        this.e_0 = this.attributes.e_0.value
    }
    style(){
        this.innerHTML = `
                        <style>
                            grafico-eje_y{
                                display: grid;
                                font-size: 14px;
                            }
                            .eje_y{
                                display: grid;
                                justify-items: end;
                                align-content: stretch;
                                padding-bottom: 10px;
                            }
                            .cero_y{
                                height: 14px;
                            }
                        </style>`
    }
    render(){
        this.innerHTML += `<div class="eje_y">
                                <div class="${this.e_0}"></div>
                                <div class="${this.e_0}"></div>
                                <div class="${this.e_0}"></div>
                                <div class="${this.e_0}"></div>
                                <div class="${this.e_0}"></div>
                                <div class="cero_y">
                                    <span>0</span>
                                </div>
                            </div>`
    };
};
customElements.define('grafico-eje_y', ejeYNumeracion);

class columnaRanking extends HTMLElement{
    f_r = "";
    r_c = "";
    constructor(){
        super();
    };
    connectedCallback(){
        this.getAttributes()
        this.style();
        this.render();
    };
    getAttributes(){
        this.f_r = this.attributes.f_r.value
        this.r_c = this.attributes.r_c.value
    };
    style(){
        this.innerHTML = `
                        <style>
                            
                            .grafico_ranking{
                                height: 240px;
                                display: grid;
                                grid-template-columns: repeat(12, 1fr);
                                justify-content: center;
                                gap: 3px;
                                padding: 0px 20px;
                            }
                            .columna_ranking_total{
                                width: auto;
                                min-width: 40px;
                                display: grid;
                                grid-template-columns: 1fr;
                                align-items: stretch;
                                justify-items: stretch;
                                height: 240px;
                            }
                            .ranking_columna{
                                position: relative;
                                display: inline-block;
                                margin: 1px 0;
                                box-shadow: rgba(111, 110, 110, 0.88) 0px 0px 5px 0px;
                                border-radius: 2px;
                            }
                            .ranking_span{
                                visibility: hidden;
                                width: max-content;
                                background-color: #000;
                                color: #fff;
                                text-align: center;
                                border-radius: 6px;
                                padding: 5px;
                                position: absolute;
                                z-index: 1;
                                bottom: 100%;
                                left: 50%;
                                transform: translateX(-50%);
                                opacity: 0;
                                transition: opacity 0.3s;
                            }
                            .ranking_columna:hover .ranking_span{
                                visibility: visible;
                                opacity: 1;
                            }
                            .ranking_fecha{
                                transform: rotate(-40deg);
                                font-size: 14px;
                                margin-top: 20px;
                            }
                        </style>`
    };
    render(){
        this.innerHTML += `<div class="columna_ranking_total ${this.r_c}">
                                <div class="ranking_columna"><span class="ranking_span"></span></div>
                                <div class="ranking_columna"><span class="ranking_span"></span></div>
                                <div class="ranking_columna"><span class="ranking_span"></span></div>
                                <div class="ranking_columna"><span class="ranking_span"></span></div>
                                <div class="ranking_columna"><span class="ranking_span"></span></div>
                            </div>
                            <div class="ranking_fecha ${this.f_r}">fecha</div>`
                            
    };

};
customElements.define('columna-ranking', columnaRanking);
function rankingColumna(arrayDatos, arrayNombres, alto, claseColumna, claseFecha, arregloMeses, arrayColores){
    
    document.querySelectorAll(claseColumna).forEach((event, j)=>{
        event.style.gridTemplateRows = `${(arrayDatos[j][0]/alto)*100}% ${(arrayDatos[j][1]/alto)*100}% ${(arrayDatos[j][2]/alto)*100}% ${(arrayDatos[j][3]/alto)*100}% ${(arrayDatos[j][4]/alto)*100}%`
        for(let i = 0; i < arrayColores.length; i++){
            event.children[i].style.background = `${arrayColores[i]}`
            if(arrayDatos[j][i] > 0){
                event.children[i].children[0].textContent = arrayNombres[j][i] + ": S/ " + arrayDatos[j][i].toFixed(2)
            }else{
                event.children[i].children[0].textContent = ""
            };
        };
    });
    document.querySelectorAll(claseFecha).forEach((event, i)=>{
        event.textContent = arregloMeses[i];
    })
};