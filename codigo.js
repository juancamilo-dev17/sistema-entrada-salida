let prestamos = JSON.parse(localStorage.getItem("prestamos")) || [];


let editando = null;



const formulario = document.getElementById("formPrestamo");

const nombre = document.getElementById("nombre");
const documento = document.getElementById("documento");
const telefono = document.getElementById("telefono");
const correo = document.getElementById("correo");
const area = document.getElementById("area");
const tipo = document.getElementById("tipo");
const codigo = document.getElementById("codigo");
const estado = document.getElementById("estado");
const observaciones = document.getElementById("observaciones");
const fechaEntrega=document.getElementById("fechaEntrega");
const fechaDevolucion=document.getElementById("fechaDevolucion");

const tabla = document.getElementById("tablaPrestamos");
const buscar = document.getElementById("buscar");

const totalPrestados = document.getElementById("totalPrestados");
const totalDevueltos = document.getElementById("totalDevueltos");
const totalRegistros = document.getElementById("totalRegistros");



function guardarLocalStorage(){

    localStorage.setItem(
        "prestamos",
        JSON.stringify(prestamos)
    );

}



function obtenerFecha(){

    const hoy = new Date();

    return hoy.toLocaleString("es-CO");

}


function limpiarFormulario(){

    formulario.reset();

    editando = null;

    formulario.querySelector("button[type='submit']").innerHTML =
    '<i class="fa-solid fa-floppy-disk"></i> Guardar';

}



function codigoExiste(codigoEquipo){

    return prestamos.some(
        p =>
        p.codigo.toLowerCase() === codigoEquipo.toLowerCase()
    );

}



formulario.addEventListener("submit",function(e){

    e.preventDefault();

    if(nombre.value.trim()===""){

        alert("Ingrese el nombre.");

        return;

    }

    if(documento.value.trim()===""){

        alert("Ingrese el documento.");

        return;

    }

    if(codigo.value.trim()===""){

        alert("Ingrese el código.");

        return;

    }

    if(editando===null){

        if(codigoExiste(codigo.value)){

            alert("Ese código ya existe.");

            return;

        }

    }

    const prestamo={

        nombre:nombre.value,

        documento:documento.value,

        telefono:telefono.value,

        correo:correo.value,

        area:area.value,

        tipo:tipo.value,

        codigo:codigo.value,

        estado:estado.value,

        observaciones:observaciones.value,
        fechaEntrega:fechaEntrega.value,
        fechaDevolucion:fechaDevolucion.value,

        fechaPrestamo:obtenerFecha(),

        fechaDevolucion:
        estado.value==="Devuelto"
        ?obtenerFecha()
        :""

    };


    if(editando!==null){

        prestamos[editando]=prestamo;

        alert("Registro actualizado correctamente.");

    }


    else{

        prestamos.push(prestamo);

        alert("Préstamo registrado correctamente.");

    }

    guardarLocalStorage();

    limpiarFormulario();

    mostrarPrestamos();

});



function mostrarPrestamos(lista = prestamos){

    tabla.innerHTML = "";

    lista.forEach((prestamo, index)=>{

        tabla.innerHTML += `

        <tr>

            <td>${prestamo.nombre}</td>

            <td>${prestamo.documento}</td>

            <td>${prestamo.tipo}</td>

            <td>${prestamo.codigo}</td>

            <td>

                <span class="badge ${prestamo.estado.toLowerCase()}">

                    ${prestamo.estado}

                </span>

            </td>

            <td>${prestamo.fechaEntrega||""}</td><td>${prestamo.fechaDevolucion||""}</td>

            <td>

                <div class="acciones">

                    <button
                    class="editar"
                    onclick="editarPrestamo(${index})"
                    title="Editar">

                    <i class="fa-solid fa-pen"></i>

                    </button>

                    <button
                    class="devolver"
                    onclick="devolverPrestamo(${index})"
                    title="Marcar como devuelto">

                    <i class="fa-solid fa-check"></i>

                    </button>

                    <button
                    class="eliminar"
                    onclick="eliminarPrestamo(${index})"
                    title="Eliminar">

                    <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            </td>

        </tr>

        `;

    });

    actualizarEstadisticas();

}


function editarPrestamo(index){

    const p = prestamos[index];

    nombre.value = p.nombre;
    documento.value = p.documento;
    telefono.value = p.telefono;
    correo.value = p.correo;
    area.value = p.area;
    tipo.value = p.tipo;
    codigo.value = p.codigo;
    estado.value = p.estado;
    observaciones.value = p.observaciones;
    fechaEntrega.value=p.fechaEntrega||"";
    fechaDevolucion.value=p.fechaDevolucion||"";

    editando = index;

    formulario.querySelector("button[type='submit']").innerHTML =
    '<i class="fa-solid fa-pen"></i> Actualizar';

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}



function eliminarPrestamo(index){

    const confirmar = confirm("¿Deseas eliminar este registro?");

    if(!confirmar) return;

    prestamos.splice(index,1);

    guardarLocalStorage();

    mostrarPrestamos();

}



function devolverPrestamo(index){

    if(prestamos[index].estado==="Devuelto"){

        alert("Este equipo ya fue devuelto.");

        return;

    }

    prestamos[index].estado="Devuelto";

    prestamos[index].fechaDevolucion=obtenerFecha();

    guardarLocalStorage();

    mostrarPrestamos();

}



buscar.addEventListener("keyup",()=>{

    const texto = buscar.value.toLowerCase();

    const resultados = prestamos.filter(p=>{

        return(

            p.nombre.toLowerCase().includes(texto)

            ||

            p.documento.toLowerCase().includes(texto)

            ||

            p.codigo.toLowerCase().includes(texto)

            ||

            p.tipo.toLowerCase().includes(texto)

            ||

            p.area.toLowerCase().includes(texto)

        );

    });

    mostrarPrestamos(resultados);

});



function actualizarEstadisticas(){

    totalRegistros.textContent = prestamos.length;

    totalPrestados.textContent = prestamos.filter(

        p=>p.estado==="Prestado"

    ).length;

    totalDevueltos.textContent = prestamos.filter(

        p=>p.estado==="Devuelto"

    ).length;

}

formulario.addEventListener("submit", function(e){

    if(editando === null) return;

    e.preventDefault();

    prestamos[editando] = {

        ...prestamos[editando],

        nombre: nombre.value.trim(),
        documento: documento.value.trim(),
        telefono: telefono.value.trim(),
        correo: correo.value.trim(),
        area: area.value.trim(),
        tipo: tipo.value,
        codigo: codigo.value.trim(),
        estado: estado.value,
        observaciones: observaciones.value.trim(),


        fechaPrestamo: prestamos[editando].fechaPrestamo,


        fechaDevolucion:
            estado.value === "Devuelto"
            ? prestamos[editando].fechaDevolucion || obtenerFecha()
            : ""

    };

    guardarLocalStorage();

    limpiarFormulario();

    mostrarPrestamos();

    alert("Registro actualizado correctamente.");

});




function ordenarPrestamos(){

    prestamos.sort((a,b)=>{

        return new Date(b.fechaPrestamo) - new Date(a.fechaPrestamo);

    });

}



window.addEventListener("load",()=>{

    ordenarPrestamos();

    mostrarPrestamos();

});


document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        limpiarFormulario();

    }

});



function exportarJSON(){

    const datos = JSON.stringify(prestamos,null,2);

    const blob = new Blob([datos],{

        type:"application/json"

    });

    const url = URL.createObjectURL(blob);

    const enlace=document.createElement("a");

    enlace.href=url;

    enlace.download="prestamos.json";

    enlace.click();

    URL.revokeObjectURL(url);

}



function importarJSON(event){

    const archivo=event.target.files[0];

    if(!archivo) return;

    const lector=new FileReader();

    lector.onload=function(e){

        prestamos=JSON.parse(e.target.result);

        guardarLocalStorage();

        mostrarPrestamos();

        alert("Datos importados correctamente.");

    }

    lector.readAsText(archivo);

}




function limpiarBaseDatos(){

    const confirmar=confirm("¿Desea eliminar TODOS los registros?");

    if(!confirmar) return;

    prestamos=[];

    guardarLocalStorage();

    mostrarPrestamos();

}


function mostrarPrestamos(lista = prestamos){

    tabla.innerHTML="";

    if(lista.length===0){

        tabla.innerHTML=`

        <tr>

            <td colspan="7" style="text-align:center;padding:35px;">

            No existen registros.

            </td>

        </tr>

        `;

        actualizarEstadisticas();

        return;

    }

    lista.forEach((prestamo,index)=>{

        tabla.innerHTML+=`

        <tr>

            <td>${prestamo.nombre}</td>

            <td>${prestamo.documento}</td>

            <td>${prestamo.tipo}</td>

            <td>${prestamo.codigo}</td>

            <td>

                <span class="badge ${prestamo.estado.toLowerCase()}">

                    ${prestamo.estado}

                </span>

            </td>

            <td>${prestamo.fechaEntrega||""}</td><td>${prestamo.fechaDevolucion||""}</td>

            <td>

                <div class="acciones">

                    <button class="editar"

                    onclick="editarPrestamo(${index})">

                    <i class="fa-solid fa-pen"></i>

                    </button>

                    <button class="devolver"

                    onclick="devolverPrestamo(${index})">

                    <i class="fa-solid fa-check"></i>

                    </button>

                    <button class="eliminar"

                    onclick="eliminarPrestamo(${index})">

                    <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            </td>

        </tr>

        `;

    });

    actualizarEstadisticas();

}